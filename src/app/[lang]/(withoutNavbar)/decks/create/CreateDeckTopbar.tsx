"use client";

import { api } from "@/app/api/trpc/client";
import BackButton from "@/components/BackButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getFormSchema } from "./CreateDeckForm";
import { useDictionary } from "@/lib/DictProvider";

// This component handles the form submission logic
// such as calling createDeckMutation, generateTagsMutation, classifySubjectMutation
// If edit is true, will use edit mutation procedure on submit
export default function CreateDeckTopbar({
  edit = false,
  deckId,
}: {
  edit?: boolean;
  deckId?: string;
}) {
  const dict = useDictionary();
  const formSchema = getFormSchema(dict);
  const form = useFormContext<z.infer<typeof formSchema>>();
  const router = useRouter();
  const createAndSaveEmbeddingsMutation =
    api.flashcard.createAndSaveEmbeddings.useMutation();
  const createAndSaveDeckEmbeddingMutation =
    api.deck.createAndSaveEmbedding.useMutation();

  const createDeckMutation = api.deck.createDeck.useMutation({
    onSuccess(data) {
      router.push(`/${dict.lang}/dashboard/decks?category=created`);

      toast.success(
        <p>
          Settet <span className="font-semibold">{form.getValues("name")}</span>{" "}
          er lagret!
        </p>,
        {
          action: {
            label: "Øv nå",
            onClick: () => {
              router.push(
                `/${dict.lang}/decks/${data.id}/rehearsal?mode=visual`
              );
            },
          },
        }
      );

      // Create embeddings for flashcards and deck in the background
      createAndSaveEmbeddingsMutation.mutate(data.flashcards);
      createAndSaveDeckEmbeddingMutation.mutate({
        id: data.id,
        name: data.name,
        subjectName: data.subjectName,
        flashcardFronts: data.flashcards.map((f) => f.front),
      });
    },
    onError() {
      toast.error("Noe gikk galt", {
        description: "Settet ble ikke lagret. Vennligst prøv igjen.",
      });
    },
  });
  const editDeckMutation = api.deck.editDeck.useMutation({
    onSuccess(data) {
      router.push(`/${dict.lang}/dashboard/decks?category=created`);

      toast.success(
        <p>
          Settet <span className="font-semibold">{form.getValues("name")}</span>{" "}
          er lagret!
        </p>
      );
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    edit ? editDeck(values) : createDeck(values);
  }

  async function createDeck(values: z.infer<typeof formSchema>) {
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

  async function editDeck(values: z.infer<typeof formSchema>) {
    const flashcardsWithContent = form
      .getValues("flashcards")
      .slice(0, -1) // Remove last flashcard which is always empty
      .filter((f) => f.front !== "" && f.back !== "");

    const processedValues = {
      ...values,
      flashcards: flashcardsWithContent,
      isPublic: !values.private,
      numFlashcards: flashcardsWithContent.length,
    };

    editDeckMutation.mutate({
      createDeck: processedValues,
      deckId: deckId as string, // This will not be undefined if edit is true
    });
  }

  return (
    <header className="sticky top-0 z-50 px-8 border-b bg-background">
      <div className="flex justify-between items-center h-[60px] gap-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-4">
          <BackButton />
          <p>{form.watch("name") || dict.decks.newSet}</p>
        </div>
        <p>
          {form.watch("flashcards").length - 1} {dict.decks.studyCards}
        </p>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
          }
        >
          {form.formState.isSubmitting || form.formState.isSubmitSuccessful ? (
            <>
              <LoadingSpinner size={20} className="mr-2" />
              {classifySubjectMutation.isLoading &&
                dict.decks.determiningSubject}
              {generateTagsMutation.isLoading && dict.decks.generatingKeywords}
              {(createDeckMutation.isLoading || editDeckMutation.isLoading) &&
                dict.decks.savingDecks}
            </>
          ) : (
            dict.decks.saveDecks
          )}
        </Button>
      </div>
    </header>
  );
}
