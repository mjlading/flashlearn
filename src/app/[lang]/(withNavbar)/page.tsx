import { getDictionary } from "../../dictionaries/dictionaries";
import { AuroraBackground } from "@/components/AuroraBackground";
import HomePageContent from "@/components/HomePageContent";
import { Locale } from "@/../i18n-config";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);
  return (
    <AuroraBackground className="h-[100vh] absolute top-0 w-full">
      <HomePageContent dict={dict} />
    </AuroraBackground>
  );
}
