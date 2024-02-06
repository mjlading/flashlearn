"use client";

import { fetchDecks } from "@/app/(withNavbar)/dashboard/decks/actions";
import { SerializedStateDates } from "@/lib/utils";
import Prisma from "@prisma/client";
import { Layers3 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import DeckCard from "./DeckCard";
import NewDeckButton from "./NewDeckButton";
import { Skeleton } from "./ui/skeleton";

interface DeckListProps {
  // Convert types dateCreated and dateChanged from Date to string
  initialDecks: SerializedStateDates<
    Prisma.Deck,
    "dateCreated" | "dateChanged"
  >[];
}

/**
 * DeckList component displays a list of "Deck" items.
 * It uses infinite scrolling to load and display more decks as the user scrolls down.
 *
 * Props:
 * - initialDecks: An array of Deck objects that should be displayed initially.
 *
 * State:
 * - decks: An array of Deck objects that are currently displayed.
 * - page: The current page number for fetching more decks.
 * - moreDecksToFetch: A reference indicating whether there are more decks to fetch.
 */
export default function DeckList({ initialDecks }: DeckListProps) {
  const [decks, setDecks] = useState(initialDecks);
  const page = useRef(1);
  const [inViewRef, inView] = useInView({
    threshold: 0,
  });
  const [moreDecksToFetch, setMoreDecksToFetch] = useState(true);

  /**
   * loadMoreDecks function fetches the next page of decks and adds them to the current list of decks.
   * If no more decks are returned, it sets moreDecksToFetch.current to false.
   */
  const loadMoreDecks = useCallback(async () => {
    const nextPage = page.current + 1;
    const newDecks = await fetchDecks({
      page: nextPage,
    });

    if (newDecks.decks.length !== 0) {
      setDecks((prevDecks) => [...prevDecks, ...newDecks.decks]);
      page.current = nextPage;
    } else {
      // No more decks to fetch
      setMoreDecksToFetch(false);
    }
  }, [page]);

  useEffect(() => {
    if (inView) {
      loadMoreDecks();
    }
  }, [inView, loadMoreDecks]);

  if (decks.length === 0) {
    return (
      <div className="h-full text-center flex flex-col items-center justify-center gap-4">
        <h2 className="font-semibold text-lg">Du har ingen studiekort 😔</h2>
        <p className="text-muted-foreground">
          Lag et sett for å komme i gang med læringen din!
        </p>
        <NewDeckButton size="lg" className="my-5" />
        <Layers3 size={80} opacity="0.2" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-3 pb-12">
        {decks.map((deck) => {
          return <DeckCard key={deck.id} deck={deck} />;
        })}

        {/* Loading skeleton */}
        {moreDecksToFetch && (
          <div ref={inViewRef}>
            <Skeleton className="h-[10rem]" />
          </div>
        )}
      </div>
    </>
  );
}
