import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireClubUser } from "@/lib/club/auth";
import type {
  ClubEvent,
  ClubEventRegistration,
  ClubGroup,
  ClubProfile,
  GroupMemberRole,
} from "@/lib/club/types";

type Props = { params: Promise<{ slug: string; eventId: string }> };

async function markOne(formData: FormData) {
  "use server";
  const { supabase } = await requireClubUser();
  const regId = String(formData.get("reg_id"));
  const slug = String(formData.get("slug"));
  const eventId = String(formData.get("event_id"));
  const attended = String(formData.get("attended")) === "true";
  await supabase.rpc("club_mark_attendance", { p_reg_id: regId, p_attended: attended });
  redirect(`/club/groups/${slug}/events/${eventId}/attendance`);
}

export default async function AttendancePage({ params }: Props) {
  const { slug, eventId } = await params;
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
  if (membership?.role !== "admin") notFound();

  const { data: event } = await supabase
    .from("club_events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle<ClubEvent>();
  if (!event) notFound();

  const { data: regs } = await supabase
    .from("club_event_registrations")
    .select("id, user_id, status, profile:club_profiles(display_name)")
    .eq("event_id", event.id)
    .in("status", ["registered", "attended", "no_show"])
    .returns<
      (Pick<ClubEventRegistration, "id" | "user_id" | "status"> & {
        profile: Pick<ClubProfile, "display_name"> | null;
      })[]
    >();

  return (
    <section className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/club/groups/${slug}/events/${event.id}`}
          className="text-sm text-text-muted hover:text-text-primary"
        >
          ← {event.title}
        </Link>
        <h1 className="font-heading font-bold text-2xl text-text-primary mt-1 mb-6">
          Mark attendance
        </h1>

        {(!regs || regs.length === 0) && (
          <p className="text-text-muted">No registered players to mark.</p>
        )}

        <ul className="space-y-2">
          {regs?.map((r) => (
            <li key={r.id} className="card-moco p-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-text-primary">
                  {r.profile?.display_name ?? "Player"}
                </div>
                <div className="text-xs text-text-muted">
                  Status: <span className="font-medium">{r.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <MarkButton
                  reg_id={r.id}
                  slug={slug}
                  event_id={event.id}
                  attended
                  active={r.status === "attended"}
                  label="Attended"
                  action={markOne}
                />
                <MarkButton
                  reg_id={r.id}
                  slug={slug}
                  event_id={event.id}
                  attended={false}
                  active={r.status === "no_show"}
                  label="No show"
                  action={markOne}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MarkButton({
  reg_id,
  slug,
  event_id,
  attended,
  active,
  label,
  action,
}: {
  reg_id: string;
  slug: string;
  event_id: string;
  attended: boolean;
  active: boolean;
  label: string;
  action: (fd: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="reg_id" value={reg_id} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="event_id" value={event_id} />
      <input type="hidden" name="attended" value={String(attended)} />
      <button
        type="submit"
        className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
          active
            ? "bg-court-green text-white"
            : "border border-gray-300 text-text-primary hover:border-court-green/50"
        }`}
      >
        {label}
      </button>
    </form>
  );
}

