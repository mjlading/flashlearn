import { api } from "@/app/api/trpc/server";
import SubjectList from "@/components/SubjectList";
import { unstable_noStore } from "next/cache";

export default async function ExplorePage() {
  unstable_noStore();
  const subjects = await api.subject.getSubjects.query();

  return (
    <div className="w-[50rem]">
      <h1 className="text-4xl font-bold mb-4">Utforsk</h1>
      <h3 className="text-muted-foreground mb-12">
        Oppdag noe nytt å lære - la nysgjerrigheten lede veien!
      </h3>
      <div className="grid grid-cols-3 gap-8">
        <SubjectList subjects={subjects} />
      </div>
    </div>
  );
}
