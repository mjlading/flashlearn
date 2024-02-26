import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function SignInButton() {
  return (
    <Link href="/api/auth/signin" className={buttonVariants()}>
      Logg inn
    </Link>
  );
}
