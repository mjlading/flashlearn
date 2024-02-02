import { expect, test, vi } from "vitest";
import prisma from "@/lib/__mocks__/prisma";
import testProxy from "./tRPCProxyClient";

vi.mock("../lib/prisma");

test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});

test("test protected procedure", async () => {
  // const actual = await testProxy.test.protectedTest.query();

  // console.log("ACTUAL: ", actual);

  return true;
});
