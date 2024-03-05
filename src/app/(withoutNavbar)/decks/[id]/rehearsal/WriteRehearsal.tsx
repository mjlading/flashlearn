"use client";

import Flashcard from "@/components/Flashcard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { percentageToHsl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { Bot, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { AnswerForm, Feedback, FormSchema } from "./AnswerForm";

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
          disabled={!!feedbacks[currentIndex]}
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
