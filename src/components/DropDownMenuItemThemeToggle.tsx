"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDictionary } from "@/lib/DictProvider";

export function DropDownMenuItemThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dict = useDictionary();
  return (
    <>
      {theme === "light" ? (
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>{dict.userDropDown.switchTheme}</span> 
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>{dict.userDropDown.switchTheme}</span>
        </DropdownMenuItem>
      )}
    </>
  );
}
