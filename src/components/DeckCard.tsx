import type { SerializedStateDates } from "@/lib/utils";
import Prisma from "@prisma/client";

interface DeckCardProps {
  // Convert types dateCreated and dateChanged from Date to string
  deck: SerializedStateDates<Prisma.Deck, "dateCreated" | "dateChanged">;
}

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-5">
      <h3 className="font-semibold text-xl">{deck.name}</h3>
      <p className="text-muted-foreground text-sm">
        <pre>{JSON.stringify(deck, null, 2)}</pre>
      </p>
    </div>
  );
}
