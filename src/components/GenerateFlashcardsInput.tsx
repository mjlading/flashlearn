import GenerateFromCourse from "./GenerateFromCourse";
import GenerateFromFile from "./GenerateFromFile";
import GenerateFromKeywords from "./GenerateFromKeywords";
import GenerateFromText from "./GenerateFromText";

export default function GenerateFlashcardsInput() {
  return (
    <div className="flex items-center gap-4 my-8">
      <p>Generer fra </p>
      <GenerateFromText />
      <GenerateFromFile />
      <GenerateFromCourse />
      <GenerateFromKeywords />
    </div>
  );
}
