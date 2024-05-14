import { api } from "@/app/api/trpc/server";
import VisualRehearsal from "./VisualRehearsal";
import WriteRehearsal from "./WriteRehearsal";
import OralRehearsal from "./OralRehearsal";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
  const session = await auth();
  if (!session?.user) {
    console.log("Not logged in, redirecting");
    redirect("/api/auth/signin");
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
    return (
      <OralRehearsal
        flashcards={deck.flashcards}
        creatorUserId={deck.userId}
        deckId={deck.id}
      />
    );
  }
}
