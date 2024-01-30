import { router, publicProcedure } from "../trpc";
import prisma from "@/db";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "Hello from tRPC!";
  }),
  helloPrisma: publicProcedure.query(async () => {
    // Test prisma db
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("User not found");

    return user;
  }),
});

export type AppRouter = typeof appRouter;
