import { api } from "@/app/api/trpc/server";
import BackButton from "@/components/BackButton";
import React from "react";

export default async function RehearsalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const deck = await api.deck.getDeckById.query({ id: params.id });

  return (
    <div className="h-screen">
      <header className="h-[60px] flex gap-4 items-center px-4">
        <BackButton variant="ghost" />
        <h2>{deck?.name}</h2>
      </header>
      <div className="flex items-center justify-center height-minus-navbar">
        <main>{children}</main>
      </div>
    </div>
  );
}
