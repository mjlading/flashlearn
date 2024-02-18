"use client";

import { subjectNameMap } from "@/lib/subject";
import { dateDifferenceFromNow } from "@/lib/utils";
import { GraduationCap, History } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import BookmarkButton from "./BookmarkButton";
import { DeckCardProps } from "./DeckCard";
import NumFlashcards from "./NumFlashcards";
import StarRating from "./StarRating";
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
import { academicLevelMap } from "@/lib/academicLevel";

export default function DeckCardDialogContent({ deck }: DeckCardProps) {
  const [modeSelected, setModeSelected] = useState("write");
  const session = useSession();
  const isUsersDeck = deck.userId === session?.data?.user.id;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="mb-2">{deck.name}</DialogTitle>
        <DialogDescription className="flex gap-4">
          {subjectNameMap[deck.subjectName]}
          <Separator orientation="vertical" />
          <NumFlashcards numFlashcards={deck.numFlashcards} />
        </DialogDescription>
      </DialogHeader>

      <div className="flex justify-between">
        {/* Deck Information */}
        <div className="space-y-2">
          {/* Average star rating */}
          <StarRating stars={deck.averageRating} />

          {/* Academic level */}
          <div className="flex gap-2 items-center text-muted-foreground text-sm">
            <GraduationCap size={18} />
            <p>{academicLevelMap[deck.academicLevel]}</p>
          </div>

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
        {/* Bookmark button */}
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
