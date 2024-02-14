import { FetchDecksParams } from "@/app/(withNavbar)/dashboard/decks/actions";
import { Bookmark, History, Layers3 } from "lucide-react";
import React from "react";
import NewDeckButton from "./NewDeckButton";

export default function NoDecks({
  fetchParams,
}: {
  fetchParams: FetchDecksParams;
}) {
  if (fetchParams.subjectName) {
    return <h2>Ingen sett funnet 🤷‍♂️</h2>;
  }

  if (fetchParams.category) {
    let title = "";
    let description = "";
    let icon = null;
    if (fetchParams.category === "recent") {
      title = "Du har ingen nylige sett";
      description = "Dine nylige øvde sett vil vises her";
      icon = History;
    } else if (fetchParams.category === "created") {
      title = "Du har ingen studiekort 😔";
      description = "Lag et sett for å komme i gang med læringen din!";
      icon = Layers3;
    } else {
      // category = 'bookmarked'
      title = "Du har ingen bokmerkede sett";
      description = "Bokmerkede sett vil vises her";
      icon = Bookmark;
    }

    return (
      <div className="h-full text-center flex flex-col items-center justify-center gap-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        {fetchParams.category === "created" && (
          <NewDeckButton size="lg" className="mt-8" />
        )}
        <div className="mt-8">
          {React.createElement(icon, { size: 80, opacity: 0.2 })}
        </div>
      </div>
    );
  }
}
