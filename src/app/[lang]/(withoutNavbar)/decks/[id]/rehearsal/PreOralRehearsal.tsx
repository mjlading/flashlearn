import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/DictProvider";
import { Ear, Info, MessageCircle, Mic } from "lucide-react";

export default function PreOralRehearsal({
  onStartClicked,
}: {
  onStartClicked: () => void;
}) {
  const dict = useDictionary();

  const stepCircleClassName = "rounded-full h-6 w-6 bg-slate-500 text-center";

  return (
    <div className="p-7 bg-accent rounded-2xl space-y-4 max-w-[40rem]">
      <h2 className="font-bold text-xl text-center leading-loose">
        {dict.rehearsal.oralRehearsal}
      </h2>

      <ol className="space-y-2 py-2">
        <p className="text-muted-foreground">
          {dict.rehearsal.forEachQuestion}:
        </p>
        <li className="flex">
          <span className={stepCircleClassName}>1</span>
          <Ear className="mx-1" />
          {dict.rehearsal.step1}
        </li>
        <li className="flex">
          <span className={stepCircleClassName}>2</span>
          <Mic className="mx-1" /> {dict.rehearsal.step2}
        </li>
        <li className="flex">
          <span className={stepCircleClassName}>3</span>
          <MessageCircle className="mx-1" /> {dict.rehearsal.step3}
        </li>
      </ol>

      <Button onClick={onStartClicked} className="w-full" size="lg">
        {dict.rehearsal.start}
      </Button>

      <div className="flex gap-2">
        <Info size={18} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {dict.rehearsal.micReminder}
        </p>
      </div>
    </div>
  );
}
