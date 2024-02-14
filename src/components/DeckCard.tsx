"use client";

import type { SerializedStateDates } from "@/lib/utils";
import Prisma from "@prisma/client";
import { Dialog } from "@radix-ui/react-dialog";
import { Layers3, Star } from "lucide-react";
import DeckCardDialogContent from "./DeckCardDialogContent";
import DeleteDeckButton from "./DeleteDeckButton";
import { Badge } from "./ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";
import NumFlashcards from "./NumFlashcards";
import { Button } from "./ui/button";

export interface DeckCardProps {
  // Convert types dateCreated and dateChanged from Date to string
  deck: SerializedStateDates<Prisma.Deck, "dateCreated" | "dateChanged">;
}

export default function DeckCard({ deck }: DeckCardProps) {
  const session = useSession();

  // Mock these for now
  const tags = [
    "Algebra",
    "Geometri",
    "Trigonometri",
    "Kalkulus",
    "Statistikk",
    "Sannsynlighet",
    "Differensiallikninger",
  ];

  return (
    <Dialog>
      <Card className="text-left">
        <DialogTrigger asChild>
          <button className="w-full">
            <CardHeader className="flex flex-row items-center justify-between py-3 cursor-pointer">
              <CardTitle className="text-lg">{deck.name}</CardTitle>
              <div className="flex gap-4">
                {/* Number of flashcards */}
                <NumFlashcards numFlashcards={deck.numFlashcards} />
                <div>
                  <Separator orientation="vertical" />
                </div>
                {/* Average star rating */}
                <StarRating stars={deck.averageRating} />
              </div>
            </CardHeader>
          </button>
        </DialogTrigger>

        <CardFooter className="flex justify-between pt-0 pb-3">
          {/* Tags */}
          <div className="pb-1">
            {tags.slice(0, 5).map((tag) => (
              <Badge className="mr-1" variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
          {/* Delete button */}
          {deck.userId === session?.data?.user.id && (
            <DeleteDeckButton deck={deck} />
          )}
        </CardFooter>
      </Card>

      {/* The dialog that opens when clicking on the card */}
      <DeckCardDialogContent deck={deck} />
    </Dialog>
  );
}
