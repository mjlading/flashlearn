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
import { useDictionary } from "@/lib/DictProvider";
import { HelpCircle } from "lucide-react";

export default function HelpButton() {
  const dict = useDictionary();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent"
                >
                  <HelpCircle />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{dict.rehearsal.help}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dict.rehearsal.help}</DialogTitle>
          <DialogDescription>
            {dict.rehearsal.helpDescription}
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandList>
            <CommandGroup heading="Snarveier">
              <CommandItem>
                <span>{dict.rehearsal.turnCard}</span>
                <CommandShortcut>
                  {dict.rehearsal.turnCardShortcut}
                </CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>{dict.rehearsal.nextCard}</span>
                <CommandShortcut>
                  {dict.rehearsal.nextCardShortcut}
                </CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>{dict.rehearsal.previousCard}</span>
                <CommandShortcut>
                  {dict.rehearsal.previousCardShortcut}
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
