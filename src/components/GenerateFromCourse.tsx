"use client";

import { CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { LoadingSpinner } from "./LoadingSpinner";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { CourseInfo, getCourseInfo } from "@/lib/webScraper";
import { toast } from "sonner";
import GenerationTypeTabs from "./GenerationTypeTabs";
import { GeneratedFlashcard } from "./GenerateFlashcardsInput";
import { api } from "@/app/api/trpc/client";

export default function GenerateFromCourse({
  onGeneratedFlashcards,
  onLoadingStateChanged,
}: {
  onGeneratedFlashcards: (flashcards: GeneratedFlashcard[]) => void;
  onLoadingStateChanged: (newState: boolean) => void;
}) {
  const [courseCode, setCourseCode] = useState("");
  const [isLoadingCourseCode, setIsLoadingCourseCode] = useState(false);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [generationType, setGenerationType] = useState("mixed");
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
    //TODO: CATCH ERRORS
    const courseInfo = await getCourseInfo(courseCodePrepared);

    if (!courseInfo) {
      toast.warning(`Emnet ${courseCodePrepared} ble ikke funnet!`);
    }
    setCourseInfo(courseInfo);
    setIsLoadingCourseCode(false);
  }

  async function handleGenerateClicked() {
    if (!courseInfo) return;

    const prompt =
      courseInfo.name +
      "\nStudy level: " +
      courseInfo.studyLevel +
      "\nLanguage:" +
      courseInfo.language +
      "\n" +
      courseInfo.courseContent +
      "\n" +
      courseInfo.learningGoal;

    generateFlashcardsMutation.mutate({
      text: prompt,
      type: generationType,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <GraduationCap size={18} className="mr-2" />
          Emne
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap />
            Generer fra emne
          </DialogTitle>
          <DialogDescription>
            Generer kort fra et emne ved NTNU.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-md items-center gap-2">
          <Label htmlFor="courseCode">Emnekode</Label>
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
                "Hent emneinfo"
              )}
            </Button>
          </div>
        </div>
        {courseInfo && (
          <div className="flex flex-col gap-4">
            <ScrollArea className="h-[20rem]">
              <h2 className="font-semibold text-lg mb-1">{courseInfo.name}</h2>
              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>Fagområder: </h3>
                {courseInfo.subjects?.map((subject) => (
                  <div key={subject}>{subject}</div>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>Språk: {courseInfo.language}</h3>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>Nivå: {courseInfo.studyLevel}</h3>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>Faglig innhold:</h3>
              </div>
              <p className="text-muted-foreground text-sm ml-7">
                {courseInfo.courseContent}
              </p>

              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>Læringsutbytte:</h3>
              </div>
              <p className="text-muted-foreground text-sm ml-7">
                {courseInfo.learningGoal}
              </p>

              <div className="flex gap-2 items-center">
                <CheckCircle2 size={20} className="text-success" />
                <h3>Læringsformer:</h3>
              </div>

              <p className="text-muted-foreground text-sm ml-7">
                {courseInfo.learningMethod}
              </p>
            </ScrollArea>
            <GenerationTypeTabs
              value={generationType}
              onValueChange={(value) => setGenerationType(value)}
            />
            <Button
              size="lg"
              className="w-full"
              onClick={handleGenerateClicked}
            >
              Generer studiekort
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
