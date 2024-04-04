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

export async function cleanDB() {
    await prisma.$transaction([prisma.deck.deleteMany()])

}