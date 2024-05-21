import { auth } from "@/auth";
import openai from "@/lib/ai";
import { NextResponse } from "next/server";

// Define tools used for function calling
const tools: any = [
  {
    type: "function",
    function: {
      name: "generate_feedback",
      description: "Generates feedback on a flashcard submission",
      parameters: {
        type: "object",
        properties: {
          score: {
            type: "number",
            description: "a score ranging from 0-100",
          },
          tips: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Helpful constructive tips to encourage learning",
          },
        },
        required: ["score"],
      },
    },
  },
];

export async function POST(request: Request) {
  const { front, back, answer } = await request.json();
  const session = await auth();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    tools: tools,
    tool_choice: {
      type: "function",
      function: { name: "generate_feedback" },
    }, // Forces function_call
    messages: [
      {
        role: "user",
        content: `You're my teacher. My academic level is: ${session?.user.academicLevel}. Given my answer to a flashcard quiz, provide a score (0-100) based on the logical correctness of the answer. The answer's details (e.g. variable names, test cases, vocabulary, grammar) does not have to match the flashcard back to be considered 100% correct. Rather than judging such details, you should give 100% if i show that i understand the question and the answer is logically correct. Provide optional useful, spesific and detailed tips aimed at me for improvement if the score is less than 100.
                flashcard front: ${front}
                flashcard back: ${back}
                My answer: ${answer}
                `,
      },
    ],
    stream: true,
  });

  const filteredStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          if (chunk.choices[0].finish_reason === "stop") {
            controller.close();
            return;
          }
          // console.log("chunk: ", JSON.stringify(chunk, null, 2));

          const delta =
            chunk.choices[0].delta.tool_calls![0].function!.arguments;
          // console.log("delta : ", delta);
          delta && controller.enqueue(delta);
          // await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error("Error processing stream:", error);
        controller.error(error);
      }
    },
  });

  const nextResponse = new NextResponse(filteredStream);
  nextResponse.headers.append("Content-Type", "text/plain; charset=utf-8");
  nextResponse.headers.append("Transfer-Encoding", "chunked");
  return nextResponse;
}
