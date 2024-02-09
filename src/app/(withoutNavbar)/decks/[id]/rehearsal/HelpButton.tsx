"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function HelpButton() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const shortcuts = [
    { name: "Snu kort", shortcut: "⌘Space | trykk på kortet" },
    { name: "Neste kort", shortcut: "⌘→" },
    { name: "Forrige kort", shortcut: "⌘←" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full px-[2px]" variant="ghost">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full p-1">
                  <HelpCircle size={28} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tips</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Øvingstips</DialogTitle>
          <DialogDescription>
            Her er noen nyttige snarveider for å navigere i øvingen.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandList>
            <CommandGroup heading="Snarveier">
              <CommandItem>
                <span>Snu kort</span>
                <CommandShortcut>Space | trykk på kortet</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Neste kort</span>
                <CommandShortcut>pil høyre →</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Forrige kort</span>
                <CommandShortcut>pil venstre ←</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}