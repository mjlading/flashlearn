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

export default function DeleteCollectionButton({
  collection,
}: CollectionCardProps) {
  const utils = api.useUtils();

  const deleteCollectionMutation = api.collection.deleteCollection.useMutation({
    onSuccess: () => {
      utils.collection.getUserCollections.invalidate();

      toast(
        <span>
          Samlingen <span className="font-semibold">{collection.name}</span> er
          slettet
        </span>
      );
    },
    onError() {
      toast.error("Noe gikk galt", {
        description: "Samlingen ble ikke slettet. Vennligst prøv igjen.",
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
            Slett <span className="font-bold">{collection.name}</span>?
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              Settene i samlingen vil ikke bli slettet.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleDeleteCollection} variant="destructive">
              Slett samling
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
