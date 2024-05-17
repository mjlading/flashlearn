"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { useDictionary } from "@/lib/DictProvider";
import { dictType } from "@/app/dictionaries/dictionariesClientSide"

export function getFormSchema(dict:dictType) {
  return z.object({
    name: z
      .string()
      .min(2, dict.collections.createCollection.nameMinLetters)
      .max(50, dict.collections.createCollection.nameMaxLetters),
    description: z
      .string()
      .max(500, dict.collections.createCollection.descriptionMaxLetters)
      .optional(),
    deckIds: z.array(z.string()),
  });
} 

export default function CreateCollectionForm() {
  const dict = useDictionary();
  const formtype = getFormSchema(dict);
  const form = useFormContext<z.infer<typeof formtype>>();

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onKeyDown={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
      >
        <div className="space-y-4">
          {/* Name input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.collections.createCollection.name}</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder={
                      dict.collections.createCollection.placeholderName
                    }
                    {...field}
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Name input */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {dict.collections.createCollection.description}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      dict.collections.createCollection.placeholderDescription
                    }
                    {...field}
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
