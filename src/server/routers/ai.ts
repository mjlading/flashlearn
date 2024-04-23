import { Feedback } from "@/app/[lang]/(withoutNavbar)/decks/[id]/rehearsal/AnswerForm";
import { GeneratedFlashcard } from "@/components/GenerateFlashcardsInput";
import openai, { generateEmbedding, generateEmbeddings } from "@/lib/ai";
import { getCosineSimilarities } from "@/lib/cosine";
import { Flashcard, Deck } from "@prisma/client";
import pgvector from "pgvector";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import fs from "fs";
import path from "path";
import { incrementalJsonParse } from "@/lib/jsonParser";

export const aiRouter = router({
  generateEmbedding: publicProcedure //test me
    .input(z.string())
    .mutation(async ({ input }) => {
      return await generateEmbedding(input);
    }),
  generateEmbeddings: publicProcedure //test me
    .input(z.array(z.string()))
    .mutation(async ({ input }) => {
      return await generateEmbeddings(input);
    }),
  /**
   * Finds the n nearest neighbors to a given target vector embedding
   * excludedBacks: a list of strings representing the back of flashcards which will be excluded
   */
  getNearestFlashcardNeighbors: publicProcedure //test me
    .input(
      z.object({
        targetEmbedding: z.array(z.number()).optional(),
        n: z.number(),
        excludedBacks: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { targetEmbedding, n, excludedBacks } = input;

      const targetEmbeddingSql = pgvector.toSql(targetEmbedding);

      // Prisma automatically converts this to prepared statement, protecting against SQL injections
      // <=> calculates the cosine distance between two embeddings
      const items = await ctx.prisma.$queryRaw<
        (Pick<Flashcard, "front" | "back" | "tag"> & {
          cosineSimilarity: number;
        })[]
      >`
        SELECT front, back, tag,
        1 - (embedding <=> ${targetEmbeddingSql}::vector) AS "cosineSimilarity"
        FROM "Flashcard"
        WHERE back NOT IN (SELECT unnest(${excludedBacks}::text[]))
        ORDER BY "cosineSimilarity" DESC
        LIMIT ${n}`;

      return items;
    }),
  getNearestDeckNeighbors: publicProcedure
    .input(
      z.object({
        targetDeckIds: z.array(z.string()),
        n: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { targetDeckIds, n } = input;

      type AvgEmbeddingResult = [
        {
          avg: string;
        }
      ];

      const avgEmbedding = await ctx.prisma.$queryRaw<AvgEmbeddingResult>`
      SELECT AVG(embedding)::text FROM "Deck"
      WHERE id = ANY(${targetDeckIds})
    `;

      const avgEmbeddingString = avgEmbedding[0].avg;

      const items = await ctx.prisma.$queryRaw<
        (Deck & {
          cosineSimilarity: number;
        })[]
      >`
        SELECT id,
        name,
        "isPublic",
        "averageRating",
        "academicLevel",
        "dateCreated",
        "dateChanged",
        "numFlashcards",
        "userId",
        "subjectName",
        1 - (embedding <=> ${avgEmbeddingString}::vector) AS "cosineSimilarity"
        FROM "Deck"
        WHERE id != ANY(${targetDeckIds}::text[])
        ORDER BY "cosineSimilarity" DESC
        LIMIT ${n}`;

      return items;
    }),
  /**
   * Returns the most fitting subject given some input text.
   * Uses embeddings, calculates similarity by cosine similarity
   * @param text the text to assign a subject to
   */
  classifySubject: protectedProcedure //test me
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

  generateTags: protectedProcedure //test me
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
  generateFlashcardsFromKeywords: protectedProcedure //test me
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
        model: "gpt-4-turbo-preview",
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

  generateFlashcardsFromText: protectedProcedure //test me
    .input(
      z.object({
        text: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { text, type } = input;

      const n = "5-20";

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
                  description: `${n} ${flashcardTypeDescription} that closely align with the provided text and type.`,
                },
              },
              required: ["flashcards"],
            },
          },
        },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        tools: tools,
        tool_choice: {
          type: "function",
          function: { name: "generate_flashcards" },
        }, // Forces function_call
        messages: [
          {
            role: "user",
            content: `Generate ${n} descriptive, detailed flashcards for the following text. Flashcards should be highly ${type}, focusing on ${flashcardTypeDescription}.
                    
                    ${text}
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
  generateFeedback: protectedProcedure //test me
    .input(
      z.object({
        front: z.string(),
        back: z.string(),
        answer: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { front, back, answer } = input;

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
                  description:
                    "Helpful constructive tips to help the student learn",
                },
              },
              required: ["score"],
            },
          },
        },
      ];

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
            content: `Given a students answer to a flashcard quiz, give a score (0-100) and optional useful tips for improvement. If score=100 dont give tips.
                    flashcard front: ${front}
                    flashcard back: ${back}
                    The students answer: ${answer}
                    `,
          },
        ],
        stream: true,
      });

      // use of ! is safe here since we force the function call

      const objectsGenerator = incrementalJsonParse(completion);

      return objectsGenerator;
    }),
  textToSpeech: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        filePath: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const audioFile = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: input.text,
      });
      const timestamp = new Date().getTime();
      const speechFile = path.resolve(input.filePath);
      const buffer = Buffer.from(await audioFile.arrayBuffer());
      await fs.promises.writeFile(speechFile, buffer);
      return timestamp;
    }),
  speechToText: protectedProcedure
    .input(
      z.object({
        audioData: z.custom<Blob>(),
      })
    )
    .mutation(async ({ input }) => {
      const { audioData } = input;
      console.log(audioData.size, audioData.type);
    }),
});
