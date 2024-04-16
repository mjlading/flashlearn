import DeckListSkeleton from "@/components/DeckListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-[50rem]">
      <Skeleton className="h-[3rem] w-[14rem] mb-4" />
      <Skeleton className="h-[1rem] w-[22rem] mb-12" />
      <DeckListSkeleton />
    </div>
  );
}
