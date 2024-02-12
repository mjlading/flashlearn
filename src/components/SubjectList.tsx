import { Subject } from "@prisma/client";
import {
  Atom,
  Binary,
  Dna,
  FlaskConical,
  GraduationCap,
  HandCoins,
  LucideIcon,
  Map,
  MessageCircleQuestion,
  Music,
  Pi,
  ScrollText,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

interface SubjectStyles {
  [key: string]: { color: string; icon: ReactElement<LucideIcon> };
}

export const subjectStyles: SubjectStyles = {
  Matematikk: { color: "bg-red-400", icon: <Pi size={32} /> },
  Naturfag: { color: "bg-green-400", icon: <Sprout size={32} /> },
  Historie: { color: "bg-blue-400", icon: <ScrollText size={32} /> },
  Geografi: { color: "bg-yellow-400", icon: <Map size={32} /> },
  Data: { color: "bg-yellow-400", icon: <Binary size={32} /> },
  Musikk: { color: "bg-lime-400", icon: <Music size={32} /> },
  Økonomi: { color: "bg-emerald-400", icon: <HandCoins size={32} /> },
  Biologi: { color: "bg-green-400", icon: <Dna size={32} /> },
  Fysikk: { color: "bg-blue-400", icon: <Atom size={32} /> },
  Kjemi: { color: "bg-purple-400", icon: <FlaskConical size={32} /> },
  Filosofi: { color: "bg-blue-400", icon: <MessageCircleQuestion size={32} /> },
};

export default function SubjectList({ subjects }: { subjects: Subject[] }) {
  return (
    <>
      {subjects.map((subject) => {
        const style = subjectStyles[subject.name] || {
          // Fallback style
          color: "bg-gray-200",
          icon: <GraduationCap size={32} />,
        };

        return (
          <div
            key={subject.name}
            className={`${style.color} border rounded-2xl`}
          >
            <Link
              href={`/explore/${subject.name}`}
              className="flex flex-col items-center justify-center gap-5 p-7"
            >
              {style.icon}
              <h3 className="text-xl font-semibold">{subject.name}</h3>
            </Link>
          </div>
        );
      })}
    </>
  );
}
