import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import { Mode } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const rehearsalRouter = router({
  saveRehearsalStarted: protectedProcedure
    .input(
      z.object({
        mode: z.enum(["visual", "write", "oral"]),
        deckId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { deckId, mode } = input;
      const userId = ctx.session.user.id;

      const rehearsal = await ctx.prisma.rehearsal.create({
        data: {
          userId: userId,
          deckId: deckId,
          mode: mode.toUpperCase() as Mode,
        },
      });

      return rehearsal;
    }),
  getRecentRehearsal: protectedProcedure
    .input(
      z.object({
        deckId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { deckId } = input;
      const userId = ctx.session.user.id;

      const rehearsal = await ctx.prisma.rehearsal.findFirst({
        where: {
          userId: userId,
          deckId: deckId,
          timeSpent: { not: 0 },
        },
        orderBy: {
          dateStart: "desc",
        },
      });

      return rehearsal;
    }),
  saveRehearsalFinished: protectedProcedure
    .input(
      z.object({
        rehearsalId: z.string(),
        timeSpent: z.number(),
        deckId: z.string(),
        score: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rehearsalId, timeSpent, score, deckId } = input;

      if (score < 0 || score > 100) {
        throw new TRPCError({
          message: "Invalid score passed",
          code: "BAD_REQUEST",
        });
      }

      return await ctx.prisma.rehearsal.update({
        where: {
          id: rehearsalId,
        },
        data: {
          isFinished: true,
          timeSpent: timeSpent,
          deckRehearsals: {
            create: {
              score: score,
              deckId: deckId,
            },
          },
        },
      });
    }),
  updateTimeSpent: protectedProcedure
    .input(
      z.object({
        rehearsalId: z.string(),
        timeToAdd: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rehearsalId, timeToAdd } = input;

      return await ctx.prisma.rehearsal.update({
        where: {
          id: rehearsalId,
        },
        data: {
          timeSpent: {
            increment: timeToAdd,
          },
        },
      });
    }),
});
