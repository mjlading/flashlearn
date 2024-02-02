import { createTRPCContext, router } from "../trpc";
import { testRouter } from "./test";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  test: testRouter,
});

export type AppRouter = typeof appRouter;
