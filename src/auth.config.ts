import GitHub from "next-auth/providers/github";

import type { DefaultSession, NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export default {
  providers: [GitHub],
} satisfies NextAuthConfig;
