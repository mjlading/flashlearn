import GenerateFromCourse from "./GenerateFromCourse";
import GenerateFromFile from "./GenerateFromFile";
import GenerateFromKeywords from "./GenerateFromKeywords";
import GenerateFromText from "./GenerateFromText";

export type GeneratedFlashcard = {
  front: string;
  back: string;
  tag: string;
};

export default function GenerateFlashcardsInput({
  onAddFlashcards,
}: {
  onAddFlashcards: (flashcards: GeneratedFlashcard[]) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 my-8 p-4 border rounded-lg">
      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Generer fra
      </p>
      <div className="space-x-2">
        <GenerateFromText />
        <GenerateFromFile />
        <GenerateFromCourse />
        <GenerateFromKeywords onAddFlashcards={onAddFlashcards} />
      </div>
    </div>
  );
}
