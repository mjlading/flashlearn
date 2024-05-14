import VisualRehearsal from "@/app/[lang]/(withoutNavbar)/decks/[id]/rehearsal/VisualRehearsal";
import WriteRehearsal from "@/app/[lang]/(withoutNavbar)/decks/[id]/rehearsal/WriteRehearsal";
import { api } from "@/app/api/trpc/server";
import OralRehearsal from "../../../decks/[id]/rehearsal/OralRehearsal";

export default async function CollectionRehearsalPage({
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
  const collection = await api.collection.getCollectionById.query({
    id: params.id,
    includeDecks: true,
  });
  const allFlashcards = collection.collectionDecks.flatMap(
    (c) => c.deck.flashcards
  );

  if (mode === "visual") {
    return <VisualRehearsal flashcards={allFlashcards} />;
  }

  if (mode === "write") {
    return (
      <WriteRehearsal
        flashcards={allFlashcards}
        creatorUserId={collection.collectionDecks[0].deck.userId}
        deckId={collection.collectionDecks[0].deck.id}
      />
    );
  }

  if (mode === "oral") {
    return <OralRehearsal flashcards={allFlashcards} />;
  }
}
