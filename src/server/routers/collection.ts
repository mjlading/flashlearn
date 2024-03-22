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
});
