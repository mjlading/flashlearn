"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchDeckCounts } from "./actions";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function CategoryTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [deckCounts, setDeckCounts] = useState({
    numBookmarkedDecks: 0,
    numCreatedDecks: 0,
  });

  useEffect(() => {
    fetchDeckCounts().then((data) => {
      setDeckCounts(data);
    });
  }, []);

  function handleTabChange(newValue: string) {
    // change value of 'category' query param
    const params = new URLSearchParams(searchParams);
    params.set("category", newValue);
    replace(`${pathname}?${params.toString()}`);
  }

  function formattedDeckCount(numDecks: number) {
    return numDecks === 0 ? "" : `(${numDecks})`;
  }

  return (
    <Tabs
      value={searchParams.get("category") || "recent"}
      onValueChange={handleTabChange}
      className="w-[25rem]"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recent">Nylige (x)</TabsTrigger>
        <TabsTrigger value="created">
          Laget {formattedDeckCount(deckCounts.numCreatedDecks)}
        </TabsTrigger>
        <TabsTrigger value="bookmarked">
          Bokmerkede {formattedDeckCount(deckCounts.numBookmarkedDecks)}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
