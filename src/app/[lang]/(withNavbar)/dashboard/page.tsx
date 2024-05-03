import { getDictionary } from "@/app/dictionaries/dictionaries";
import { Locale } from "@/../i18n-config";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage({params:{lang}}:{params:{lang:Locale}}) {

  const dict = await getDictionary(lang);
  /*const session = await auth();
  
  if (!session?.user) {
    console.log("Not logged in, redirecting");
    redirect("/api/auth/signin");
  }*/

  return (
    <>
      <h1 className="text-3xl font-bold">{dict.dashboard.dashboard}</h1>
    </>
  );
}
