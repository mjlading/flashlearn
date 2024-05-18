"use client";

import { useDictionary } from "@/lib/DictProvider";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function GenerationLanguageSelect({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const dict = useDictionary();

  return (
    <div className="flex items-center gap-4 justify-center">
      <Label>{dict.generateFromCourse.language}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="auto">
              {dict.generateFromCourse.sameAsText}
            </SelectItem>
            <SelectItem value="Norwegian">
              {dict.generateFromCourse.norwegian}
            </SelectItem>
            <SelectItem value="English">
              {dict.generateFromCourse.english}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
