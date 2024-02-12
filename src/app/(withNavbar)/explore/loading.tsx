import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-[50rem]">
      <Skeleton className="h-[4rem] w-[25rem] mb-12" />
      <div className="grid grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-[7rem]" />
        ))}
      </div>
    </div>
  );
}
