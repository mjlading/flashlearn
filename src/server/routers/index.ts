import { createTRPCContext, router } from "../trpc";
import { deckRouter } from "./deck";
import { testRouter } from "./test";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  test: testRouter,
  deck: deckRouter,
});

export type AppRouter = typeof appRouter;
