import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { User } from "next-auth";

interface ExtendedUserProperties {
  preferencesSet?: boolean;
  nickname?: string;
}

export const authConfig = {
  providers: [GitHub, Google],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user, session, trigger }) {
      // console.log("jwt callback: ", { token, user, session, trigger });

      if (
        trigger === "update" &&
        session?.nickname &&
        session?.preferencesSet
      ) {
        token.nickname = session.nickname;
        token.preferencesSet = session.preferencesSet;
      }

      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        const extendedUser = user as User & ExtendedUserProperties;
        token.preferencesSet = extendedUser.preferencesSet;
      }
      return token;
    },
    async session({ session, token }: any) {
      // console.log("session callback", { session, token });

      if (token.sub) {
        session.user.id = token.sub;
      } else {
        console.error("Token SUB is missing");
      }

      // Add the preferencesSet boolean to the session
      session.user.preferencesSet = token.preferencesSet ?? false;
      console.log("users preferences set to: ", session.user.preferencesSet)
      session.user.nickname = token.nickname;

      return session;
    },
    // Middleware function for authorization
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Define the paths that require authentication
      const protectedPaths = ["/dashboard", "/decks/create"];

      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("/api/auth/signin", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
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
