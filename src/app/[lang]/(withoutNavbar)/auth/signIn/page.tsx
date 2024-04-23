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
import { getDictionary } from '@/app/dictionaries/dictionaries'
import { Locale } from "@/../i18n-config";

export default async function SignInPage({params:{lang}}:{params:{lang:Locale}}) {
  const dict = await getDictionary(lang);
  return (
    <div className="flex flex-col gap-4">
      <main>
        <Card className="p-4 max-w-[28rem] rounded-2xl border-none">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">{dict.signInPage.signIn}</CardTitle>
            <CardDescription>
            {dict.signInPage.thirdPartyLogin}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 mt-4">
            <ProviderButton provider="github" logo={GithubIcon} dict={dict} />
            <ProviderButton provider="google" logo={GoogleIcon} dict={dict} />
          </CardContent>
        </Card>
      </main>
      <footer className="flex justify-end">
        <Link
          href="/privacy"
          target="_blank"
          className={cn(buttonVariants({ variant: "link" }), "text-xs")}
        >
          <span>{dict.signInPage.privacy}</span>
        </Link>
        <Link
          href="/terms"
          target="_blank"
          className={cn(buttonVariants({ variant: "link" }), "text-xs")}
        >
          <span>{dict.signInPage.termsAndConditions}</span>
        </Link>
      </footer>
    </div>
  );
}
