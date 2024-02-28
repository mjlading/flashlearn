"use client";

import { api } from "@/app/api/trpc/client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import DeckCard from "./DeckCard";
import DeckListSkeleton from "./DeckListSkeleton";
import NoDecks from "./NoDecks";
import { Skeleton } from "./ui/skeleton";
import { Deck } from "@prisma/client";
import { SerializedStateDates } from "@/lib/utils";

/**
 * DeckList component displays a list of Decks.
 * It uses infinite scrolling to load and display more decks as the user scrolls down.
 *
 * Props:
 * - subject (optional): A string to filter decks by their subject.
 * - category (optional): A category to filter decks, can be "recent", "created", or "bookmarked".
 * - query (optional): A search query that searches for deck names
 * - initialDecks (optional): Initial decks can be fetched on the server and be displayed on initial page load.
 */

export interface DeckListProps {
  initialDecks?: SerializedStateDates<Deck, "dateCreated" | "dateChanged">[];
  subject?: string;
  category?: "recent" | "created" | "bookmarked";
  query?: string;
}

export default function DeckList(props: DeckListProps) {
  const infiniteQuery = api.deck.infiniteDecks.useInfiniteQuery(
    {
      limit: 10, // Page size
      ...props,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: props.initialDecks && {
        pages: [
          {
            decks: props.initialDecks,
            nextCursor: undefined,
          },
        ],
        pageParams: [undefined],
      },
    }
  );

  const [inViewRef, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    // When the bottom skeleton is in view, fetch more decks
    if (inView) {
      infiniteQuery.fetchNextPage();
    }
  }, [inView, infiniteQuery]);

  if (infiniteQuery.isLoading) {
    return <DeckListSkeleton />;
  }

  if (infiniteQuery.data?.pages[0].decks.length === 0) {
    // 0 decks found
    return <NoDecks {...props} />;
  }

  return (
    <>
      <div className="flex flex-col space-y-3">
        {infiniteQuery.data?.pages
          .flatMap((page) => page.decks)
          .map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}

        {/* Loading more decks skeleton */}
        {infiniteQuery.hasNextPage && (
          <div ref={inViewRef}>
            <Skeleton className="h-[6rem]" />
          </div>
        )}
      </div>
    </>
  );
}
