import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import DropDownMenuItemSignOut from "./DropDownMenuItemSignOut";
import SignInButton from "./SignInButton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropDownMenuItemThemeToggle } from "./DropDownMenuItemThemeToggle";
import SearchInput from "./SearchInput";

function ProfileDropdownMenu({ user }: { user: User }) {
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image ?? ""} alt="profil" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-8">
        <DropdownMenuLabel className="truncate mb-[-5px]">
          {user.name}
        </DropdownMenuLabel>
        <span className="ml-2 text-muted-foreground text-sm truncate">
          {user.email}
        </span>
        <DropdownMenuSeparator className="mt-2" />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashbord</span>
            </DropdownMenuItem>
          </Link>
          <DropDownMenuItemThemeToggle />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropDownMenuItemSignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function ProfileButton() {
  const session = await auth();
  return (
    <>
      {session?.user ? (
        <ProfileDropdownMenu user={session.user} />
      ) : (
        <SignInButton />
      )}
    </>
  );
}

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
        <div className="flex items-center">
          <Link className={LINK_STYLE} href="/">
            Flashlearn
          </Link>
          <Link className={LINK_STYLE} href="/explore">
            Utforsk
          </Link>
          <SearchInput />
        </div>
        <ProfileButton />
      </nav>
    </header>
  );
}
