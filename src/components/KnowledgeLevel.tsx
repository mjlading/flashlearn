import { cn, percentageToTwBgColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Star } from "lucide-react";

export default function KnowledgeLevel({
  knowledgeLevel,
}: {
  knowledgeLevel: number;
}) {
  const bgColor = percentageToTwBgColor(knowledgeLevel);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center rounded ${
              knowledgeLevel < 100 && "border"
            } ml-4 w-[5rem]`}
          >
            {knowledgeLevel >= 100 && (
              <Star className="fill-yellow-400 stroke-yellow-400" />
            )}
            <div
              style={{ width: `${knowledgeLevel}%` }}
              className={cn(
                bgColor,
                `py-2 rounded-l ${knowledgeLevel >= 100 && "rounded-r"} ${
                  knowledgeLevel >= 100 && "border border-yellow-400"
                }`
              )}
            ></div>
          </div>
        </TooltipTrigger>
        <TooltipContent>Mestring</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
