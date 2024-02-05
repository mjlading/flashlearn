/**
 * This code is adapted from the T3 stack.
 * Source: https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */

import { auth } from "@/auth";
import { TRPCError, initTRPC } from "@trpc/server";
import prisma from "@/lib/prisma";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();

  return {
    prisma,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
