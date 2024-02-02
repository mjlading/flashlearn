"use client";

import { expect, test, it } from "vitest";
import testProxy from "../tRPCProxyClient";
import { appRouter } from "@/server/routers/index";
test("gunnartest mirrors entered string", async () => {
  expect(await testProxy.test.hello.query()).toBe("Hello from tRPC!");
});

test("gunnartest mirrors entered string", async () => {
  const caller = appRouter.createCaller({ headers: Headers.prototype, session: null });

  expect(await caller.test.hello()).toBe("Hello from tRPC!");
});
