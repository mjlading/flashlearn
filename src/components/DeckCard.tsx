import type { SerializedStateDates } from "@/lib/utils";
import Prisma from "@prisma/client";
import DeckCardDialogContent from "./DeckCardDialogContent";
import { DialogTrigger } from "./ui/dialog";

export interface DeckCardProps {
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
      {/* The dialog that opens when clicking on the card */}
      <DeckCardDialogContent deck={deck} />
    </>
  );
}
