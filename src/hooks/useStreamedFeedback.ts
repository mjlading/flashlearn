"use client";

import { Feedback } from "@/app/[lang]/(withoutNavbar)/decks/[id]/rehearsal/AnswerForm";
import { useRef, useState } from "react";

export default function useStreamedFeedback() {
  const [feedback, setFeedback] = useState<Partial<Feedback> | undefined>(
    undefined
  );
  const isFetching = useRef(false);

  /**
   * TODO: docs
   */
  function* jsonIncrementalParser(): Generator<
    Partial<Feedback> | undefined,
    void,
    string
  > {
    // console.log("parser started");

    let text = "";
    let readingTips = false;

    while (true) {
      let delta: string | undefined = yield;
      text += delta;

      // console.log("delta: ", delta);
      // console.log("text: ", text);

      if (delta.includes(",") && !readingTips) {
        // Score is ready
        const idx = text.indexOf(",");
        const partialObject = text.slice(0, idx) + "}";
        parseJsonAndSetFeedback(partialObject);
      } else if (delta.includes("[")) {
        readingTips = true;
      } else if (readingTips && !/["\]}]/.test(delta)) {
        // if not includes " or ] or }
        const partialObject = text + '"]}';
        parseJsonAndSetFeedback(partialObject);
      } else if (text.includes("}")) {
        // This only happens for the last read
        // so we now have all the data in text
        parseJsonAndSetFeedback(text);
      }
    }
  }

  function parseJsonAndSetFeedback(partialObject: string) {
    try {
      const partialJson = JSON.parse(partialObject) as Partial<Feedback>;
      // console.log("partialJson: ", partialJson);

      setFeedback((prev) => ({ ...prev, ...partialJson }));
    } catch (error) {
      console.error("failed parsing partialObject to json: ", error);
    }
  }

  async function generateFeedback(feedbackMutationInput: {
    front: string;
    back: string;
    answer: string;
  }) {
    isFetching.current = true;

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(feedbackMutationInput),
    });

    if (!response.body) {
      isFetching.current = false;
      return;
    }

    const reader = response.body.getReader();

    const jsonParser = jsonIncrementalParser();
    jsonParser.next(); // Start the generator

    async function read() {
      const { value, done } = await reader.read();
      if (done) {
        // console.log("done");
        reader.releaseLock();
        jsonParser.return(undefined);
      } else {
        const text = new TextDecoder().decode(value);
        // console.log("text: ", text);

        // Feed the json parser generator function and take response
        jsonParser.next(text);

        // setMessages((prev) => prev.concat(text));

        await read(); // Recursively read next value from stream
      }
    }

    await read();

    // Reset the feedback
    setFeedback(undefined);

    isFetching.current = false;
  }

  return { feedback, generateFeedback };
}
