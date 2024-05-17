"use client";

import { api } from "@/app/api/trpc/client";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { getFormSchema } from "../../create/CreateCollectionForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SerializedStateDates } from "@/lib/utils";
import type { Deck } from "@prisma/client";
import CreateCollectionTopbar from "../../create/CreateCollectionTopbar";
import CreateCollecionTabs from "../../create/CreateCollectionTabs";
import { Separator } from "@/components/ui/separator";
import AddedCollections from "../../create/AddedCollections";
import { useDictionary } from "@/lib/DictProvider";

export default function EditCollectionPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const collection = api.collection.getCollectionById.useQuery({
    id: params.id,
    includeDecks: true,
  });
  const dict = useDictionary();
  const formSchema = getFormSchema(dict)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      deckIds: [],
    },
  });

  const [addedDecks, setAddedDecks] = useState<
    SerializedStateDates<Deck, "dateCreated" | "dateChanged">[]
  >([]);

  useEffect(() => {
    if (collection.data) {
      // Set the metadata
      const deckIds = collection.data.collectionDecks.map((cd) => cd.deckId);
      form.reset({
        name: collection.data.name,
        description: collection.data.description || undefined,
        deckIds: deckIds,
      });

      // Set the decks
      const decks = collection.data?.collectionDecks.map((cd) => cd.deck);
      setAddedDecks(decks);
    }
  }, [collection.data, form]);

  return (
    <FormProvider {...form}>
      <CreateCollectionTopbar edit collectionId={collection.data?.id} />
      <div className="height-minus-navbar grid grid-cols-[1fr_1px_1fr] overflow-hidden">
        {/* Left side: Meta + add sets */}
        <CreateCollecionTabs
          addedDecks={addedDecks}
          setAddedDecks={setAddedDecks}
        />

        {/* Vertical separator line */}
        <Separator orientation="vertical" />

        {/* Right side: Added sets overview */}
        <AddedCollections
          addedDecks={addedDecks}
          setAddedDecks={setAddedDecks}
        />
      </div>
    </FormProvider>
  );
}
