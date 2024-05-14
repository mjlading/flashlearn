"use client";

import Flashcard from "@/components/Flashcard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TextGenerateEffect } from "@/components/TextGenerateEffect";
import { ScrollArea } from "@/components/ui/scroll-area";
import useRehearsal from "@/hooks/useRehearsal";
import { useDictionary } from "@/lib/DictProvider";
import { percentageToHsl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { AnswerForm, FormSchema } from "./AnswerForm";
import ProgressBar from "./ProgressBar";
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
  const dict = useDictionary();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const {
    currentIndex,
    setCurrentIndex,
    currentFlashcard,
    startRehearsal,
    feedbacks,
    handleSetFeedback,
    dialogOpen,
    setDialogOpen,
    averageScore,
    timeSpent,
    xpGain,
    isFinished,
  } = useRehearsal({ flashcards, deckId, creatorUserId });

  const { theme } = useTheme();

  useEffect(() => {
    startRehearsal();
  }, []);

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
