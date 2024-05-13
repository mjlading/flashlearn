import { api } from "@/app/api/trpc/server";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import DeckList from "@/components/DeckList";
import SearchInput from "@/components/SearchInput";
import { Metadata } from "next";
import { Locale } from "@/../i18n-config";

export const metadata: Metadata = {
  title: "Flashlearn - Søk Studiekort",
  description:
    "Søk etter studiekort på Flashlearn for å finne nøyaktig det du trenger for å forbedre dine studieferdigheter og kunnskap.",
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: {
    lang: Locale;
  };
  searchParams: {
    q: string;
  };
}) {
  const { q } = searchParams; // The search query
  const dict = await getDictionary(params.lang);
  // Fetch initial results and count on the server in paralell
  const [{ decks }, hits] = await Promise.all([
    api.deck.infiniteDecks.query({
      limit: 10,
      query: q,
    }),
    api.deck.countDecks.query({
      query: q,
    }),
  ]);

  return (
    <div className="sm:px-8 px-4 my-12">
      <main className="w-[50rem] max-w-full mx-auto">
        <SearchInput
          defaultValue={q}
          className="h-14 text-lg pl-9 rounded-lg"
        />
        <div className="my-6 space-y-1">
          <p>
            {dict.search.showingResults} &quot;
            <span className="font-semibold">{q}</span>&quot;
          </p>
          <p>
            {dict.search.hits}:{" "}
            <span className="font-semibold">
              {hits != decks.length ? decks.length : hits}
            </span>
          </p>
        </div>

        <DeckList initialDecks={decks} query={q} />
      </main>
    </div>
  );
}
