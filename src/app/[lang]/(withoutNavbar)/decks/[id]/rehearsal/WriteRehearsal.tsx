"use client";

import { api } from "@/app/api/trpc/client";
import Flashcard from "@/components/Flashcard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { percentageToHsl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { Bot } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AnswerForm, Feedback, FormSchema } from "./AnswerForm";
import ProgressBar from "./ProgressBar";
import RehearsalFinishedDialog from "./RehearsalFinishedDialog";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/TextGenerateEffect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDictionary } from "@/lib/DictProvider";

export default function WriteRehearsal({
  flashcards,
  deckId,
  creatorUserId,
}: {
  flashcards: FlashcardType[];
  deckId?: string;
  creatorUserId?: string;
}) {
  const dict = useDictionary();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);
  const [feedbacks, setFeedbacks] = useState<Partial<Feedback>[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const averageScore = useRef(0);
  const timeSpent = useRef(0);
  const xpGain = useRef(0);
  const isFinished = useRef(false);

  const saveRehearsalStartedMutation =
    api.rehearsal.saveRehearsalStarted.useMutation();
  const saveRehearsalFinishedMutation =
    api.rehearsal.saveRehearsalFinished.useMutation();
  const addXPMutation = api.user.addXp.useMutation();
  const upsertUserDeckKnowledgeMutation =
    api.deck.upsertUserDeckKnowledge.useMutation();

  const { theme } = useTheme();

  useEffect(() => {
    setCurrentFlashcard(flashcards[currentIndex]);
  }, [currentIndex, flashcards]);

  useEffect(() => {
    if (!deckId) return;

    // Create a new rehearsal
    saveRehearsalStartedMutation.mutate({
      mode: "write",
      deckId: deckId,
    });
  }, []);

  // Checks if rehearsal is finished whenever feedbacks change
  useEffect(() => {
    if (
      feedbacks.length === flashcards.length &&
      feedbacks.every((f) => f !== undefined)
    ) {
      handleRehearsalFinished();
    }
  }, [feedbacks]);

  function handleSetFeedback(feedback: Partial<Feedback>) {
    setFeedbacks((prev) => {
      const newFeedbacks = [...prev];
      newFeedbacks[currentIndex] = feedback;
      return newFeedbacks;
    });
  }

  function calculateXPGain() {
    let xp = 0;
    for (const f of feedbacks) {
      if (typeof f.score === "undefined") {
        console.error("score was undefined when calculating xp");
        return 0;
      }
      xp += f.score / 4;
    }

    const expectedTimeSpent = feedbacks.length * 1000 * 120;

    // Longer time spent = more xp
    const timeMultiplier = Math.min(expectedTimeSpent / timeSpent.current, 2);

    xp = xp * timeMultiplier;

    return Number(xp.toFixed(0));
  }

  function handleRehearsalFinished() {
    if (isFinished.current) return;
    console.log("Handle finished");

    if (!deckId) return;

    isFinished.current = true;

    // Display finished rehearsal modal
    averageScore.current =
      feedbacks.reduce(
        (previous, current) => previous + (current.score || 0),
        0
      ) / feedbacks.length;
    setDialogOpen(true);

    const rehearsalData = saveRehearsalStartedMutation.data;
    if (!rehearsalData) {
      toast.error(dict.rehearsal.saveError, {
        description: dict.rehearsal.saveErrorDescription,
      });
      return;
    }

    timeSpent.current =
      new Date().getTime() -
      new Date(saveRehearsalStartedMutation.data.dateStart).getTime();

    xpGain.current = calculateXPGain();
    addXPMutation.mutate(xpGain.current);

    // Set isFinished to true in db
    saveRehearsalFinishedMutation.mutate({
      rehearsalId: rehearsalData.id,
      timeSpent: timeSpent.current,
      score: averageScore.current,
      deckId: deckId,
    });

    // Set user deck knowledge
    upsertUserDeckKnowledgeMutation.mutate({
      deckId: deckId,
      score: averageScore.current,
    });
  }

  // Used for animation
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.3,
      },
    }),
  };

  return (
    <main className="flex flex-col justify-between w-full max-w-[45rem] px-4 height-minus-navbar">
      <ProgressBar
        currentIndex={currentIndex}
        numFlashcards={flashcards.length}
        setCurrentIndex={setCurrentIndex}
      />
      <FormProvider {...form}>
        <Flashcard
          flashcard={currentFlashcard}
          className="h-[10rem] mt-4"
          mode="write"
          isFlipEnabled={!!feedbacks[currentIndex]}
        />

        {/* The feedback section */}
        <ScrollArea className="flex-1 space-y-2">
          {form.formState.isSubmitting && (
            <LoadingSpinner className="mx-auto" />
          )}
          {feedbacks[currentIndex] && (
            <div className="space-y-4">
              {/* The score */}
              {feedbacks[currentIndex].score !== undefined && (
                <div
                  className="rounded-full mx-auto w-fit p-2 shadow-sm font-semibold"
                  style={{
                    backgroundColor: percentageToHsl(
                      (feedbacks[currentIndex]?.score || 0) / 100,
                      0,
                      120,
                      theme === "dark" ? 20 : 65
                    ),
                  }}
                >
                  {feedbacks[currentIndex].score} / 100
                </div>
              )}

              {/* The tips */}
              <ul className="space-y-4">
                {feedbacks[currentIndex].tips?.map((tip, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-2"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <div className="rounded-full p-1 h-fit shadow-sm bg-purple-600 text-white">
                      <Bot size={22} />
                    </div>
                    <li className="bg-slate-200 dark:bg-slate-800 rounded-3xl rounded-tl-md p-4">
                      <TextGenerateEffect words={tip} className="text-sm" />
                    </li>
                  </motion.div>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>

        {/* The textarea input section */}
        <div className="pb-4">
          <AnswerForm
            flashcard={currentFlashcard}
            currentIndex={currentIndex}
            disabled={!!feedbacks[currentIndex]}
            setFeedback={handleSetFeedback}
          />
        </div>
      </FormProvider>

      {/* Dialog that displays when the rehearsal is finished */}
      {deckId && creatorUserId && (
        <RehearsalFinishedDialog
          open={dialogOpen}
          onOpenChange={(val) => setDialogOpen(val)}
          averageScore={averageScore.current}
          timeSpent={timeSpent.current}
          creatorUserId={creatorUserId}
          deckId={deckId}
          xpGain={xpGain.current}
        />
      )}
    </main>
  );
}
