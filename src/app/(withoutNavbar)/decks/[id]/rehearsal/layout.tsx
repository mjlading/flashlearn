import { api } from "@/app/api/trpc/server";
import BackButton from "@/components/BackButton";
import React from "react";
import HelpButton from "./HelpButton";

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
      <header className="h-[60px] flex gap-4 items-center justify-between px-8">
        <BackButton variant="ghost" tooltipText="Forlat øving" />
        <h2 className="text-muted-foreground font-semibold">{deck?.name}</h2>
        <HelpButton />
      </header>
      <div className="flex items-center justify-center height-minus-navbar">
        <main>{children}</main>
      </div>
    </div>
  );
}
