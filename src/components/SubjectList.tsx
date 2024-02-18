import { subjectNameMap, subjectStyles } from "@/lib/subject";
import { Subject } from "@prisma/client";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SubjectList({ subjects }: { subjects: Subject[] }) {
  return (
    <>
      {subjects.map((subject) => {
        const style = subjectStyles[subject.name] || {
          // Fallback style
          color: "bg-gray-200",
          icon: GraduationCap,
        };
        const norwegianSubjectName = subjectNameMap[subject.name];

        return (
          <div
            key={subject.name}
            className={`${style.color} border rounded-2xl`}
          >
            <Link
              href={`/explore/${subject.name}`}
              className="flex flex-col items-center justify-center gap-5 p-7"
            >
              {React.createElement(style.icon, { size: 32 })}
              <h3 className="text-xl font-semibold">{norwegianSubjectName}</h3>
            </Link>
          </div>
        );
      })}
    </>
  );
}
