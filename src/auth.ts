import NextAuth, { NextAuthConfig } from "next-auth";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { User } from "next-auth";
import { i18n } from "../i18n-config";
import { isProtected } from "@/routes";
interface ExtendedUserProperties {
  preferencesSet?: boolean;
  nickname?: string;
  academicLevel?: string;
}

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    preferencesSet?: boolean | null;
    nickname?: string | null;
    academicLevel?: string | null;
  }
}

function getProviders() {
  if (!process.env.ENABLE_CYPRESS_LOGIN || !process.env.CYPRESS_TEST_AC_ID)
    return [Google, GitHub];
  else {
    return [
      Google,
      GitHub,
      Credentials({
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials: any, req: any) => {
          let user = null;
          if (credentials.password !== "flashlearn")
            throw new Error("User not found.");
          // logic to verify if user exists
          user = await prisma.user.findUnique({
            where: { id: process.env.CYPRESS_TEST_AC_ID }, //THIS REQUIRES A REAL USER
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              preferencesSet: true,
              nickname: true,
              academicLevel: true,
            },
          });
          //console.log(user)
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error(
              "Eggbert was not in the database (or the id needs to be updated)."
            );
          }

          // return user object with the their profile data
          return user;
        },
      }),
    ];
  }
}

export const authConfig = {
  providers: getProviders(),
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user, session, trigger }) {
      //console.log("jwt callback: ", { token, user, session, trigger });

      if (
        trigger === "update" &&
        session?.nickname &&
        session?.preferencesSet &&
        session?.academicLevel
      ) {
        token.nickname = session.nickname;
        token.preferencesSet = session.preferencesSet;
        token.academicLevel = session.academicLevel;
      }

      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        const extendedUser = user as User;

        // Directly fetch preferences from the database if not available in session
        if (!extendedUser.preferencesSet) {
          console.log("fetching db user");
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              preferencesSet: true,
              nickname: true,
              academicLevel: true,
            },
          });

          token.preferencesSet = dbUser?.preferencesSet;
          token.nickname = dbUser?.nickname;
          token.academicLevel = dbUser?.academicLevel;
        } else {
          token.preferencesSet = extendedUser.preferencesSet;
          token.nickname = extendedUser.nickname;
          token.academicLevel = extendedUser.academicLevel;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      //console.log("session callback", { session, token });

      if (token.sub) {
        session.user.id = token.sub;
      } else {
        console.error("Token SUB is missing");
      }

      // Add the preferencesSet boolean to the session
      session.user.preferencesSet = token.preferencesSet;
      console.log("users preferences set to: ", session.user.preferencesSet);
      session.user.nickname = token.nickname;
      session.user.academicLevel = token.academicLevel;

      return session;
    },
    // Middleware function for authorization
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Define the paths that require authentication
      let path = nextUrl.pathname;
      // Remove localization prefix url string
      const locales = i18n.locales;
      // console.log("path before cleaning", path);
      const pathnameHasLocale = locales.some(
        (locale) => path.split("/")[1] == locale
      );
      let pathWithoutLang;

      if (!pathnameHasLocale) {
        pathWithoutLang = path;
      } else {
        pathWithoutLang = path.slice(3);
      }
      // console.log("path after cleaning", pathWithoutLang);
      const pathIsProtected = isProtected(path);
      console.log("route protected by auth mdw: ", pathIsProtected);
      if (pathIsProtected && !isLoggedIn) {
        console.log("redirecting to signin from: ", pathWithoutLang);
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
  signIn,
  auth,
} = NextAuth(authConfig);
