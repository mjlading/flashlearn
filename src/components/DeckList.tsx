"use client";

import { api } from "@/app/api/trpc/client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import DeckCard from "./DeckCard";
import DeckListSkeleton from "./DeckListSkeleton";
import NoDecks from "./NoDecks";
import { Skeleton } from "./ui/skeleton";

/**
 * DeckList component displays a list of Decks.
 * It uses infinite scrolling to load and display more decks as the user scrolls down.
 *
 * Props (mutually exclusive):
 * - subject (optional): A string to filter decks by their subject.
 * - category (optional): A category to filter decks, can be "recent", "created", or "bookmarked".
 */

export interface DeckListProps {
  subject?: string;
  category?: "recent" | "created" | "bookmarked";
}

export default function DeckList(props: DeckListProps) {
  const infiniteQuery = api.deck.infiniteDecks.useInfiniteQuery(
    {
      limit: 10, // Page size
      ...props,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      //TODO: initialData
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
