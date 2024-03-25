"use client";

import type { SerializedStateDates } from "@/lib/utils";
import Prisma from "@prisma/client";
import { Dialog } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import DeckCardDialogContent from "./DeckCardDialogContent";
import DeleteDeckButton from "./DeleteDeckButton";
import NumFlashcards from "./NumFlashcards";
import StarRating from "./StarRating";
import { Badge } from "./ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { api } from "@/app/api/trpc/client";
import TagsSkeleton from "./TagsSkeleton";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Minus, Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export interface DeckCardProps {
  // Convert types dateCreated and dateChanged from Date to string
  deck: SerializedStateDates<Prisma.Deck, "dateCreated" | "dateChanged">;
  addable?: boolean;
  removable?: boolean;
  onAddClicked?: () => void;
  onRemoveClicked?: () => void;
}

export default function DeckCard({
  deck,
  addable,
  removable,
  onAddClicked,
  onRemoveClicked,
}: DeckCardProps) {
  const session = useSession();

  // Fetch the tags
  const tags = api.deck.getTagsByDeckId.useQuery(deck.id);

  return (
    <Dialog>
      <Card className="text-left">
        <div className="flex">
          <div className="flex-1">
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
              <div className="h-7">
                {tags.isLoading ? (
                  <TagsSkeleton />
                ) : (
                  tags.data?.slice(0, 4).map((tag, index) => (
                    <Badge className="mr-1" variant="secondary" key={index}>
                      {tag}
                    </Badge>
                  ))
                )}
              </div>
              {/* Delete button */}
              {deck.userId === session?.data?.user.id && (
                <DeleteDeckButton deck={deck} />
              )}
            </CardFooter>
          </div>

          {/* If addable or removale, display button on right side of card */}
          {addable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-[92px] w-[60px] flex items-center justify-center rounded-l-none"
                    variant="secondary"
                    onClick={onAddClicked}
                  >
                    <ArrowRight />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Legg til</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {removable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-[92px] w-[60px] flex items-center justify-center rounded-l-none"
                    variant="secondary"
                    onClick={onRemoveClicked}
                  >
                    <X />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fjern</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </Card>

      {/* The dialog that opens when clicking on the card */}
      <DeckCardDialogContent deck={deck} />
    </Dialog>
  );
}
