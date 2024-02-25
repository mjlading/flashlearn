"use client";

import { BetweenHorizonalStart, Trash } from "lucide-react";
import React, { useState } from "react";
import GenerateFromCourse from "./GenerateFromCourse";
import GenerateFromFile from "./GenerateFromFile";
import GenerateFromKeywords from "./GenerateFromKeywords";
import GenerateFromText from "./GenerateFromText";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export type GeneratedFlashcard = {
  front: string;
  back: string;
  tag: string;
};

export default function GenerateFlashcardsInput({
  onAddFlashcards,
}: {
  onAddFlashcards: (generatedFlashcards: GeneratedFlashcard[]) => void;
}) {
  const [generatedFlashcards, setGeneratedFlashcards] = useState<
    GeneratedFlashcard[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleGeneratedFlashcards(
    generatedFlashcards: GeneratedFlashcard[]
  ) {
    setGeneratedFlashcards(generatedFlashcards);
  }

  function handleInsertClicked() {
    onAddFlashcards(generatedFlashcards);
    setGeneratedFlashcards([]);
  }

  function statusText() {
    if (isLoading && !generatedFlashcards.length) {
      return "Genererer...";
    } else if (!isLoading && !generatedFlashcards.length) {
      return "Generer fra";
    } else if (!isLoading && generatedFlashcards.length) {
      return `Genererte ${generatedFlashcards.length} studiekort`;
    }
  }

  return (
    <div className="my-8 p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {statusText()}
        </p>
        {!isLoading && !generatedFlashcards.length && (
          <div className="space-x-2">
            <GenerateFromText
              onGeneratedFlashcards={handleGeneratedFlashcards}
              onLoadingStateChanged={(newState: boolean) =>
                setIsLoading(newState)
              }
            />
            <GenerateFromFile />
            <GenerateFromCourse
              onGeneratedFlashcards={handleGeneratedFlashcards}
              onLoadingStateChanged={(newState: boolean) =>
                setIsLoading(newState)
              }
            />
            <GenerateFromKeywords
              onGeneratedFlashcards={handleGeneratedFlashcards}
              onLoadingStateChanged={(newState: boolean) =>
                setIsLoading(newState)
              }
            />
          </div>
        )}
      </div>
      {/* The generated flashcards */}
      {isLoading && <Skeleton className="h-[10rem]" />}
      {generatedFlashcards.length > 0 && (
        <div className="bg-muted dark:bg-muted/80 shadow relative">
          <div className="overflow-y-scroll max-h-[22rem] p-4 grid grid-cols-2 gap-12">
            {generatedFlashcards.map((flashcard, index) => (
              <React.Fragment key={index}>
                <div>{flashcard.front}</div>
                <div>{flashcard.back}</div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex gap-2 justify-end absolute top-0 right-0 left-6 mt-[-1.25rem] pr-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => setGeneratedFlashcards([])}
                  >
                    <Trash size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Forkast</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button type="button" onClick={handleInsertClicked}>
              <BetweenHorizonalStart size={18} className="mr-2" />
              Sett inn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
