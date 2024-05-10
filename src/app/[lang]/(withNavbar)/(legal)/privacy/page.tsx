import { getDictionary } from "@/app/dictionaries/dictionaries";
import { Locale } from "@/../i18n-config";

export default async function PrivacyPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);
  return (
    <>
      <h1>{dict.legal.privacyPolicy1}</h1>

      <h1>{dict.legal.privacyPolicy2}</h1>

      <h1>{dict.legal.privacyPolicy3}</h1>

      <h1>{dict.legal.privacyPolicy4}</h1>
    </>
  );
}
