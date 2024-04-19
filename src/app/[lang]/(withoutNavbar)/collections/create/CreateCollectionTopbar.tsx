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
import { useDictionary } from "@/lib/DictProvider";

export default function CreateCollectionTopbar({
  edit = false,
  collectionId,
}: {
  edit?: boolean;
  collectionId?: string;
}) {
  const dict = useDictionary();
  const form = useFormContext<z.infer<typeof formSchema>>();
  const router = useRouter();

  const createCollectionMutation = api.collection.createCollection.useMutation({
    onSuccess: (data) => {
      toast.success(
        dict.collections.createCollection.toasts.yourCollection + 
        data.name + 
        dict.collections.createCollection.toasts.isStored);
      router.push("/dashboard/collections");
    },
    onError: () => {
      toast.error(dict.collections.createCollection.toasts.saveFailed, {
        description: dict.collections.createCollection.toasts.tryAgain,
      });
    },
  });
  const editCollectionMutation = api.collection.editCollection.useMutation({
    onSuccess: (data) => {
      toast.success(
        dict.collections.createCollection.toasts.editWorked + 
        data.name + 
        dict.collections.createCollection.toasts.isStored);
      router.push("/dashboard/collections");
    },
    onError: () => {
      toast.error(dict.collections.createCollection.toasts.editFailed, {
        description: dict.collections.createCollection.toasts.tryAgain,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    edit
      ? editCollectionMutation.mutate({
          collection: values,
          id: collectionId as string,
        })
      : createCollectionMutation.mutate(values);
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
        {dict.collections.createCollection.saveCollection}
      </Button>
    </header>
  );
}
