"use client";

import { trpc } from "@/app/api/trpc/client";

export default function TRPCTest() {
  const helloTest = trpc.test.hello.useQuery();
  const prismaTest = trpc.test.helloPrisma.useQuery();

  return (
    <>
      {helloTest.data}
      <br />
      <br />
      Prisma test (fetch first db user):
      <pre>{JSON.stringify(prismaTest.data, null, 2)}</pre>
    </>
  );
}
