import DeckList from "@/components/DeckList";
import NewDeckButton from "@/components/NewDeckButton";
import CategoryTabs from "./CategoryTabs";
import { Metadata } from "next";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import { Locale } from "@/../i18n-config";

export const metadata: Metadata = {
  title: "Flashlearn - Studiekort",
};

export default async function DecksPage({
  searchParams,
  params:{lang}
}: {
  searchParams: {
    category: "recent" | "created" | "bookmarked";
  };
  params:{lang:Locale}
}) {
  const dict = await getDictionary(lang);
  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{dict.decks.studyCards}</h1>
        <NewDeckButton dict={dict}/>
      </div>
      <CategoryTabs initialCategory={searchParams.category} dict={dict}/>
      <DeckList category={searchParams.category} dict={dict}/>
    </div>
  );
}
