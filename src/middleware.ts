import NextAuth from "next-auth";
import { auth, authConfig } from "./auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if user has preferences set
  // If not, redirect to user config page
  const session = await auth();

  const preferencesSet = session?.user.preferencesSet || false;

  if (!preferencesSet && session?.user) {
    // Redirect to profile setup page
    return NextResponse.redirect(new URL("/profileSetup", request.url));
  }

  return NextResponse.next();
}

// Matcher configuration to exclude specific paths
export const config = {
  matcher: [
    // apply middleware to all paths except these, including the profileSetup page
    "/((?!profileSetup|api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export default NextAuth(authConfig).auth;
