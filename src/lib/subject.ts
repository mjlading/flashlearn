import {
  Atom,
  Binary,
  Dna,
  FlaskConical,
  HandCoins,
  LucideIcon,
  Map,
  MessageCircleQuestion,
  Music,
  Pi,
  ScrollText,
  Sprout,
} from "lucide-react";

interface SubjectStyles {
  [key: string]: { color: string; fillColor: string; icon: LucideIcon };
}

export const subjectStyles: SubjectStyles = {
  Mathematics: { color: "bg-red-400", fillColor: "fill-red-400", icon: Pi },
  Science: { color: "bg-green-400", fillColor: "fill-green-400", icon: Sprout },
  History: {
    color: "bg-blue-400",
    fillColor: "fill-blue-400",
    icon: ScrollText,
  },
  Geography: {
    color: "bg-yellow-400",
    fillColor: "fill-yellow-400",
    icon: Map,
  },
  "Computer-Science": {
    color: "bg-yellow-400",
    fillColor: "fill-yellow-400",
    icon: Binary,
  },
  Music: { color: "bg-lime-400", fillColor: "fill-lime-400", icon: Music },
  Economics: {
    color: "bg-emerald-400",
    fillColor: "fill-emerald-400",
    icon: HandCoins,
  },
  Biology: { color: "bg-green-400", fillColor: "fill-green-400", icon: Dna },
  Physics: { color: "bg-blue-400", fillColor: "fill-blue-400", icon: Atom },
  Chemistry: {
    color: "bg-purple-400",
    fillColor: "fill-purple-400",
    icon: FlaskConical,
  },
  Philosophy: {
    color: "bg-blue-400",
    fillColor: "fill-blue-400",
    icon: MessageCircleQuestion,
  },
};

export const subjectNameMap: { [key: string]: string } = {
  Mathematics: "Matematikk",
  Science: "Naturfag",
  History: "Historie",
  Geography: "Geografi",
  "Computer-Science": "Data",
  Music: "Musikk",
  Economics: "Økonomi",
  Biology: "Biologi",
  Physics: "Fysikk",
  Chemistry: "Kjemi",
  Philosophy: "Filosofi",
};
