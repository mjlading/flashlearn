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
          <div className="cursor-pointer">
            <CardHeader className="pt-3 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{deck.name}</CardTitle>
              <div className="flex gap-4 text-muted-foreground text-sm">
                {/* Number of flashcards */}
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
                <div>
                  <Separator orientation="vertical" />
                </div>
                {/* Average star rating */}
                <StarRating stars={deck.averageRating} />
              </div>
            </CardHeader>
          </div>
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
