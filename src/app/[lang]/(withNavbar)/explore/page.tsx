import SubjectList from "@/components/SubjectList";

export default async function ExplorePage() {
  return (
    <div className="max-w-full lg:w-[50rem]">
      <h1 className="text-4xl font-bold mb-4">Utforsk</h1>
      <h3 className="text-muted-foreground mb-12">
        Oppdag noe nytt å lære - la nysgjerrigheten lede veien!
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <SubjectList />
      </div>
    </div>
  );
}
