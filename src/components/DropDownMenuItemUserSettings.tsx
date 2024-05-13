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
import { useDictionary } from "@/lib/DictProvider";

export default function DialogContentUserSettings({
  userName,
}: {
  userName: string | null | undefined;
}) {
  const dict = useDictionary();

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
        toast(dict.userSettings.wasDeleted);
      })
      .catch((error) => {
        toast.error(dict.userSettings.error, {
          description: dict.userSettings.errorDescription,
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
          `${dict.userSettings.academicLevelChangedTo} ${
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
          <h2 className="text-lg">{dict.userSettings.userSettings}</h2>
        </div>
      </DialogHeader>
      {/* User profile info */}
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={session.data?.user.image ?? ""} alt="profil" />
          <AvatarFallback>meg</AvatarFallback>
        </Avatar>
        <span data-cy="userSettingsNickname" className="font-semibold">
          {session.data?.user.nickname}
        </span>
      </div>

      {/* Change academic level section */}
      <div data-cy="academicLevel" className="mb-8 mt-2 space-y-1">
        <Label>{dict.userSettings.academicLevel}</Label>
        <Select
          onValueChange={handleAcademicLevelChanged}
          value={academicLevel}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {Object.keys(academicLevelMap).map((academicLevelOption) => (
              <SelectItem
                data-cy="academicLevelSelector"
                value={academicLevelOption}
                key={academicLevelOption}
              >
                {academicLevelMap[academicLevelOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          {dict.userSettings.academicLevelDescription}
        </p>
      </div>

      {/* Delete user data section */}
      <div className="bg-warning/10 rounded p-4 border border-warning">
        <p className="font-semibold leading-loose mb-1">
          {dict.userSettings.deleteUserData}
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          {dict.userSettings.deleteUserDataInfo}
        </p>

        {/* Delete user data confirmation dialog */}
        <Dialog>
          <DialogTrigger className="float-end">
            <Button data-cy="deleteUserButton" variant="destructive" size="sm">
              {dict.userSettings.deleteUserData}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <h2 className="font-semibold text-lg leading-loose mb-2">
                {dict.userSettings.areYouSure}
              </h2>
              <p>
                <AlertTriangle className="text-warning" />
                {dict.userSettings.user}{" "}
                <span className="font-bold">{userName}</span>{" "}
                {dict.userSettings.andRelated}
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
                  {dict.userSettings.deleteUserData}
                </Button>
                <DialogClose asChild>
                  <Button size="sm">{dict.userSettings.cancel}</Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DialogContent>
  );
}
