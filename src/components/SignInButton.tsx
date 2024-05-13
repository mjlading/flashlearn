import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getDictionary } from "@/app/dictionaries/dictionaries";

export default function SignInLink({
  dict,
}: {
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  return (
    <Link href={`/${dict.lang}/auth/signIn`} className={buttonVariants()}>
      {dict.signInButton.signIn}
    </Link>
  );
}
