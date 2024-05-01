import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Menu, Settings, UserCog } from "lucide-react";
import { User as NextAuthUser } from "next-auth";
import Link from "next/link";
import DropDownMenuItemSignOut from "./DropDownMenuItemSignOut";
import { DropDownMenuItemThemeToggle } from "./DropDownMenuItemThemeToggle";
import SearchInput from "./SearchInput";
import SignInButton from "./SignInButton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import XPDisplay from "./XPDisplay";
import DropDownMenuItemUserSettings from "./DropDownMenuItemUserSettings";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import DialogContentUserSettings from "./DropDownMenuItemUserSettings";
import { dictType } from "@/app/dictionaries/dictionariesClientSide";
import { getDictionary } from "@/app/dictionaries/dictionaries";

interface User extends NextAuthUser {
  nickname?: string;
}

function HamburgerDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ul className="items-center">
          <li>
            <Link className={LINK_STYLE} href="/">
              Flashlearn
            </Link>
          </li>
          <li>
            <Link className={LINK_STYLE} href="/explore">
              Utforsk
            </Link>
          </li>
          <SearchInput />
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileDropdownMenu({ dict, user }: { dict:Awaited<ReturnType<typeof getDictionary>>, user: User }) {
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button data-cy="userDropdown" id="profileDropdownButton" className="rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image ?? ""} alt="profil" />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-8">
          <DropdownMenuLabel data-cy="nameInDropDown" className="truncate mb-[-5px]">
            {user.nickname}
          </DropdownMenuLabel>
          <span data-cy="emailInDropDown" className="ml-2 text-muted-foreground text-sm truncate">
            {user.email}
          </span>
          <DropdownMenuSeparator className="mt-2" />
          <DropdownMenuGroup>
            <Link href={`/${dict.lang}/dashboard`}>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>{dict.userDropDown.dashboard}</span>
              </DropdownMenuItem>
            </Link>
            <DropDownMenuItemThemeToggle />
            <DropdownMenuItem>
              <DialogTrigger className="flex cursor-default items-center">
                <UserCog data-cy="userSettings" className="mr-2 h-4 w-4" />
                <span>{dict.userDropDown.userSettings}</span>
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropDownMenuItemSignOut />
        </DropdownMenuContent>
      </DropdownMenu>
      {/* The dialog that opens when clicking user settings */}
      <DialogContentUserSettings userName={user.name} />
    </Dialog>
  );
}

async function ProfileButton({ dict, user }: { dict:Awaited<ReturnType<typeof getDictionary>>, user: User | undefined }) {
  return <>{user ? <ProfileDropdownMenu dict={dict} user={user} /> : <SignInButton dict={dict}/>}</>;
}

const LINK_STYLE = cn(
  buttonVariants({
    variant: "link",
    size: "lg",
  }),
  "text-md"
);

export default async function Navbar(
  {dict}
  :{dict:Awaited<ReturnType<typeof getDictionary>>}) {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 py-2 px-8 border-b backdrop-blur">
      <nav className="flex items-center justify-between flex-wrap gap-2">
        {/* Hamburger menu for mobile view */}
        <div className="md:hidden">
          <HamburgerDropdownMenu />
        </div>
        <ul className="hidden md:flex items-center">
          <li>
            <Link className={LINK_STYLE} href={`/${dict.lang}`}>
              {dict.home.title}
            </Link>
          </li>
          <li>
            <Link className={LINK_STYLE} href={`/${dict.lang}/explore`}>
              {dict.explore.explore}
            </Link>
          </li>
          <SearchInput />
        </ul>
        <div className="flex items-center gap-8">
          {session?.user && <XPDisplay />}
          <ProfileButton dict={dict} user={session?.user} />
        </div>
      </nav>
    </header>
  );
}
