"use client";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flashcard } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";

export default function VisualRehearsal({
  flashcards,
}: {
  flashcards: Flashcard[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);
  const [showBack, setShowBack] = useState(false);
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
    if (event.code === "Space") {
      // Flip card
      setShowBack(!showBack);
    } else if (event.code === "ArrowRight") {
      // Go to next card
      const nextIndex = currentIndex + 1;

      if (nextIndex >= flashcards.length) return;

      setShowBack(false); // Always show front on next card
      setCurrentIndex(nextIndex);
    } else if (event.code === "ArrowLeft") {
      // Go to previous card
      const nextIndex = currentIndex - 1;

      if (nextIndex < 0) return;

      setShowBack(false); // Always show front on previous card
      setCurrentIndex(nextIndex);
    }
  }

  function dynamicTextSize(textLength: number): string {
    if (textLength < 50) {
      return "text-xl";
    } else if (textLength < 100) {
      return "text-lg";
    } else if (textLength < 500) {
      return "text-md";
    } else {
      return "text-sm";
    }
  }

  // useMemo to prevent recalculating these on every render
  const textSizeFront = useMemo(
    () => dynamicTextSize(currentFlashcard.front.length),
    [currentFlashcard.front]
  );
  const textSizeBack = useMemo(
    () => dynamicTextSize(currentFlashcard.back.length),
    [currentFlashcard.back]
  );

  return (
    <>
      <Progress value={progress} />
      <div
        onClick={() => setShowBack(!showBack)}
        className="h-[20rem] w-[30rem] rounded-xl bg-muted/40 p-7 leading-relaxed break-words mt-8"
      >
        {/* The front of the flashcard */}
        <ScrollArea hidden={showBack} className="h-full">
          <p className={textSizeFront}>{currentFlashcard.front}</p>
        </ScrollArea>

        {/* The back of the flashcard */}
        <ScrollArea hidden={!showBack} className="h-full">
          <p className={textSizeBack}>{currentFlashcard.back}</p>
        </ScrollArea>
      </div>
    </>
  );
}
