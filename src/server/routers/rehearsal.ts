import { Mode } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const rehearsalRouter = router({
  saveRehearsalStarted: protectedProcedure //test me
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
  saveRehearsalFinished: protectedProcedure //test me
    .input(
      z.object({
        rehearsalId: z.string(),
        mode: z.enum(["VISUAL", "WRITE", "ORAL"]),
        timeSpent: z.number(),
        deckId: z.string(),
        score: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rehearsalId, timeSpent, score, deckId, mode } = input;

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
          mode: mode,
          deckRehearsals: {
            create: {
              score: score,
              deckId: deckId,
            },
          },
        },
      });
    }),
  getUserRehearsals: protectedProcedure
    .input(
      z.object({
        includeSubjects: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const rehearsals = await ctx.prisma.rehearsal.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          deckRehearsals: {
            include: {
              deck: {
                include: {
                  subject: input.includeSubjects,
                },
              },
            },
          },
        },
      });

      return rehearsals;
    }),
});
