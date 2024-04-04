import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

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
  getCollectionById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        includeDecks: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const { includeDecks, id } = input;

      const collection = await ctx.prisma.collection.findUnique({
        where: {
          id: id,
        },
        include: {
          collectionDecks: {
            include: {
              deck: {
                include: {
                  flashcards: includeDecks,
                },
              },
            },
          },
        },
      });

      if (!collection) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Collection not found",
        });
      }

      // if current user is not the owner
      if (collection.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this resource",
        });
      }

      return collection;
    }),
});
