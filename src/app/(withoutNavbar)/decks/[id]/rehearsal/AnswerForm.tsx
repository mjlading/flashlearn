import { Flashcard } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { api } from "@/app/api/trpc/client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { toast } from "sonner";

export type Feedback = {
  score: number;
  tips?: string[];
};

export const FormSchema = z.object({
  answer: z.string().max(1000, { message: "Kan ikke overstige 1000 tegn." }),
});

export function AnswerForm({
  flashcard,
  currentIndex,
  setFeedback,
  disabled,
}: {
  flashcard: Flashcard;
  currentIndex: number;
  setFeedback: (feedback: Feedback) => void;
  disabled: boolean;
}) {
  const form = useFormContext<z.infer<typeof FormSchema>>();
  const [answers, setAnswers] = useState<string[]>([]);
  const generateFeedbackMututation = api.ai.generateFeedback.useMutation();

  useEffect(() => {
    form.setValue("answer", answers[currentIndex] || "");
  }, [currentIndex]);

  useEffect(() => {
    // Watch for changes in the form and update the corresponding answer
    const subscription = form.watch((value, { name }) => {
      if (name === "answer") {
        const updatedAnswers = [...answers];
        updatedAnswers[currentIndex] = value.answer || "";
        setAnswers(updatedAnswers);
      }
    });
    return () => subscription.unsubscribe();
  }, [currentIndex, answers, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const feedback = await generateFeedbackMututation.mutateAsync({
        front: flashcard.front,
        back: flashcard.back,
        answer: data.answer,
      });

      setFeedback(feedback);
    } catch (error) {
      toast.error("Kunne ikke hente feedback, vennligst prøv igjen");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    rows={1}
                    maxRows={10}
                    placeholder="Skriv inn svaret ditt her"
                    className="w-full p-4 pr-16 leading-relaxed text-md rounded-xl resize-none bg-muted dark:bg-muted/40 outline-none focus:bg-gray-200 dark:focus:bg-muted/60 placeholder-gray-500"
                    autoFocus
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-[10px] bottom-[10px] rounded-xl"
                  disabled={disabled}
                >
                  <SendHorizonal />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send inn</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-destructive">
          {form.formState.errors.answer?.message?.toString()}
        </p>
      </form>
    </Form>
  );
}