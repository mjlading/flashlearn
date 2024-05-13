"use client";

import { useDictionary } from "@/lib/DictProvider";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function GenerationTypeTabs({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const dict = useDictionary();

  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="grid w-[25rem] grid-cols-3 mx-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value="theoretical" className="w-full">
                {dict.generationType.moreTheoretical}
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {dict.generationType.moreTheoreticalTooltip}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value="mixed" className="w-full">
                {dict.generationType.mixed}
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>{dict.generationType.mixedTooltip}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value="practical" className="w-full">
                {dict.generationType.morePractical}
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {dict.generationType.morePracticalTooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsList>
    </Tabs>
  );
}
