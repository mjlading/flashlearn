import type { SerializedStateDates } from "@/lib/utils";
import Prisma from "@prisma/client";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface DeckCardProps {
  // Convert types dateCreated and dateChanged from Date to string
  deck: SerializedStateDates<Prisma.Deck, "dateCreated" | "dateChanged">;
}

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <>
      <DialogTrigger>
        <div className="rounded-lg border bg-card text-card-foreground p-5">
          <h3 className="font-semibold text-xl">{deck.name}</h3>
          <pre className="text-xs">{JSON.stringify(deck, null, 2)}</pre>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{deck.name}</DialogTitle>
          <DialogDescription>{deck.subjectName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button type="submit">Start</Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
