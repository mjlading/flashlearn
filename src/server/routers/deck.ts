import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

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
  getDeckById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        includeFlashcards: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const deck = await ctx.prisma.deck.findUnique({
        where: {
          id: input.id,
        },
        include: {
          flashcards: input.includeFlashcards,
        },
      });

      if (!deck) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Deck not found" });
      }

      // if deck is private and current user is not the owner
      if (!deck.isPublic && deck.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this resource",
        });
      }

      return deck;
    }),

  getDecksBySubjectName: publicProcedure
    .input(
      z.object({
        page: z.number().min(1),
        pageSize: z.number().min(1),
        sortBy: z.string().default("dateCreated"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        subjectName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, sortBy, sortOrder, subjectName } = input;

      const skip = (page - 1) * pageSize;

      return await ctx.prisma.deck.findMany({
        where: {
          subjectName: input.subjectName,
          isPublic: true,
        },
        take: pageSize,
        skip: skip,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });
    }),
  deleteDeckById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deckToDelete = await ctx.prisma.deck.findUnique({
        where: {
          id: input,
        },
      });

      if (!deckToDelete) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deck not found",
        });
      }

      if (deckToDelete.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return await ctx.prisma.deck.delete({
        where: {
          id: input,
        },
      });
    }),
  countDecksByCategory: protectedProcedure
    .input(
      z.object({
        category: z.enum(["bookmarked", "recent", "created"]),
      })
    )
    .query(async ({ ctx, input }) => {
      let count = 0;

      if (input.category === "bookmarked") {
        count = await ctx.prisma.bookmarkedDeck.count({
          where: {
            userId: ctx.session.user.id,
          },
        });
      } else if (input.category === "created") {
        count = await ctx.prisma.deck.count({
          where: {
            userId: ctx.session.user.id,
          },
        });
      } else {
        // category = recent
        // TODO
      }

      return count;
    }),
});
