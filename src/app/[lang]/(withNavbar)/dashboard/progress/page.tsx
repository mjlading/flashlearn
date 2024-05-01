"use client";

import { api } from "@/app/api/trpc/client";
import FavoriteMode from "./FavoriteMode";
import SubjectWordCloud from "./SubjectWordCloud";
import StreakLineChart from "./StreakLineChart";
import Leaderboard from "./Leaderboard";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default function ProgressPage() {
  const rehearsals = api.rehearsal.getUserRehearsals.useQuery({
    includeSubjects: true,
  });
  
  const session = useSession(); // is this a good way to do this?

  if (!session?.data?.user) {
    console.log("Not logged in, redirecting");
    redirect("/api/auth/signin");
  }

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
