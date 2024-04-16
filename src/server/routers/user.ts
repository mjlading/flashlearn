import { academicLevelMap } from "@/lib/academicLevel";
import { AcademicLevel } from "@prisma/client";
import z from "zod";
import { protectedProcedure, router } from "../trpc";

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
        nickname: {
          not: null,
        },
      },
      orderBy: {
        xp: "desc",
      },
      take: 10,
      select: {
        nickname: true,
        xp: true,
      },
    });

    // Get user's placement/rank
    // Using raw SQL since prisma does not support SQL window functions
    const userRank = await ctx.prisma.$queryRaw<
      [{ rank: BigInt; xp: Number; nickname: string }]
    >`
      SELECT nickname, rank, xp FROM (
        SELECT id, nickname, xp, RANK() OVER (ORDER BY xp DESC)
        FROM "User"
        WHERE nickname IS NOT NULL
      ) AS ranked_users
      WHERE id = ${userId}
    `;

    const userRankFormatted = {
      ...userRank[0],
      rank: Number(userRank[0].rank),
      xp: Number(userRank[0].xp),
    };

    const top10WithUser = {
      top10: top10 as { nickname: string; xp: number }[],
      userRank: userRankFormatted,
    };

    return top10WithUser;
  }),
  setNickname: protectedProcedure
    .input(z.string().min(2).max(50))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the nickname is unique
      const existingUser = await ctx.prisma.user.findFirst({
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
  addXp: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const response = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          xp: {
            increment: input,
          },
        },
      });

      return response;
    }),
  setAcademicLevel: protectedProcedure
    .input(
      z.object({
        academicLevel: z.enum(
          Object.keys(academicLevelMap) as [string, ...string[]]
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          academicLevel: input.academicLevel as AcademicLevel,
        },
      });
    }),
  /**
   * Deletes the logged in user
   */
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }),
});
