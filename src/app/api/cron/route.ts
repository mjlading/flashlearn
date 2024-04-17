import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }
  console.log("RUNNING CRON JOB");
  return NextResponse.json({ ok: true });
}
