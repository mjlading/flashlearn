"use client";

import { Star } from "lucide-react";
import { Button } from "./ui/button";

export default function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (newValue: number) => void;
}) {
  return (
    <div className="flex justify-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Button
          key={index}
          size="icon"
          variant="ghost"
          onClick={() => onChange(index + 1)}
          className="hover:bg-transparent"
        >
          <Star
            fill={
              value >= index + 1 ? "rgb(234, 179, 8)" : "rgba(229, 231, 235)"
            }
            strokeWidth={0}
          />
        </Button>
      ))}
    </div>
  );
}
