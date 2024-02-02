"use client";

import { trpc } from "@/app/api/trpc/client";

export default function TRPCProtectedTest() {
  const protectedTest = trpc.test.protectedTest.useQuery();

  return (
    <>
      <pre>{protectedTest.data || "Not authorized"}</pre>
    </>
  );
}
