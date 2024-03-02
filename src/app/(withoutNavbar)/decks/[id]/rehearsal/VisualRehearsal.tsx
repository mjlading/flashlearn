"use client";

import Flashcard from "@/components/Flashcard";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VisualRehearsal({
  flashcards,
}: {
  flashcards: FlashcardType[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentFlashcard(flashcards[currentIndex]);
    setProgress(((currentIndex + 1) / flashcards.length) * 100);
  }, [currentIndex, flashcards]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  function nextFlashcard() {
    const nextIndex = Math.min(currentIndex + 1, flashcards.length - 1);
    setCurrentIndex(nextIndex);
  }

  function previousFlashcard() {
    const previousIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(previousIndex);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.code === "ArrowRight") {
      nextFlashcard();
    } else if (event.code === "ArrowLeft") {
      previousFlashcard();
    }
  }

  return (
    <main className="space-y-8 w-full max-w-[40rem]">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => previousFlashcard()}
          disabled={currentIndex === 0}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft />
        </Button>
        <Progress value={progress} className="h-2" />
        <Button
          onClick={() => nextFlashcard()}
          disabled={currentIndex === flashcards.length - 1}
          size="icon"
          variant="ghost"
        >
          <ChevronRight />
        </Button>
      </div>
      <Flashcard flashcard={currentFlashcard} />
    </main>
  );
}
