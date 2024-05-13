"use client";

import { api } from "@/app/api/trpc/client";
import StarRatingInput from "@/components/StarRatingInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brain } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDictionary } from "@/lib/DictProvider";

export default function RehearsalFinishedDialog({
  open,
  onOpenChange,
  averageScore,
  timeSpent,
  creatorUserId,
  deckId,
  xpGain,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  averageScore: number;
  timeSpent: number;
  creatorUserId: string;
  deckId: string;
  xpGain: number;
}) {
  const session = useSession();
  const dict = useDictionary();
  const { push } = useRouter();
  const setDeckRatingMutation = api.deck.setDeckRating.useMutation();
  const { data: deckRating } = api.deck.getDeckRating.useQuery({
    deckId: deckId,
  });
  const [stars, setStars] = useState(0);

  useEffect(() => {
    if (deckRating?.stars) {
      setStars(deckRating.stars);
    }
  }, [deckRating]);

  function msToTimeString(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Add leading zero if seconds less than 10
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

    return `${minutes}:${formattedSeconds}`; // 1 minute 15 seconds -> "1:15"
  }

  function handleContinueClicked() {
    push(`/${dict.lang}/dashboard/decks?category=recent`);

    // Save or update star rating
    if (stars === 0 || deckRating?.stars === stars) return;
    setDeckRatingMutation.mutate({
      deckId: deckId,
      stars: stars,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(val) => onOpenChange(val)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Øving fullført! 👏
          </DialogTitle>
          <DialogDescription className="text-center">
            Fantastisk jobb! Du har svart på alle spørsmålene i denne økten.
          </DialogDescription>
        </DialogHeader>

        {/* Stats */}
        <div className="my-8 flex gap-10 justify-center w-full sm:w-[80%] mx-auto">
          <div className="flex flex-1 flex-col items-center p-4 rounded-xl shadow-md border">
            <p className="font-medium text-gray-700 dark:text-white">
              Tid brukt
            </p>
            <span className="mt-1 text-lg font-semibold text-blue-600">
              {timeSpent && msToTimeString(timeSpent)}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center p-4 rounded-xl shadow-md border">
            <p className="font-medium text-gray-700 dark:text-white">Score</p>
            <span className="mt-1 text-lg font-semibold text-green-500">
              {averageScore.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="flex items-center w-fit border mx-auto rounded-full p-4 mb-4">
          <Brain className="text-orange-400 fill-orange-100 mr-1" />
          <span className="font-bold text-orange-400">+{xpGain}</span>
        </div>

        {/* Star rating input */}
        {session.data?.user.id !== creatorUserId && (
          <div className="my-4">
            <p className="text-center font-medium text-gray-800">
              Vurder settet
            </p>
            <StarRatingInput value={stars} onChange={(val) => setStars(val)} />
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleContinueClicked} className="w-full">
            Videre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
