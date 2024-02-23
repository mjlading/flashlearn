import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { generateEmbeddings } from "@/lib/ai";

export const flashcardRouter = router({
  createAndSaveEmbeddings: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          front: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      // Generate embeddings
      const embeddings = await generateEmbeddings(
        input.map((obj) => obj.front)
      );
      const flashcardIds = input.map((f) => f.id);

      const promises: Promise<number>[] = new Array(embeddings.length);

      for (let i = 0; i < embeddings.length; i++) {
        const embedding = embeddings[i];
        const id = flashcardIds[i];

        promises[i] = ctx.prisma.$executeRaw`
        UPDATE "Flashcard"
        SET embedding = ${embedding}::vector
        WHERE id = ${id}`;
      }

      // Run in batch for performance
      await Promise.all(promises);
    }),
});
