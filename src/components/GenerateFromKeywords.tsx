"use client";

import { CornerDownLeft, Tag, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function GenerateFromKeywords() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  function handleAddBadge() {
    if (inputValue.trim() !== "" && !keywords.includes(inputValue)) {
      setKeywords((oldBadges) => [...oldBadges, inputValue]);
      setInputValue("");
    }
  }

  function handleRemoveBadge(badgeToRemove: string) {
    setKeywords(keywords.filter((badge) => badge !== badgeToRemove));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleAddBadge();
    }
  }

  function handleGenerateClicked() {
    alert("todo");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Tag size={18} className="mr-2" />
          Stikkord
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generer fra stikkord</DialogTitle>
          <DialogDescription>
            Skriv inn en liste med stikkord, så genereres studiekort etter den.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex gap-2">
            <Input
              type="text"
              autoFocus
              placeholder="Skriv inn stikkord"
              value={inputValue}
              maxLength={40}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddBadge}>
              Legg til <CornerDownLeft size={18} className="ml-2" />
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {keywords.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-sm">
                {badge}
                <X
                  size={16}
                  onClick={() => handleRemoveBadge(badge)}
                  className="ml-1"
                />
              </Badge>
            ))}
          </div>
        </div>
        <Button
          size="lg"
          className="w-full mt-2"
          disabled={keywords.length < 1}
          onClick={handleGenerateClicked}
        >
          Generer studiekort
        </Button>
      </DialogContent>
    </Dialog>
  );
}
