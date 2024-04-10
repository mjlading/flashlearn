// Runs before each unit test

import { resolve } from 'path';
import { vi } from "vitest";
import prisma from '@/lib/prisma';
// Mock useRouter()
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
    route: "/",
  }),
}));

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// Mock IntersectionObserver
vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(() => [vi.fn(), true]),
}));

// Mock useSession()
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    user: {
      id: "user1",
    },
  }),
}));

export async function cleanDBDecks() {
  if (process.env.NODE_ENV !== "production") {
    if (await prisma.deck.count() > 0)
      await prisma.$transaction([prisma.deck.deleteMany()]);
  }

}
export async function cleanDBCollections() {
  if (process.env.NODE_ENV !== "production") {
    if (await prisma.collection.count() > 0)
    await prisma.$transaction([prisma.collection.deleteMany()]);
  }
}
export async function cleanDBUsers() {
  if (process.env.NODE_ENV !== "production"){
    if (await prisma.user.count() != 1) 
    await prisma.$transaction([prisma.user.deleteMany() , prisma.user.create({data:{id:"testId", name:"test"}})]);
  }
}

