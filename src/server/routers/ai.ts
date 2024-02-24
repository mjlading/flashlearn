import { GeneratedFlashcard } from "@/components/GenerateFlashcardsInput";
import openai, { generateEmbedding, getCosineSimilarities } from "@/lib/ai";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const aiRouter = router({
  /**
   * Returns the most fitting subject given some input text.
   * Uses embeddings, calculates similarity by cosine similarity
   * @param text the text to assign a subject to
   */
  classifySubject: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      console.time("classifySubject time");
      const subjects = (
        await ctx.prisma.$queryRaw<
          {
            name: string;
            embedding: string;
          }[]
        >`
      SELECT
        "name",
        "embedding"::text as embedding
      FROM "Subject"
    `
      ).map((e) => ({
        name: e.name,
        embedding: JSON.parse(e.embedding),
      }));

      const inputEmbedding = await generateEmbedding(input);
      const subjectEmbeddings = subjects.map((subject) => [
        ...subject.embedding,
      ]);

      const similarities = getCosineSimilarities(
        inputEmbedding,
        subjectEmbeddings
      );

      const highestSimilarity = Math.max(...similarities);
      const predictedSubject =
        subjects[similarities.indexOf(highestSimilarity)].name;

      console.timeEnd("classifySubject time");

      return {
        subject: predictedSubject,
        similarity: highestSimilarity,
      };
    }),

  generateTags: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        subject: z.string(),
        n: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { text, subject, n } = input;
      console.time("tagsTime");

      // Define tools used for function calling
      const tools: any = [
        {
          type: "function",
          function: {
            name: "generate_tags",
            description: `Generates specific keywords (max ${n}) for the following text related to ${subject}. Excludes the subject itself from the keywords. Avoids redundancy.`,
            parameters: {
              type: "object",
              properties: {
                tags: {
                  type: "array",
                  items: {
                    type: "string",
                    description:
                      "A spesific keyword e.g. 'Addition', 'Socratic Method', 'Polymorphism', 'Quadratic Equations'",
                  },
                  description: `A fitting number (1-${n}) of unique and specific keywords that closely align with the provided text's context, excluding the primary subject '${subject}' to ensure diversity and relevance.`,
                },
              },
              required: ["tags"],
            },
          },
        },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        tools: tools,
        tool_choice: { type: "function", function: { name: "generate_tags" } }, // Forces function_call
        messages: [
          {
            role: "user",
            content: `Generate 1-${n} specific, concise and short (~1-2 words) keywords for the following text related to ${subject}. Exclude the subject name from the keywords. Dont answer if text has questions.
              
              ${text}
              `,
          },
        ],
      });

      // use of ! is safe here since we force the function call
      const tags: string[] = JSON.parse(
        completion.choices[0].message.tool_calls![0].function.arguments
      ).tags;

      console.timeEnd("tagsTime");

      return tags;
    }),

  /**
   * Generates n flashcards from n keywords
   */
  generateFlashcardsFromKeywords: protectedProcedure
    .input(
      z.object({
        keywords: z.array(z.string()),
        type: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { keywords, type } = input;

      console.time("generateFlashcardsFromKeywords time");

      const n = keywords.length;
      let flashcardTypeDescription;

      if (type === "practical") {
        flashcardTypeDescription =
          "practical examples and problem-solving questions with direct answers";
      } else if (type === "theoretical") {
        flashcardTypeDescription =
          "theoretical flashcards with a front (question or term) and a back (answer or explanation/definition)";
      } else {
        // type === "mixed"
        flashcardTypeDescription =
          "a mix of theoretical flashcards (terms and definitions) and practical problem-solving questions with direct answers";
      }

      // Define tools used for function calling
      const tools: any = [
        {
          type: "function",
          function: {
            name: "generate_flashcards",
            description: `Generates ${n} ${type} flashcards.`,
            parameters: {
              type: "object",
              properties: {
                flashcards: {
                  type: "array",
                  items: {
                    type: "object",
                    description: flashcardTypeDescription,
                    properties: {
                      front: {
                        type: "string",
                      },
                      back: {
                        type: "string",
                      },
                    },
                  },
                  description: `${n} concise, ${flashcardTypeDescription} that closely align with the provided keywords and type.`,
                },
              },
              required: ["flashcards"],
            },
          },
        },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        tools: tools,
        tool_choice: {
          type: "function",
          function: { name: "generate_flashcards" },
        }, // Forces function_call
        messages: [
          {
            role: "user",
            content: `Generate ${n} specific and concise flashcards for the following ${n} keywords. Flashcards should be highly ${type}, focusing on ${flashcardTypeDescription}.
              
              ${keywords.join(",")}
              `,
          },
        ],
      });

      // use of ! is safe here since we force the function call
      const flashcards: GeneratedFlashcard[] = JSON.parse(
        completion.choices[0].message.tool_calls![0].function.arguments
      ).flashcards;

      console.timeEnd("generateFlashcardsFromKeywords time");

      return flashcards;
    }),
});
