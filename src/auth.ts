import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";

export const authConfig = {
  providers: [GitHub, Google],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    session({ session, token }: any) {
      // session.accessToken = token.accessToken;

      if (token.sub) {
        session.user.id = token.sub;
      } else {
        console.error("Token SUB is missing");
      }

      // console.log("Session callback - Modified session object:", session);

      return session;
    },
  },
  pages: {
    signIn: "/auth/signIn",
  },
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authConfig);
