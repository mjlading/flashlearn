"use client";

import { api } from "@/app/api/trpc/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Navnet må være minst 2 tegn")
    .max(50, "Navnet kan ikke være mer enn 50 tegn"),
  private: z.boolean(),
  flashcards: z.array(
    z.object({
      front: z
        .string()
        // .min(2, "Fremsiden må være minst 2 tegn")
        .max(500, "Fremsiden kan være maks 500 tegn"),
      back: z
        .string()
        // .min(2, "Baksiden må være minst 2 tegn")
        .max(1500, "Baksiden kan være maks 1500 tegn"),
    })
  ),
});

export default function CreateDeckForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      private: false,
      flashcards: [{ front: "", back: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flashcards",
  });

  const router = useRouter();

  const createDeckMutation = api.deck.createDeck.useMutation({
    onSuccess() {
      router.push("/dashboard/decks?category=created");
      router.refresh(); // Fetch and display the new deck

      toast.success(`Settet '${form.getValues("name")}' er lagret`, {
        action: {
          label: "Øv nå",
          onClick: () => {
            // TODO: Navigate to practice page
          },
        },
      });
    },
    onError() {
      toast.error("Noe gikk galt", {
        description: "Settet ble ikke lagret. Vennligst prøv igjen.",
      });
    },
  });

  const lastFlashcardFront = form.watch(
    `flashcards.${fields.length - 1}.front`
  );

  useEffect(() => {
    // Add a new flashcard if the last one has content
    if (lastFlashcardFront.length > 1) {
      append({ front: "", back: "" }, { shouldFocus: false });
    }
  }, [lastFlashcardFront, append]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Remove last flashcard which is always empty
    const flashcardsWithContent = form.getValues("flashcards").slice(0, -1);

    const processedValues = {
      ...values,
      flashcards: flashcardsWithContent,
      averageRating: 1,
      academicLevel: 1,
      isPublic: !values.private,
      subjectName: "Biology",
      numFlashcards: flashcardsWithContent.length,
    };

    createDeckMutation.mutate(processedValues);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name input */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Navn</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Gi settet ditt et navn"
                  {...field}
                  className="max-w-[25rem]"
                  maxLength={50}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Privacy switch */}
        <FormField
          control={form.control}
          name="private"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center rounded-lg border p-3 max-w-[25rem]">
              <div>
                <FormLabel>Privat</FormLabel>
                <FormDescription>
                  Private sett er kun synlige for deg.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Flashcards input */}
        <div className="pt-4">
          <h4 className="mb-4 text-2xl font-semibold">Legg til studiekort</h4>
          <Separator />
          <p className="mt-4 mb-4">
            Hvert kort har en fremside og en bakside. Fremsiden kan ha et begrep
            eller spørsmål, og baksiden kan ha et svar eller en forklaring.
          </p>
          {fields.map((field, index) => (
            <div key={field.id}>
              <Label>{index + 1}.</Label>
              <div className="flex gap-6">
                {/* Front side of flashcard */}
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.front`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Textarea
                          placeholder="Fremside"
                          className="h-[10rem] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Back side of flashcard */}
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.back`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Textarea
                          placeholder="Bakside"
                          className="h-[10rem] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 backdrop-blur rounded-md w-full">
          <div className="mb-5 flex justify-end items-center gap-8">
            <span>{form.watch("name")}</span>
            <Separator orientation="vertical" className="h-[20px]" />
            <span>{fields.length - 1} Studiekort</span>
            <Button
              size="lg"
              type="submit"
              disabled={createDeckMutation.isLoading}
            >
              {createDeckMutation.isLoading && (
                <LoadingSpinner className="mr-2" size={20} />
              )}
              Lagre sett
            </Button>
          </div>
        </footer>
      </form>
    </Form>
  );
}
