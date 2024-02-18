import { router } from "../trpc";
import { aiRouter } from "./ai";
import { bookmarkRouter } from "./bookmark";
import { deckRouter } from "./deck";
import { rehearsalRouter } from "./rehearsal";
import { subjectRouter } from "./subject";
import { testRouter } from "./test";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  test: testRouter,
  deck: deckRouter,
  subject: subjectRouter,
  bookmark: bookmarkRouter,
  rehearsal: rehearsalRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
