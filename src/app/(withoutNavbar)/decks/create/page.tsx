"use client";

import { Layers3 } from "lucide-react";
import CreateDeckForm, { formSchema } from "./CreateDeckForm";
import CreateDeckTopbar from "./CreateDeckTopbar";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function CreateDeckPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      private: false,
      flashcards: [{ front: "", back: "", tag: "" }],
      subjectName: "Auto",
      academicLevel: "BACHELOR",
    },
  });

  return (
    <FormProvider {...form}>
      <CreateDeckTopbar />
      <main className="mx-auto my-12 px-4 md:px-8 lg:w-[60rem]">
        <div className="flex flex-col space-y-8">
          <div className="flex gap-4 items-center">
            <Layers3 size={32} />
            <h1 className="font-bold text-4xl">Nytt sett</h1>
          </div>
          <p className="text-muted-foreground">
            Opprett et nytt sett med studiekort
          </p>
          <CreateDeckForm />
        </div>
      </main>
    </FormProvider>
  );
}
