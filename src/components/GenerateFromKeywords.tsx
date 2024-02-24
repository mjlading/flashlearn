"use client";

import { api } from "@/app/api/trpc/client";
import { CornerDownLeft, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GeneratedFlashcard } from "./GenerateFlashcardsInput";
import GenerationTypeTabs from "./GenerationTypeTabs";
import { LoadingSpinner } from "./LoadingSpinner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function GenerateFromKeywords({
  onAddFlashcards,
}: {
  onAddFlashcards: (flashcards: GeneratedFlashcard[]) => void;
}) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [flashcards, setFlashcards] = useState<GeneratedFlashcard[]>([]);
  const [generationType, setGenerationType] = useState("mixed");

  const generateFlashcardsMutation =
    api.ai.generateFlashcardsFromKeywords.useMutation();

  function handleAddKeyword() {
    if (inputValue.trim() !== "" && !keywords.includes(inputValue)) {
      setKeywords((oldKeywords) => [...oldKeywords, inputValue]);
      setInputValue("");
    }
  }

  function handleRemoveKeyword(keyword: string) {
    setKeywords(keywords.filter((k) => k !== keyword));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleAddKeyword();
    }
  }

  async function handleGenerateClicked() {
    const generatedFlashcards: GeneratedFlashcard[] =
      await generateFlashcardsMutation.mutateAsync({
        keywords: keywords,
        type: generationType,
      });

    setFlashcards(generatedFlashcards);
  }

  function handleAddFlashcardsClicked() {
    onAddFlashcards(flashcards);
    const numAdded = flashcards.length;
    toast.success(`La til ${numAdded} studiekort`, { position: "top-center" });
    setFlashcards([]); // Reset flashcards
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Tag size={18} className="mr-2" />
          Stikkord
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`w-full ${
          flashcards.length === 0 ? "md:min-w-[30rem]" : "md:min-w-[45rem]"
        }`}
      >
        {flashcards.length === 0 ? (
          <>
            <DialogHeader>
              <DialogTitle>Generer fra stikkord</DialogTitle>
              <DialogDescription>
                Skriv inn en liste med stikkord, så genereres studiekort etter
                den.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 space-y-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  autoFocus
                  placeholder="Skriv inn stikkord"
                  value={inputValue}
                  maxLength={40}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button onClick={handleAddKeyword}>
                  Legg til <CornerDownLeft size={18} className="ml-2" />
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-sm">
                    {keyword}
                    <X
                      size={16}
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-1"
                    />
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="mb-4" />
            <GenerationTypeTabs
              value={generationType}
              onValueChange={(value) => setGenerationType(value)}
            />
            <Button
              size="lg"
              className="w-full mt-2"
              disabled={
                keywords.length < 1 || generateFlashcardsMutation.isLoading
              }
              onClick={handleGenerateClicked}
            >
              {generateFlashcardsMutation.isLoading ? (
                <LoadingSpinner />
              ) : (
                "Generer studiekort"
              )}
            </Button>
          </>
        ) : (
          // Post generation content
          <>
            <DialogHeader>
              <DialogTitle>
                Genererte {flashcards.length} studiekort
              </DialogTitle>
              <DialogDescription>
                Trykk på legg til for å legge til studiekortene til settet.
              </DialogDescription>
            </DialogHeader>
            {/* The generated flashcards */}
            <ScrollArea className="max-h-[60vh]">
              <div className="text-sm">
                {flashcards.map((flashcard, index) => (
                  <div key={index}>
                    <span>{index + 1}.</span>
                    <div className="bg-accent rounded mb-2 p-2 grid grid-cols-2 gap-4">
                      <div>
                        <p>{flashcard.front}</p>
                      </div>
                      <div>
                        <p>{flashcard.back}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DialogClose asChild>
              <Button onClick={handleAddFlashcardsClicked}>
                Legg til genererte studiekort
              </Button>
            </DialogClose>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
