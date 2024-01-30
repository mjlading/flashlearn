import { router, publicProcedure } from "../trpc";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "Hello from tRPC!";
  }),
  helloPrisma: publicProcedure.query(async () => {
    // Test prisma db
    return await prisma?.user.findFirst();
  }),
});

export type AppRouter = typeof appRouter;
