import { NextResponse } from "next/server";
import openai from "@/lib/ai";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Returns an ai-generated text transcription of a given audio file (format webm)
 */
export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "File not found or invalid file type." },
      { status: 400 }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "audio",
    "user-answer.webm"
  );
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.promises.writeFile(filePath, buffer);

  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: fs.createReadStream("uploads/audio/user-answer.webm"),
  });

  return NextResponse.json({
    text: response.text,
  });
}
