"use client";

import { api } from "@/app/api/trpc/client";
import { AlertCircle, Trash } from "lucide-react";
import { toast } from "sonner";
import { DeckCardProps } from "./DeckCard";
import { LoadingSpinner } from "./LoadingSpinner";
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

export default function DeleteDeckButton({ deck }: DeckCardProps) {
  const utils = api.useUtils();

  const deleteDeckMutation = api.deck.deleteDeckById.useMutation({
    onSuccess() {
      utils.deck.infiniteDecks.refetch();

      toast(
        <span>
          Settet <span className="font-semibold">{deck.name}</span> er slettet
        </span>
      );
    },
    onError() {
      toast.error("Noe gikk galt", {
        description: "Settet ble ikke slettet. Vennligst prøv igjen.",
      });
    },
  });

  function handleDeleteDeck() {
    deleteDeckMutation.mutate(deck.id);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive h-7"
        >
          {deleteDeckMutation.isLoading && <LoadingSpinner size={16} />}
          <Trash size={16} />
        </Button>
      </DialogTrigger>

      {/* Confirmation dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Slett <span className="font-bold">{deck.name}</span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle size={18} />
              Denne handlingen kan ikke angres.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleDeleteDeck} variant="destructive">
              Slett sett
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
