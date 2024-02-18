import { File } from "lucide-react";
import { Button } from "./ui/button";
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import React, { useState } from "react";

export default function GenerateFromFile() {
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  }

  function handleGenerateClicked() {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const text = e.target.result;

      console.log(text);
    };

    reader.readAsText(file);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <File size={18} className="mr-2" />
          Fil
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generer fra fil</DialogTitle>
          <DialogDescription>
            Last opp en fil (.txt eller .pdf), så genereres studiekort etter
            den.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="file">Fil</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept="text/plain, application/pdf"
            />
          </div>

          {file && (
            <Button
              size="lg"
              className="w-full"
              disabled={!file}
              onClick={handleGenerateClicked}
            >
              Generer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
