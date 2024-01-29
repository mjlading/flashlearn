"use client";

import { trpc } from "@/app/api/trpc/client";

export default function TRPCTest() {
  const helloTest = trpc.hello.useQuery();

  return <>{helloTest.data}</>;
}
