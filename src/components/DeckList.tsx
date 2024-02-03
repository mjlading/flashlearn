"use client";

import { trpc } from "@/app/api/trpc/client";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Layers3 } from "lucide-react";
import DeckCard from "./DeckCard";

export default function DeckList() {
  const decks = trpc.user.getDecks.useQuery({
    page: 1,
    pageSize: 10,
  });

  if (decks.isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[8rem]" />
        ))}
      </div>
    );
  }

  if (decks.isError) {
    return (
      <h2 className="text-destructive">
        Kunne ikke hente studiekort: {decks.error.message}
      </h2>
    );
  }

  if (decks.data.length === 0) {
    return (
      <div className="h-full text-center flex flex-col items-center justify-center gap-4">
        <h2 className="font-semibold text-lg">Du har ingen studiekort 😔</h2>
        <p className="text-muted-foreground">
          Lag et sett for å komme i gang med læringen din!
        </p>
        <Button size="lg" className="my-5">
          Lag et sett
        </Button>
        <Layers3 size={80} opacity="0.2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      {decks.data.map((deck) => {
        return <DeckCard key={deck.id} deck={deck} />;
      })}
    </div>
  );
}
