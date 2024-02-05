"use server";

import { api } from "@/app/api/trpc/server";

export async function fetchDecks({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  const decks = await api.user.getDecks.query({
    page: page,
    pageSize: pageSize,
  });
  return decks;
}
