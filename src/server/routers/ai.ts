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
            description: `Generates ${n} specific keywords for the following text related to ${subject}. Excludes the subject itself from the keywords. Avoids redundancy.`,
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
                  description: `${n} unique and specific keywords that closely align with the provided text's context, excluding the primary subject '${subject}' to ensure diversity and relevance.`,
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
            content: `Generate ${n} specific, concise and short (~1-2 words) keywords for the following text related to ${subject}. Exclude the subject name from the keywords.
              
              ${text}
              `,
          },
        ],
      });

      const tags: string[] = JSON.parse(
        completion.choices[0].message.tool_calls![0].function.arguments
      ).tags;

      console.timeEnd("tagsTime");

      return tags;
    }),
});
