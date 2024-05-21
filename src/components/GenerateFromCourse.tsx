"use client";

import { api } from "@/app/api/trpc/client";
import { useDictionary } from "@/lib/DictProvider";
import { CourseInfo, getCourseInfo } from "@/lib/webScraper";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GeneratedFlashcard } from "./GenerateFlashcardsInput";
import GenerationLanguageSelect from "./GenerationLangaugeSelect";
import GenerationTypeTabs from "./GenerationTypeTabs";
import { LoadingSpinner } from "./LoadingSpinner";
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
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

export default function GenerateFromCourse({
  onGeneratedFlashcards,
  onLoadingStateChanged,
  academicLevel,
}: {
  onGeneratedFlashcards: (flashcards: GeneratedFlashcard[]) => void;
  onLoadingStateChanged: (newState: boolean) => void;
  academicLevel: string;
}) {
  const dict = useDictionary();

  const [courseCode, setCourseCode] = useState("");
  const [isLoadingCourseCode, setIsLoadingCourseCode] = useState(false);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [generationType, setGenerationType] = useState("mixed");
  const [generationLanguage, setGenerationLanguage] = useState("auto");

  const generateFlashcardsMutation =
    api.ai.generateFlashcardsFromText.useMutation({
      onMutate: () => {
        onLoadingStateChanged(true);
      },
      onSuccess: (data) => {
        onGeneratedFlashcards(data);
        onLoadingStateChanged(false);
      },
      onError: () => {
        onLoadingStateChanged(false);
        toast.error("Kunne ikke generere studiekort", {
          description: "Vennligst prøv igjen",
        });
      },
    });

  async function handleGetCourseInfo() {
    setIsLoadingCourseCode(true);
    const courseCodePrepared = courseCode.trim().toUpperCase();
    const courseInfo = await getCourseInfo(courseCodePrepared);

    if (!courseInfo) {
      toast.warning(`Emnet ${courseCodePrepared} ble ikke funnet!`);
    }
    setCourseInfo(courseInfo);

    console.log("LANGUAGE: ", courseInfo?.language);
    courseInfo?.language && setGenerationLanguage(courseInfo.language);
    setIsLoadingCourseCode(false);
  }

  async function handleGenerateClicked() {
    if (!courseInfo) return;

    const prompt =
      courseInfo.name +
      "\nStudy level: " +
      courseInfo.studyLevel +
      "\n" +
      courseInfo.courseContent +
      "\n" +
      courseInfo.learningGoal;

    generateFlashcardsMutation.mutate({
      text: prompt,
      language: generationLanguage,
      academicLevel: academicLevel,
      type: generationType,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <GraduationCap size={18} className="mr-2" />
          {dict.generateFromCourse.course}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap />
            {dict.generateFromCourse.generateFromCourse}
          </DialogTitle>
          <DialogDescription>
            {dict.generateFromCourse.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-md items-center gap-2">
          <Label htmlFor="courseCode">
            {dict.generateFromCourse.courseCode}
          </Label>
          <div className="flex gap-2">
            <Input
              type="text"
              id="courseCode"
              autoFocus
              placeholder="IDATT2001"
              className="uppercase"
              maxLength={12}
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <Button
              onClick={handleGetCourseInfo}
              disabled={courseCode.length < 4 || isLoadingCourseCode}
            >
              {isLoadingCourseCode ? (
                <LoadingSpinner className="mx-9" />
              ) : (
                dict.generateFromCourse.fetchCourseInfo
              )}
            </Button>
          </div>
        </div>
        {courseInfo && (
          <div className="flex flex-col gap-4">
            <ScrollArea className="h-[18rem]">
              <h2 className="font-semibold text-lg mb-1">{courseInfo.name}</h2>
              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>{dict.generateFromCourse.subjectAreas}: </h3>
                {courseInfo.subjects?.map((subject) => (
                  <div key={subject}>{subject}</div>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>
                  {dict.generateFromCourse.languages}: {courseInfo.language}
                </h3>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>
                  {dict.generateFromCourse.level}: {courseInfo.studyLevel}
                </h3>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>{dict.generateFromCourse.courseContent}:</h3>
              </div>
              <p className="text-muted-foreground text-sm ml-7">
                {courseInfo.courseContent}
              </p>

              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>{dict.generateFromCourse.learningOutcomes}:</h3>
              </div>
              <p className="text-muted-foreground text-sm ml-7">
                {courseInfo.learningGoal}
              </p>

              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>{dict.generateFromCourse.learningMethods}:</h3>
              </div>

              <p className="text-muted-foreground text-sm ml-7">
                {courseInfo.learningMethod}
              </p>
            </ScrollArea>

            <GenerationLanguageSelect
              value={generationLanguage}
              onValueChange={(value) => setGenerationLanguage(value)}
            />
            <GenerationTypeTabs
              value={generationType}
              onValueChange={(value) => setGenerationType(value)}
            />
            <Button
              size="lg"
              className="w-full"
              onClick={handleGenerateClicked}
            >
              {dict.generateFromCourse.generateFlashcards}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
