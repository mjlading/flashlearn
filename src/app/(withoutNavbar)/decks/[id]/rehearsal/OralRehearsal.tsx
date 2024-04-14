"use client";

import { api } from "@/app/api/trpc/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, percentageToHsl } from "@/lib/utils";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { Bot, Ear, MessageCircleQuestion, Mic } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Feedback } from "./AnswerForm";
import PreOralRehearsal from "./PreOralRehearsal";

export default function OralRehearsal({
  flashcards,
}: {
  flashcards: FlashcardType[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [handsfreeMode, setHandsfreeMode] = useState<boolean>(true);
  const [progress, setProgress] = useState(0);

  const isSpeaking = useRef(false);
  const questionAudio = useRef(new Audio());
  const feedbackAudio = useRef(new Audio());
  const recentlyPlayedAudio = useRef<"questionAudio" | "feedbackAudio">(
    "questionAudio"
  );
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [showPreRehearsalScreen, setShowPreRehearsalScreen] =
    useState<boolean>(true);

  const generateFeedbackMututation = api.ai.generateFeedback.useMutation();

  const session = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    getMicAudio();
  }, []);

  useEffect(() => {
    if (currentIndex === 0) return;

    setProgress(((currentIndex + 1) / flashcards.length) * 100);

    const textInput = flashcards[currentIndex].front;
    playAudioFromText(textInput);
  }, [currentIndex]);

  function startRehearsal() {
    setShowPreRehearsalScreen(false);

    const textInput = flashcards[0].front;
    playAudioFromText(textInput);
  }

  async function fetchTranscription(blob: Blob) {
    try {
      const transcriptionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/audio/transcriptions`,
        {
          method: "POST",
          body: blob,
        }
      );

      const data = await transcriptionResponse.json();
      const transcription = data.text;

      setUserAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentIndex] = transcription;
        return newAnswers;
      });

      // Generate feedback based on user answer
      const feedback = await generateFeedbackMututation.mutateAsync({
        front: flashcards[currentIndex].front,
        back: flashcards[currentIndex].back,
        answer: transcription,
      });

      setFeedbacks((prev) => {
        const newFeedbacks = [...prev];
        newFeedbacks[currentIndex] = feedback;
        return newFeedbacks;
      });

      feedback.tips &&
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/audio/textToSpeech?key=${currentIndex}`,
          {
            method: "POST",
            body: feedback.tips.join("\n"),
          }
        ).then(async (res) => {
          const data = await res.blob();
          const url = URL.createObjectURL(data);
          feedbackAudio.current = new Audio(url);
          feedbackAudio.current.play();
          recentlyPlayedAudio.current = "feedbackAudio";
        });
    } catch (error) {
      console.error(error);
      toast.error("Kunne ikke hente feedback, vennligst prøv igjen.");
    }
  }

  function handleEarClicked() {
    mediaRecorder.current?.stop();
    playAudio(questionAudio.current);
    recentlyPlayedAudio.current = "questionAudio";
  }

  async function startMicRecording() {
    console.log("Attempting to start recording");

    setIsRecording(true);
    if (!mediaRecorder.current) {
      console.log("MediaRecorder not initialized, initializing now");
      await getMicAudio();
    }
    if (!mediaRecorder.current || mediaRecorder.current.state === "recording") {
      console.log("Not mediarecorder or its currently recording");
      return;
    }

    mediaRecorder.current.start();
    console.log("Recorder started");
    console.log(mediaRecorder.current.state);

    let chunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      setIsRecording(false);
      console.log("Recorder stopped");

      const blob = new Blob(chunks, { type: "audio/webm" });
      chunks = [];

      fetchTranscription(blob);
    };
  }

  function stopMicRecording() {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      console.log("Stopping recording");
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }

  function playAudio(audio: HTMLAudioElement) {
    if (isSpeaking.current) return;
    isSpeaking.current = true;

    function onAudioEnded() {
      audio.removeEventListener("ended", onAudioEnded);

      // When feedback audio is finished playing, skip recording mic
      if (recentlyPlayedAudio.current === "feedbackAudio") return;

      startMicRecording();
    }

    audio.addEventListener("ended", onAudioEnded);

    audio
      .play()
      .then(() => {
        // done
      })
      .catch((error) => {
        audio.removeEventListener("ended", onAudioEnded);

        if (error.name === "NotAllowedError") {
          toast.warning(
            "Du har ikke tillatt automatisk spilling av lyd i nettleseren din for denne nettsiden."
          );
        } else {
          toast.error("Lydspilling feilet: ", error);
        }
      })
      .finally(() => {
        isSpeaking.current = false;
      });
  }

  async function playAudioFromText(text: string) {
    // Key is used to prevent caching
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/audio/textToSpeech?key=${currentIndex}`,
      {
        method: "POST",
        body: text,
      }
    ).then(async (res) => {
      const data = await res.blob();
      const url = URL.createObjectURL(data);

      mediaRecorder.current?.stop();
      questionAudio.current = new Audio(url);
      playAudio(questionAudio.current);
      recentlyPlayedAudio.current = "questionAudio";
    });
  }

  async function getMicAudio() {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream, {
            mimeType: "audio/webm",
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("Kunne ikke hente mikrofonen din: ", error);
        });
    } else {
      console.info("Audio devices not supported");
      toast.info("Kunne ikke hente media");
    }
  }

  if (showPreRehearsalScreen) {
    return (
      <PreOralRehearsal
        handsfreeMode={handsfreeMode}
        setHandsfreeMode={setHandsfreeMode}
        onStartClicked={startRehearsal}
      />
    );
  }

  return (
    <div className="flex flex-col gap-16 w-full max-w-[40rem]">
      <Progress value={progress} className="h-2" />

      {/* The ear (audio play) button */}
      {!userAnswers[currentIndex] && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="secondary"
                disabled={!questionAudio.current}
                onClick={handleEarClicked}
              >
                <Ear />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hør igjen</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* The mic input section */}
      {!userAnswers[currentIndex] && (
        <div className="flex flex-col items-center gap-8">
          <h2
            className={`font-semibold text-xl ${
              isRecording ? "text-default" : "text-gray-400"
            }`}
          >
            {isRecording ? "Si svaret ditt" : "Hør oppgaven"}
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
            {!isRecording ? (
              <MessageCircleQuestion size={60} />
            ) : (
              <Mic size={60} />
            )}
          </div>
        </div>
      )}

      {/* The user's answer section */}
      <div className="flex gap-2 justify-end pl-10">
        <div
          className={cn(
            `${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`,
            "rounded-3xl rounded-tr-md p-4"
          )}
        >
          <p>{isRecording ? ". . ." : userAnswers[currentIndex]}</p>
        </div>
        <Avatar className="h-8 w-8 shadow-sm">
          <AvatarImage src={session.data?.user.image ?? ""} alt="profil" />
          <AvatarFallback>meg</AvatarFallback>
        </Avatar>
      </div>

      {/* The feedback section */}
      <div className="space-y-2">
        {generateFeedbackMututation.isLoading && (
          <LoadingSpinner className="mx-auto" />
        )}
        {feedbacks[currentIndex] && (
          <div className="space-y-4">
            {/* The score */}
            <div
              className="rounded-full mx-auto w-fit p-2 shadow-sm font-semibold"
              style={{
                backgroundColor: percentageToHsl(
                  feedbacks[currentIndex].score / 100,
                  0,
                  120,
                  theme === "dark" ? 20 : 65
                ),
              }}
            >
              {feedbacks[currentIndex].score} / 100
            </div>

            {/* The tips */}
            {/* TODO: abstract? */}
            <ul className="space-y-4 pr-10">
              {feedbacks[currentIndex].tips?.map((tip) => (
                <div key={tip} className="flex gap-2">
                  <div className="rounded-full p-1 h-fit shadow-sm bg-purple-600 text-white">
                    <Bot size={22} />
                  </div>
                  <li className="bg-slate-200 dark:bg-slate-800 rounded-3xl rounded-tl-md p-4">
                    {tip}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isRecording && (
        <Button onClick={() => stopMicRecording()}>Stop lydopptak</Button>
      )}
      {feedbacks[currentIndex] && currentIndex !== flashcards.length - 1 && (
        <Button onClick={() => setCurrentIndex(currentIndex + 1)}>
          Fortsett
        </Button>
      )}
    </div>
  );
}
