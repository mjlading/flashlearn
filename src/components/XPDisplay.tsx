"use client";

import { api } from "@/app/api/trpc/client";
import { Brain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useDictionary } from "@/lib/DictProvider";

export default function XPDisplay() {
  const dict = useDictionary();
  const xp = api.user.getXP.useQuery();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-orange-400 font-bold">
            <Brain size={22} className="fill-orange-100" />
            <span className="cursor-default">{xp.data}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>{dict.xpDisplay.knowledgePoints}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
