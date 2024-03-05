"use client";

import { api } from "@/app/api/trpc/client";
import Flashcard from "@/components/Flashcard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { percentageToHsl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { Bot, ChevronLeft, ChevronRight, SendHorizonal } from "lucide-react";
import { useTheme } from "next-themes";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

export type Feedback = {
  score: number;
  tips?: string[];
};

const FormSchema = z.object({
  answer: z.string().max(1000, { message: "Kan ikke overstige 1000 tegn." }),
});

function AnswerForm({
  flashcard,
  currentIndex,
  setFeedback,
}: {
  flashcard: FlashcardType;
  currentIndex: number;
  setFeedback: (feedback: Feedback) => void;
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
    const feedback = await generateFeedbackMututation.mutateAsync({
      front: flashcard.front,
      back: flashcard.back,
      answer: data.answer,
    });

    setFeedback(feedback);
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

export default function WriteRehearsal({
  flashcards,
}: {
  flashcards: FlashcardType[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);
  const [progress, setProgress] = useState(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const { theme } = useTheme();

  useEffect(() => {
    setCurrentFlashcard(flashcards[currentIndex]);
    setProgress(((currentIndex + 1) / flashcards.length) * 100);
  }, [currentIndex, flashcards]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.code === "ArrowRight") {
      nextFlashcard();
    } else if (event.code === "ArrowLeft") {
      previousFlashcard();
    }
  }

  function nextFlashcard() {
    const nextIndex = Math.min(currentIndex + 1, flashcards.length - 1);
    setCurrentIndex(nextIndex);
  }

  function previousFlashcard() {
    const previousIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(previousIndex);
  }

  return (
    <main className="space-y-8 w-full max-w-[40rem] px-2">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => previousFlashcard()}
          disabled={currentIndex === 0}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft />
        </Button>
        <Progress value={progress} className="h-2" />
        <Button
          onClick={() => nextFlashcard()}
          disabled={currentIndex === flashcards.length - 1}
          size="icon"
          variant="ghost"
        >
          <ChevronRight />
        </Button>
      </div>
      <FormProvider {...form}>
        <Flashcard
          flashcard={currentFlashcard}
          className="h-[10rem]"
          mode="write"
          isFlipEnabled={form.formState.isSubmitSuccessful}
        />

        {/* The feedback section */}
        <div className="space-y-2">
          {form.formState.isSubmitting && (
            <LoadingSpinner className="mx-auto" />
          )}
          {feedbacks[currentIndex] && (
            <div className="space-y-4">
              {/* The score */}
              <div
                className="rounded-full mx-auto w-fit p-2 shadow-sm font-semibold"
                style={{
                  backgroundColor: percentageToHsl(
                    feedbacks[currentIndex].score / 100,
                    0,
                    120,
                    theme === "dark" ? 20 : 65
                  ),
                }}
              >
                {feedbacks[currentIndex].score} / 100
              </div>

              {/* The tips */}
              <ul className="space-y-4">
                {feedbacks[currentIndex].tips?.map((tip) => (
                  <div key={tip} className="flex gap-2">
                    <div className="rounded-full p-1 h-fit shadow-sm bg-purple-600 text-white">
                      <Bot size={22} />
                    </div>
                    <li className="bg-slate-200 dark:bg-slate-800 rounded-3xl rounded-tl-md p-4">
                      {tip}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* The textarea input section */}
        <AnswerForm
          flashcard={currentFlashcard}
          currentIndex={currentIndex}
          setFeedback={(feedback) =>
            setFeedbacks((prev) => {
              let newFeedbacks = prev;
              newFeedbacks[currentIndex] = feedback;
              return newFeedbacks;
            })
          }
        />
      </FormProvider>
    </main>
  );
}
