import { getDictionary } from "@/app/dictionaries/dictionaries";
import CollectionList from "@/components/CollectionList";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Locale } from "@/../i18n-config";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Flashlearn - Samlinger",
};

function NewCollectionButton({
  dict
}:{
  dict:Awaited<ReturnType<typeof getDictionary>>
}) {

  return (
    <Link href="/collections/create" className={buttonVariants()}>
      <Plus size={20} className="mr-1" />
      {dict.collections.newCollection}
    </Link>
  );
}

export default async function CollectionsPage({params:{lang}}:{params:{lang:Locale}}) {
  
  const session = await auth();
  
  if (!session?.user) {
    console.log("Not logged in, redirecting");
    redirect("/api/auth/signin");
  }
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{dict.collections.collections}</h1>
        <NewCollectionButton dict={dict}/>
      </div>
      <CollectionList dict={dict} />
    </div>
  );
}
