import { expect, test, it } from "vitest";
import testProxy from "../tRPCProxyClient";

test("gunnartest mirrors entered string", async () => {
  const actual = await testProxy.test.hello.query();
  expect(actual).toBe("Hello from tRPC!");
});
