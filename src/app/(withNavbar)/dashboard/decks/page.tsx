import DeckList from "@/components/DeckList";
import NewDeckButton from "@/components/NewDeckButton";
import CategoryTabs from "./CategoryTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flashlearn - Studiekort",
};

export default async function DecksPage({
  searchParams,
}: {
  searchParams: {
    category: "recent" | "created" | "bookmarked";
  };
}) {
  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Studiekort</h1>
        <NewDeckButton />
      </div>
      <CategoryTabs initialCategory={searchParams.category} />
      <DeckList category={searchParams.category} />
    </div>
  );
}
