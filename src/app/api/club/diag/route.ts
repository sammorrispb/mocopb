import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchUpcomingPublicEvents } from "@/lib/club/public-events";

// Diagnostic endpoint — TEMPORARY, removed after E2E confirms.
export async function GET() {
  const env = {
    has_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  // Decode the role claim from the SUPABASE_SERVICE_ROLE_KEY JWT to confirm
  // the value isn't the anon key by mistake.
  let serviceRoleClaim = "unknown";
  try {
    const tok = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    const payload = JSON.parse(Buffer.from(tok.split(".")[1] ?? "", "base64").toString());
    serviceRoleClaim = String(payload.role ?? "missing");
  } catch {
    serviceRoleClaim = "parse-failed";
  }

  // Run the openGroups query directly + fetchUpcomingPublicEvents and report.
  let openGroupsCount: number | string = "not run";
  let openGroupsError: string | null = null;
  let publicEventsCount: number | string = "not run";
  let publicEventsTitles: string[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data, error } = await supabase
      .from("club_groups")
      .select("id, slug, visibility");
    openGroupsCount = data?.length ?? 0;
    openGroupsError = error?.message ?? null;

    const events = await fetchUpcomingPublicEvents(15);
    publicEventsCount = events.length;
    publicEventsTitles = events.map((e) => e.title);
  } catch (e) {
    publicEventsCount = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    env,
    serviceRoleClaim,
    openGroupsCount,
    openGroupsError,
    publicEventsCount,
    publicEventsTitles,
  });
}
