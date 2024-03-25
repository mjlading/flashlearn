"use client";

import { api } from "@/app/api/trpc/client";
import { Plus, SquareStack } from "lucide-react";
import Link from "next/link";
import CollectionCard from "./CollectionCard";
import { buttonVariants } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

function CollectionListSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-[140px]" />
      ))}
    </div>
  );
}

function NoCollections() {
  return (
    <div className="h-full text-center flex flex-col items-center justify-center gap-4">
      <h2 className="font-semibold text-lg">Du har ingen samlinger</h2>
      <p className="text-muted-foreground">
        Lag en samling for å organisere og øve flere sett sammen
      </p>
      <Link
        href="/collections/create"
        className={buttonVariants({
          size: "lg",
          className: "mt-8",
        })}
      >
        <Plus size={20} className="mr-1" />
        Ny samling
      </Link>

      <div className="mt-8">
        <SquareStack size={80} opacity={0.2} />
      </div>
    </div>
  );
}

export default function CollectionList() {
  const collections = api.collection.getUserCollections.useQuery();

  if (collections.isLoading) {
    return <CollectionListSkeleton />;
  }

  if (collections.data?.length === 0) {
    return <NoCollections />;
  }

  return (
    <div className="space-y-3 pb-7">
      {collections.data?.map((collection) => (
        <div key={collection.id}>
          <CollectionCard collection={collection} />
        </div>
      ))}
    </div>
  );
}
