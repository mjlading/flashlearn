import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Ear, Info, MessageCircle, Mic } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function PreOralRehearsal({
  handsfreeMode,
  setHandsfreeMode,
  onStartClicked,
}: {
  handsfreeMode: boolean;
  setHandsfreeMode: Dispatch<SetStateAction<boolean>>;
  onStartClicked: () => void;
}) {
  const stepCircleClassName = "rounded-full h-6 w-6 bg-slate-500 text-center";

  return (
    <div className="p-7 bg-slate-800/20 rounded-2xl space-y-4 max-w-[40rem]">
      <h2 className="font-bold text-xl text-center leading-loose">
        Muntlig øving
      </h2>

      <ol className="space-y-2 py-2">
        <p className="text-muted-foreground">For hvert spørsmål:</p>
        <li className="flex">
          <span className={stepCircleClassName}>1</span>
          <Ear className="mx-1" />
          Hør ferdig spørsmålet som stilles
        </li>
        <li className="flex">
          <span className={stepCircleClassName}>2</span>
          <Mic className="mx-1" /> Si svaret ditt
        </li>
        <li className="flex">
          <span className={stepCircleClassName}>3</span>
          <MessageCircle className="mx-1" /> Hør tilbakemeldingen
        </li>
      </ol>

      <div className="flex items-center space-x-2 justify-center pb-4">
        <Switch
          checked={handsfreeMode}
          onCheckedChange={(e) => setHandsfreeMode(e)}
          id="handsfree-mode"
        />
        <Label htmlFor="handsfree-mode">Handsfree modus</Label>
      </div>

      <Button onClick={onStartClicked} className="w-full" size="lg">
        Start
      </Button>

      <div className="flex gap-2">
        <Info size={18} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Husk å slå på mikrofonen din og lyd for å øve muntlig
        </p>
      </div>
    </div>
  );
}
