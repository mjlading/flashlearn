"use client";

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
import { academicLevelMap } from "@/lib/academicLevel";
import { subjectNameMap } from "@/lib/subject";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const formSchema = z.object({
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
  const form = useFormContext<z.infer<typeof formSchema>>();

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

    // TODO: temporary fix, will generate tags in future
    const flashcardsWithTags = flashcards.map((f) => ({ ...f, tag: "" }));

    append(flashcardsWithTags);
    toast.success(`La til ${flashcards.length} studiekort`, {
      position: "top-center",
    });
  }

  const subjectOptions = ["Auto", ...Object.keys(subjectNameMap)];

  return (
    <Form {...form}>
      <form className="space-y-6">
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
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="private"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center rounded-lg border p-4">
                  <div>
                    <FormLabel>Privat</FormLabel>
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
        </div>

        {/* Flashcards input */}
        <div className="py-8">
          <h4 className="mb-6 text-2xl font-medium">Legg til studiekort</h4>

          <p className="mt-6 mb-8 text-muted-foreground max-w-xl">
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
                          placeholder="Bakside"
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
