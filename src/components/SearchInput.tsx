"use client";

import React from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import useLocale from "@/hooks/useLocale";

export default function SearchInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const locale = useLocale();

  return (
    <form action={`/${locale}/search`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-muted-foreground" size={18} />
        <Input
          type="search"
          name="q"
          aria-label="Søk etter studiekort sett"
          autoComplete="off"
          placeholder="Søk"
          maxLength={50}
          minLength={2}
          required
          className="pl-9 rounded-lg"
          {...props}
        />
      </div>
    </form>
  );
}
