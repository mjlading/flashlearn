import { api } from "@/app/api/trpc/server";
import DeckList from "@/components/DeckList";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock useSearchParams()
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    category: "created",
    setCategory: vi.fn(),
  }),
}));

// Mock trpc getDecks and getDecksBySubjectname procedures
vi.mock("@/app/api/trpc/server", () => ({
  api: {
    user: {
      getDecks: {
        query: vi.fn(() => []),
      },
    },
    deck: {
      getDecksBySubjectName: {
        query: vi.fn(() => []),
      },
    },
  },
}));

vi.mock("@/app/api/trpc/client", () => ({
  api: {
    deck: {
      getTagsByDeckId: {
        useQuery: vi.fn(() => []),
      },
    },
  },
}));

describe("deck list test", () => {
  it("TODO", async () => {
    return true;
  });
});
