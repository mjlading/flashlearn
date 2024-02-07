"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function BackButton({ ...props }: ButtonProps) {
  const router = useRouter();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => router.back()} {...props}>
            <ArrowLeft size={28} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gå tilbake</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
