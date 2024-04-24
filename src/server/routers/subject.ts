import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const subjectRouter = router({
  getSubjects: publicProcedure.query(({ ctx }) => {
    // test me
    return ctx.prisma.subject.findMany();
  }),
  getKeywordsInSubject: publicProcedure
    .input(
      z.object({
        subject: z.string(),
        n: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { subject, n } = input;

      let keywords = await ctx.prisma.flashcard.findMany({
        where: {
          tag: {
            not: null,
          },
        },
        select: {
          tag: true,
        },
        distinct: ["tag"],
        take: n,
      });

      keywords = keywords.filter(
        (item) => item.tag !== null && item.tag.length > 0
      );

      return keywords;
    }),
});
