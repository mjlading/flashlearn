"use client";

import { api } from "@/app/api/trpc/client";

export default function TRPCProtectedTest() {
  const protectedTest = api.test.protectedTest.useQuery();

  return (
    <>
      <pre>{protectedTest.data || "Not authorized"}</pre>
    </>
  );
}
