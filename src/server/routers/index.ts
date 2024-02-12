import { router } from "../trpc";
import { bookmarkRouter } from "./bookmark";
import { deckRouter } from "./deck";
import { subjectRouter } from "./subject";
import { testRouter } from "./test";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  test: testRouter,
  deck: deckRouter,
  subject: subjectRouter,
  bookmark: bookmarkRouter,
});

export type AppRouter = typeof appRouter;
