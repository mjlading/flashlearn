"use client";

import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { formSchema } from "./CreateCollectionForm";
import { z } from "zod";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/app/api/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateCollectionTopbar() {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const router = useRouter();

  const createCollectionMutation = api.collection.createCollection.useMutation({
    onSuccess: (data) => {
      toast.success("Samlingen " + data.name + " er lagret");
      router.push("/dashboard/collections");
    },
    onError: () => {
      toast.error("Samlingen kunne ikke lagres", {
        description: "Vennligst prøv igjen",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createCollectionMutation.mutate(values);
  }

  return (
    <header className="h-[60px] border-b flex items-center justify-between px-8">
      <div className="flex items-center gap-2">
        <BackButton />
        <h2>{form.watch("name") || "Ny samling"}</h2>
      </div>
      <Button
        onClick={form.handleSubmit(onSubmit)}
        disabled={
          form.formState.isSubmitting || form.formState.isSubmitSuccessful
        }
      >
        {form.formState.isSubmitting ||
          (createCollectionMutation.isLoading && (
            <LoadingSpinner size={20} className="mr-2" />
          ))}
        Lagre samling
      </Button>
    </header>
  );
}
