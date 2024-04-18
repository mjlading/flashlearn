import { getDictionary } from "@/app/dictionaries/dictionaries"

export default async function CoursesPage({
  params:{lang}}:{params:{lang:any}}) {
  const dict = await getDictionary(lang);
  return (
    <>
      <h1 className="text-3xl font-bold">{dict.courses.courses}</h1>
    </>
  );
}
