import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const LINK_STYLE = cn(
  buttonVariants({
    variant: "link",
    size: "lg",
  }),
  "text-md"
);

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 py-2 px-8 border-b bg-background">
      <nav className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <Link className={LINK_STYLE} href="/">
            Hjem
          </Link>
        </div>
        Profile
      </nav>
    </header>
  );
}
