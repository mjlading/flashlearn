import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import { Mode } from "@prisma/client";

export const rehearsalRouter = router({
  saveRehearsalStarted: protectedProcedure
    .input(
      z.object({
        mode: z.enum(["visual", "write", "oral"]),
        deckId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.rehearsal.create({
        data: {
          userId: ctx.session.user.id,
          deckId: input.deckId,
          mode: input.mode.toUpperCase() as Mode,
        },
      });
    }),
  saveRehearsalFinished: protectedProcedure
    .input(
      z.object({
        rehearsalId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.rehearsal.update({
        where: {
          id: input.rehearsalId,
        },
        data: {
          dateEnd: new Date(),
        },
      });
    }),
});
