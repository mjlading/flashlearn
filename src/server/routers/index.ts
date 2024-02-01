import { router, publicProcedure } from "../trpc";
import prisma from "@/db";
import z from "zod"

const testmethod = () => {
  return "Hello from tRPC!";
}

export const appRouter = router({
  hello: publicProcedure.query(
    testmethod
    ),
  helloPrisma: publicProcedure.query(async () => {
    // Test prisma db
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("User not found");

    return user;
  }),
  //input is of unknown type, still interpreted as requiring a string :)
  gunnartest: publicProcedure
  .input(z.string())
  .query(({input}) => {
    return {mirror: input};
  })  
});

export type AppRouter = typeof appRouter;
