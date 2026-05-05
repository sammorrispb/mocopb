import { NextResponse } from "next/server";
import { processPendingNotifications } from "@/lib/club/notify";

// Vercel cron hits this endpoint. Also callable manually for testing.
// Header-based auth: requires CRON_SECRET to match `Authorization: Bearer …`.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const expected = process.env.CRON_SECRET;
  if (expected && auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await processPendingNotifications(50);
  return NextResponse.json({ ok: true, ...result });
}
