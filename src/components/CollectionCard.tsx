"use client";

import { SerializedStateDates } from "@/lib/utils";
import type { Deck } from "@prisma/client";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { useState } from "react";
import DeleteCollectionButton from "./DeleteCollectionButton";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    userId: string;
    collectionDecks: {
      deckId: string;
      collectionId: string;
      deck: SerializedStateDates<Deck, "dateCreated" | "dateChanged">;
    }[];
  };
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const [showDecks, setShowDecks] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{collection.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <h3>{collection.collectionDecks.length} Sett</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDecks(!showDecks)}
                >
                  {showDecks && <ChevronUp size={18} />}
                  {!showDecks && <ChevronDown size={18} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showDecks ? "Gjem sett" : "Vis sett"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Decks table */}
        {showDecks && (
          <Table>
            <TableHeader>
              <TableHead>Navn</TableHead>
              <TableHead className="text-right">Antall studiekort</TableHead>
            </TableHeader>
            <TableBody>
              {collection.collectionDecks.map(({ deck }) => (
                <TableRow key={deck.id}>
                  <TableCell>{deck.name}</TableCell>
                  <TableCell className="text-right">
                    {deck.numFlashcards}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* Rehearse button */}
        <Button>Start øving</Button>
        <div className="space-x-2">
          {/* Edit button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rediger samling</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DeleteCollectionButton collection={collection} />
        </div>
      </CardFooter>
    </Card>
  );
}
