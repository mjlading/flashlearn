import { NextRequest, NextResponse } from "next/server";
import { api } from "../trpc/server";
import prisma from "@/lib/prisma";

/**
 * Triggered by a vercel cron job which runs every day at 06:00 UTC
 * Used to decrement userDeckKnowledges
 */
export async function GET(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  console.log("RUNNING CRON JOB");

  // Decrement all userDeckKnowledges
  prisma.userDeckKnowledge.updateMany({
    data: {
      knowledgeLevel: {
        decrement: 10,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
