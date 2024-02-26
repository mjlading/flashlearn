"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function ProviderButton({
  provider,
  logo,
}: {
  provider: string;
  logo: any;
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
        Fortsett med {capitalizeFirstLetter(provider)}
      </span>
    </Button>
  );
}
