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
  // Returns [] if envs aren't set (build-time pre-render); runtime force-dynamic
  // refills.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }
  const supabase = createClubServiceClient();

  // Two-step: filter open groups first, then events. Avoids PostgREST embed
  // shape ambiguity (the same select can return `group` as an object OR a
  // single-element array depending on FK cardinality detection, and the
  // runtime shape doesn't match the .returns<>() type cast).
  const { data: openGroups } = await supabase
    .from("club_groups")
    .select("id, slug, name")
    .eq("visibility", "open");

  const groups = (openGroups ?? []) as { id: string; slug: string; name: string }[];
  if (groups.length === 0) return [];

  const groupIds = groups.map((g) => g.id);
  const groupById = new Map(groups.map((g) => [g.id, g]));

  const { data: events } = await supabase
    .from("club_events")
    .select("id, title, starts_at, location, group_id")
    .eq("status", "scheduled")
    .gte("starts_at", new Date().toISOString())
    .in("group_id", groupIds)
    .order("starts_at", { ascending: true })
    .limit(limit);

  const rows = (events ?? []) as {
    id: string;
    title: string;
    starts_at: string;
    location: string;
    group_id: string;
  }[];

  return rows.map((e) => {
    const g = groupById.get(e.group_id);
    return {
      event_id: e.id,
      title: e.title,
      starts_at: e.starts_at,
      location: e.location,
      group_slug: g?.slug ?? "",
      group_name: g?.name ?? "",
    };
  });
}
