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
import { useDictionary } from "@/lib/DictProvider";

export default function GenerateFromText({
  onGeneratedFlashcards,
  onLoadingStateChanged,
}: {
  onGeneratedFlashcards: (flashcards: GeneratedFlashcard[]) => void;
  onLoadingStateChanged: (newState: boolean) => void;
}) {
  const dict = useDictionary();

  const FormSchema = z.object({
    textInput: z
      .string()
      .min(10, { message: dict.generateFromText.textInputMin })
      .max(1000, {
        message: dict.generateFromText.textInputMax,
      }),
  });

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
        toast.error(dict.generateFromText.error, {
          description: dict.generateFromText.pleaseTryAgain,
        });
      },
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(event: any, data: z.infer<typeof FormSchema>) {
    event.preventDefault();
    event.stopPropagation(); // Prevent triggering the outer form
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
          {dict.generateFromText.text}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[45rem] min-w-full">
        <DialogHeader>
          <DialogTitle>{dict.generateFromText.generateFromText}</DialogTitle>
          <DialogDescription>
            {dict.generateFromText.dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(event) =>
              form.handleSubmit((data) => onSubmit(event, data))(event)
            }
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="textInput"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={dict.generateFromText.enterTextHere}
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
              {dict.generateFromText.generateFlashcards}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
