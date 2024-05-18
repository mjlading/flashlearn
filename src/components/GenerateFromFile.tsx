"use client";

import { File } from "lucide-react";
import { Button } from "./ui/button";
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { GeneratedFlashcard } from "./GenerateFlashcardsInput";
import { toast } from "sonner";
import { api } from "@/app/api/trpc/client";
import GenerationTypeTabs from "./GenerationTypeTabs";
import { useDictionary } from "@/lib/DictProvider";
import GenerationLanguageSelect from "./GenerationLangaugeSelect";

export default function GenerateFromFile({
  onGeneratedFlashcards,
  onLoadingStateChanged,
}: {
  onGeneratedFlashcards: (flashcards: GeneratedFlashcard[]) => void;
  onLoadingStateChanged: (newState: boolean) => void;
}) {
  const dict = useDictionary();

  const [file, setFile] = useState<File | null>(null);
  const [generationType, setGenerationType] = useState("mixed");
  const [generationLanguage, setGenerationLanguage] = useState("auto");

  const generateFlashcardsMutation =
    api.ai.generateFlashcardsFromText.useMutation({
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

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  }

  function handleGenerateClicked() {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const text = e.target.result;

      generateFlashcardsMutation.mutate({
        text: text,
        language: generationLanguage,
        type: generationType,
      });
    };

    reader.readAsText(file);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <File size={18} className="mr-2" />
          {dict.generateFromFile.file}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.generateFromFile.generateFromFile}</DialogTitle>
          <DialogDescription>
            {dict.generateFromFile.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="file">{dict.generateFromFile.file}</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept="text/plain, application/pdf"
            />
          </div>

          {file && (
            <>
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
                className="w-full"
                disabled={!file}
                onClick={handleGenerateClicked}
              >
                {dict.generateFromFile.generateFlashcards}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
