import DeckList from "@/components/DeckList";
import NewDeckButton from "@/components/NewDeckButton";
import { fetchDecks } from "./actions";
import { unstable_noStore } from "next/cache";

export default async function DecksPage() {
  unstable_noStore(); // Disable caching for this page so it always fetches the latest data
  const initialDecks = await fetchDecks({});

  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Studiekort</h1>
        <NewDeckButton />
      </div>
      <DeckList initialDecks={initialDecks} />
    </div>
  );
}
