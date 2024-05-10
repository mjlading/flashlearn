import { Locale } from "@/../i18n-config";
import { getDictionary } from "@/app/dictionaries/dictionaries";

export default async function TermsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang)
  return (
    <>
      <h1>{dict.legal.ToS1}</h1>

      <h1>{dict.legal.ToS2}</h1>

      <h1>{dict.legal.ToS3}</h1>

      <h1>{dict.legal.ToS4}</h1>

      <h1>{dict.legal.ToS5}</h1>
    </>
  );
}
