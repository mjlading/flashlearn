import { publicProcedure, router } from "../trpc";

export const subjectRouter = router({
  getSubjects: publicProcedure.query(({ ctx }) => { // test me
    return ctx.prisma.subject.findMany();
  }),
});
