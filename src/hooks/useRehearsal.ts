"use client";

import { Feedback } from "@/app/[lang]/(withoutNavbar)/decks/[id]/rehearsal/AnswerForm";
import { api } from "@/app/api/trpc/client";
import { useEffect, useRef, useState } from "react";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { useDictionary } from "@/lib/DictProvider";
import { toast } from "sonner";

export default function useRehearsal({
  flashcards,
  deckId,
  creatorUserId,
}: {
  flashcards: FlashcardType[];
  deckId: string;
  creatorUserId: string;
}) {
  const dict = useDictionary();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
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

  useEffect(() => {
    setCurrentFlashcard(flashcards[currentIndex]);
  }, [currentIndex, flashcards]);

  // Checks if rehearsal is finished whenever feedbacks change
  useEffect(() => {
    if (
      feedbacks.length === flashcards.length &&
      feedbacks.every((f) => f !== undefined)
    ) {
      handleRehearsalFinished();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function startRehearsal() {
    // Create a new rehearsal
    saveRehearsalStartedMutation.mutate({
      mode: "write",
      deckId: deckId,
    });
  }

  function handleRehearsalFinished() {
    if (isFinished.current || !deckId) return;

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

  const maxScoreEmojis = ["🎉", "🥳", "🎊", "🙌", "✨", "💫", "🥇", "👏"];

  const getRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * maxScoreEmojis.length);
    return maxScoreEmojis[randomIndex];
  };

  return {
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
  };
}
