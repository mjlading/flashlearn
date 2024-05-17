"use client";

import { Separator } from "@/components/ui/separator";
import { SerializedStateDates } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Deck } from "@prisma/client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { getFormSchema } from "./CreateCollectionForm";
import CreateCollecionTabs from "./CreateCollectionTabs";
import CreateCollectionTopbar from "./CreateCollectionTopbar";
import AddedCollections from "./AddedCollections";
import { useDictionary } from "@/lib/DictProvider";

export default function CreateCollectionPage() {
  const dict = useDictionary();
  const formSchema = getFormSchema(dict);
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

  return (
    <FormProvider {...form}>
      <CreateCollectionTopbar />
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
