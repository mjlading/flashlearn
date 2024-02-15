// Runs before each unit test

import { vi } from "vitest";

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

// Mock useSearchParams()
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    category: "created",
    setCategory: vi.fn(),
  }),
}));

// Mock useSession()
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    user: {
      id: "user1",
    },
  }),
}));
