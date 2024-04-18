"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";
import { LoadingSpinner } from "./LoadingSpinner";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import Link from "next/link";

export default function AuthButton({
  dict,
}: {
  dict: Awaited<ReturnType<typeof getDictionary>>; // fancy unwrap
}) {
  const session = useSession();

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
        <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
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
