import { Skeleton } from "./ui/skeleton";

export default function DeckListSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[6rem]" />
      ))}
    </div>
  );
}
