import { api } from "@/app/api/trpc/server";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default async function CategoryTabs({
  initialCategory,
}: {
  initialCategory: string;
}) {
  const deckCounts = await api.deck.countDecksByCategories.query();

  function formattedDeckCount(numDecks: number) {
    return numDecks === 0 ? "" : `(${numDecks})`;
  }

  return (
    <Tabs value={initialCategory || "recent"} className="w-[25rem]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recent" asChild>
          <Link href={`/dashboard/decks?category=recent`}>
            Nylige {formattedDeckCount(deckCounts.countRecent)}
          </Link>
        </TabsTrigger>
        <TabsTrigger value="created" asChild>
          <Link href={`/dashboard/decks?category=created`}>
            Laget {formattedDeckCount(deckCounts.countCreated)}{" "}
          </Link>
        </TabsTrigger>
        <TabsTrigger value="bookmarked" asChild>
          <Link href={`/dashboard/decks?category=bookmarked`}>
            Bokmerkede {formattedDeckCount(deckCounts.countBookmarked)}
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
