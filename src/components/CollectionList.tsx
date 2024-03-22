"use client";

import { api } from "@/app/api/trpc/client";
import CollectionCard from "./CollectionCard";
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

export default function CollectionList() {
  const collections = api.collection.getUserCollections.useQuery();

  if (collections.isLoading) {
    return <CollectionListSkeleton />;
  }

  return (
    <div className="space-y-3">
      {collections.data?.map((collection) => (
        <div key={collection.id}>
          <CollectionCard collection={collection} />
        </div>
      ))}
    </div>
  );
}
