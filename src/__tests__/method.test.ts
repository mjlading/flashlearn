import { expect, test, vi } from "vitest";
import prisma from "@/lib/__mocks__/prisma";
import testProxy from "./tRPCProxyClient";

vi.mock("../lib/prisma");

test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});

test("test trpc", async () => {
  const expected = {
    email: "mjlading@stud.ntnu.no",
    emailVerified: null,
    id: "cls03t74k00001511wa6ffq0k",
    image: "https://avatars.githubusercontent.com/u/91284776?v=4",
    name: "mjlading",
  };

  const actual = await testProxy.test.helloPrisma.query();

  expect(actual).toStrictEqual(expected);
});

test("test protected procedure", async () => {
  // const actual = await testProxy.test.protectedTest.query();

  // console.log("ACTUAL: ", actual);

  return true;
});
