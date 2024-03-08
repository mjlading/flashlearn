"use client";

import { api } from "@/app/api/trpc/client";
import Flashcard from "@/components/Flashcard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { percentageToHsl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { Bot, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AnswerForm, Feedback, FormSchema } from "./AnswerForm";
import RehearsalFinishedDialog from "./RehearsalFinishedDialog";

export default function WriteRehearsal({
  flashcards,
  deckId,
  creatorUserId,
}: {
  flashcards: FlashcardType[];
  deckId: string;
  creatorUserId: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);
  const [progress, setProgress] = useState(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const averageScore = useRef(0);
  const timeSpent = useRef(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const saveRehearsalStartedMutation =
    api.rehearsal.saveRehearsalStarted.useMutation();
  const saveRehearsalFinishedMutation =
    api.rehearsal.saveRehearsalFinished.useMutation();
  const updateTimeSpentMutation = api.rehearsal.updateTimeSpent.useMutation();
  const isFinished = useRef(false);

  const recentRehearsal = api.rehearsal.getRecentRehearsal.useQuery({
    deckId: deckId,
  });

  const { theme } = useTheme();

  useEffect(() => {
    setCurrentFlashcard(flashcards[currentIndex]);
    setProgress(((currentIndex + 1) / flashcards.length) * 100);
  }, [currentIndex, flashcards]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  useEffect(() => {
    const rehearsal = recentRehearsal.data;
    if (!rehearsal || rehearsal.isFinished) {
      // Create a new rehearsal
      saveRehearsalStartedMutation.mutate({
        mode: "write",
        deckId: deckId,
      });
    } else {
      // The existing rehearsal is not finished
      console.log("TODO: unfinished rehearsal");
      // TODO
    }
  }, []);

  const INTERVAL_TIME = 30_000;

  // Update "timeSpent" in db every 30 seconds
  useEffect(() => {
    // If the rehearsal is finished, dont update timeSpent
    if (isFinished.current) return;

    const interval = setInterval(() => {
      const rehearsalId = saveRehearsalStartedMutation.data?.id;
      if (!rehearsalId) {
        console.warn("Tried to update timeSpent, rehearsalId was undefined");
        return;
      }
      updateTimeSpentMutation.mutate({
        rehearsalId: rehearsalId,
        timeToAdd: INTERVAL_TIME,
      });
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, [saveRehearsalStartedMutation.data, isFinished.current]);

  // Checks if rehearsal is finished whenever feedbacks change
  useEffect(() => {
    if (
      feedbacks.length === flashcards.length &&
      feedbacks.every((f) => f !== undefined)
    ) {
      handleRehearsalFinished();
    }
  }, [feedbacks]);

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

  function handleSetFeedback(feedback: Feedback) {
    setFeedbacks((prev) => {
      const newFeedbacks = [...prev];
      newFeedbacks[currentIndex] = feedback;
      return newFeedbacks;
    });
  }

  function handleRehearsalFinished() {
    isFinished.current = true;

    // Display finished rehearsal modal
    averageScore.current =
      feedbacks.reduce((previous, current) => previous + current.score, 0) /
      feedbacks.length;
    setDialogOpen(true);

    const rehearsalData = saveRehearsalStartedMutation.data;
    if (!rehearsalData) {
      toast.error("Kunne ikke lagre øvingen", {
        description: "Du vil ikke kunne se denne øvingen i din fremgang",
      });
      return;
    }

    // TODO: if this rehearsal is discontinous timewise, dont set timeSpent here
    // alternative: add time passed from last interval, which is < 30 seconds
    timeSpent.current =
      new Date().getTime() -
      new Date(saveRehearsalStartedMutation.data.dateStart).getTime();

    // Set isFinished to true in db
    saveRehearsalFinishedMutation.mutate({
      rehearsalId: rehearsalData.id,
      timeSpent: timeSpent.current,
      score: averageScore.current,
      deckId: deckId,
    });
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
          isFlipEnabled={!!feedbacks[currentIndex]}
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
          setFeedback={handleSetFeedback}
        />
      </FormProvider>

      {/* Dialog that displays when the rehearsal is finished */}
      <RehearsalFinishedDialog
        open={dialogOpen}
        onOpenChange={(val) => setDialogOpen(val)}
        averageScore={averageScore.current}
        timeSpent={timeSpent.current}
        creatorUserId={creatorUserId}
      />
    </main>
  );
}
