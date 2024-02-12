import { protectedProcedure, publicProcedure, router } from "../trpc";
import z from "zod";

export const userRouter = router({
  /**
   * getDecks is a protected procedure that fetches a paginated list of decks for the logged-in user.
   *
   * @param {number} input.page - The page number to fetch. Must be a number greater than or equal to 1.
   * @param {number} input.pageSize - The number of decks to fetch per page. Must be a number greater than or equal to 1.
   *
   * @returns An array of decks for the user.
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
        category: z.enum(["recent", "created", "bookmarked"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, sortBy, sortOrder, category } = input;

      const skip = (page - 1) * pageSize;

      if (category === "recent") {
        return await ctx.prisma.deck.findMany({
          where: {
            userId: ctx.session.user.id,
          },
          take: pageSize,
          skip: skip,
          orderBy: {
            [sortBy]: sortOrder,
          },
        });
      } else if (category === "created") {
        return await ctx.prisma.deck.findMany({
          where: {
            userId: ctx.session.user.id,
          },
          take: pageSize,
          skip: skip,
          orderBy: {
            [sortBy]: sortOrder,
          },
        });
      } else {
        // category = "bookmarked"
        const bookmarks = await ctx.prisma.bookmarkedDeck.findMany({
          where: {
            userId: ctx.session.user.id,
          },
          take: pageSize,
          skip: skip,
          include: {
            deck: true,
          },
        });
        return bookmarks.map((bookmark) => bookmark.deck);
      }
    }),
});
