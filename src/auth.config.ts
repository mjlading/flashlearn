import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import type { DefaultSession, NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      preferencesSet?: boolean;
      nickname?: string;
      academicLevel?: string;
    } & DefaultSession["user"];
  }
}

export default {
  providers: [GitHub, Google],
} satisfies NextAuthConfig;
