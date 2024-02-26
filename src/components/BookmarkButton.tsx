"use client";

import { api } from "@/app/api/trpc/client";
import { Bookmark, BookmarkCheck, BookmarkPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function BookmarkButton({ deckId }: { deckId: string }) {
  const utils = api.useUtils();

  const isBookmarkedQuery = api.bookmark.isBookmarked.useQuery({
    deckId: deckId,
  });

  const [isBookmarked, setIsBookmarked] = useState<undefined | boolean>(
    undefined
  );

  useEffect(() => {
    if (isBookmarkedQuery.isSuccess) {
      setIsBookmarked(isBookmarkedQuery.data);
    }
  }, [isBookmarkedQuery.isSuccess, isBookmarkedQuery.data]);

  const addBookmarkMutation = api.bookmark.addBookmark.useMutation({
    onMutate() {
      // Optimistic rendering
      setIsBookmarked(true);
    },
    onSuccess() {
      utils.deck.infiniteDecks.invalidate({ category: "bookmarked" });
      utils.bookmark.invalidate();
    },
    onError() {
      // Undo optimistic rendering
      setIsBookmarked(false);

      toast.error("Noe gikk galt", {
        description: "Settet ble ikke bokmerket. Vennligst prøv igjen.",
      });
    },
  });
  const removeBookmarkMutation = api.bookmark.removeBookmark.useMutation({
    onMutate() {
      // Optimistic rendering
      setIsBookmarked(false);
    },
    onSuccess() {
      utils.deck.infiniteDecks.invalidate({ category: "bookmarked" });
      utils.bookmark.invalidate();
    },
    onError() {
      // Undo optimistic rendering
      setIsBookmarked(true);

      toast.error("Noe gikk galt", {
        description: "Bokmerket ble ikke fjernet. Vennligst prøv igjen.",
      });
    },
  });

  function removeBookmark() {
    removeBookmarkMutation.mutate({
      deckId: deckId,
    });
  }

  function addBookmark() {
    addBookmarkMutation.mutate({
      deckId: deckId,
    });
  }

  if (isBookmarkedQuery.isLoading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Bookmark />
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {isBookmarked ? (
            <Button variant="outline" onClick={removeBookmark} size="icon">
              <BookmarkCheck className="text-success" />
            </Button>
          ) : (
            <Button variant="outline" onClick={addBookmark} size="icon">
              <BookmarkPlus />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{isBookmarked ? "Fjern bokmerke" : "Legg til bokmerke"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
