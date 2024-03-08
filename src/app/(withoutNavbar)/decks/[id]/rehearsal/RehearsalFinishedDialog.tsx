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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RehearsalFinishedDialog({
  open,
  onOpenChange,
  averageScore,
  timeSpent,
  creatorUserId,
  deckId,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  averageScore: number;
  timeSpent: number;
  creatorUserId: string;
  deckId: string;
}) {
  const [stars, setStars] = useState(0);
  const session = useSession();
  const { push } = useRouter();
  const createDeckRatingMutation = api.deck.createDeckRating.useMutation();

  function msToTimeString(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Add leading zero if seconds less than 10
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

    return `${minutes}:${formattedSeconds}`; // 1 minute 15 seconds -> "1:15"
  }

  function handleContinueClicked() {
    push("/dashboard");

    // Save star rating if it exists
    if (stars === 0) return;
    createDeckRatingMutation.mutate({
      deckId: deckId,
      stars: stars,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(val) => onOpenChange(val)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gratulerer! Du har fullført økten.</DialogTitle>
          <DialogDescription>
            Fantastisk jobb! Du har svart på alle spørsmålene i denne økten.
          </DialogDescription>
        </DialogHeader>

        <div className="my-8 flex gap-4 justify-center">
          <div>
            <p>Tid brukt</p>
            <span>{timeSpent && msToTimeString(timeSpent)}</span>
          </div>
          <div>
            <p>Score</p>
            <span>{averageScore.toFixed(0)}%</span>
          </div>
        </div>

        {/* Star rating input */}
        {session.data?.user.id !== creatorUserId && (
          <div>
            <p className="text-center">Vurder settet</p>
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
