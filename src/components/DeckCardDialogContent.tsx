"use client";

import { dateDifferenceFromNow } from "@/lib/utils";
import { History, Layers3, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BookmarkButton from "./BookmarkButton";
import { DeckCardProps } from "./DeckCard";
import { buttonVariants } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";

export default function DeckCardDialogContent({ deck }: DeckCardProps) {
  const [modeSelected, setModeSelected] = useState("write");
  const session = useSession();
  const isUsersDeck = deck.userId === session?.data?.user.id;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="mb-2">{deck.name}</DialogTitle>
        <DialogDescription className="flex gap-4">
          {deck.subjectName}
          <Separator orientation="vertical" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-2 items-center">
                  <Layers3 size={18} />
                  {deck.numFlashcards}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Antall studiekort</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogDescription>
      </DialogHeader>

      {/* Deck Information */}
      <div className="flex justify-between">
        <div>
          {/* Average star rating */}
          <StarRating stars={deck.averageRating} />

          {/* Time ago created/changed */}
          <div className="flex gap-2 items-center text-muted-foreground text-sm">
            <History size={18} />
            {deck.dateChanged.valueOf() === deck.dateCreated.valueOf() ? (
              <p>Opprettet {dateDifferenceFromNow(deck.dateCreated)}</p>
            ) : (
              <p>Sist endret {dateDifferenceFromNow(deck.dateChanged)}</p>
            )}
          </div>
        </div>
        {!isUsersDeck && <BookmarkButton deckId={deck.id} />}
      </div>

      <Separator className="my-4" />

      {/* Rehearsal Mode Selection */}
      <div className="flex flex-col gap-4 py-4">
        <Tabs
          value={modeSelected}
          onValueChange={(newValue) => setModeSelected(newValue)}
        >
          <Label htmlFor="rehearsal-mode">Øvemodus</Label>
          <TabsList className="grid w-full grid-cols-3 mt-1">
            <TabsTrigger value="visual">Visuell</TabsTrigger>
            <TabsTrigger value="write">Skriftlig</TabsTrigger>
            <TabsTrigger value="oral">Muntlig</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <DialogFooter>
        <Link
          href={`/decks/${deck.id}/rehearsal?mode=${modeSelected}`}
          className={buttonVariants({
            size: "lg",
            className: "w-full",
          })}
        >
          Start
        </Link>
      </DialogFooter>
    </DialogContent>
  );
}
