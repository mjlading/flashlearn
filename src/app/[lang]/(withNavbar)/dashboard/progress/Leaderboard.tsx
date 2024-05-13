"use client";

import { api } from "@/app/api/trpc/client";
import { Separator } from "@/components/ui/separator";
import { useDictionary } from "@/lib/DictProvider";
import { Brain } from "lucide-react";

export default function Leaderboard() {
  const dict = useDictionary();

  const top10WithUser = api.user.getLeaderboardWithUser.useQuery();

  return (
    <div className="col-span-1 row-span-2 bg-yellow-100 dark:bg-yellow-300/30 rounded-2xl p-4">
      <h2 className="font-semibold text-xl leading-loose mb-2">
        {dict.progress.leaderboard}
      </h2>
      <div className="flex justify-between text-orange-400 mb-1">
        <span className="font-semibold ml-8">{dict.progress.user}</span>
        <Brain className="fill-orange-100" />
      </div>
      <ol className="space-y-2">
        {top10WithUser.data?.top10.map(({ nickname, xp }, index) => (
          <>
            <li key={nickname} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-center font-bold text-white rounded-full h-6 w-6 bg-yellow-400">
                  {index + 1}
                </div>
                <span>{nickname}</span>
              </div>
              <span className="text-orange-400 font-semibold">{xp}</span>
            </li>
            <Separator
              className={`${
                index === top10WithUser.data?.top10.length - 1 && "h-1"
              }`}
            />
          </>
        ))}
        {/* The user's rank */}
        <li className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-center font-bold text-white rounded-full h-6 w-6 bg-yellow-400">
              {top10WithUser.data?.userRank.rank}
            </div>
            <span className="font-semibold">
              {top10WithUser.data?.userRank.nickname}
            </span>
          </div>
          <span className="text-orange-400 font-semibold">
            {top10WithUser.data?.userRank.xp}
          </span>
        </li>
      </ol>
    </div>
  );
}
