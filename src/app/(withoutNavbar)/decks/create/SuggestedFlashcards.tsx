"use client";

import { api } from "@/app/api/trpc/client";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./CreateDeckForm";
import { Flashcard } from "@prisma/client";

export default function SuggestedFlashcards() {
  const { getValues } = useFormContext<z.infer<typeof formSchema>>();

  const [similarFlashcards, setSimilarFlashcards] = useState<
    Pick<Flashcard, "front" | "back" | "tag">[]
  >([]);

  const numFlashcards = getValues("flashcards").length - 1;

  const generateEmbeddingMutation = api.ai.generateEmbedding.useMutation();
  const getNearestNeighborsMutation = api.ai.getNearestNeighbors.useMutation();

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
          table: "Flashcard",
          n: 2,
        });

        setSimilarFlashcards(nearestNeighbors);
      })();
    }
  }, [numFlashcards]);

  return (
    <pre>
      Suggested flashcards: <br />
      {JSON.stringify(similarFlashcards, null, 2)}
    </pre>
  );
}
