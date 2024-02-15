"use client";

import {
  FetchDecksParams,
  fetchDecks,
} from "@/app/(withNavbar)/dashboard/decks/actions";
import { SerializedStateDates } from "@/lib/utils";
import Prisma from "@prisma/client";
import { Layers3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import DeckCard from "./DeckCard";
import NewDeckButton from "./NewDeckButton";
import { Skeleton } from "./ui/skeleton";
import NoDecks from "./NoDecks";

interface DeckListProps {
  // Convert types dateCreated and dateChanged from Date to string
  initialDecks: SerializedStateDates<
    Prisma.Deck,
    "dateCreated" | "dateChanged"
  >[];
  fetchParams: FetchDecksParams;
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
export default function DeckList({ initialDecks, fetchParams }: DeckListProps) {
  const searchParams = useSearchParams();
  const [decks, setDecks] = useState(initialDecks);
  const page = useRef(1);
  const [inViewRef, inView] = useInView({
    threshold: 0,
  });
  const [moreDecksToFetch, setMoreDecksToFetch] = useState(
    initialDecks.length >= (fetchParams.pageSize ? fetchParams.pageSize : 10) // if initialDecks length is < pageSize, there are no more decks to fetch
  );

  // updates the list on deck deletion
  useEffect(() => {
    setDecks(initialDecks);
    page.current = 1;
  }, [initialDecks]);

  /**
   * loadMoreDecks function fetches the next page of decks and adds them to the current list of decks.
   * If no more decks are returned, it sets moreDecksToFetch.current to false.
   */
  const loadMoreDecks = useCallback(async () => {
    const nextPage = page.current + 1;
    const newDecks = await fetchDecks({
      ...fetchParams,
      page: nextPage,
    });

    if (newDecks.length !== 0) {
      setDecks((prevDecks) => [...prevDecks, ...newDecks]);
      page.current = nextPage;
    }
    if (newDecks.length < 10) {
      setMoreDecksToFetch(false);
    }
  }, [page, fetchParams]);

  useEffect(() => {
    if (inView) {
      loadMoreDecks();
    }
  }, [inView, loadMoreDecks]);

  if (decks.length === 0) {
    return <NoDecks fetchParams={fetchParams} />;
  }

  return (
    <>
      <div className="flex flex-col space-y-3 pb-12">
        {decks.map((deck) => {
          return <DeckCard key={deck.id} deck={deck} />;
        })}

        {/* Loading more decks skeleton */}
        {moreDecksToFetch && (
          <div ref={inViewRef}>
            <Skeleton className="h-[10rem]" />
          </div>
        )}
      </div>
    </>
  );
}
