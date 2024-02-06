import { protectedProcedure, publicProcedure, router } from "../trpc";
import z from "zod";

export const userRouter = router({
  /**
   * getDecks is a protected procedure that fetches a paginated list of decks for the logged-in user.
   *
   * @param {number} input.page - The page number to fetch. Must be a number greater than or equal to 1.
   * @param {number} input.pageSize - The number of decks to fetch per page. Must be a number greater than or equal to 1.
   *
   * @returns An array of decks and the total count of decks for the user.
   *
   * @throws Will throw an error if the input is not valid or user auth is missing.
   */
  getDecks: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1),
        pageSize: z.number().min(1),
        sortBy: z.string().default("dateCreated"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.pageSize;

      const decks = await ctx.prisma.deck.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        take: input.pageSize,
        skip: skip,
        orderBy: {
          [input.sortBy]: input.sortOrder,
        },
      });

      const totalCount = await ctx.prisma.deck.count({
        where: {
          userId: ctx.session.user.id,
        },
      });

      return {
        decks,
        totalCount,
      };
    }),
});
