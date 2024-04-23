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

export default function WriteRehearsal({
  flashcards,
  deckId,
  creatorUserId,
}: {
  flashcards: FlashcardType[];
  deckId?: string;
  creatorUserId?: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);
  const [feedbacks, setFeedbacks] = useState<Partial<Feedback>[]>([]);
  const averageScore = useRef(0);
  const timeSpent = useRef(0);
  const xpGain = useRef(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const saveRehearsalStartedMutation =
    api.rehearsal.saveRehearsalStarted.useMutation();
  const saveRehearsalFinishedMutation =
    api.rehearsal.saveRehearsalFinished.useMutation();
  const updateTimeSpentMutation = api.rehearsal.updateTimeSpent.useMutation();
  const addXPMutation = api.user.addXp.useMutation();
  const upsertUserDeckKnowledgeMutation =
    api.deck.upsertUserDeckKnowledge.useMutation();

  const isFinished = useRef(false);

  let recentRehearsal: any = undefined;
  if (deckId) {
    recentRehearsal = api.rehearsal.getRecentRehearsal.useQuery({
      deckId: deckId,
    });
  }

  const { theme } = useTheme();

  useEffect(() => {
    setCurrentFlashcard(flashcards[currentIndex]);
  }, [currentIndex, flashcards]);

  useEffect(() => {
    if (!deckId || !recentRehearsal) return; //TODO: temporary workaround for collections

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
    if (!deckId) return; //TODO: temporary workaround for collections

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

  function handleSetFeedback(feedback: Partial<Feedback>) {
    setFeedbacks((prev) => {
      const newFeedbacks = [...prev];
      newFeedbacks[currentIndex] = feedback;
      return newFeedbacks;
    });
  }

  function handleRehearsalFinished() {
    if (!deckId) return; //TODO: temporary workaround for collections

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

    xpGain.current = calculateXPGain();
    addXPMutation.mutate(xpGain.current);

    // Set isFinished to true in db
    saveRehearsalFinishedMutation.mutate({
      rehearsalId: rehearsalData.id,
      timeSpent: timeSpent.current,
      score: averageScore.current,
      deckId: deckId as string,
    });

    // Set user deck knowledge
    upsertUserDeckKnowledgeMutation.mutate({
      deckId: deckId,
      score: averageScore.current,
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

    return xp;
  }

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
    <main className="space-y-8 w-full max-w-[40rem] px-2">
      <ProgressBar
        currentIndex={currentIndex}
        numFlashcards={flashcards.length}
        setCurrentIndex={setCurrentIndex}
      />
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
