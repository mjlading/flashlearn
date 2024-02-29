"use client";

import { api } from "@/app/api/trpc/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { formSchema } from "./CreateDeckForm";
import BackButton from "@/components/BackButton";

// This component handles the form submission logic
// such as calling createDeckMutation, generateTagsMutation, classifySubjectMutation

export default function CreateDeckTopbar() {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const router = useRouter();

  const createAndSaveEmbeddingsMutation =
    api.flashcard.createAndSaveEmbeddings.useMutation();

  const createDeckMutation = api.deck.createDeck.useMutation({
    onSuccess(data) {
      router.push("/dashboard/decks?category=created");

      toast.success(
        <p>
          Settet <span className="font-semibold">{form.getValues("name")}</span>{" "}
          er lagret!
        </p>,
        {
          action: {
            label: "Øv nå",
            onClick: () => {
              router.push(`/decks/${data.id}/rehearsal?mode=visual`); // TODO: set mode to preffered mode
            },
          },
        }
      );

      // Create embeddings for flashcards in the background
      createAndSaveEmbeddingsMutation.mutate(data.flashcards);
    },
    onError() {
      toast.error("Noe gikk galt", {
        description: "Settet ble ikke lagret. Vennligst prøv igjen.",
      });
    },
  });

  const classifySubjectMutation = api.ai.classifySubject.useMutation({
    onError() {
      toast.error("Noe gikk galt", {
        description:
          "Vi kunne ikke generere et Fagområde. Vennligst prøv igjen eller velg et Fagområde manuelt.",
      });
    },
  });

  const generateTagsMutation = api.ai.generateTags.useMutation({
    onError() {
      toast.error("Noe gikk galt", {
        description: "Vi kunne ikke generere stikkord. Vennligst prøv igjen.",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const flashcardsWithContent = form
      .getValues("flashcards")
      .slice(0, -1) // Remove last flashcard which is always empty
      .filter((f) => f.front !== "" && f.back !== "");

    // Classify subject if "Auto" selected
    let predictedSubject: undefined | string = undefined;
    if (values.subjectName === "Auto") {
      const prediction = await classifySubjectMutation.mutateAsync(
        flashcardsWithContent[0].front
      );
      predictedSubject = prediction.subject;
    }

    // Generate tags
    const tags = await generateTagsMutation.mutateAsync({
      subject: predictedSubject ? predictedSubject : values.subjectName,
      text: flashcardsWithContent.map((f) => f.front).join("\n\n"),
      n: flashcardsWithContent.length,
    });
    for (let i = 0; i < tags.length; i++) {
      if (!flashcardsWithContent[i]) {
        console.warn("flashcardsWithContent[i] is undefined");
        break;
      }
      flashcardsWithContent[i].tag = tags[i];
    }

    const processedValues = {
      ...values,
      flashcards: flashcardsWithContent,
      isPublic: !values.private,
      numFlashcards: flashcardsWithContent.length,
      subjectName: predictedSubject ? predictedSubject : values.subjectName,
    };

    createDeckMutation.mutate(processedValues);
  }

  return (
    <header className="sticky top-0 z-50 py-4 px-8 border-b bg-background">
      <div className="flex justify-between items-center gap-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-4">
          <BackButton />
          <p>{form.watch("name") || "Nytt sett"}</p>
        </div>
        <p>{form.watch("flashcards").length - 1} Studiekort</p>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
          }
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {form.formState.isSubmitting ? (
            <>
              <LoadingSpinner size={20} className="mr-2" />
              {classifySubjectMutation.isLoading && "Bestemmer fagområde"}
              {generateTagsMutation.isLoading && "Genererer nøkkelord"}
              {createDeckMutation.isLoading && "Lagrer"}
            </>
          ) : (
            "Lagre sett"
          )}
        </Button>
      </div>
    </header>
  );
}
