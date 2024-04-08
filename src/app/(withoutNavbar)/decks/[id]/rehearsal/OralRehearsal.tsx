"use client";

import { api } from "@/app/api/trpc/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { Bot, Ear, MessageCircleQuestion, Mic } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Feedback } from "./AnswerForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { percentageToHsl } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function OralRehearsal({
  flashcards,
}: {
  flashcards: FlashcardType[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<String[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const isSpeaking = useRef(false);
  const questionAudio = useRef(new Audio());
  const feedbackAudio = useRef(new Audio());
  const recentlyPlayedAudio = useRef<"questionAudio" | "feedbackAudio">(
    "questionAudio"
  );
  const mediaRecorder = useRef<MediaRecorder | undefined>(undefined);

  const ttsMutation = api.ai.textToSpeech.useMutation();
  const generateFeedbackMututation = api.ai.generateFeedback.useMutation();

  const session = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    ttsMutation
      .mutateAsync({
        text: flashcards[currentIndex].front,
        filePath: "./uploads/audio/question.webm",
      })
      .then(async () => {
        // The key param is used to prevent the browser caching the audio file
        questionAudio.current = new Audio(
          `/api/audio/uploads?fileName=question.webm&key=${currentIndex}`
        );
        playAudio(questionAudio.current);
        recentlyPlayedAudio.current = "questionAudio";
      });
  }, [currentIndex]);

  async function fetchTranscription(blob: Blob) {
    const file = new File([blob], "user-answer", {
      type: blob.type,
    });

    const formData = new FormData();
    formData.append("file", file);

    // Upload the user-answer audio file
    //TODO: error handling
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/audio/uploads?key=${currentIndex}`,
      {
        method: "POST",
        body: formData,
      }
    );

    // Fetch the transcription of the audio file
    //TODO error handling
    const transcriptionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/audio/transcriptions`,
      {
        method: "POST",
      }
    );
    const transcription = (await transcriptionResponse.json()).transcription;

    console.log("THE TRANSCRIPTION: ", transcription);

    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = transcription;
      return newAnswers;
    });

    // Generate feedback on user answer
    generateFeedbackMututation
      .mutateAsync({
        front: flashcards[currentIndex].front,
        back: flashcards[currentIndex].back,
        answer: transcription,
      })
      .then((feedback) => {
        // Play the feedback audio back to the user
        feedback.tips &&
          ttsMutation
            .mutateAsync({
              text: feedback.tips.join("\n"),
              filePath: "./uploads/audio/feedback.webm",
            })
            .then(() => {
              feedbackAudio.current = new Audio(
                `/api/audio/uploads?fileName=feedback.webm&key=${currentIndex}`
              );
              playAudio(feedbackAudio.current);
              recentlyPlayedAudio.current = "feedbackAudio";
            });

        setFeedbacks((prev) => {
          const newFeedbacks = [...prev];
          newFeedbacks[currentIndex] = feedback;
          return newFeedbacks;
        });
      })
      .catch((error) => {
        console.error("Could not fetch transcription: ", error);
        toast.error("Kunne ikke hente tilbakemelding og score.");
      });
  }

  function handleEarClicked() {
    mediaRecorder.current?.stop();
    playAudio(questionAudio.current);
    recentlyPlayedAudio.current = "questionAudio";
  }

  function playAudio(audio: HTMLAudioElement) {
    if (isSpeaking.current) return;
    isSpeaking.current = true;

    async function onAudioEnded() {
      audio.removeEventListener("ended", onAudioEnded);

      // When feedback audio is finished playing, skip recording mic
      if (recentlyPlayedAudio.current === "feedbackAudio") return;

      setIsRecording(true);
      if (!mediaRecorder.current) return;
      if (mediaRecorder.current.state === "recording") {
        await getMicAudio();
      }
      mediaRecorder.current.start();
      console.log(mediaRecorder.current.state);
      console.log("Recorder started");

      let chunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.current.onstop = async (e) => {
        setIsRecording(false);
        console.log("recorder stopped");
        const blob = new Blob(chunks, { type: "audio/webm" });
        chunks = [];

        fetchTranscription(blob);
      };
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

  async function getMicAudio() {
    if (navigator.mediaDevices) {
      console.log("getUserMedia supported");
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          console.log("SUCCESS");

          mediaRecorder.current = new MediaRecorder(stream, {
            mimeType: "audio/webm",
          });
        })
        .catch((error) => {
          console.log("ERROR 42");
          console.log(error);
        });
    } else {
      console.log("NOT SUPPORTED");
    }
  }

  useEffect(() => {
    getMicAudio();
  }, []);

  return (
    <div className="flex flex-col gap-16">
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
      <div className="flex gap-2">
        <Avatar className="h-8 w-8 shadow-sm">
          <AvatarImage src={session.data?.user.image ?? ""} alt="profil" />
          <AvatarFallback>meg</AvatarFallback>
        </Avatar>
        <div className="bg-slate-200 rounded-3xl rounded-tl-md p-4">
          <p>{isRecording ? ". . ." : userAnswers[currentIndex]}</p>
        </div>
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
            <ul className="space-y-4">
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

      {!!isRecording && (
        <Button onClick={() => mediaRecorder.current?.stop()}>
          Stop lydopptak
        </Button>
      )}
      {feedbacks[currentIndex] && currentIndex !== flashcards.length - 1 && (
        <Button onClick={() => setCurrentIndex(currentIndex + 1)}>
          Fortsett
        </Button>
      )}
    </div>
  );
}
