"use client";

import { api } from "@/app/api/trpc/client";
import { AlertTriangle, UserCog } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
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
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { academicLevelMap } from "@/lib/academicLevel";
import { useEffect, useState } from "react";
import { type AcademicLevel } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function DialogContentUserSettings({
  userName,
}: {
  userName: string | null | undefined;
}) {
  const deleteUserMutation = api.user.deleteUser.useMutation();
  const academicLevelQuery = api.user.getAcademicLevel.useQuery();
  const setAcademicLevelMutation = api.user.setAcademicLevel.useMutation();

  const [academicLevel, setAcademicLevel] = useState<AcademicLevel | undefined>(
    undefined
  );

  const session = useSession();

  useEffect(() => {
    if (academicLevelQuery.data) {
      setAcademicLevel(academicLevelQuery.data.academicLevel as AcademicLevel);
    }
  }, [academicLevelQuery.data]);

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

  function handleAcademicLevelChanged(value: string) {
    if (!academicLevel) return;

    setAcademicLevel(value as AcademicLevel);

    setAcademicLevelMutation
      .mutateAsync({
        academicLevel: value,
      })
      .then((data) => {
        toast.success(
          `Akademisk nivå er endret til ${
            academicLevelMap[data.academicLevel!]
          }`
        );
      });
  }

  return (
    <DialogContent data-cy="userSettings">
      <DialogHeader>
        <div className="flex items-center gap-2 leading-loose mb-4">
          <UserCog />
          <h2 className="text-lg">BrukerInstillinger</h2>
        </div>
      </DialogHeader>
      {/* User profile info */}
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={session.data?.user.image ?? ""} alt="profil" />
          <AvatarFallback>meg</AvatarFallback>
        </Avatar>
        <span data-cy="userSettingsNickname" className="font-semibold">{session.data?.user.nickname}</span>
      </div>

      {/* Change academic level section */}
      <div data-cy="academicLevel" className="mb-8 mt-2 space-y-1">
        <Label>Akademisk nivå</Label>
        <Select
          onValueChange={handleAcademicLevelChanged}
          value={academicLevel}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent >
            {Object.keys(academicLevelMap).map((academicLevelOption) => (
              <SelectItem data-cy="academicLevelSelector" value={academicLevelOption} key={academicLevelOption}>
                {academicLevelMap[academicLevelOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          Akademisk nivå brukes bl.a. for å tilpasse øvinger
        </p>
      </div>

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
            <Button data-cy="deleteUserButton" variant="destructive" size="sm">
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
