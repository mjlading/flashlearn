"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateCollectionForm from "./CreateCollectionForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeckList from "@/components/DeckList";
import { percentageToHsl, SerializedStateDates } from "@/lib/utils";
import DeckCard from "@/components/DeckCard";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { Deck } from "@prisma/client";
import { useTheme } from "next-themes";
import { api } from "@/app/api/trpc/client";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import { dictType } from "@/app/dictionaries/dictionariesClientSide";
import { useDictionary } from "@/lib/DictProvider";

export default function CreateCollecionTabs({
  addedDecks,
  setAddedDecks,
}: {
  addedDecks: SerializedStateDates<Deck, "dateCreated" | "dateChanged">[];
  setAddedDecks: Dispatch<
    SetStateAction<SerializedStateDates<Deck, "dateCreated" | "dateChanged">[]>
  >;
}) {
  const dict = useDictionary();
  type SimilarDeck = SerializedStateDates<
    Deck,
    "dateCreated" | "dateChanged"
  > & {
    cosineSimilarity: number;
  };

  const [suggestedDecks, setSuggestedDecks] = useState<SimilarDeck[]>([]);

  const { theme } = useTheme();

  const nearestNeighborsMutation = api.ai.getNearestDeckNeighbors.useMutation();

  const form = useFormContext();

  useEffect(() => {
    // When addedDecks are changed, refetch suggested/similar decks
    nearestNeighborsMutation
      .mutateAsync({
        targetDeckIds: addedDecks.map((d) => d.id),
        n: 3,
      })
      .then((data) => {
        setSuggestedDecks(data);
      });
  }, [addedDecks]);

  function handleAddClicked(
    deck: SerializedStateDates<Deck, "dateCreated" | "dateChanged">
  ) {
    if (addedDecks.find((d) => d.id === deck.id)) {
      toast("Settet " + deck.name + " er allerede lagt til.");
      return;
    }

    setAddedDecks((prev) => [...prev, deck]);
    form.setValue("deckIds", addedDecks.map((d) => d.id).concat(deck.id));
  }

  return (
    <Tabs defaultValue="meta" className="flex flex-col mx-4 py-2">
      <TabsList>
        <TabsTrigger value="meta" className="w-full text-md font-semibold">
          Meta
        </TabsTrigger>
        <TabsTrigger value="addDecks" className="w-full text-md font-semibold">
          Legg til sett
        </TabsTrigger>
      </TabsList>
      <TabsContent value="meta" className="mt-12">
        <CreateCollectionForm />
      </TabsContent>
      <TabsContent value="addDecks" className="mt-10">
        {/* Deck type tabs */}
        <Tabs defaultValue="created" className="mb-2">
          <TabsList>
            <TabsTrigger value="created">Laget</TabsTrigger>
            <TabsTrigger value="suggested">Lignende</TabsTrigger>
          </TabsList>
          <TabsContent value="created">
            <ScrollArea className="h-[calc(100vh-200px)] pr-3">
              <DeckList
                dict={dict}
                category="created"
                addable={true}
                onAddClicked={(deck) => handleAddClicked(deck)}
              />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="suggested">
            <ScrollArea className="h-[calc(100vh-200px)] pr-3">
              <div className="space-y-3 mt-5">
                {suggestedDecks.map(({ cosineSimilarity, ...deck }) => (
                  <div key={deck.id}>
                    <span
                      style={{
                        backgroundColor: percentageToHsl(
                          cosineSimilarity,
                          0,
                          120,
                          theme === "dark" ? 20 : 60
                        ),
                      }}
                      className="rounded-full h-6 w-6 text-sm text-center pt-[2px] shadow-sm absolute left-6 mt-[-12px]"
                    >
                      {(cosineSimilarity * 100).toFixed(0)}
                    </span>
                    <DeckCard
                      deck={deck}
                      addable
                      onAddClicked={() => handleAddClicked(deck)}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
