"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function ProgressBar({
  currentIndex,
  numFlashcards,
  setCurrentIndex,
}: {
  currentIndex: number;
  numFlashcards: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}) {
  const [progress, setProgress] = useState((1 / numFlashcards) * 100);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  function nextFlashcard() {
    const nextIndex = Math.min(currentIndex + 1, numFlashcards - 1);
    setCurrentIndex(nextIndex);
    setProgress(((nextIndex + 1) / numFlashcards) * 100);
  }

  function previousFlashcard() {
    const previousIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(previousIndex);
    setProgress(((previousIndex + 1) / numFlashcards) * 100);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.code === "ArrowRight") {
      nextFlashcard();
    } else if (event.code === "ArrowLeft") {
      previousFlashcard();
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Previous flashcard button (left arrow) */}
      <Button
        onClick={() => previousFlashcard()}
        disabled={currentIndex === 0}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      <Progress value={progress} className="h-2" />
      {/* Next flashcard button (right arrow) */}
      <Button
        onClick={() => nextFlashcard()}
        disabled={currentIndex === numFlashcards - 1}
        size="icon"
        variant="ghost"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
