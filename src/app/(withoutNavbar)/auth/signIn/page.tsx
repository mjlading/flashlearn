"use client";

import GithubIcon from "@/../public/images/github-icon.svg";
import GoogleIcon from "@/../public/images/googe-icon.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-4">
      <main>
        <Card className="p-8 max-w-[22rem]">
          <CardHeader>
            <CardTitle className="mb-2">Logg inn</CardTitle>
            <CardDescription className="mb-1">
              Velg en tredjeparts autentisering for rask og sikker innlogging
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <form
              action={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <Button size="lg" variant="outline" type="submit" tabIndex={0}>
                <Image
                  alt="github logo"
                  loading="lazy"
                  height="24"
                  width="24"
                  src={GithubIcon}
                />
                <span className="ml-4">Fortsett med Github</span>
              </Button>
            </form>
            <form
              action={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <Button size="lg" variant="outline" type="submit" tabIndex={0}>
                <Image
                  alt="google logo"
                  loading="lazy"
                  height="24"
                  width="24"
                  src={GoogleIcon}
                />
                <span className="ml-4">Fortsett med Google</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="flex justify-end">
        <Link
          href="/privacy"
          target="_blank"
          className={cn(buttonVariants({ variant: "link" }), "text-xs")}
        >
          <span>Personvern</span>
        </Link>
        <Link
          href="/terms"
          target="_blank"
          className={cn(buttonVariants({ variant: "link" }), "text-xs pr-0")}
        >
          <span>Vilkår</span>
        </Link>
      </footer>
    </div>
  );
}
