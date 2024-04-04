import { createCaller } from "@/server/routers";
import { createInnerTRPCContext } from "@/server/trpc";
import { expect, test } from "vitest";

test("protected example router", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: { id: "testId", name: "test" },
      expires: "1",
    },
  });
  const caller = createCaller(ctx);

  const user = { id: "testId", name: "test" }

  const res = await caller.test.helloPrisma();
  console.log(res);

  expect(user.id).toBe(res.id); 
  expect(user.name).toBe(res.name);
});
