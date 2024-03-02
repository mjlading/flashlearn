"use client";

import { type Flashcard } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Flashcard({
  flashcard,
  className,
  mode,
}: {
  flashcard: Flashcard;
  className?: string;
  mode: string;
}) {
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    if (mode === "write") return;
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  // When switching flashcards, show the front of new card
  useEffect(() => {
    setShowBack(false);
  }, [flashcard]);

  function handleKeydown(event: KeyboardEvent) {
    if (event.code === "Space") {
      // Flip card
      setShowBack(!showBack);
    }
  }

  function dynamicTextSize(textLength: number): string {
    if (textLength < 500) {
      return "text-lg";
    } else if (textLength < 1000) {
      return "text-md";
    } else {
      return "text-sm";
    }
  }

  function flipCard() {
    if (mode === "write") return;
    setShowBack(!showBack);
  }

  // Flip animation
  const flipStyle: React.CSSProperties = {
    transform: showBack ? "rotateX(180deg)" : "rotateX(0deg)",
    transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1)",
  };

  const frontStyle: React.CSSProperties = {
    opacity: showBack ? 0 : 1,
    zIndex: showBack ? 1 : 2,
    transition: "opacity 0.5s",
  };

  const backStyle: React.CSSProperties = {
    opacity: showBack ? 1 : 0,
    zIndex: showBack ? 2 : 1,
    transition: "opacity 0.5s",
    transform: "rotateX(180deg)",
    position: "absolute",
    top: 0,
    left: 0,
  };

  return (
    <div
      onClick={() => flipCard()}
      className={cn(
        "h-[20rem] rounded-xl bg-muted dark:bg-muted/40 leading-relaxed break-words",
        className
      )}
      style={flipStyle}
    >
      {/* The front of the flashcard */}
      <ScrollArea style={frontStyle} className="h-full w-full p-5">
        <p className={dynamicTextSize(flashcard.front.length)}>
          {flashcard.front}
        </p>
      </ScrollArea>

      {/* The back of the flashcard */}
      <ScrollArea style={backStyle} className="h-full w-full p-5">
        <p className={dynamicTextSize(flashcard.back.length)}>
          {flashcard.back}
        </p>
      </ScrollArea>
    </div>
  );
}
