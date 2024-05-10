"use client";

import { subjectNameMap, subjectStyles } from "@/lib/subject";
import { cn, dateDifferenceFromNow, SerializedStateDates } from "@/lib/utils";
import { GraduationCap, History } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
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
import type { Deck } from "@prisma/client";
import { useDictionary } from "@/lib/DictProvider";

interface Props {
  // Convert types dateCreated and dateChanged from Date to string
  deck: SerializedStateDates<Deck, "dateCreated" | "dateChanged">;
}

export default function DeckCardDialogContent({ deck }: Props) {
  const [modeSelected, setModeSelected] = useState("write");
  const session = useSession();
  const isUsersDeck = deck.userId === session?.data?.user.id;
  const style = subjectStyles[deck.subjectName];
  const dict = useDictionary();
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="mb-2">{deck.name}</DialogTitle>
        <DialogDescription className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(style.color, "rounded-full p-1 text-black")}>
              {React.createElement(style.icon, { size: 20 })}
            </div>
            {subjectNameMap[deck.subjectName]}
          </div>

          <Separator orientation="vertical" />
          <NumFlashcards numFlashcards={deck.numFlashcards} />
        </DialogDescription>
      </DialogHeader>

      <div className="flex justify-between items-end">
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
              <p>
                {dict.decks.startPractice.created}{" "}
                {dateDifferenceFromNow(dict.lang, deck.dateCreated)}
              </p>
            ) : (
              <p>
                {dict.decks.startPractice.lastEdited}{" "}
                {dateDifferenceFromNow(dict.lang, deck.dateChanged)}
              </p>
            )}
          </div>
        </div>
        {/* Bookmark button */}
        {session.data?.user && !isUsersDeck && (
          <BookmarkButton deckId={deck.id} />
        )}
      </div>

      <Separator className="my-4" />

      {/* Rehearsal Mode Selection */}

      <div className="flex flex-col">
        <Label htmlFor="select-mode" className="text-center mb-4">
          {dict.decks.practiceMode}
        </Label>
        <Tabs
          id="select-mode"
          value={modeSelected}
          onValueChange={(newValue) => setModeSelected(newValue)}
        >
          {session.data?.user && (
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visual">
                {dict.decks.startPractice.visual}
              </TabsTrigger>
              <TabsTrigger value="write">
                {dict.decks.startPractice.written}
              </TabsTrigger>
              <TabsTrigger value="oral">
                {dict.decks.startPractice.oral}
              </TabsTrigger>
            </TabsList>
          )}
          {!session.data?.user && (
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visual">
                {dict.decks.startPractice.visual}
              </TabsTrigger>
              <TabsTrigger disabled={true} value="write">
                {dict.decks.startPractice.written}
              </TabsTrigger>
              <TabsTrigger disabled={true} value="oral">
                {dict.decks.startPractice.oral}
              </TabsTrigger>
            </TabsList>
          )}
        </Tabs>
      </div>

      <DialogFooter className="mt-2">
        <Link
          href={`/${dict.lang}/decks/${deck.id}/rehearsal?mode=${modeSelected}`}
          className={buttonVariants({
            size: "lg",
            className: "w-full",
          })}
        >
          {dict.decks.startPractice.start}
        </Link>
      </DialogFooter>
    </DialogContent>
  );
}
