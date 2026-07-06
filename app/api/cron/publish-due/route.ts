import { NextRequest, NextResponse } from "next/server";
import { publishDuePosts } from "@/lib/x-publisher";

export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");

  if (expected && header !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await publishDuePosts();
  return NextResponse.json({ processed: results.length, results });
}
