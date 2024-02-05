import { Layers3 } from "lucide-react";
import CreateDeckForm from "./CreateDeckForm";

export default function CreateDeckPage() {
  return (
    <div className="flex flex-col space-y-7">
      <div className="flex gap-2 items-center">
        <Layers3 size={30} />
        <h1 className="font-bold text-3xl">Nytt sett</h1>
      </div>
      <p className="text-muted-foreground">
        Opprett et nytt sett med studiekort
      </p>

      <CreateDeckForm />
    </div>
  );
}
