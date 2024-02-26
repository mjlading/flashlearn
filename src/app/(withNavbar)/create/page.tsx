import { Layers3 } from "lucide-react";
import CreateDeckForm from "./CreateDeckForm";

export default function CreateDeckPage() {
  return (
    <main className="mx-auto my-12 px-4 md:px-8 lg:w-[60rem] lg:max-w-[90%]">
      <div className="flex flex-col space-y-8">
        <div className="flex gap-4 items-center">
          <Layers3 size={32} />
          <h1 className="font-bold text-4xl">Nytt sett</h1>
        </div>
        <p className="text-muted-foreground">
          Opprett et nytt sett med studiekort
        </p>
        <CreateDeckForm />
      </div>
    </main>
  );
}
