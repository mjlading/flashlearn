import DeckList from "@/components/DeckList";
import NewDeckButton from "@/components/NewDeckButton";
import CategoryTabs from "./CategoryTabs";
import { fetchDecks } from "./actions";

export default async function DecksPage({
  searchParams,
}: {
  searchParams: {
    category: string;
  };
}) {
  const fetchParams = {
    category: searchParams.category as "recent" | "created" | "bookmarked",
  };

  const initialDecks = await fetchDecks(fetchParams);

  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Studiekort</h1>
        <NewDeckButton />
      </div>
      <CategoryTabs />
      <DeckList initialDecks={initialDecks} fetchParams={fetchParams} />
    </div>
  );
}
