import DeckCard from "@/components/DeckCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SerializedStateDates } from "@/lib/utils";
import type { Deck } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";

export default function AddedCollections({
  addedDecks,
  setAddedDecks,
}: {
  addedDecks: SerializedStateDates<Deck, "dateCreated" | "dateChanged">[];
  setAddedDecks: Dispatch<
    SetStateAction<SerializedStateDates<Deck, "dateCreated" | "dateChanged">[]>
  >;
}) {
  const form = useFormContext();

  function handleRemoveClicked(
    deck: SerializedStateDates<Deck, "dateCreated" | "dateChanged">
  ) {
    setAddedDecks((prev) => prev.filter((d) => d !== deck));
    form.setValue(
      "deckIds",
      addedDecks.filter((d) => d.id !== deck.id).map((d) => d.id)
    );
  }

  return (
    <div className="mx-4 py-2">
      <h2 className="text-center text-lg font-semibold mt-3 mb-12">
        Lagt til sett
      </h2>
      <ScrollArea className="h-[calc(100vh-155px)] pr-3">
        <div className="space-y-3 pb-7">
          {addedDecks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              removable={true}
              onRemoveClicked={() => handleRemoveClicked(deck)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
