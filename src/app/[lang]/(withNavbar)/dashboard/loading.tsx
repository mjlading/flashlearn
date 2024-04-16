import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-7">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-[7rem]" />
      ))}
    </div>
  );
}
