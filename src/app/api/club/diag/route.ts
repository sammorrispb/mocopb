import { NextResponse } from "next/server";
import { fetchUpcomingPublicEvents } from "@/lib/club/public-events";

// Diagnostic endpoint — TEMPORARY, removed after E2E confirms.
export async function GET() {
  const env = {
    has_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    has_service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    has_cron: !!process.env.CRON_SECRET,
    has_gmail_user: !!process.env.GMAIL_USER,
    has_gmail_pass: !!process.env.GMAIL_APP_PASSWORD,
  };
  let publicEventsCount: number | { error: string } = { error: "not run" };
  let titles: string[] = [];
  try {
    const events = await fetchUpcomingPublicEvents(15);
    publicEventsCount = events.length;
    titles = events.map((e) => e.title);
  } catch (e) {
    publicEventsCount = { error: e instanceof Error ? e.message : String(e) };
  }
  return NextResponse.json({ env, publicEventsCount, titles });
}
