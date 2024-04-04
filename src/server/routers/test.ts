import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

// This router is temporary and is used by the dev team for testing purposes

export const testRouter = router({
  hello: publicProcedure.query(() => "Hello from tRPC!"),
  helloPrisma: publicProcedure.query(async ({ ctx }) => {
    // Test prisma db
    const user = await ctx.prisma.user.findFirst();
    if (!user) throw new Error("User not found");

    return user;
  }),

  gunnartest: publicProcedure.input(z.string()).query(({ input }) => {
    return { mirror: input };
  }),

  protectedTest: protectedProcedure.query(({ ctx }) => "Protected message"), //test me (verify that any protected procedure will work)
});
