"use client";

import useLocale from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Layers3,
  LayoutDashboard,
  SquareStack,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/lib/DictProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const dict = useDictionary();
  const links = [
    {
      text: dict.sidebar.dashboard,
      href: `/${locale}/dashboard`,
      icon: <LayoutDashboard size={20} />,
    },
    {
      text: dict.sidebar.flashcards,
      href: `/${locale}/dashboard/decks`,
      icon: <Layers3 size={20} />,
      query: "?category=recent",
    },
    {
      text: dict.sidebar.collections,
      href: `/${locale}/dashboard/collections`,
      icon: <SquareStack size={20} />,
    },
    {
      text: dict.sidebar.courses,
      href: `/${locale}/dashboard/courses`,
      icon: <GraduationCap size={20} />,
    },
    {
      text: dict.sidebar.progress,
      href: `/${locale}/dashboard/progress`,
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <aside className="sticky top-[61px] height-minus-navbar overflow-none border-r min-w-[10rem] lg:min-w-[15rem]">
      <nav className="pt-5 px-3 lg:px-5 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href + (link.query ? link.query : "")}
            className={cn(
              pathname == link.href ? "bg-accent" : "opacity-80",
              "rounded-lg px-3 py-1.5 flex font-medium gap-4 items-center text-lg hover:bg-accent transition"
            )}
            style={pathname == link.href ? { fontWeight: 600 } : {}}
          >
            {link.icon}
            <span className="text-[0.93rem]">{link.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
