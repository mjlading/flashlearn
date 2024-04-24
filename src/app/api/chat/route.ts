import openai from "@/lib/ai";
import { NextResponse } from "next/server";

// Define tools used for function calling
const tools: any = [
  {
    type: "function",
    function: {
      name: "generate_feedback",
      description:
        "Generates descriptive, helpful feedback on a flashcard submission",
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
            description: "Helpful constructive tips to help the student learn",
          },
        },
        required: ["score"],
      },
    },
  },
];

export async function POST(request: Request) {
  const { front, back, answer } = await request.json();
  // console.log(front, back, answer);

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    tools: tools,
    tool_choice: {
      type: "function",
      function: { name: "generate_feedback" },
    }, // Forces function_call
    messages: [
      {
        role: "user",
        content: `Given a students answer to a flashcard quiz, give a score (0-100) and optional useful tips (concise and few) for improvement. Avoid broad/general tips like "practice more" or "double-check your work", instead give spesific practical tips. If score=100 dont give tips.
                flashcard front: ${front}
                flashcard back: ${back}
                The students answer: ${answer}
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
