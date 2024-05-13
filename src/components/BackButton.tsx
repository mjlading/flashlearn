"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useDictionary } from "@/lib/DictProvider";

interface BackButtonProps extends ButtonProps {
  tooltipText?: string;
}

export default function BackButton({ tooltipText, ...props }: BackButtonProps) {
  const dict = useDictionary();

  const router = useRouter();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => router.back()}
            {...props}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText || dict.backButton.goBack}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
