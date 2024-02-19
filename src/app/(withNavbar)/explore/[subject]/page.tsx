import DeckList from "@/components/DeckList";
import { subjectNameMap, subjectStyles } from "@/lib/subject";
import React from "react";
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

  const initialDecks = await fetchDecks(fetchParams);

  const subject = params.subject;

  const norwegianSubjectName = subjectNameMap[subject];

  const style = subjectStyles[subject];

  return (
    <div className="max-w-full md:w-[40rem] lg:w-[50rem]">
      <div className={`flex items-center mb-4 gap-2`}>
        <div className={`rounded-full p-1 ${style.color}`}>
          {React.createElement(style.icon, { size: 32 })}
        </div>
        <h1 className="text-4xl font-bold">{norwegianSubjectName}</h1>
      </div>
      <h3 className="text-muted-foreground mb-12">
        Trykk på et stikkord for å se mere spesifikke sett
      </h3>
      <DeckList initialDecks={initialDecks} fetchParams={fetchParams} />
    </div>
  );
}
