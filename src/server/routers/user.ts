import { protectedProcedure, publicProcedure, router } from "../trpc";
import z from "zod";

export const userRouter = router({
  getXP: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        xp: true,
      },
    });

    return user.xp;
  }),
});
