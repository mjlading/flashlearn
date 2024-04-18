"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./LoadingSpinner";
import { getDictionary } from "@/app/dictionaries/dictionaries";

export default function AuthButton({
  dict
}:{  
  dict:Awaited<ReturnType<typeof getDictionary>> // fancy unwrap
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
        <Button onClick={() => signOut()}>
          <span>{dict.home.signOut}</span>
        </Button>
      ) : (
        <Button onClick={() => signIn()}>
          <span>{dict.home.signIn}</span>
        </Button>
      )}
    </>
  );
}
