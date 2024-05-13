"use client";

import { AlertCircle, Trash } from "lucide-react";
import { CollectionCardProps } from "./CollectionCard";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { api } from "@/app/api/trpc/client";
import { toast } from "sonner";
import { LoadingSpinner } from "./LoadingSpinner";
import { useDictionary } from "@/lib/DictProvider";

export default function DeleteCollectionButton({
  collection,
}: CollectionCardProps) {
  const dict = useDictionary();

  const utils = api.useUtils();

  const deleteCollectionMutation = api.collection.deleteCollection.useMutation({
    onSuccess: () => {
      utils.collection.getUserCollections.invalidate();

      toast(
        <span>
          {dict.collections.theCollection}{" "}
          <span className="font-semibold">{collection.name}</span>{" "}
          {dict.collections.isDeleted}
        </span>
      );
    },
    onError() {
      toast.error(dict.collections.deleteError, {
        description: dict.collections.deleteErrorDescription,
      });
    },
  });

  function handleDeleteCollection() {
    deleteCollectionMutation.mutate({
      id: collection.id,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive"
        >
          {deleteCollectionMutation.isLoading && <LoadingSpinner size={16} />}
          <Trash size={16} />
        </Button>
      </DialogTrigger>
      {/* Confirmation dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dict.collections.delete}{" "}
            <span className="font-bold">{collection.name}</span>?
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              {dict.collections.deleteInfo}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleDeleteCollection} variant="destructive">
              {dict.collections.deleteCollection}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
