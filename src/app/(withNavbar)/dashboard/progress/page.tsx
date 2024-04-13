"use client";

import { api } from "@/app/api/trpc/client";
import FavoriteMode from "./FavoriteMode";

export default function ProgressPage() {
  const rehearsals = api.rehearsal.getUserRehearsals.useQuery();

  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Fremgang</h1>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 grid-rows-2 gap-8">
        {/* Favorite subjects */}
        <section className="col-span-2 bg-yellow-200 p-4 rounded-2xl">
          <h2>Favoritt fagområde</h2>
        </section>
        {/* Favorite mode */}
        <FavoriteMode rehearsals={rehearsals.data} />
      </div>
    </div>
  );
}
