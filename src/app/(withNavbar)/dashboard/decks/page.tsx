import AddDeckButton from "@/components/AddDeckButton";
import DeckList from "@/components/DeckList";

export default function DecksPage() {
  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Studiekort</h1>
        <AddDeckButton />
      </div>
      <DeckList />
    </div>
  );
}
