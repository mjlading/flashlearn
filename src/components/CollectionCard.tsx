"use client";

import { SerializedStateDates } from "@/lib/utils";
import type { Deck } from "@prisma/client";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteCollectionButton from "./DeleteCollectionButton";
import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
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
    description: string | null;
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
  const [modeSelected, setModeSelected] = useState("write");
  const router = useRouter();

  function handleRehearseClicked() {
    router.push(`/collections/${collection.id}/rehearsal`);
  }

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
        <Dialog>
          <DialogTrigger asChild>
            {/* Rehearse button */}
            <Button>Øving</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>{collection.name}</DialogHeader>
            <DialogDescription>{collection.description}</DialogDescription>
            {/* Rehearsal Mode Selection */}
            <div className="flex flex-col">
              <Label htmlFor="select-mode" className="text-center mb-4">
                Øvemodus
              </Label>
              <Tabs
                id="select-mode"
                value={modeSelected}
                onValueChange={(newValue) => setModeSelected(newValue)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="visual">Visuell</TabsTrigger>
                  <TabsTrigger value="write">Skriftlig</TabsTrigger>
                  <TabsTrigger value="oral">Muntlig</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <DialogFooter className="mt-2">
              <Link
                href={`/collections/${collection.id}/rehearsal?mode=${modeSelected}`}
                className={buttonVariants({
                  size: "lg",
                  className: "w-full",
                })}
              >
                Start
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="space-x-2">
          {/* Edit button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/collections/${collection.id}/edit`}
                  className={buttonVariants({
                    size: "icon",
                    variant: "ghost",
                  })}
                >
                  <Pencil size={16} />
                </Link>
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
