import { api } from "@/app/api/trpc/server";
import DeckList from "@/components/DeckList";
import { subjectStyles } from "@/components/SubjectList";
import { fetchDecks } from "../../dashboard/decks/actions";

export default async function SubjectPage({
  params,
}: {
  params: {
    subject: string;
  };
}) {
  // const decks = await api.deck.getDecksBySubjectName.query(params.subject);

  const fetchParams = {
    subjectName: params.subject,
  };

  const decks = await fetchDecks(fetchParams);

  // needed for norwegian chars to be decoded
  const subject = decodeURIComponent(params.subject);

  const style = subjectStyles[subject];

  return (
    <div className="w-[50rem]">
      <div className={`flex items-center mb-4 gap-2`}>
        <div className={`rounded-full p-1 ${style.color}`}>{style.icon}</div>
        <h1 className="text-4xl font-bold">{subject}</h1>
      </div>
      <h3 className="text-muted-foreground mb-12">
        Trykk på et stikkord for å se mere spesifikke sett
      </h3>
      <DeckList initialDecks={decks} fetchParams={fetchParams} />
    </div>
  );
}
