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

export default function DeleteCollectionButton({
  collection,
}: CollectionCardProps) {
  function handleDeleteCollection() {
    alert("DELETE");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive"
        >
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
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle size={18} />
              Denne handlingen kan ikke angres.
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
