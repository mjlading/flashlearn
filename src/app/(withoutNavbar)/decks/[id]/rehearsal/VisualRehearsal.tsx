"use client";

import Flashcard from "@/components/Flashcard";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

export default function VisualRehearsal({
  flashcards,
}: {
  flashcards: FlashcardType[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);

  useEffect(() => {
    setCurrentFlashcard(flashcards[currentIndex]);
  }, [currentIndex, flashcards]);

  return (
    <main className="space-y-8 w-full max-w-[40rem]">
      <ProgressBar
        currentIndex={currentIndex}
        numFlashcards={flashcards.length}
        setCurrentIndex={setCurrentIndex}
      />
      <Flashcard flashcard={currentFlashcard} mode="visual" />
    </main>
  );
}
