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

export const formSchema = z.object({
  name: z
    .string()
    .min(2, "Navnet må være minst 2 tegn")
    .max(50, "Navnet kan ikke være mer enn 50 tegn"),
  description: z
    .string()
    .min(2, "Beskrivelsen må være minst 2 tegn")
    .max(500, "Beskrivelsen kan ikke være mer enn 500 tegn")
    .optional(),
});

export default function CreateCollectionForm() {
  const form = useFormContext<z.infer<typeof formSchema>>();

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
                <FormLabel>Navn</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Gi samlingen din et navn"
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
                <FormLabel>Beskrivelse (valgfri)</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Gi samlingen din en beskrivelse"
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
