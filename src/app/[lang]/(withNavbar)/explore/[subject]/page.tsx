import { api } from "@/app/api/trpc/server";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import DeckList from "@/components/DeckList";
import { subjectNameMap, subjectStyles } from "@/lib/subject";
import React, { Suspense } from "react";
import { Locale } from "@/../i18n-config";
import ExploreKeywords from "@/components/ExploreKeywords";

export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: {
    subject: string;
    lang: Locale;
  };
  searchParams: {
    keyword: string;
  };
}) {
  const dict = await getDictionary(params.lang);
  const subject = params.subject;

  const norwegianSubjectName = subjectNameMap[subject];
  const style = subjectStyles[subject];

  const initialDecks = (
    await api.deck.infiniteDecks.query({
      limit: 10,
      subject: subject,
      keyword: searchParams.keyword,
    })
  ).decks;

  return (
    <>
      <div className={`flex items-center mb-4 gap-2`}>
        <div className={`rounded-full p-1 ${style.color}`}>
          {React.createElement(style.icon, { size: 32 })}
        </div>
        <h1 className="text-4xl font-bold">{norwegianSubjectName}</h1>
      </div>
      <h3 className="text-muted-foreground mb-12">
        Trykk på et stikkord for å se mere spesifikke sett
      </h3>
      <ExploreKeywords subject={subject} />
      <DeckList dict={dict} initialDecks={initialDecks} subject={subject} />
    </>
  );
}
