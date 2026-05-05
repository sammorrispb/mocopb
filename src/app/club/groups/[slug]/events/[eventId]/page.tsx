import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireClubUser } from "@/lib/club/auth";
import type {
  ClubEvent,
  ClubEventRegistration,
  ClubGroup,
  ClubProfile,
  GroupMemberRole,
} from "@/lib/club/types";

type Props = { params: Promise<{ slug: string; eventId: string }> };

async function rsvp(formData: FormData) {
  "use server";
  const { user, supabase } = await requireClubUser();
  const eventId = String(formData.get("event_id"));
  const slug = String(formData.get("slug"));
  const action = String(formData.get("action"));
  const displayName = formData.get("display_name")?.toString().trim() ?? "";

  if (action === "register") {
    if (displayName.length >= 1 && displayName.length <= 60) {
      await supabase
        .from("club_profiles")
        .update({ display_name: displayName })
        .eq("id", user.id);
    }
    await supabase.rpc("club_register_for_event", { p_event_id: eventId });
  } else if (action === "cancel") {
    await supabase.rpc("club_cancel_registration", { p_event_id: eventId });
  }
  // Bust Router Cache so the redirect lands on a freshly-rendered page.
  revalidatePath(`/club/groups/${slug}/events/${eventId}`);
  revalidatePath(`/club/groups/${slug}`);
  revalidatePath(`/club`);
  redirect(`/club/groups/${slug}/events/${eventId}`);
}

export default async function EventDetailPage({ params }: Props) {
  const { slug, eventId } = await params;
  const { user, supabase } = await requireClubUser();

  const { data: group } = await supabase
    .from("club_groups")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<ClubGroup>();
  if (!group) notFound();

  const { data: event } = await supabase
    .from("club_events")
    .select("*")
    .eq("id", eventId)
    .eq("group_id", group.id)
    .maybeSingle<ClubEvent>();
  if (!event) notFound();

  const { data: membership } = await supabase
    .from("club_group_members")
    .select("role")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle<{ role: GroupMemberRole }>();
  if (!membership) notFound();
  const isAdmin = membership.role === "admin";

  const { data: myProfile } = await supabase
    .from("club_profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle<{ display_name: string }>();

  const emailLocal = user.email?.split("@")[0] ?? "";
  const isDefaultName =
    !myProfile?.display_name || myProfile.display_name === emailLocal;

  const { data: regs } = await supabase
    .from("club_event_registrations")
    .select(
      "id, user_id, status, position, registered_at, profile:club_profiles(display_name)"
    )
    .eq("event_id", event.id)
    .order("position", { ascending: true, nullsFirst: false })
    .order("registered_at", { ascending: true })
    .returns<
      (Pick<ClubEventRegistration, "id" | "user_id" | "status" | "position" | "registered_at"> & {
        profile: Pick<ClubProfile, "display_name"> | null;
      })[]
    >();

  const registered = (regs ?? []).filter((r) => r.status === "registered");
  const waitlisted = (regs ?? []).filter((r) => r.status === "waitlisted");
  const myReg = (regs ?? []).find((r) => r.user_id === user.id);
  const isFull = registered.length >= event.capacity;
  const isCancelledEvent = event.status === "cancelled";

  return (
    <section className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <nav className="text-sm text-text-muted flex flex-wrap items-center gap-1.5">
          <Link href="/club" className="hover:text-text-primary">
            ← Club
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/club/groups/${group.slug}`}
            className="hover:text-text-primary"
          >
            {group.name}
          </Link>
        </nav>

        <div className="flex items-start justify-between gap-3 mt-2 mb-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-text-primary">{event.title}</h1>
            <div className="text-text-muted mt-1">
              {new Date(event.starts_at).toLocaleString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
              {event.ends_at && (
                <>
                  {" – "}
                  {new Date(event.ends_at).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </>
              )}
            </div>
            <div className="text-text-muted">{event.location}</div>
          </div>
          {isCancelledEvent && (
            <span className="text-xs rounded bg-red-100 text-red-700 px-2 py-1">cancelled</span>
          )}
        </div>

        {event.description && (
          <p className="text-text-primary whitespace-pre-line mb-6">{event.description}</p>
        )}

        <div className="card-moco p-4 mb-6">
          {(() => {
            const userIsRegistered =
              !!myReg && (myReg.status === "registered" || myReg.status === "waitlisted");
            const showNameInput = !isCancelledEvent && !userIsRegistered && isDefaultName;
            return (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-text-muted">
                      {registered.length} / {event.capacity} registered
                      {waitlisted.length > 0 && ` · ${waitlisted.length} waitlisted`}
                    </div>
                    {myReg && (
                      <div className="mt-1 text-sm font-semibold text-text-primary">
                        You: {myReg.status}
                        {myReg.status === "waitlisted" && myReg.position
                          ? ` (#${myReg.position})`
                          : null}
                      </div>
                    )}
                  </div>
                  {!isCancelledEvent && (
                    <form action={rsvp} className="flex flex-col sm:flex-row sm:items-end gap-2 w-full sm:w-auto">
                      <input type="hidden" name="event_id" value={event.id} />
                      <input type="hidden" name="slug" value={group.slug} />
                      {showNameInput && (
                        <label className="flex flex-col text-xs text-text-muted">
                          <span className="mb-1 font-semibold text-text-primary">
                            Your name
                          </span>
                          <input
                            type="text"
                            name="display_name"
                            required
                            minLength={1}
                            maxLength={60}
                            placeholder="So others recognize you"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-text-primary focus:border-court-green focus:outline-none focus:ring-1 focus:ring-court-green"
                          />
                        </label>
                      )}
                      {userIsRegistered ? (
                        <button
                          name="action"
                          value="cancel"
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-text-primary hover:border-red-300 hover:text-red-600"
                        >
                          Cancel RSVP
                        </button>
                      ) : (
                        <button
                          name="action"
                          value="register"
                          className="rounded-lg bg-court-green px-4 py-2 text-sm font-semibold text-white hover:bg-court-green/90"
                        >
                          {isFull ? "Join waitlist" : "RSVP"}
                        </button>
                      )}
                    </form>
                  )}
                </div>
                {showNameInput && (
                  <p className="mt-3 text-xs text-text-muted">
                    Pick a name your group will recognize. You can change it later in your profile.
                  </p>
                )}
              </>
            );
          })()}
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href={`/club/groups/${group.slug}/events/${event.id}/edit`}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-court-green/50"
            >
              Edit event
            </Link>
            <Link
              href={`/club/groups/${group.slug}/events/${event.id}/attendance`}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-court-green/50"
            >
              Mark attendance
            </Link>
          </div>
        )}

        <h2 className="font-heading font-semibold text-lg text-text-primary mb-2">Going</h2>
        <ol className="mb-4 list-decimal list-inside">
          {registered.length === 0 && (
            <li className="text-text-muted text-sm list-none">Nobody yet — be first.</li>
          )}
          {registered.map((r) => (
            <li key={r.id} className="text-sm py-1">
              {r.profile?.display_name ?? "Player"}
            </li>
          ))}
        </ol>

        {waitlisted.length > 0 && (
          <>
            <h2 className="font-heading font-semibold text-lg text-text-primary mb-2">Waitlist</h2>
            <ul>
              {waitlisted.map((r) => (
                <li key={r.id} className="text-sm py-1">
                  #{r.position ?? "?"} {r.profile?.display_name ?? "Player"}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
