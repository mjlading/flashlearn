"use client";

import { api } from "@/app/api/trpc/client";

export default function TRPCTest() {
  const helloTest = api.test.hello.useQuery();
  const prismaTest = api.test.helloPrisma.useQuery();

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
