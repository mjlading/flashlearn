"use client";

import { dictType } from "@/app/dictionaries/dictionariesClientSide";
import GenerateFlashcardsInput, {
  GeneratedFlashcard,
} from "@/components/GenerateFlashcardsInput";
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
import { useDictionary } from "@/lib/DictProvider";
import { academicLevelMap } from "@/lib/academicLevel";
import { subjectNameMap } from "@/lib/subject";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function getFormSchema(dict: dictType) {
  return z.object({
    name: z
      .string()
      .min(2, dict.decks.createDecks.nameMinLetters)
      .max(50, dict.decks.createDecks.nameMaxLetters),
    private: z.boolean(),
    subjectName: z.string(),
    academicLevel: z.enum(
      Object.keys(academicLevelMap) as [string, ...string[]]
    ),
    flashcards: z
      .array(
        z.object({
          front: z.string().max(500, dict.decks.createDecks.frontMaxLetters),
          back: z.string().max(1500, dict.decks.createDecks.backMaxLetters),
          tag: z.string(),
        })
      )
      .min(3, dict.decks.createDecks.flashcardsMin), // min 3 because last card is always empty
  });
}

export default function CreateDeckForm({
  showGenerateFlashcardsInput = true,
}: {
  showGenerateFlashcardsInput?: boolean;
}) {
  const dict = useDictionary();
  const formSchema = getFormSchema(dict);
  const form = useFormContext<z.infer<typeof formSchema>>();
  const session = useSession();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flashcards",
  });

  const lastFlashcardFront = form.watch(
    `flashcards.${fields.length - 1}.front`
  );

  useEffect(() => {
    // Add a new flashcard if the last one's front has content
    if (lastFlashcardFront.length > 1) {
      append({ front: "", back: "", tag: "" }, { shouldFocus: false });
    }
  }, [lastFlashcardFront, append]);

  function handleAddFlashcards(flashcards: GeneratedFlashcard[]) {
    remove(-1); // Remove last empty flashcard
    const flashcardsWithTags = flashcards.map((f) => ({ ...f, tag: "" }));

    append(flashcardsWithTags);
    const success =
      dict.decks.createDeck.added +
      flashcards.length +
      dict.decks.createDeck.flashcards;
    toast.success(success, {
      position: "top-center",
    });
  }

  const subjectOptions = ["Auto", ...Object.keys(subjectNameMap)];

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onKeyDown={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name input */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.decks.createDeck.name}</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder={dict.decks.createDeck.giveSetName}
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Subject select */}
          <FormField
            control={form.control}
            name="subjectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.decks.createDeck.field}</FormLabel>
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

          {/* Academic level select */}
          <FormField
            control={form.control}
            name="academicLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.decks.createDeck.academicLevel}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={session.data?.user.academicLevel}
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

        {/* Privacy switch */}
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="private"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center rounded-lg border p-4">
                <div>
                  <FormLabel>{dict.decks.createDeck.private}</FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    {dict.decks.createDeck.privateDescription}
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

        {/* Flashcards input */}
        <div className="py-8">
          <h4 className="mb-6 text-2xl font-medium">
            {dict.decks.createDeck.addFlashcard}
          </h4>

          <p className="mt-6 mb-8 text-muted-foreground max-w-xl">
            {dict.decks.createDeck.addFlashcardDescription}
          </p>

          {/* Generation input */}
          {showGenerateFlashcardsInput && (
            <GenerateFlashcardsInput
              onAddFlashcards={handleAddFlashcards}
              academicLevel={form.getValues("academicLevel")}
            />
          )}

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
                          placeholder={dict.decks.createDeck.placeholderFront}
                          className="h-[12rem] resize-none p-4"
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
                          placeholder={dict.decks.createDeck.placeholderBack}
                          className="h-[12rem] resize-none p-4"
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
      </form>
    </Form>
  );
}
