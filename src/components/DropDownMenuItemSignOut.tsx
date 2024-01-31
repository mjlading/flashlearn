"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function DropDownMenuItemSignOut() {
  return (
    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Logg ut</span>
    </DropdownMenuItem>
  );
}
