import { Layers3 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function NumFlashcards({
  numFlashcards,
}: {
  numFlashcards: number;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex gap-2 items-center text-muted-foreground text-sm">
            <Layers3 size={18} />
            {numFlashcards}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Antall studiekort</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
