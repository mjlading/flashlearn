import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Returns uploaded audio file
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fileName = url.searchParams.get("fileName");
  if (!fileName) {
    return NextResponse.json({ error: "Filename missing" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", "audio", fileName);

  console.log("GETTING UPLOADED FILE WITH NAME : ", fileName);

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);

    const fileContent = await fs.promises.readFile(filePath);
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "audio/webm",
      },
    });
  } catch (error) {
    console.error("Error retrieving file: ", error);
    return NextResponse.json(
      { error: "File not found or access denied" },
      { status: 404 }
    );
  }
}

/**
 * Uploads audio file on .webm format
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

  console.log("UPLOADING FILE WITH NAME: ", file.name);

  const filePath = path.join(
    process.cwd(),
    "uploads",
    "audio",
    file.name + ".webm"
  );

  console.log("THE FILE PATH; ", filePath.toString());

  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.promises.writeFile(filePath, buffer);

  return NextResponse.json({ status: 200 });
}
