import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const bookmarkRouter = router({
  // Checks if a given deck is bookmarked by the current user
  isBookmarked: protectedProcedure //test me
    .input(
      z.object({
        deckId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const bookmarkedDeck = await ctx.prisma.bookmarkedDeck.findUnique({
        where: {
          userId_deckId: {
            userId: ctx.session.user.id,
            deckId: input.deckId,
          },
        },
      });
      return !!bookmarkedDeck;
    }),
  addBookmark: protectedProcedure //test me
    .input(
      z.object({
        deckId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bookmarkedDeck.create({
        data: {
          userId: ctx.session.user.id,
          deckId: input.deckId,
        },
      });
    }),
  removeBookmark: protectedProcedure //test me
    .input(
      z.object({
        deckId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bookmarkedDeck.delete({
        where: {
          userId_deckId: {
            userId: ctx.session.user.id,
            deckId: input.deckId,
          },
        },
      });
    }),
});
