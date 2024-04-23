import { api } from "@/app/api/trpc/server";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default async function CategoryTabs({
  initialCategory,
  dict
}: {
  initialCategory: string;
  dict:Awaited<ReturnType<typeof getDictionary>> // fancy unwrap
}) {
  const deckCounts = await api.deck.countDecksByCategories.query();

  function formattedDeckCount(numDecks: number) {
    return numDecks === 0 ? "" : `(${numDecks})`;
  }

  return (
    <Tabs value={initialCategory || "recent"} className="w-[25rem]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recent" asChild>
          <Link href={`/${dict.lang}/dashboard/decks?category=recent`}>
            {dict.decks.recent} {formattedDeckCount(deckCounts.countRecent)}
          </Link>
        </TabsTrigger>
        <TabsTrigger value="created" asChild>
          <Link href={`/${dict.lang}/dashboard/decks?category=created`}>
          {dict.decks.created} {formattedDeckCount(deckCounts.countCreated)}{" "}
          </Link>
        </TabsTrigger>
        <TabsTrigger value="bookmarked" asChild>
          <Link href={`/${dict.lang}/dashboard/decks?category=bookmarked`}>
          {dict.decks.bookmarked} {formattedDeckCount(deckCounts.countBookmarked)}
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
