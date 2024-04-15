import { PrismaAdapter } from "@auth/prisma-adapter";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import z from "zod";

export const userRouter = router({
  getXP: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        xp: true,
      },
    });

    return user.xp;
  }),
  getLeaderboardWithUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const top10 = await ctx.prisma.user.findMany({
      where: {
        name: {
          not: null,
        },
      },
      orderBy: {
        xp: "desc",
      },
      take: 10,
      select: {
        name: true,
        xp: true,
      },
    });

    // Get user's placement/rank
    // Using raw SQL since prisma does not support SQL window functions
    const userRank = await ctx.prisma.$queryRaw<
      [{ rank: BigInt; xp: Number; name: string }]
    >`
      SELECT name, rank, xp FROM (
        SELECT id, name, xp, RANK() OVER (ORDER BY xp DESC)
        FROM "User"
        WHERE name IS NOT NULL
      ) AS ranked_users
      WHERE id = ${userId}
    `;

    const userRankFormatted = {
      ...userRank[0],
      rank: Number(userRank[0].rank),
      xp: Number(userRank[0].xp),
    };

    const top10WithUser = {
      top10: top10 as { name: string; xp: number }[],
      userRank: userRankFormatted,
    };

    return top10WithUser;
  }),
  setNickname: protectedProcedure
    .input(z.string().min(2).max(50))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the nickname is unique
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          nickname: input,
        },
      });

      if (existingUser) {
        return "NICKNAME_IN_USE";
      }

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          nickname: input,
          preferencesSet: true,
        },
      });
    }),
});
