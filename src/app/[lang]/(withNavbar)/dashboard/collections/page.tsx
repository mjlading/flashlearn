import { Locale } from "@/../i18n-config";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import CollectionList from "@/components/CollectionList";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flashlearn - Samlinger",
};

function NewCollectionLink({
  dict,
}: {
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  return (
    <Link
      href={`/${dict.lang}/collections/create`}
      className={buttonVariants()}
    >
      <Plus size={20} className="mr-1" />
      {dict.collections.newCollection}
    </Link>
  );
}

export default async function CollectionsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{dict.collections.collections}</h1>
        <NewCollectionLink dict={dict} />
      </div>
      <CollectionList dict={dict} />
    </div>
  );
}
