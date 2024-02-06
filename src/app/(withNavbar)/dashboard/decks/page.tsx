import DeckList from "@/components/DeckList";
import NewDeckButton from "@/components/NewDeckButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { unstable_noStore } from "next/cache";
import { fetchDecks } from "./actions";

export default async function DecksPage() {
  unstable_noStore(); // Disable caching for this page

  const initialDecks = await fetchDecks({
    sortBy: "dateCreated",
    sortOrder: "desc",
  });

  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Studiekort</h1>
        <NewDeckButton />
      </div>
      <div>
        <Tabs defaultValue="recent" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">
              Nylige ({initialDecks.totalCount})
            </TabsTrigger>
            <TabsTrigger value="myDecks">Mine sett</TabsTrigger>
            <TabsTrigger value="bookmarked">Bokmerkede</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <DeckList initialDecks={initialDecks.decks} />
    </div>
  );
}
