import { api } from "@/app/api/trpc/server";
import DeckList from "@/components/DeckList";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

describe("DeckList", () => {
  it("Displays placeholder text and CTA if user has no created decks", async () => {
    const fetchParams = {
      category: "created" as "created",
    };
    render(<DeckList initialDecks={[]} fetchParams={fetchParams} />);

    expect(await api.user.getDecks.query).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      sortBy: "dateCreated",
      sortOrder: "desc",
      category: "created",
    });
    expect(await screen.findByText(/Du har ingen studiekort/));
    expect(await screen.findByRole("link", { name: "Nytt sett" }));
  });
  it("Displays placeholder text if user has no recent decks", async () => {
    const fetchParams = {
      category: "recent" as "recent",
    };
    render(<DeckList initialDecks={[]} fetchParams={fetchParams} />);

    expect(await api.user.getDecks.query).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      sortBy: "dateCreated",
      sortOrder: "desc",
      category: "recent",
    });
    expect(await screen.findByText(/Du har ingen nylige sett/));
  });
  it("Displays placeholder text if user has no bookmarked decks", async () => {
    const fetchParams = {
      category: "bookmarked" as "bookmarked",
    };
    render(<DeckList initialDecks={[]} fetchParams={fetchParams} />);

    expect(await api.user.getDecks.query).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      sortBy: "dateCreated",
      sortOrder: "desc",
      category: "bookmarked",
    });
    expect(await screen.findByText(/Du har ingen bokmerkede sett/));
  });
  it("Displays placeholder text if subject has no decks", async () => {
    const fetchParams = {
      subjectName: "Mathematics" as "Mathematics",
    };
    render(<DeckList initialDecks={[]} fetchParams={fetchParams} />);

    expect(await api.deck.getDecksBySubjectName.query).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      sortBy: "dateCreated",
      sortOrder: "desc",
      subjectName: "Mathematics",
    });
    expect(await screen.findByText(/Ingen sett funnet/));
  });
  it("Displays users initial decks", async () => {
    const fetchParams = {
      category: "created" as "created",
    };

    const initialDecks = [
      {
        id: "1",
        name: "Deck 1",
        dateCreated: new Date(),
        dateChanged: new Date(),
        numFlashcards: 0,
        userId: "user1",
        subjectName: "Mathematics",
        isPublic: true,
        averageRating: null,
        academicLevel: 0,
      },
      {
        id: "2",
        name: "Deck 2",
        dateCreated: new Date(),
        dateChanged: new Date(),
        numFlashcards: 0,
        userId: "user1",
        subjectName: "Mathematics",
        isPublic: true,
        averageRating: null,
        academicLevel: 0,
      },
    ];

    render(
      <DeckList initialDecks={initialDecks as any} fetchParams={fetchParams} />
    );

    expect(await api.user.getDecks.query).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      sortBy: "dateCreated",
      sortOrder: "desc",
      category: "recent",
    });
    expect(await screen.findByText("Deck 1"));
    expect(await screen.findByText("Deck 2"));
  });
});
