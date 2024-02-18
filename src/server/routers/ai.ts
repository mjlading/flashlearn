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

      const subjectEmbeddingsPromise = client.embeddings.create({
        model: "text-embedding-3-small",
        input: subjects,
      });
      const textEmbeddingPromise = client.embeddings.create({
        model: "text-embedding-3-small",
        input: input,
      });

      let embeddings;
      try {
        embeddings = await Promise.all([
          subjectEmbeddingsPromise,
          textEmbeddingPromise,
        ]);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to retrieve embeddings:${error}`,
        });
      }

      const subjectEmbeddings = embeddings[0].data.map(
        (subjectEmbedding) => subjectEmbedding.embedding
      );
      const textEmbedding = embeddings[1].data[0].embedding;

      const scores = getCosineScores(textEmbedding, subjectEmbeddings);

      const predictionConfidence = Math.max(...scores);
      const predictedSubject = subjects[scores.indexOf(predictionConfidence)];

      return {
        predictedSubject: predictedSubject,
        predictionConfidence: predictionConfidence,
      };
    }),
});
