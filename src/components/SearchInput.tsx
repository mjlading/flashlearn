"use client";

import useLocale from "@/hooks/useLocale";
import { useDictionary } from "@/lib/DictProvider";
import { Search } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";

export default function SearchInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const locale = useLocale();
  const { search } = useDictionary();

  return (
    <form action={`/${locale}/search`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-muted-foreground" size={18} />
        <Input
          type="search"
          name="q"
          aria-label="Søk etter studiekort sett"
          autoComplete="off"
          placeholder={search.search}
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
