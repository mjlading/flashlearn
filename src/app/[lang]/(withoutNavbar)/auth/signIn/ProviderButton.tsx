"use client";

import { getDictionary } from "@/app/dictionaries/dictionaries";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function ProviderButton({
  provider,
  logo,
  dict
}: {
  provider: string;
  logo: any;
  dict:Awaited<ReturnType<typeof getDictionary>> // fancy unwrap
}) {
  function handleSignIn() {
    signIn(provider, { callbackUrl: "/dashboard" });
  }

  function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <Button
      onClick={handleSignIn}
      size="lg"
      variant="outline"
      className="w-full"
    >
      <Image
        alt={`${provider} logo`}
        loading="lazy"
        height="24"
        width="24"
        src={logo}
      />
      <span className="ml-4">
        {dict.signInPage.chooseProvider} {capitalizeFirstLetter(provider)}
      </span>
    </Button>
  );
}
