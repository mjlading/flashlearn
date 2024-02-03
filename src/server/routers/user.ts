import prisma from "@/lib/prisma";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import z from "zod";

export const userRouter = router({
  /**
   * getDecks is a protected procedure that fetches a paginated list of decks for the logged-in user.
   *
   * @param {number} input.page - The page number to fetch. Must be a number greater than or equal to 1.
   * @param {number} input.pageSize - The number of decks to fetch per page. Must be a number greater than or equal to 1.
   *
   * @returns An array of decks.
   *
   * @throws Will throw an error if the input is not valid or user auth is missing.
   */
  getDecks: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1),
        pageSize: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.pageSize;

      const decks = await prisma.deck.findMany({
        where: {
          userId: ctx.user.id,
        },
        take: input.pageSize,
        skip: skip,
      });

      return decks;
    }),
});
