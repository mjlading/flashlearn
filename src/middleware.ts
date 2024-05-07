import NextAuth from "next-auth";
import { auth, authConfig } from "./auth";
import { NextRequest, NextResponse } from "next/server";

import { isProtected } from "@/routes"
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// available localizations TODO: Move this to lang config
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

/**
 * 
 * @param path
 * @returns boolean true if path includes locale
 */
function checkLang(path:string){
  const pathnameHasLocale = locales.some(
    (locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`
  );
  //console.log("\npath includes lang:", pathnameHasLocale, "\n");
  return pathnameHasLocale
}

function skipLangForApi(pathname: string) {
  const authPaths = [`api`];

  const skipLangAuth = authPaths.some(
    (path) => pathname.startsWith(`/${path}/`) || pathname === `/${path}`
  );
  //console.log("caught url:", pathname, " with result: ", skipLangAuth)
  return skipLangAuth;
}

export default auth(async (request) => {

  /*
   * 1. check if url leads to api
   * 2. check if pathname has locale
   * 3. check if path is protected -> sign in 
   * 4. if on initial sign in, redirect to account setup
   */


  const { pathname } = request.nextUrl;

  //console.log("\npath:", pathname);
  //console.log("session token cookie:", request.cookies.get('authjs.session-token'), "\n")
  if (skipLangForApi(pathname)) {
    //console.log("pathname led to api");
    return NextResponse.next();
  }

  if (!checkLang(pathname)) { // this will make paths to api fail so they should be excluded in path config
    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    //console.log("redirecting to locale", request.nextUrl.pathname);
    return NextResponse.redirect(request.nextUrl);
  }

  console.log("path:", pathname, "protected?", isProtected(pathname))
  
  const session = request.auth;
  // Check if user has preferences set
  // Check if user has preferences set
  // If not, redirect to user config page

  const preferencesSet = session?.user.preferencesSet;
  if (preferencesSet === undefined) {
    console.warn("preferencesSet is undefined");
  }
  // if user has not set pref. redirect to user config page
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
})
// Matcher configuration to exclude specific paths
export const config = {
  matcher: [
    // apply middleware to all paths except these, including the profileSetup page
    "/((?!profileSetup|api|_next/static|_next/image|favicon.ico).*)",
    // Skip all internal paths (_next)
    "/((?!_next).*)",
  ],
};
