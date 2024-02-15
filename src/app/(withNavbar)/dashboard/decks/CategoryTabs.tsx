"use client";

import { api } from "@/app/api/trpc/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CategoryTabs() {
  const deckCounts = api.deck.countDecksByCategories.useQuery();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
    <>
      <Tabs
        value={searchParams.get("category") || "recent"}
        onValueChange={handleTabChange}
        className="w-[25rem]"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">
            Nylige{" "}
            {deckCounts.data && formattedDeckCount(deckCounts.data.countRecent)}
          </TabsTrigger>
          <TabsTrigger value="created">
            Laget{" "}
            {deckCounts.data &&
              formattedDeckCount(deckCounts.data.countCreated)}
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            Bokmerkede{" "}
            {deckCounts.data &&
              formattedDeckCount(deckCounts.data.countBookmarked)}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
}
