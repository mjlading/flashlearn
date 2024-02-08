import { api } from "@/app/api/trpc/server";

export default async function RehearsalPage({
  params,
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: any;
}) {
  const mode = searchParams.mode;
  const deck = await api.deck.getDeckById.query({
    id: params.id,
    includeFlashcards: true,
  });

  return (
    <div>
      <h1>Øving side</h1>
      <h2>Modus: {JSON.stringify(mode)}</h2>
      <h2>Sett:</h2>
      <pre>{JSON.stringify(deck, null, 2)}</pre>
    </div>
  );
}
