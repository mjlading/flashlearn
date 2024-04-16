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

import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// available localizations
let locales:readonly string[] = ['en']

function getLocale(request:NextRequest) {
    
    let headers= { // typescript caused this 
        temp:<{[key:string]:string | string[] | undefined}> {
            'accept-language':request.headers.get('accept-language')
        }
    }.temp;

    let languages:readonly string[] = new Negotiator({headers}).languages();
    let defaultLocale:string = 'en'
    
    return match(languages, locales, defaultLocale)
}

function skipLangForAuth(pathname:string) {
  const authPaths = [`api/auth`,`api/auth/signIn`, `api/auth/error`, `api/auth/providers`]

  const skipLangAuth = authPaths.some(
    (path) => pathname.startsWith(`/${path}/`) || pathname === `/${path}`
  )
  console.log("caught url:", pathname, " with result: ", skipLangAuth)
  return skipLangAuth
}

export function middleware(request:NextRequest){

    const { pathname } = request.nextUrl
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    //console.log("\n", pathname)
    const skipLangAuth = skipLangForAuth(pathname);
    
    if (pathnameHasLocale || skipLangAuth) return
   
    // Redirect if there is no locale
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl)
}

export const config = {
    matcher: [
      // Skip all internal paths (_next)
      '/((?!_next).*)',
      // Optional: only run on root (/) URL
    ],
  }
