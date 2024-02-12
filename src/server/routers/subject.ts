import { publicProcedure, router } from "../trpc";

export const subjectRouter = router({
  getSubjects: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subject.findMany();
  }),
});
