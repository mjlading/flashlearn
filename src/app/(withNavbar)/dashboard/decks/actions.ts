"use server";

import { api } from "@/app/api/trpc/server";

export async function fetchDecks({
  page = 1,
  pageSize = 10,
  sortBy = "dateCreated",
  sortOrder = "desc",
}: {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const decks = await api.user.getDecks.query({
    page: page,
    pageSize: pageSize,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });
  return decks;
}
