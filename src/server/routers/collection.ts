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
  createCollection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        deckIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, deckIds } = input;

      return await ctx.prisma.collection.create({
        data: {
          name: name,
          description: description,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          collectionDecks: {
            createMany: {
              data: deckIds.map((deckId) => ({
                deckId: deckId,
              })),
            },
          },
        },
      });
    }),
});
