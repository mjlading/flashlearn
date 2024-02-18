"use client";

import { api } from "@/app/api/trpc/client";
import GenerateFlashcardsInput from "@/components/GenerateFlashcardsInput";
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
import { Separator } from "@/components/ui/separator";
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
      flashcards: [{ front: "", back: "" }],
      subjectName: "Auto",
      academicLevel: "BACHELOR",
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

  const classifySubjectMutation = api.ai.classifySubject.useMutation({
    onError() {
      toast.error("Noe gikk galt", {
        description:
          "Vi kunne ikke generere et Fagområde. Vennligst prøv igjen eller velg et Fagområde manuelt.",
      });
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAnyLoading =
      createDeckMutation.isLoading || classifySubjectMutation.isLoading;
    setIsLoading(isAnyLoading);
  }, [createDeckMutation.isLoading, classifySubjectMutation.isLoading]);

  const lastFlashcardFront = form.watch(
    `flashcards.${fields.length - 1}.front`
  );

  useEffect(() => {
    // Add a new flashcard if the last one has content
    if (lastFlashcardFront.length > 1) {
      append({ front: "", back: "" }, { shouldFocus: false });
    }
  }, [lastFlashcardFront, append]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Remove last flashcard which is always empty
    const flashcardsWithContent = form.getValues("flashcards").slice(0, -1);

    let predictedSubject: undefined | string = undefined;
    if (values.subjectName === "Auto") {
      const prediction = await classifySubjectMutation.mutateAsync(
        flashcardsWithContent[0].front
      );
      predictedSubject = prediction.predictedSubject;
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
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
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
                    className="max-w-sm"
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
              <FormItem className="max-w-sm">
                <FormLabel>Fagområde</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
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
          <FormField
            control={form.control}
            name="private"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center rounded-lg border p-3 max-w-sm">
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

          {/* Academic level select */}
          <FormField
            control={form.control}
            name="academicLevel"
            render={({ field }) => (
              <FormItem className="max-w-sm">
                <FormLabel>Akademisk nivå</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
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

        {/* Flashcards input */}
        <div className="pt-4">
          <h4 className="mb-4 text-2xl font-semibold">Legg til studiekort</h4>
          <Separator />
          <p className="mt-4 mb-4 text-muted-foreground">
            Hvert kort har en fremside og en bakside. Fremsiden kan ha et begrep
            eller spørsmål, og baksiden kan ha et svar eller en forklaring.
          </p>
          {/* Generation input */}
          <GenerateFlashcardsInput />

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
          {/* Show error message if less than 2 flashcards are filled */}
          <FormMessage className="my-2">
            {form.formState.errors.flashcards?.root?.message}
          </FormMessage>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 backdrop-blur rounded-md w-full">
          <div className="mb-5 flex justify-end items-center gap-8">
            <span>{form.watch("name")}</span>
            <Separator orientation="vertical" className="h-[20px]" />
            <span>{fields.length - 1} Studiekort</span>
            <Button size="lg" type="submit" disabled={isLoading}>
              {isLoading && <LoadingSpinner className="mr-2" size={20} />}
              Lagre sett
            </Button>
          </div>
        </footer>
      </form>
    </Form>
  );
}
