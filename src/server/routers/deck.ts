import { academicLevelMap } from "@/lib/academicLevel";
import { AcademicLevel } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const createDeck = z.object({
  name: z.string(),
  isPublic: z.boolean().default(true),
  academicLevel: z.enum(Object.keys(academicLevelMap) as [string, ...string[]]),
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
          academicLevel: input.academicLevel as AcademicLevel,
        },
        include: {
          flashcards: true,
        },
      });
      return newDeck;
    }),
  infiniteDecks: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(), // The page size
        cursor: z.string().nullish(),
        subject: z.string().optional(),
        category: z.enum(["recent", "created", "bookmarked"]).optional(),
        query: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor, subject, category, query } = input;

      const userId = ctx.session?.user.id;
      if (category && !userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User must be logged in to access decks using 'category'",
        });
      }

      const decks = await ctx.prisma.deck.findMany({
        take: limit + 1,
        where: {
          ...(subject && { subjectName: subject, isPublic: true }),
          ...(category === "bookmarked" && {
            bookmarkedDecks: {
              some: {
                userId: userId,
              },
            },
          }),
          ...(category === "created" && {
            userId: userId,
          }),
          ...(query && {
            name: {
              contains: query,
              mode: "insensitive",
            },
          }),
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy:
          category === "recent"
            ? [{ dateChanged: "desc" }, { id: "desc" }]
            : [{ id: "desc" }],
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (decks.length > limit) {
        const nextItem = decks.pop();
        nextCursor = nextItem!.id;
      }

      return {
        decks,
        nextCursor,
      };
    }),
  getDeckById: publicProcedure
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
      if (!deck.isPublic && deck.userId !== ctx.session?.user.id) {
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
        page: z.number().default(1),
        pageSize: z.number().default(10),
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
          subjectName: subjectName,
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
  countDecksByCategories: protectedProcedure.query(async ({ ctx }) => {
    const countCreated = ctx.prisma.deck.count({
      where: {
        userId: ctx.session.user.id,
      },
    });
    const countBookmarked = ctx.prisma.bookmarkedDeck.count({
      where: {
        userId: ctx.session.user.id,
      },
    });

    // Fetch in parallell
    const counts = await Promise.all([countCreated, countBookmarked]);

    return {
      countCreated: counts[0],
      countBookmarked: counts[1],
      countRecent: 0, // TODO
    };
  }),
  getTagsByDeckId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const tags = await ctx.prisma.flashcard.findMany({
        where: {
          deckId: input,
        },
        select: {
          tag: true,
        },
        distinct: ["tag"],
      });

      return tags.map((tag) => tag.tag).filter((tag) => tag !== "");
    }),
});
