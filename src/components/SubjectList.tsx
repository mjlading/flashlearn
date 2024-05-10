import { api } from "@/app/api/trpc/server";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import { subjectNameMap, subjectStyles } from "@/lib/subject";
import { GraduationCap } from "lucide-react";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import React from "react";

export default async function SubjectList({
  dict,
}: {
  dict: Awaited<ReturnType<typeof getDictionary>>; // fancy unwrap
}) {
  unstable_noStore();
  const subjects = await api.subject.getSubjects.query();

  return (
    <>
      {subjects.map((subject) => {
        const style = subjectStyles[subject.name] || {
          // Fallback style
          color: "bg-gray-200",
          icon: GraduationCap,
        };
        const norwegianSubjectName = subjectNameMap[subject.name];

        const subjectName =
          dict.lang === "no" ? norwegianSubjectName : subject.name;

        return (
          <div
            key={subject.name}
            className={`${style.color} border rounded-2xl bg-opacity-80`}
          >
            <Link
              href={`/${dict.lang}/explore/${subject.name}`}
              className="flex flex-col items-center justify-center gap-5 p-7"
            >
              {React.createElement(style.icon, { size: 32 })}
              <h3 className="text-xl font-semibold">{subjectName}</h3>
            </Link>
          </div>
        );
      })}
    </>
  );
}
