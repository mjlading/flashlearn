import { api } from "@/app/api/trpc/server";
import VisualRehearsal from "./VisualRehearsal";

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

  if (mode === "visual") {
    return <VisualRehearsal flashcards={deck.flashcards} />;
  }

  if (mode === "write") {
    return <h1>Write</h1>;
  }

  if (mode === "oral") {
    return <h1>Oral</h1>;
  }
}
