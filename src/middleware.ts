import NextAuth from "next-auth";
import { auth, authConfig } from "./auth";
import { NextRequest, NextResponse } from "next/server";

export default NextAuth(authConfig).auth;

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// available localizations
let locales: readonly string[] = ["en", "no"];

function getLocale(request: NextRequest) {
  let headers = {
    // typescript caused this
    temp: <{ [key: string]: string | string[] | undefined }>{
      "accept-language": request.headers.get("accept-language"),
    },
  }.temp;

  let languages: readonly string[] = new Negotiator({ headers }).languages();
  let defaultLocale: string = "en";

  return match(languages, locales, defaultLocale);
}

function skipLangForApi(pathname: string) {
  const authPaths = [`api`];

  const skipLangAuth = authPaths.some(
    (path) => pathname.startsWith(`/${path}/`) || pathname === `/${path}`
  );
  //console.log("caught url:", pathname, " with result: ", skipLangAuth)
  return skipLangAuth;
}

export async function middleware(request: NextRequest) {
  /*
   * 1. check if url leads to auth
   * 2. check if pathname has locale
   * 3. on initial login, redirect to account setup
   *
   * Make sure that account setup works?
   *
   */

  const { pathname } = request.nextUrl;

  console.log("\npath:", pathname);
  console.log("session token cookie:", request.cookies.get('authjs.session-token'), "\n")
  if (skipLangForApi(pathname)) {
    console.log("pathname led to api");
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  console.log("\n", pathnameHasLocale, "\n");

  if (!pathnameHasLocale) {
    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    console.log("redirecting to locale", request.nextUrl.pathname);
    return NextResponse.redirect(request.nextUrl);
  }

  // Check if user has preferences set
  // If not, redirect to user config page
  const session = await auth();

  const preferencesSet = session?.user.preferencesSet;
  if (preferencesSet === undefined) {
    console.warn("preferencesSet is undefined");
  }

  if (
    request.nextUrl.pathname !== `/${getLocale(request)}/profileSetup` &&
    !preferencesSet &&
    session?.user
  ) {
    //create redirect link
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}/profileSetup`;

    console.log("redirecting bc we are going to profileSetup");
    // Redirect to profile setup page
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

// Matcher configuration to exclude specific paths
export const config = {
  matcher: [
    // apply middleware to all paths except these, including the profileSetup page
    "/((?!profileSetup|api|_next/static|_next/image|favicon.ico).*)",
    // Skip all internal paths (_next)
    "/((?!_next).*)",
  ],
};
