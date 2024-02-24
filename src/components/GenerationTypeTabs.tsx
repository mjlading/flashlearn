"use client";

import { Label } from "./ui/label";
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
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="grid w-[25rem] grid-cols-3 mx-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value="theoretical" className="w-full">
                Mer teoretisk
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Genererer studiekort med definisjoner og teoretiske spørsmål.
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value="mixed" className="w-full">
                Blanding
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Inneholder både teoretiske definisjoner og praktiske spørsmål.
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value="practical" className="w-full">
                Mer praktisk
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fokuserer på praktiske oppgaver og direkte anvendelse.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsList>
    </Tabs>
  );
}
