"use client";

import { useSearchParams } from "next/navigation";

export default function RehearsalPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div>
      <h1>Øving side</h1>
      <h2>Modus: {mode}</h2>
      <h2>Sett id:</h2>
      <pre>{JSON.stringify(params.id, null, 2)}</pre>
    </div>
  );
}
