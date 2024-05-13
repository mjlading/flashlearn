import { api } from "@/app/api/trpc/server";
import BackButton from "@/components/BackButton";
import React from "react";
import HelpButton from "@/components/HelpButton";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import { Locale } from "../../../../../../../i18n-config";

export default async function RehearsalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
    locale: Locale;
  };
}) {
  const dict = await getDictionary(params.locale);

  const collection = await api.collection.getCollectionById.query({
    id: params.id,
  });

  return (
    <div className="h-screen">
      <header className="h-[60px] flex items-center justify-between px-3">
        <div className="flex gap-3 items-center">
          <BackButton tooltipText={dict.rehearsal.leaveRehearsal} />
          <h2 className="text-muted-foreground font-semibold">
            {collection?.name}
          </h2>
        </div>
        <HelpButton />
      </header>
      <div className="flex items-center justify-center height-minus-navbar">
        {children}
      </div>
    </div>
  );
}
