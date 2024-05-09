"use client";

import { getDictionary } from "@/app/dictionaries/dictionaries";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Check, Globe, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function LanguageDropdownMenu({
  dict,
}: {
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Globe size={22} />
          <span>{dict.lang.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Link href={`/no${pathname.slice(3)}`}>
            <DropdownMenuItem>
              {dict.lang === "no" && <Check className="mr-2 h-4 w-4" />}
              <span>Norsk</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`/en${pathname.slice(3)}`}>
            <DropdownMenuItem>
              {dict.lang === "en" && <Check className="mr-2 h-4 w-4" />}
              <span>English</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
