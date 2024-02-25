"use client";

import { api } from "@/app/api/trpc/client";
import { CornerDownLeft, Tag, X } from "lucide-react";
import { useState } from "react";
import { GeneratedFlashcard } from "./GenerateFlashcardsInput";
import GenerationTypeTabs from "./GenerationTypeTabs";
import { LoadingSpinner } from "./LoadingSpinner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

export default function GenerateFromKeywords({
  onGeneratedFlashcards,
  onLoadingStateChanged,
}: {
  onGeneratedFlashcards: (flashcards: GeneratedFlashcard[]) => void;
  onLoadingStateChanged: (newState: boolean) => void;
}) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [generationType, setGenerationType] = useState("mixed");

  const generateFlashcardsMutation =
    api.ai.generateFlashcardsFromKeywords.useMutation({
      onMutate: () => {
        onLoadingStateChanged(true);
      },
      onSuccess: (data) => {
        onGeneratedFlashcards(data);
        onLoadingStateChanged(false);
      },
      onError: () => {
        onLoadingStateChanged(false);
        toast.error("Kunne ikke generere studiekort", {
          description: "Vennligst prøv igjen",
        });
      },
    });

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

  function handleGenerateClicked() {
    generateFlashcardsMutation.mutate({
      keywords: keywords,
      type: generationType,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Tag size={18} className="mr-2" />
          Stikkord
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generer fra stikkord</DialogTitle>
          <DialogDescription>
            Skriv inn en liste med stikkord, så genereres studiekort etter den.
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
          disabled={keywords.length < 1 || generateFlashcardsMutation.isLoading}
          onClick={handleGenerateClicked}
        >
          {generateFlashcardsMutation.isLoading ? (
            <LoadingSpinner />
          ) : (
            "Generer studiekort"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
