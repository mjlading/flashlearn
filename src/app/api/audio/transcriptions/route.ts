/**
 * Takes in an audio blob (format .webm), fetches text transcription from openai API and returns it
 */
export async function POST(request: Request) {
  const blob = await request.blob();

  console.log("Transcription blob: ", blob);
  console.log(blob.size);

  const file = new File([blob], "user-answer", { type: blob.type });

  const formData = new FormData();
  formData.append("file", file, "user-anwer.webm");
  formData.append("model", "whisper-1");

  try {
    // Cannot use openai client here since we need the file to be inside a FormData for openai to recognize it
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    console.log("The transcription: ", data.text);
    return new Response(JSON.stringify({ text: data.text }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: `Failed to fetch transcription: ${err}` }),
      { status: 500 }
    );
  }
}
