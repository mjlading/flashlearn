"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Layers3, SquareStack } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CreateCollectionTopbar from "./CreateCollectionTopbar";
import CreateCollectionForm, { formSchema } from "./CreateCollectionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DeckList from "@/components/DeckList";
import { SerializedStateDates } from "@/lib/utils";
import type { Deck } from "@prisma/client";
import { useState } from "react";
import DeckCard from "@/components/DeckCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function CreateCollectionPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [addedDecks, setAddedDecks] = useState<
    SerializedStateDates<Deck, "dateCreated" | "dateChanged">[]
  >([]);

  function handleAddClicked(
    deck: SerializedStateDates<Deck, "dateCreated" | "dateChanged">
  ) {
    if (addedDecks.find((d) => d.id === deck.id)) {
      toast("Settet " + deck.name + " er allerede lagt til.");
      return;
    }

    setAddedDecks((prev) => [...prev, deck]);
  }

  function handleRemoveClicked(
    deck: SerializedStateDates<Deck, "dateCreated" | "dateChanged">
  ) {
    setAddedDecks((prev) => prev.filter((d) => d !== deck));
  }

  return (
    <FormProvider {...form}>
      <CreateCollectionTopbar />
      <div className="height-minus-navbar grid grid-cols-[1fr_1px_1fr] overflow-hidden">
        {/* Left side: Meta + add sets */}
        <Tabs defaultValue="meta" className="flex flex-col mx-4 py-2">
          <TabsList className="mx-auto">
            <TabsTrigger value="meta" className="w-[8rem]">
              Meta
            </TabsTrigger>
            <TabsTrigger value="addDecks" className="w-[8rem]">
              Legg til sett
            </TabsTrigger>
          </TabsList>
          <TabsContent value="meta" className="mt-12">
            <CreateCollectionForm />
          </TabsContent>
          <TabsContent value="addDecks" className="mt-12">
            <ScrollArea className="h-[calc(100vh-155px)] pr-3 flex-1">
              <DeckList
                category="created"
                addable={true}
                onAddClicked={(deck) => handleAddClicked(deck)}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Vertical separator line */}
        <Separator orientation="vertical" />

        {/* Right side: Added sets overview */}
        <div className="mx-4 py-2">
          <h2 className="text-center text-lg font-semibold mt-3 mb-12">
            Lagt til sett
          </h2>
          <div className="space-y-3">
            {addedDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                removable={true}
                onRemoveClicked={() => handleRemoveClicked(deck)}
              />
            ))}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
