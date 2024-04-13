"use client";

import { api } from "@/app/api/trpc/client";
import FavoriteMode from "./FavoriteMode";
import SubjectWordCloud from "./SubjectWordCloud";

export default function ProgressPage() {
  const rehearsals = api.rehearsal.getUserRehearsals.useQuery({
    includeSubjects: true,
  });

  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Fremgang</h1>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 grid-rows-2 gap-8">
        {/* Favorite subjects */}
        <SubjectWordCloud
          subjects={rehearsals.data?.flatMap((rehearsal) =>
            rehearsal.deckRehearsals.map((dr) => dr.deck.subjectName)
          )}
        />
        {/* Favorite mode */}
        <FavoriteMode rehearsals={rehearsals.data} />
      </div>
    </div>
  );
}
