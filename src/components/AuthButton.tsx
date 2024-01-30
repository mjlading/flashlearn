"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./LoadingSpinner";

export default function AuthButton() {
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
        <Button onClick={() => signOut()}>
          <span>Logg ut</span>
        </Button>
      ) : (
        <Button onClick={() => signIn()}>
          <span>Logg inn</span>
        </Button>
      )}
    </>
  );
}
