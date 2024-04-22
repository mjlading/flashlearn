import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { dictType } from "@/app/dictionaries/dictionariesClientSide";
import { useDictionary } from "@/lib/DictProvider";

export default function StarRating({ stars }: { stars: number | null }) {
  
  const dict = useDictionary();
  return (
    <>
      {stars ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex w-fit gap-2 items-center text-muted-foreground text-sm">
                <Star size={18} />
                <p>{stars.toFixed(1)}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{dict.starRating.avgStars}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex w-fit gap-2 items-center text-muted-foreground text-sm">
          <Star size={18} />
          <p>{dict.starRating.noRatings}</p>
        </div>
      )}
    </>
  );
}
