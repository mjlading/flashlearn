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

export default function GenerateFromFile({
  onGeneratedFlashcards,
  onLoadingStateChanged,
}: {
  onGeneratedFlashcards: (flashcards: GeneratedFlashcard[]) => void;
  onLoadingStateChanged: (newState: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [generationType, setGenerationType] = useState("mixed");
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
          Fil
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generer fra fil</DialogTitle>
          <DialogDescription>
            Last opp en fil (.txt eller .pdf), så genereres studiekort etter
            den.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="file">Fil</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept="text/plain, application/pdf"
            />
          </div>

          {file && (
            <>
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
                Generer
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
