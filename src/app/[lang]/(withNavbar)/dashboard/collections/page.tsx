import CollectionList from "@/components/CollectionList";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flashlearn - Samlinger",
};

function NewCollectionButton() {
  return (
    <Link href="/collections/create" className={buttonVariants()}>
      <Plus size={20} className="mr-1" />
      Ny samling
    </Link>
  );
}

export default function CollectionsPage() {
  return (
    <div className="flex flex-col space-y-7 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Samlinger</h1>
        <NewCollectionButton />
      </div>
      <CollectionList />
    </div>
  );
}
