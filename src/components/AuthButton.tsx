"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";
import { LoadingSpinner } from "./LoadingSpinner";
import Link from "next/link";
import { useDictionary } from "@/lib/DictProvider";

export default function AuthButton() {
  const session = useSession();
  const dict = useDictionary();
  if (session.status === "loading") {
    return (
      <Button disabled className="px-5">
        <LoadingSpinner />
      </Button>
    );
  }

  return (
    <>
      {session.status === "authenticated" ? (
        <Link href={`/${dict.lang}/dashboard`} className={buttonVariants({ size: "lg" })}>
          <span>{dict.home.dashboard}</span>
        </Link>
      ) : (
        <Button onClick={() => signIn()} size="lg">
          <span>{dict.home.getStarted}</span>
        </Button>
      )}
    </>
  );
}
