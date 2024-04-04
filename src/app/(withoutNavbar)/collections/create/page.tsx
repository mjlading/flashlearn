"use client";

import DeckCard from "@/components/DeckCard";
import DeckList from "@/components/DeckList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { percentageToHsl, SerializedStateDates } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Deck } from "@prisma/client";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CreateCollectionForm, { formSchema } from "./CreateCollectionForm";
import CreateCollectionTopbar from "./CreateCollectionTopbar";
import { api } from "@/app/api/trpc/client";
import prisma from "@/lib/prisma";
import { useTheme } from "next-themes";

export default function CreateCollectionPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      deckIds: [],
    },
  });

  const nearestNeighborsMutation = api.ai.getNearestDeckNeighbors.useMutation();

  type SimilarDeck = SerializedStateDates<
    Deck,
    "dateCreated" | "dateChanged"
  > & {
    cosineSimilarity: number;
  };

  const [addedDecks, setAddedDecks] = useState<
    SerializedStateDates<Deck, "dateCreated" | "dateChanged">[]
  >([]);
  const [suggestedDecks, setSuggestedDecks] = useState<SimilarDeck[]>([]);

  const { theme } = useTheme();

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
    <FormProvider {...form}>
      <CreateCollectionTopbar />
      <div className="height-minus-navbar grid grid-cols-[1fr_1px_1fr] overflow-hidden">
        {/* Left side: Meta + add sets */}
        <Tabs defaultValue="meta" className="flex flex-col mx-4 py-2">
          <TabsList>
            <TabsTrigger value="meta" className="w-full text-md font-semibold">
              Meta
            </TabsTrigger>
            <TabsTrigger
              value="addDecks"
              className="w-full text-md font-semibold"
            >
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

        {/* Vertical separator line */}
        <Separator orientation="vertical" />

        {/* Right side: Added sets overview */}
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
      </div>
    </FormProvider>
  );
}
