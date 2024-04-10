"use client";

import { api } from "@/app/api/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pen } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CreateDeckForm, { formSchema } from "../../create/CreateDeckForm";
import CreateDeckTopbar from "../../create/CreateDeckTopbar";
import { useEffect } from "react";

export default function EditDeckPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const deck = api.deck.getDeckById.useQuery({
    id: params.id,
    includeFlashcards: true,
  });

  const formattedFlashcards = deck.data?.flashcards.map((f) => {
    const formattedFlashcard: {
      front: string | undefined;
      back: string | undefined;
      tag: string | undefined;
    } = {
      front: f.front,
      back: f.back,
      tag: f.tag === null ? undefined : f.tag,
    };

    return formattedFlashcard;
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      private: false,
      flashcards: [{ front: "", back: "", tag: "" }],
      subjectName: "Auto",
      academicLevel: "BACHELOR",
    },
  });

  useEffect(() => {
    if (deck.data) {
      const formattedFlashcards = deck.data.flashcards.map((f) => ({
        front: f.front,
        back: f.back,
        tag: f.tag ?? undefined,
      }));

      form.reset({
        name: deck.data.name,
        private: !deck.data.isPublic,
        flashcards: formattedFlashcards,
        subjectName: deck.data.subjectName,
        academicLevel: deck.data.academicLevel,
      });
    }
  }, [deck.data, form]);

  return (
    <FormProvider {...form}>
      <CreateDeckTopbar edit deckId={params.id} />
      <main className="mx-auto my-12 px-4 md:px-8 lg:w-[60rem]">
        <div className="flex flex-col space-y-8">
          <div className="flex gap-4 items-center">
            <Pen size={32} />
            <h1 className="font-bold text-4xl">Rediger sett</h1>
          </div>
          {deck.data?.flashcards && (
            <CreateDeckForm showGenerateFlashcardsInput={false} />
          )}
        </div>
      </main>
    </FormProvider>
  );
}
