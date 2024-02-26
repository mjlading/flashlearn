"use client";

import { api } from "@/app/api/trpc/client";
import GenerateFlashcardsInput, {
  GeneratedFlashcard,
} from "@/components/GenerateFlashcardsInput";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { academicLevelMap } from "@/lib/academicLevel";
import { subjectNameMap } from "@/lib/subject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Navnet må være minst 2 tegn")
    .max(50, "Navnet kan ikke være mer enn 50 tegn"),
  private: z.boolean(),
  subjectName: z.string(),
  academicLevel: z.enum(Object.keys(academicLevelMap) as [string, ...string[]]),
  flashcards: z
    .array(
      z.object({
        front: z
          .string()
          // .min(2, "Fremsiden må være minst 2 tegn")
          .max(500, "Fremsiden kan være maks 500 tegn"),
        back: z
          .string()
          // .min(2, "Baksiden må være minst 2 tegn")
          .max(1500, "Baksiden kan være maks 1500 tegn"),
        tag: z.string(),
      })
    )
    .min(3, "Settet må ha minst 2 studiekort"), // min 3 because last card is always empty
});

export default function CreateDeckForm() {
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flashcards",
  });

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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAnyLoading =
      createDeckMutation.isLoading ||
      classifySubjectMutation.isLoading ||
      generateTagsMutation.isLoading;
    setIsLoading(isAnyLoading);
  }, [
    createDeckMutation.isLoading,
    classifySubjectMutation.isLoading,
    generateTagsMutation.isLoading,
  ]);

  const lastFlashcardFront = form.watch(
    `flashcards.${fields.length - 1}.front`
  );

  useEffect(() => {
    // Add a new flashcard if the last one has content
    if (lastFlashcardFront.length > 1) {
      append({ front: "", back: "", tag: "" }, { shouldFocus: false });
    }
  }, [lastFlashcardFront, append]);

  function handleAddFlashcards(flashcards: GeneratedFlashcard[]) {
    remove(-1); // Remove last empty flashcard

    // TODO: temporary fix, will generate tags in future
    const flashcardsWithTags = flashcards.map((f) => ({ ...f, tag: "" }));

    append(flashcardsWithTags);
    toast.success(`La til ${flashcards.length} studiekort`, {
      position: "top-center",
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const flashcardsWithContent = form
      .getValues("flashcards")
      .slice(0, -1) // Remove last flashcard which is always empty
      .filter((flashcard) => flashcard.front !== "" && flashcard.back !== "");

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

  const subjectOptions = ["Auto", ...Object.keys(subjectNameMap)];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
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
                    className="w-full p-4 text-base"
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject select */}
          <FormField
            control={form.control}
            name="subjectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fagområde</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="p-4 text-base">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjectOptions.map((subjectOption) => (
                      <SelectItem value={subjectOption} key={subjectOption}>
                        {subjectNameMap[subjectOption] || "Auto"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Privacy switch */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="private"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base text-gray-800 dark:text-gray-200">
                      Privat
                    </FormLabel>
                    <FormDescription className="text-sm text-muted-foreground">
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
          </div>

          {/* Academic level select */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="academicLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Akademisk nivå</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="p-4 text-base">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(academicLevelMap).map(
                        (academicLevelOption) => (
                          <SelectItem
                            value={academicLevelOption}
                            key={academicLevelOption}
                          >
                            {academicLevelMap[academicLevelOption]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Flashcards input */}
        <div className="pt-8 pb-[7rem]">
          <h4 className="mb-6 text-2xl font-medium">Legg til studiekort</h4>

          <p className="mt-6 mb-8 text-base text-muted-foreground max-w-xl">
            Hvert kort har en fremside og en bakside. Fremsiden kan ha et begrep
            eller spørsmål, og baksiden kan ha et svar eller en forklaring.
          </p>

          {/* Generation input */}
          <GenerateFlashcardsInput onAddFlashcards={handleAddFlashcards} />

          {fields.map((field, index) => (
            <div key={field.id} className="mt-6">
              <Label className="block text-lg font-medium text-muted-foreground mb-2">
                {index + 1}.
              </Label>
              <div className="flex gap-8">
                {/* Front side of flashcard */}
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.front`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Textarea
                          placeholder="Fremside"
                          className="h-[12rem] resize-none p-4 text-md"
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
                          className="h-[12rem] resize-none p-4 text-md"
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
          {/* Show error message if less than 2 flashcards are filled */}
          <FormMessage className="my-2">
            {form.formState.errors.flashcards?.root?.message}
          </FormMessage>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 py-4 bg-white dark:bg-gray-900 border">
          <div className="flex justify-between items-center gap-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
            <p>{form.watch("name") || "Nytt sett"}</p>
            <p>{fields.length - 1} Studiekort</p>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size={20} />
                  {classifySubjectMutation.isLoading && "Bestemmer fagområde"}
                  {generateTagsMutation.isLoading && "Genererer nøkkelord"}
                  {createDeckMutation.isLoading && "Lagrer"}
                </>
              ) : (
                "Lagre sett"
              )}
            </Button>
          </div>
        </footer>
      </form>
    </Form>
  );
}
