"use client";

import { api } from "@/app/api/trpc/client";
import FavoriteMode from "./FavoriteMode";
import SubjectWordCloud from "./SubjectWordCloud";
import StreakLineChart from "./StreakLineChart";
import Leaderboard from "./Leaderboard";

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

        <Leaderboard />

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
