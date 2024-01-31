"use client";

import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Layers3,
  LayoutDashboard,
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
    { text: "Decks", href: "/dashboard/decks", icon: <Layers3 size={20} /> },
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
    <aside className="border-r w-[15rem]">
      <nav className="p-7 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              pathname == link.href ? "bg-accent text-accent-foreground" : "",
              "rounded-md px-3 py-2 flex gap-2 items-center hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {link.icon}
            <span className="font-medium text-sm">{link.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
