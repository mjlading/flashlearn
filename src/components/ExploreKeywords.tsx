import { api } from "@/app/api/trpc/server";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getDictionary } from "@/app/dictionaries/dictionaries";

export default async function ExploreKeywords({
  subject,
  activeKeyword,
  dict,
}: {
  subject: string;
  activeKeyword?: string;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const keywords = await api.subject.getKeywordsInSubject.query({
    subject: subject,
    n: 10,
  });

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {keywords.map(({ tag }) => (
        <Link
          key={tag}
          href={`/${dict.lang}/explore/${subject}?keyword=${tag}`}
          className={buttonVariants({
            variant: activeKeyword === tag ? "default" : "secondary",
            className: "tracking-wide rounded-xl",
          })}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
