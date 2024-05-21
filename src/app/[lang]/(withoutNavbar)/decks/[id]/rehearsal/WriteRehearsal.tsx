"use client";

import Flashcard, { FlashcardRef } from "@/components/Flashcard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TextGenerateEffect } from "@/components/TextGenerateEffect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import useRehearsal from "@/hooks/useRehearsal";
import { cn, percentageToTwBgColor } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
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
    userAnswers,
    setUserAnswers,
    getRandomEmoji,
  } = useRehearsal({ flashcards, deckId, creatorUserId, mode: "WRITE" });

  const flashcardRef = useRef<FlashcardRef>(null);

  const session = useSession();

  useEffect(() => {
    startRehearsal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAnswerSubmitted(answer: string) {
    if (flashcardRef.current) {
      flashcardRef.current.flipCard();
    }
    setUserAnswers((prev) => [...prev, answer]);
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
        <ScrollArea className="flex-1 space-y-2 pb-2">
          <Flashcard
            ref={flashcardRef}
            flashcard={currentFlashcard}
            className="h-[10rem] mt-4"
            mode="write"
            isFlipEnabled={!!feedbacks[currentIndex]}
          />

          {/* The user's answer section */}
          {userAnswers[currentIndex] && (
            <div className="flex gap-2 justify-end pl-10 my-4">
              <div
                className="dark:bg-slate-800 bg-slate-200
          rounded-3xl rounded-tr-md p-4"
              >
                <p>{userAnswers[currentIndex]}</p>
              </div>
              <Avatar className="h-8 w-8 shadow-sm">
                <AvatarImage
                  src={session.data?.user.image ?? ""}
                  alt="profil"
                />
                <AvatarFallback>meg</AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* The feedback section */}
          {form.formState.isSubmitting && (
            <LoadingSpinner className="mx-auto" />
          )}
          {feedbacks[currentIndex] && (
            <div className="space-y-4">
              {/* The score */}
              {feedbacks[currentIndex].score !== undefined && (
                <div
                  className={cn(
                    percentageToTwBgColor(feedbacks[currentIndex]?.score || 0),
                    "flex gap-1 rounded-full py-2 px-5 mx-auto w-fit shadow-sm font-semibold"
                  )}
                >
                  <span className="text-lg text-white">
                    {feedbacks[currentIndex].score}{" "}
                    <span className="text-sm text-gray-300">/ 100</span>
                  </span>
                  <span className="text-lg">
                    {feedbacks[currentIndex].score === 100 && getRandomEmoji()}
                  </span>
                </div>
              )}

              {/* The tips */}
              <ul className="space-y-4 pb-8">
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
        <div className="pb-4 bg-transparent">
          <AnswerForm
            flashcard={currentFlashcard}
            currentIndex={currentIndex}
            disabled={!!feedbacks[currentIndex]}
            setFeedback={handleSetFeedback}
            onSubmitted={handleAnswerSubmitted}
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
