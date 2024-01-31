"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignInButton({ ...props }) {
  return (
    <Button {...props} onClick={() => signIn()}>
      <span>Logg inn</span>
    </Button>
  );
}
