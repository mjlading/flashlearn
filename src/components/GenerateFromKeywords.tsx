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
import { useDictionary } from "@/lib/DictProvider";
import GenerationLanguageSelect from "./GenerationLangaugeSelect";

export default function GenerateFromKeywords({
  onGeneratedFlashcards,
  onLoadingStateChanged,
  academicLevel,
}: {
  onGeneratedFlashcards: (flashcards: GeneratedFlashcard[]) => void;
  onLoadingStateChanged: (newState: boolean) => void;
  academicLevel: string;
}) {
  const dict = useDictionary();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [generationType, setGenerationType] = useState("mixed");
  const [generationLanguage, setGenerationLanguage] = useState("auto");

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
      academicLevel: academicLevel,
      language: generationLanguage,
      type: generationType,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Tag size={18} className="mr-2" />
          {dict.generateFromKeywords.keywords}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dict.generateFromKeywords.generateFromKeywords}
          </DialogTitle>
          <DialogDescription>
            {dict.generateFromKeywords.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-6">
          <div className="flex gap-2">
            <Input
              type="text"
              autoFocus
              placeholder={dict.generateFromKeywords.enterKeywords}
              value={inputValue}
              maxLength={40}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddKeyword}>
              {dict.generateFromKeywords.add}{" "}
              <CornerDownLeft size={18} className="ml-2" />
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
        <GenerationLanguageSelect
          value={generationLanguage}
          onValueChange={(value) => setGenerationLanguage(value)}
        />
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
            dict.generateFromKeywords.generateFlashcards
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
