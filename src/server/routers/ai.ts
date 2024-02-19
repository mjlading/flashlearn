import client, { getCosineScores } from "@/lib/ai";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { subjectNameMap } from "@/lib/subject";
import { TRPCError } from "@trpc/server";

/**
 * Returns the most fitting subject given some input text.
 * Uses embeddings, calculates similarity by cosine similarity
 * @param text the text to assign a subject to
 */
export const aiRouter = router({
  classifySubject: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const subjects = Object.keys(subjectNameMap);

      let response;
      try {
        response = await client.embeddings.create({
          model: "text-embedding-3-small",
          input: [input, ...subjects], // batch requests
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to retrieve embeddings:${error}`,
        });
      }

      // Needed since the the response object may not return embeddings in the order of the inputs
      const embeddings = new Array(response.data.length);
      for (const embedding of response.data) {
        embeddings[embedding.index] = embedding.embedding;
      }

      const textEmbedding = embeddings[0];
      const subjectEmbeddings = embeddings.slice(1);

      const scores = getCosineScores(textEmbedding, subjectEmbeddings);

      const predictionConfidence = Math.max(...scores);
      const predictedSubject = subjects[scores.indexOf(predictionConfidence)];

      return {
        predictedSubject: predictedSubject,
        predictionConfidence: predictionConfidence,
      };
    }),
});
