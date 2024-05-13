"use client";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/DictProvider";
import { MessageCircleQuestion, Mic, Square } from "lucide-react";

export default function MicInput({
  isRecording,
  stopMicRecording,
}: {
  isRecording: boolean;
  stopMicRecording: () => void;
}) {
  const dict = useDictionary();

  return (
    <div className="flex flex-col items-center gap-8">
      <h2
        className={`font-semibold text-xl ${
          isRecording ? "text-default" : "text-gray-400"
        }`}
      >
        {isRecording ? dict.rehearsal.sayYourAnswer : dict.rehearsal.listen}
      </h2>
      <div
        className={`
          rounded-full p-8 shadow-md
        ${
          isRecording
            ? "bg-blue-400 text-slate-900"
            : "bg-gray-100 text-slate-400"
        }`}
      >
        {!isRecording ? <MessageCircleQuestion size={60} /> : <Mic size={60} />}
      </div>

      {isRecording && (
        <Button
          onClick={() => stopMicRecording()}
          className="rounded-full"
          size="lg"
          variant="outline"
        >
          {dict.rehearsal.stopRecording}
          <Square className="ml-2 fill-destructive" strokeWidth={0} />
        </Button>
      )}
    </div>
  );
}
