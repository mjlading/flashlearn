import { protectedProcedure, publicProcedure, router } from "../trpc";
import z from "zod";
import type { Prisma } from "@prisma/client";

const createDeck = z.object({
  name: z.string(),
  isPublic: z.boolean().default(true),
  averageRating: z.number(),
  academicLevel: z.number(),
  subjectName: z.string(),
  numFlashcards: z.number(),
  flashcards: z
    .array(
      z.object({
        front: z.string(),
        back: z.string(),
        tag: z.string().optional(),
      })
    )
    .optional(),
});

export const deckRouter = router({
  createDeck: protectedProcedure
    .input(createDeck)
    .mutation(async ({ ctx, input }) => {
      const newDeck = await ctx.prisma.deck.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          flashcards: {
            create: input.flashcards,
          },
        },
      });
      return newDeck;
    }),
});
