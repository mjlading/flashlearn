"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useDictionary } from "@/lib/DictProvider";

export default function DropDownMenuItemSignOut() {
  const dict = useDictionary();
  return (
    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>{dict.home.signOut}</span>
    </DropdownMenuItem>
  );
}
