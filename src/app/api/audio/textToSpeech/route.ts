export async function POST(request: Request) {
  try {
    const textInput = await request.text();

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "alloy",
        input: textInput,
      }),
    });

    const blob = await response.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "audio/mp3",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: `An error occurred: ${error}` }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
