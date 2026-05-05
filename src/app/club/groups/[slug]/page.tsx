import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClubUser } from "@/lib/club/auth";
import { GroupChat } from "@/components/club/GroupChat";
import type {
  ClubEvent,
  ClubGroup,
  ClubGroupMessage,
  ClubProfile,
  GroupMemberRole,
} from "@/lib/club/types";

type GroupPageProps = { params: Promise<{ slug: string }> };

export default async function GroupHomePage({ params }: GroupPageProps) {
  const { slug } = await params;
  const { user, supabase } = await requireClubUser();

  const { data: group } = await supabase
    .from("club_groups")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<ClubGroup>();
  if (!group) notFound();

  const { data: membership } = await supabase
    .from("club_group_members")
    .select("role")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle<{ role: GroupMemberRole }>();

  if (!membership && group.visibility !== "open") notFound();

  const isAdmin = membership?.role === "admin";

  const { data: events } = await supabase
    .from("club_events")
    .select("id, title, starts_at, location, capacity, status")
    .eq("group_id", group.id)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  const { count: memberCount } = await supabase
    .from("club_group_members")
    .select("user_id", { count: "exact", head: true })
    .eq("group_id", group.id);

  // Last 50 chat messages (oldest→newest order in UI).
  const { data: messageRows } = await supabase
    .from("club_group_messages")
    .select("id, group_id, user_id, body, created_at, profile:club_profiles(display_name)")
    .eq("group_id", group.id)
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<
      (ClubGroupMessage & { profile: Pick<ClubProfile, "display_name"> | null })[]
    >();
  const initialMessages = (messageRows ?? [])
    .reverse()
    .map((m) => ({
      id: m.id,
      group_id: m.group_id,
      user_id: m.user_id,
      body: m.body,
      created_at: m.created_at,
      display_name: m.profile?.display_name ?? "Player",
    }));

  return (
    <section className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-3xl text-text-primary">{group.name}</h1>
          {group.description && <p className="text-text-muted mt-2">{group.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <Link href={`/club/groups/${group.slug}/members`} className="hover:text-text-primary">
              {memberCount ?? 0} members
            </Link>
            {isAdmin && (
              <>
                <span>·</span>
                <Link
                  href={`/club/groups/${group.slug}/events/new`}
                  className="text-court-green font-semibold"
                >
                  + new event
                </Link>
                <span>·</span>
                <span className="text-xs">
                  Invite link:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    /club/join/{group.invite_code}
                  </code>
                </span>
              </>
            )}
          </div>
        </div>

        <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">Group chat</h2>
        {membership ? (
          <div className="mb-8">
            <GroupChat
              groupId={group.id}
              currentUserId={user.id}
              initialMessages={initialMessages}
            />
          </div>
        ) : (
          <p className="text-text-muted mb-8 text-sm">Join the group to chat.</p>
        )}

        <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">
          Upcoming events
        </h2>
        {(!events || events.length === 0) && (
          <p className="text-text-muted">
            Nothing scheduled.
            {isAdmin && (
              <>
                {" "}
                <Link
                  href={`/club/groups/${group.slug}/events/new`}
                  className="text-court-green underline"
                >
                  Schedule one
                </Link>
                .
              </>
            )}
          </p>
        )}
        <ul className="space-y-2">
          {(events as Pick<ClubEvent, "id" | "title" | "starts_at" | "location" | "capacity" | "status">[] | null)?.map((e) => (
            <li key={e.id}>
              <Link
                href={`/club/groups/${group.slug}/events/${e.id}`}
                className="card-moco p-4 block hover:border-court-green/30"
              >
                <div className="flex items-center justify-between gap-3">
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
                      · {e.location}
                    </div>
                  </div>
                  {e.status === "cancelled" && (
                    <span className="text-xs rounded bg-red-100 text-red-700 px-2 py-0.5">
                      cancelled
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
