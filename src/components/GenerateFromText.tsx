import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import GenerationTypeTabs from "./GenerationTypeTabs";
import { useState } from "react";
import { GeneratedFlashcard } from "./GenerateFlashcardsInput";
import { api } from "@/app/api/trpc/client";
import { toast } from "sonner";

const FormSchema = z.object({
  textInput: z
    .string()
    .min(10, { message: "Må være minst 10 tegn." })
    .max(1000, {
      message: "Kan ikke overstige 1000 tegn.",
    }),
});

export default function GenerateFromText({
  onGeneratedFlashcards,
  onLoadingStateChanged,
}: {
  onGeneratedFlashcards: (flashcards: GeneratedFlashcard[]) => void;
  onLoadingStateChanged: (newState: boolean) => void;
}) {
  const [generationType, setGenerationType] = useState("mixed");
  const generateFlashcardsMutation =
    api.ai.generateFlashcardsFromText.useMutation({
      onMutate: () => {
        onLoadingStateChanged(true);
      },
      onSuccess: (data) => {
        onGeneratedFlashcards(data);
        onLoadingStateChanged(false);
      },
      onError: () => {
        onLoadingStateChanged(false);
        toast.error("Kunne ikke generere studiekort", {
          description: "Vennligst prøv igjen",
        });
      },
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    generateFlashcardsMutation.mutate({
      text: data.textInput,
      type: generationType,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Text size={18} className="mr-2" />
          Tekst
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[45rem] min-w-full">
        <DialogHeader>
          <DialogTitle>Generer fra tekst</DialogTitle>
          <DialogDescription>
            Skriv inn din tekst, så genereres studiekort etter den.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="textInput"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Skriv inn tekst her"
                      {...field}
                      rows={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <GenerationTypeTabs
              value={generationType}
              onValueChange={(value) => setGenerationType(value)}
            />
            <Button type="submit" size="lg" className="w-full">
              Generer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
