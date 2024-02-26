import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ProviderButton from "./ProviderButton";
import GithubIcon from "@/../public/images/github-icon.svg";
import GoogleIcon from "@/../public/images/googe-icon.svg";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-4">
      <main>
        <Card className="p-4 max-w-[28rem] rounded-2xl border-none">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">Logg inn</CardTitle>
            <CardDescription>
              Velg en tredjeparts autentisering for rask og sikker innlogging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 mt-4">
            <ProviderButton provider="github" logo={GithubIcon} />
            <ProviderButton provider="google" logo={GoogleIcon} />
          </CardContent>
        </Card>
      </main>
      <footer className="flex justify-end">
        <Link
          href="/privacy"
          target="_blank"
          className={cn(buttonVariants({ variant: "link" }), "text-xs")}
        >
          <span>Personvern</span>
        </Link>
        <Link
          href="/terms"
          target="_blank"
          className={cn(buttonVariants({ variant: "link" }), "text-xs")}
        >
          <span>Vilkår</span>
        </Link>
      </footer>
    </div>
  );
}
