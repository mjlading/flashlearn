import { api } from "@/app/api/trpc/server";
import VisualRehearsal from "./VisualRehearsal";
import WriteRehearsal from "./WriteRehearsal";

export default async function DeckRehearsalPage({
  params,
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: {
    mode: string;
  };
}) {
  const mode = searchParams.mode;
  const deck = await api.deck.getDeckById.query({
    id: params.id,
    includeFlashcards: true,
  });

  if (mode === "visual") {
    return <VisualRehearsal flashcards={deck.flashcards} />;
  }

  if (mode === "write") {
    return (
      <WriteRehearsal
        flashcards={deck.flashcards}
        creatorUserId={deck.userId}
        deckId={deck.id}
      />
    );
  }

  if (mode === "oral") {
    return <h1>Oral</h1>;
  }
}
