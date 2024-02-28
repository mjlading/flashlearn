import { api } from "@/app/api/trpc/server";
import DeckList from "@/components/DeckList";
import SearchInput from "@/components/SearchInput";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    q: string;
  };
}) {
  const { q } = searchParams; // The search query

  // Fetch initial results on the server
  const initialDecks = (
    await api.deck.infiniteDecks.query({
      limit: 10,
      query: q,
    })
  ).decks;

  return (
    <div className="sm:px-8 px-4 my-12">
      <main className="w-[50rem] max-w-full mx-auto">
        <SearchInput defaultValue={q} className="h-14 text-md" />
        <div className="my-6 space-y-1">
          <p>
            Viser resultater for &quot;
            <span className="font-semibold">{q}</span>&quot;
          </p>
          <p>
            Treff: <span className="font-semibold">123</span>
          </p>
        </div>

        <DeckList initialDecks={initialDecks} query={q} />
      </main>
    </div>
  );
}
