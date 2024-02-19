"use client";

import Flashcard from "@/components/Flashcard";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { type Flashcard as FlashcardType } from "@prisma/client";

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

  function handleKeydown(event: KeyboardEvent) {
    if (event.code === "ArrowRight") {
      // Go to next card
      const nextIndex = currentIndex + 1;

      if (nextIndex >= flashcards.length) return;

      setCurrentIndex(nextIndex);
    } else if (event.code === "ArrowLeft") {
      // Go to previous card
      const nextIndex = currentIndex - 1;

      if (nextIndex < 0) return;

      setCurrentIndex(nextIndex);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Progress value={progress} className="h-2" />
      <Flashcard flashcard={currentFlashcard} />
    </div>
  );
}
