import { createClubServiceClient } from "@/lib/club/supabase-server";

export type PublicEvent = {
  event_id: string;
  title: string;
  starts_at: string;
  location: string;
  group_slug: string;
  group_name: string;
};

export async function fetchUpcomingPublicEvents(limit = 10): Promise<PublicEvent[]> {
  // Service-role read so we don't need a public-read RLS policy on club_events.
  // Hardcoded filter to open-visibility groups + scheduled events + future date.
  // Returns [] if envs aren't set (build-time pre-render); runtime ISR refills.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }
  const supabase = createClubServiceClient();
  const { data, error } = await supabase
    .from("club_events")
    .select(
      "id, title, starts_at, location, group:club_groups!inner(slug, name, visibility)"
    )
    .eq("status", "scheduled")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit)
    .returns<
      {
        id: string;
        title: string;
        starts_at: string;
        location: string;
        group: { slug: string; name: string; visibility: "open" | "invite" } | null;
      }[]
    >();

  if (error || !data) return [];

  return data
    .filter((e) => e.group?.visibility === "open")
    .map((e) => ({
      event_id: e.id,
      title: e.title,
      starts_at: e.starts_at,
      location: e.location,
      group_slug: e.group!.slug,
      group_name: e.group!.name,
    }));
}
