// sum.test.js
import { expect, test, vi } from "vitest";
import { sum } from "../lib/method";
import prisma from "@/lib/__mocks__/prisma";
import { createSubject } from "@/lib/script";

vi.mock("../lib/prisma");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("test prisma", async () => {
  const newSubject = { name: "Test123" };

  prisma.subject.create.mockResolvedValue(newSubject);

  const subject = await createSubject(newSubject);

  expect(subject).toStrictEqual(newSubject);
});
