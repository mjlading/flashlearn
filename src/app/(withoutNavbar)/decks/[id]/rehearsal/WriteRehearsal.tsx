"use client";

import Flashcard from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Flashcard as FlashcardType } from "@prisma/client";
import { ChevronLeft, ChevronRight, SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

const FormSchema = z.object({
  answer: z.string().max(1000, { message: "Kan ikke overstige 1000 tegn." }),
});

function AnswerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    //TODO

    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    rows={1}
                    maxRows={10}
                    placeholder="Skriv inn svaret ditt her"
                    className="w-full p-4 pr-16 leading-relaxed text-md rounded-xl resize-none bg-muted dark:bg-muted/40 outline-none focus:bg-gray-200 dark:focus:bg-muted/60 placeholder-gray-500"
                    autoFocus
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={!form.watch("answer")}
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-[10px] bottom-[10px] rounded-full"
                >
                  <SendHorizonal />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send inn</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-destructive">
          {form.formState.errors.answer?.message}
        </p>
      </form>
    </Form>
  );
}

export default function WriteRehearsal({
  flashcards,
}: {
  flashcards: FlashcardType[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(flashcards[0]);
  const [progress, setProgress] = useState(0);
  const [textarea, setTextarea] = useState("");

  useEffect(() => {
    setCurrentFlashcard(flashcards[currentIndex]);
    setProgress(((currentIndex + 1) / flashcards.length) * 100);
  }, [currentIndex, flashcards]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  function nextFlashcard() {
    const nextIndex = Math.min(currentIndex + 1, flashcards.length - 1);
    setCurrentIndex(nextIndex);
  }

  function previousFlashcard() {
    const previousIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(previousIndex);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.code === "ArrowRight") {
      nextFlashcard();
    } else if (event.code === "ArrowLeft") {
      previousFlashcard();
    }
  }

  return (
    <main className="space-y-8 w-full max-w-[40rem]">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => previousFlashcard()}
          disabled={currentIndex === 0}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft />
        </Button>
        <Progress value={progress} className="h-2" />
        <Button
          onClick={() => nextFlashcard()}
          disabled={currentIndex === flashcards.length - 1}
          size="icon"
          variant="ghost"
        >
          <ChevronRight />
        </Button>
      </div>
      <Flashcard
        flashcard={currentFlashcard}
        className="h-[10rem]"
        mode="write"
      />

      {/* The write section */}
      <AnswerForm />
    </main>
  );
}
