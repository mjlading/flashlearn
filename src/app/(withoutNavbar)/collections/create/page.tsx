"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Layers3, SquareStack } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CreateCollectionTopbar from "./CreateCollectionTopbar";
import CreateCollectionForm, { formSchema } from "./CreateCollectionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function CreateCollectionPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <FormProvider {...form}>
      <CreateCollectionTopbar />
      <div className="height-minus-navbar grid grid-cols-[1fr_1px_1fr]">
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
            add decks
          </TabsContent>
        </Tabs>

        {/* Vertical separator line */}
        <Separator orientation="vertical" />

        {/* Right side: Added sets overview */}
        <div className="mx-4 py-2">
          <h2 className="text-center text-lg font-semibold mt-2">
            Lagt til sett
          </h2>
        </div>
      </div>
    </FormProvider>
  );
}
