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
          className={`hover:bg-transparent hover:scale-110 transition-transform ${
            value >= index + 1 ? "text-yellow-500" : "text-gray-300"
          } hover:text-yellow-600`}
        >
          <Star fill="currentColor" strokeWidth={0} />
        </Button>
      ))}
    </div>
  );
}
