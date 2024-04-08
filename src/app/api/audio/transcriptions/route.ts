import openai from "@/lib/ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Takes an audio file (.webm) path, fetches text transcription from openai API and returns it
 */
export async function POST() {
  console.log("FETCHING TRANSCRIPTION");

  const filePath = path.join(
    process.cwd(),
    "uploads",
    "audio",
    "user-answer.webm"
  );

  try {
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(filePath),
    });

    console.log("THE TRANSCRIPTION: ", transcription.text);

    return NextResponse.json(
      { transcription: transcription.text },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transcription:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcription" },
      { status: 500 }
    );
  }
}
