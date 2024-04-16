"use client";

import { api } from "@/app/api/trpc/client";
import { AlertTriangle, UserCog } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

export default function DialogContentUserSettings({
  userName,
}: {
  userName: string | null | undefined;
}) {
  const deleteUserMutation = api.user.deleteUser.useMutation();
  const router = useRouter();

  function handleDeleteUser() {
    deleteUserMutation
      .mutateAsync()
      .then(async () => {
        router.push("/");
        await signOut(); // Deletes Auth.js cookies from browser
        toast("Brukeren ble slettet");
      })
      .catch((error) => {
        toast.error("Kunne ikke slette brukeren", {
          description:
            "Vennligst prøv igjen. Hvis problemet vedvarer, ta kontakt med oss via mail.",
        });
        console.error("Could not delete user: ", error);
      });
  }

  return (
    <DialogContent>
      <DialogHeader>
        <div className="flex items-center gap-2 leading-loose mb-4">
          <UserCog />
          <h2>BrukerInstillinger</h2>
        </div>
      </DialogHeader>
      {/* Delete user data section */}
      <div className="bg-warning/10 rounded p-4 border border-warning">
        <p className="font-semibold leading-loose mb-1">Slett brukerdata</p>
        <p className="text-muted-foreground text-sm mb-4">
          Vil slette all data tilknyttet deg fra databasen vår, dvs. personlig
          data (navn, epost, bilde), din fremgang, dine studiekort, samlinger
          osv.
        </p>

        {/* Delete user data confirmation dialog */}
        <Dialog>
          <DialogTrigger className="float-end">
            <Button variant="destructive" size="sm">
              Slett brukerdata
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <h2 className="font-semibold text-lg leading-loose mb-2">
                Er du sikker?
              </h2>
              <p>
                <AlertTriangle className="text-warning" />
                Brukeren <span className="font-bold">{userName}</span> og all
                tilknyttet data vil bli slettet
              </p>
            </DialogHeader>
            <DialogFooter>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={handleDeleteUser}
                  variant="destructive"
                  size="sm"
                  className="w-fit"
                >
                  Slett brukerdata
                </Button>
                <DialogClose asChild>
                  <Button size="sm">Avbryt</Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DialogContent>
  );
}
