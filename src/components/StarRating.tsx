import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function StarRating({ stars }: { stars: number | null }) {
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
              <p>Gjennomsnittlig vurdering</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex w-fit gap-2 items-center text-muted-foreground text-sm">
          <Star size={18} />
          <p>Ingen vurderinger</p>
        </div>
      )}
    </>
  );
}
