import { getDictionary } from "@/app/dictionaries/dictionaries"

import { Locale } from "@/../i18n-config";

export default async function CoursesPage({
  params:{lang}}:{params:{lang:Locale}}) {
  const dict = await getDictionary(lang);
  return (
    <>
      <h1 className="text-3xl font-bold">{dict.courses.courses}</h1>
    </>
  );
}
