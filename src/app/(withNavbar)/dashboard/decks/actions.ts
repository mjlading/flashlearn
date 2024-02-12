"use server";

import { api } from "@/app/api/trpc/server";

export type FetchDecksParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: "recent" | "created" | "bookmarked";
  subjectName?: string;
};

export async function fetchDecks({
  page = 1,
  pageSize = 10,
  sortBy = "dateCreated",
  sortOrder = "desc",
  category,
  subjectName,
}: FetchDecksParams) {
  if (category) {
    // Fetch users decks based on category
    return await api.user.getDecks.query({
      page: page,
      pageSize: pageSize,
      sortBy: sortBy,
      sortOrder: sortOrder,
      category: category,
    });
  }

  if (subjectName) {
    // Fetch decks that have given subject
    return await api.deck.getDecksBySubjectName.query({
      page: page,
      pageSize: pageSize,
      sortBy: sortBy,
      sortOrder: sortOrder,
      subjectName: subjectName,
    });
  }

  throw new Error("Invalid input params to fetchDecks function");
}

export async function fetchDeckCounts() {
  // fetch data in parallel
  const [numBookmarkedDecks, numCreatedDecks] = await Promise.all([
    await api.deck.countDecksByCategory.query({
      category: "bookmarked",
    }),
    api.deck.countDecksByCategory.query({
      category: "created",
    }),
  ]);
  return {
    numBookmarkedDecks: numBookmarkedDecks,
    numCreatedDecks: numCreatedDecks,
  };
}
