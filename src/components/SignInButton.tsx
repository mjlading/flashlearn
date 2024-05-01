import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getDictionary } from "@/app/dictionaries/dictionaries";

export default function SignInButton(
  {dict}
  :{dict:Awaited<ReturnType<typeof getDictionary>>}) {
  return (
    <Link href="/api/auth/signin" className={buttonVariants()}>
      Logg inn
    </Link>
  );
}
