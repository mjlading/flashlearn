import { Bookmark, History, Layers3 } from "lucide-react";
import React from "react";
import { DeckListProps } from "./DeckList";
import NewDeckButton from "./NewDeckButton";
import { getDictionary } from "@/app/dictionaries/dictionaries";



export default function NoDecks(
   // fancy unwrap 
{dict, subject, category }: DeckListProps) {
  
  if (subject) {
    return <h2>{dict.decks.noDecks.noSets}</h2>;
  }

  if (category) {
    let title = "";
    let description = "";
    let icon = null;
    if (category === "recent") {
      title = dict.decks.noDecks.noRecentSets;
      description = dict.decks.noDecks.noRecentSetsEx;
      icon = History;
    } else if (category === "created") {
      title = dict.decks.noDecks.noCreatedSets;
      description = dict.decks.noDecks.noCreatedSetsEx;
      icon = Layers3;
    } else {
      // category = 'bookmarked'
      title = dict.decks.noDecks.noBookmakedSets;
      description = dict.decks.noDecks.noBookmakedSetsEx;
      icon = Bookmark;
    }

    return (
      <div className="h-full text-center flex flex-col items-center justify-center gap-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        {category === "created" && <NewDeckButton dict={dict} size="lg" className="mt-8" />}
        <div className="mt-8">
          {React.createElement(icon, { size: 80, opacity: 0.2 })}
        </div>
      </div>
    );
  }
}
