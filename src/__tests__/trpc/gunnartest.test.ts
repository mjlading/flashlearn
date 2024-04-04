import { createCaller } from "@/server/routers";
import { expect, test, it } from "vitest";
import { createInnerTRPCContext } from "@/server/trpc";

test("gunnartest mirrors entered string", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: { id: "123", name: "John Doe" },
      expires: "1",
    },
  });
  const caller = createCaller(ctx);

  const actual = await caller.test.hello();
  console.log(actual)
  expect(actual).toBe("Hello from tRPC!");
});
