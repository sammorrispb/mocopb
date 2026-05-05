import Link from "next/link";
import { requireClubUser } from "@/lib/club/auth";
import type { ClubEvent, ClubGroup, RegistrationStatus } from "@/lib/club/types";

type GroupRow = ClubGroup & { role: "admin" | "member" };
type UpcomingRow = Pick<ClubEvent, "id" | "title" | "starts_at" | "location" | "group_id"> & {
  group_slug: string;
  group_name: string;
  my_status: RegistrationStatus | null;
};

export default async function ClubDashboard() {
  const { user, supabase } = await requireClubUser();

  const { data: memberships } = await supabase
    .from("club_group_members")
    .select("role, group:club_groups(*)")
    .eq("user_id", user.id)
    .returns<{ role: "admin" | "member"; group: ClubGroup | null }[]>();

  const groups: GroupRow[] = (memberships ?? [])
    .map((m) => (m.group ? { ...m.group, role: m.role } : null))
    .filter((g): g is GroupRow => g !== null);

  const groupIds = groups.map((g) => g.id);
  let upcoming: UpcomingRow[] = [];
  if (groupIds.length > 0) {
    const { data: events } = await supabase
      .from("club_events")
      .select("id, title, starts_at, location, group_id, group:club_groups(slug, name)")
      .in("group_id", groupIds)
      .eq("status", "scheduled")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(20)
      .returns<
        {
          id: string;
          title: string;
          starts_at: string;
          location: string;
          group_id: string;
          group: { slug: string; name: string } | null;
        }[]
      >();

    const eventIds = (events ?? []).map((e) => e.id);
    const { data: myRegs } = await supabase
      .from("club_event_registrations")
      .select("event_id, status")
      .eq("user_id", user.id)
      .in("event_id", eventIds.length ? eventIds : ["00000000-0000-0000-0000-000000000000"]);

    const statusByEvent = new Map<string, RegistrationStatus>();
    for (const r of myRegs ?? []) statusByEvent.set(r.event_id, r.status);

    upcoming = (events ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      starts_at: e.starts_at,
      location: e.location,
      group_id: e.group_id,
      group_slug: e.group?.slug ?? "",
      group_name: e.group?.name ?? "",
      my_status: statusByEvent.get(e.id) ?? null,
    }));
  }

  return (
    <section className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-text-primary">Your club</h1>
            <p className="text-text-muted mt-1">Groups you&apos;re in and events coming up.</p>
          </div>
          <Link
            href="/club/groups/new"
            className="rounded-lg bg-court-green px-4 py-2 text-sm font-semibold text-white hover:bg-court-green/90"
          >
            New group
          </Link>
        </div>

        <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">My groups</h2>
        {groups.length === 0 ? (
          <p className="text-text-muted mb-10">
            You&apos;re not in any groups yet.{" "}
            <Link href="/club/groups/new" className="text-court-green underline">
              Create one
            </Link>{" "}
            or paste an invite link.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {groups.map((g) => (
              <Link
                key={g.id}
                href={`/club/groups/${g.slug}`}
                className="card-moco p-5 hover:border-court-green/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-text-primary">{g.name}</h3>
                    {g.description && (
                      <p className="text-sm text-text-muted mt-1 line-clamp-2">{g.description}</p>
                    )}
                  </div>
                  {g.role === "admin" && (
                    <span className="text-xs rounded bg-court-green/10 text-court-green px-2 py-0.5">
                      admin
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">Upcoming events</h2>
        {upcoming.length === 0 ? (
          <p className="text-text-muted mb-10">No upcoming events.</p>
        ) : (
          <ul className="space-y-2 mb-10">
            {upcoming.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/club/groups/${e.group_slug}/events/${e.id}`}
                  className="card-moco p-4 flex items-center justify-between hover:border-court-green/30"
                >
                  <div>
                    <div className="font-semibold text-text-primary">{e.title}</div>
                    <div className="text-sm text-text-muted">
                      {new Date(e.starts_at).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      · {e.location} · {e.group_name}
                    </div>
                  </div>
                  {e.my_status && (
                    <span className={`text-xs rounded px-2 py-0.5 ${statusBadge(e.my_status)}`}>
                      {e.my_status}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-xl border border-court-green/20 bg-section-alt p-6">
          <h2 className="font-heading font-semibold text-xl text-text-primary mb-1">
            Start your own group in 3 steps
          </h2>
          <p className="text-text-muted text-sm mb-5">
            Free to run. Built for crews of any size — drop-in, league, ladder, kids&apos; clinic.
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <li className="flex gap-3">
              <span className="shrink-0 h-7 w-7 rounded-full bg-court-green text-white text-sm font-bold flex items-center justify-center">
                1
              </span>
              <div>
                <div className="font-semibold text-text-primary">Name your group</div>
                <p className="text-sm text-text-muted mt-0.5">
                  Add a description and skill level so the right players join.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 h-7 w-7 rounded-full bg-court-green text-white text-sm font-bold flex items-center justify-center">
                2
              </span>
              <div>
                <div className="font-semibold text-text-primary">Schedule sessions</div>
                <p className="text-sm text-text-muted mt-0.5">
                  Pick a court, time, and capacity. Waitlists are automatic.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 h-7 w-7 rounded-full bg-court-green text-white text-sm font-bold flex items-center justify-center">
                3
              </span>
              <div>
                <div className="font-semibold text-text-primary">Share the link</div>
                <p className="text-sm text-text-muted mt-0.5">
                  Players RSVP and you get a clean roster — no spreadsheets.
                </p>
              </div>
            </li>
          </ol>
          <Link
            href="/club/groups/new"
            className="inline-block rounded-lg bg-court-green px-4 py-2 text-sm font-semibold text-white hover:bg-court-green/90"
          >
            Create a group →
          </Link>
        </div>
      </div>
    </section>
  );
}

function statusBadge(s: RegistrationStatus) {
  switch (s) {
    case "registered":
      return "bg-court-green/10 text-court-green";
    case "waitlisted":
      return "bg-amber-100 text-amber-800";
    case "attended":
      return "bg-court-green/15 text-court-green";
    case "no_show":
    case "cancelled":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
