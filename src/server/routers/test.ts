import prisma from "@/lib/prisma";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import z from "zod";

// This router is temporary and is used by the dev team for testing purposes

export const testRouter = router({
  hello: publicProcedure.query(() => "Hello from tRPC!"),
  helloPrisma: publicProcedure.query(async () => {
    // Test prisma db
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("User not found");

    return user;
  }),

  gunnartest: publicProcedure.input(z.string()).query(({ input }) => {
    return { mirror: input };
  }),

  protectedTest: protectedProcedure.query((opts) => {
    console.log("SESSIONs:: ", JSON.stringify(opts.ctx.session, null, 2));
    return {
      secret: "Protected Message",
    };
  }),
});
