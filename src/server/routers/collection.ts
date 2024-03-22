import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const collectionRouter = router({
  getUserCollections: protectedProcedure.query(async ({ ctx }) => {
    const collections = await ctx.prisma.collection.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        collectionDecks: {
          include: {
            deck: true,
          },
        },
      },
    });
    return collections;
  }),
  deleteCollection: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.collection.delete({
        where: {
          userId: ctx.session.user.id,
          id: id,
        },
      });
    }),
});
