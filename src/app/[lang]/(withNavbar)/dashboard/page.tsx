import { getDictionary } from "@/app/dictionaries/dictionaries";

export default async function DashboardPage({params:{lang}}:{params:{lang:any}}) {

  const dict = await getDictionary(lang);


  return (
    <>
      <h1 className="text-3xl font-bold">{dict.dashboard.dashboard}</h1>
    </>
  );
}
