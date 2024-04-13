"use client";

import { SerializedStateDates } from "@/lib/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Rehearsal } from "@prisma/client";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StreakLineChart({
  rehearsals,
}: {
  rehearsals: SerializedStateDates<Rehearsal, "dateStart">[] | undefined;
}) {
  const [chartData, setChartData] = useState<undefined | any>(undefined);

  useEffect(() => {
    if (!rehearsals || rehearsals.length === 0) return;

    // Function to get date string 'YYYY-MM-DD' for n days back
    const getDateNDaysBack = (n: number) => {
      const date = new Date();
      date.setDate(date.getDate() - n);
      return date.toISOString().split("T")[0];
    };

    const counts = new Array(7).fill(0);

    // Create a map of date strings to their index in counts array
    const dateToIndexMap: { [key in string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const date = getDateNDaysBack(6 - i);
      dateToIndexMap[date] = i;
    }

    // Count rehearsals per day based on the map
    rehearsals.forEach((rehearsal) => {
      const date = new Date(rehearsal.dateStart).toISOString().split("T")[0];
      if (date in dateToIndexMap) {
        counts[dateToIndexMap[date]]++;
      }
    });

    setChartData(counts);
  }, [rehearsals]);

  const norwegianLabels = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];
  const todayDayIndex = new Date().getDay();
  const labels = new Array(7)
    .fill(null)
    .map((_, i) => {
      const labelIndex = (todayDayIndex - i + 7) % 7;
      return norwegianLabels[labelIndex];
    })
    .reverse();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Øvinger",
        data: chartData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <section className="col-span-2 bg-red-100 dark:bg-red-900/40 p-4 rounded-2xl">
      <h2 className="font-semibold text-xl leading-loose">Streak</h2>
      <Line options={options} data={data} />
    </section>
  );
}
