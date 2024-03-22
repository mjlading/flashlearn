"use client";

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

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      text: "Dashbord",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      text: "Studiekort",
      href: "/dashboard/decks?category=recent",
      icon: <Layers3 size={20} />,
    },
    {
      text: "Samlinger",
      href: "/dashboard/collections",
      icon: <SquareStack size={20} />,
    },
    {
      text: "Emner",
      href: "/dashboard/courses",
      icon: <GraduationCap size={20} />,
    },
    {
      text: "Fremgang",
      href: "/dashboard/progress",
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <aside className="sticky top-[61px] height-minus-navbar overflow-none border-r min-w-[10rem] lg:min-w-[15rem]">
      <nav className="pt-5 px-3 lg:px-5 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
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
