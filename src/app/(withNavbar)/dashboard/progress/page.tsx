"use client";

import { api } from "@/app/api/trpc/client";
import FavoriteMode from "./FavoriteMode";
import SubjectWordCloud from "./SubjectWordCloud";
import StreakLineChart from "./StreakLineChart";

export default function ProgressPage() {
  const rehearsals = api.rehearsal.getUserRehearsals.useQuery({
    includeSubjects: true,
  });

  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Fremgang</h1>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 grid-rows-2 gap-8 pb-7">
        <StreakLineChart rehearsals={rehearsals.data} />

        <div className="col-span-1 row-span-2 bg-yellow-100 dark:bg-yellow-300/30 rounded-2xl p-4">
          <h2 className="font-semibold text-xl leading-loose">Toppliste</h2>
        </div>

        <SubjectWordCloud
          subjects={rehearsals.data?.flatMap((rehearsal) =>
            rehearsal.deckRehearsals.map((dr) => dr.deck.subjectName)
          )}
        />

        <FavoriteMode rehearsals={rehearsals.data} />
      </div>
    </div>
  );
}
