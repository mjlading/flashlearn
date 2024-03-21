import { createCaller } from "@/server/routers";
import { createInnerTRPCContext } from "@/server/trpc";
import { expect, test } from "vitest";

test("protected example router", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: { id: "123", name: "John Doe" },
      expires: "1",
    },
  });
  const caller = createCaller(ctx);

  const res = await caller.test.helloPrisma();
  console.log(res);

  expect(1).toEqual(1);
});
