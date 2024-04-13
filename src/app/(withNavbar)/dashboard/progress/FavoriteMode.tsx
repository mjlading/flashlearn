"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SerializedStateDates } from "@/lib/utils";
import type { Rehearsal } from "@prisma/client";
import { Mode } from "@prisma/client";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FavoriteModeInfo {
  favoriteMode: string;
  frequency: number | undefined;
  emoji: string;
  pieData: any;
}

export default function FavoriteMode({
  rehearsals,
}: {
  rehearsals: SerializedStateDates<Rehearsal, "dateStart">[] | undefined;
}) {
  const [favoriteModeObj, setFavoriteModeObj] = useState<
    FavoriteModeInfo | undefined
  >(undefined);

  useEffect(() => {
    if (rehearsals && rehearsals.length > 0) {
      setFavoriteModeObj(getFavoriteMode());
    }
  }, [rehearsals]);

  function getFavoriteMode(): FavoriteModeInfo | undefined {
    if (!rehearsals || rehearsals.length === 0) return undefined;

    const frequencies = new Map<Mode, number>();

    for (const mode of rehearsals.map((r) => r.mode)) {
      if (!frequencies.has(mode)) {
        frequencies.set(mode, 1);
      } else {
        frequencies.set(mode, frequencies.get(mode)! + 1);
      }
    }

    let maxMode: Mode = Mode.VISUAL;
    let maxCount = 0;
    frequencies.forEach((count, mode) => {
      if (count > maxCount) {
        maxCount = count;
        maxMode = mode;
      }
    });

    const pieData = {
      labels: ["Visuell", "Skriftlig", "Muntlig"],
      datasets: [
        {
          label: "# av Øvinger",
          data: [
            frequencies.get(Mode.VISUAL),
            frequencies.get(Mode.WRITE),
            frequencies.get(Mode.ORAL),
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    };

    const modeToNorwegianMap: { [key in Mode]: string } = {
      VISUAL: "Visuell",
      WRITE: "Skriftlig",
      ORAL: "Muntlig",
    };

    const modeToEmojiMap: { [key in Mode]: string } = {
      VISUAL: "👀",
      WRITE: "✏️",
      ORAL: "👂",
    };

    const favoriteMode = modeToNorwegianMap[maxMode];
    const emoji = modeToEmojiMap[maxMode];

    return {
      favoriteMode,
      frequency: frequencies.get(maxMode),
      emoji,
      pieData,
    };
  }

  return (
    <section className="col-span-1 bg-blue-100 dark:bg-blue-900/50 p-4 rounded-2xl">
      <h2 className="font-semibold text-xl leading-loose">Favorittmodus</h2>
      {favoriteModeObj ? (
        <div>
          <span>{favoriteModeObj.favoriteMode}</span>
          <span>{favoriteModeObj.emoji}</span>
          <span>{favoriteModeObj.frequency} øvinger</span>
          <Pie data={favoriteModeObj.pieData} />
        </div>
      ) : (
        <Skeleton />
      )}
    </section>
  );
}
