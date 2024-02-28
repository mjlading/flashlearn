import React from "react";
import { Input } from "./ui/input";

export default function SearchInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <form action="/search">
      <Input
        type="search"
        name="q"
        aria-label="Søk etter studiekort sett"
        autoComplete="off"
        placeholder="Søk"
        maxLength={20}
        minLength={2}
        required
        {...props}
      />
    </form>
  );
}
