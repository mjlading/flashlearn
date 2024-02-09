"use client";

import { AlertCircle, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function DeleteDeckButton({ deckName }: { deckName: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
        >
          <Trash size={18} />
        </Button>
      </DialogTrigger>

      {/* Confirmation dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Slett <span className="font-bold">{deckName}</span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle size={18} />
              Denne handlingen kan ikke angres.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive">Slett sett</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
