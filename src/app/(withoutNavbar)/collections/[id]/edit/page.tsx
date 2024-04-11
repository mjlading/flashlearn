"use client";

import { api } from "@/app/api/trpc/client";

export default function EditCollectionPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const deck = api.collection.getCollectionById.useQuery({
    id: params.id,
    includeDecks: true,
  });

  return <div>{JSON.stringify(deck.data)}</div>;
}
