"use client";

import { api } from "@/app/api/trpc/client";
import { Button } from "@/components/ui/button";
import { percentageToHsl } from "@/lib/utils";
import { Flashcard } from "@prisma/client";
import { BetweenHorizonalStart, ThumbsDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getFormSchema } from "./CreateDeckForm";
import { useDictionary } from "@/lib/DictProvider";

type SimilarFlashcard = Pick<Flashcard, "front" | "back" | "tag"> & {
  cosineSimilarity: number;
};

export default function SuggestedFlashcards() {
  const dict = useDictionary();
  const formSchema = getFormSchema(dict);
  const { getValues, setValue } = useFormContext<z.infer<typeof formSchema>>();

  const [similarFlashcards, setSimilarFlashcards] = useState<
    SimilarFlashcard[]
  >([]);
  const excludedBacks = useRef<string[]>([]);

  const numFlashcards = getValues("flashcards").length - 1;

  const generateEmbeddingMutation = api.ai.generateEmbedding.useMutation();
  const getNearestNeighborsMutation =
    api.ai.getNearestFlashcardNeighbors.useMutation();

  const { theme } = useTheme();

  useEffect(() => {
    // When at least two flashcards are filled, find and suggest similar flashcards based on embeddings
    if (numFlashcards >= 3) {
      // Find similar flashcards
      const embeddingInput = getValues("flashcards")
        .slice(0, -2) // Last flashcard will only have two chars in front side, so we remove it
        .map((f) => `${f.front} ${f.back}`)
        .join(" ");
      console.log("create embedding from input: ", embeddingInput);

      (async () => {
        const targetEmbedding = await generateEmbeddingMutation.mutateAsync(
          embeddingInput
        );
        // Find nearest e.g. most similar neighbors to the target embedding
        const nearestNeighbors = await getNearestNeighborsMutation.mutateAsync({
          targetEmbedding: targetEmbedding,
          n: 2,
          excludedBacks: excludedBacks.current,
        });

        setSimilarFlashcards(nearestNeighbors);
      })();
    }
  }, [numFlashcards]);

  function handleInsertFlashcard(flashcard: SimilarFlashcard) {
    const currentFlashcards = getValues("flashcards");

    const updatedFlashcards = [
      ...currentFlashcards.slice(0, -1),
      {
        front: flashcard.front,
        back: flashcard.back,
        tag: flashcard.tag || "",
      },
    ];

    setValue("flashcards", updatedFlashcards, { shouldValidate: false });

    // Prevent future suggestions from including the added flashcard
    excludedBacks.current.push(flashcard.back);

    // Remove added flashcard from the suggestions
    setSimilarFlashcards((currentFlashcards) =>
      currentFlashcards.filter((f) => f !== flashcard)
    );

    toast.success(`La til 1 studiekort`, {
      position: "top-center",
    });
  }

  function handleThumbsDown(flashcard: SimilarFlashcard) {
    // TODO: can potentially modify the embedding here to improve future suggestions. Low priority

    // Remove from the suggestions
    setSimilarFlashcards((currentFlashcards) =>
      currentFlashcards.filter((f) => f !== flashcard)
    );
  }

  return (
    <section>
      <div className="flex flex-col p-4 gap-12 rounded border">
        <h2 className="font-semibold">
          {dict.suggestedFlashcards.similarFlashcards}
        </h2>
        {similarFlashcards.map((flashcard, index) => (
          <div key={index} className="bg-accent rounded-lg p-4 relative">
            <div className="absolute top-0 mt-[-16px] flex justify-between items-center w-full pr-8">
              <span
                style={{
                  backgroundColor: percentageToHsl(
                    flashcard.cosineSimilarity,
                    0,
                    120,
                    theme === "dark" ? 20 : 60
                  ),
                }}
                className="p-1 rounded-full h-8 w-8 text-center shadow-sm"
              >
                {(flashcard.cosineSimilarity * 100).toFixed(0)}
              </span>
              <div className="border space-x-2 rounded bg-white dark:bg-black h-8 shadow-sm">
                <Button
                  onClick={() => handleThumbsDown(flashcard)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <ThumbsDown size={16} />
                </Button>
                <Button
                  onClick={() => handleInsertFlashcard(flashcard)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <BetweenHorizonalStart size={16} />
                </Button>
              </div>
            </div>
            <div className="flex gap-12 text-sm">
              <p className="flex-1">{flashcard.front}</p>
              <p className="flex-1">{flashcard.back}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
