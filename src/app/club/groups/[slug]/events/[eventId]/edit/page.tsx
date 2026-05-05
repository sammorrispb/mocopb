import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireClubUser } from "@/lib/club/auth";
import type { ClubEvent, ClubGroup, GroupMemberRole } from "@/lib/club/types";

type Props = { params: Promise<{ slug: string; eventId: string }> };

async function updateEvent(formData: FormData) {
  "use server";
  const { user, supabase } = await requireClubUser();
  const slug = String(formData.get("slug"));
  const eventId = String(formData.get("event_id"));

  const { data: group } = await supabase
    .from("club_groups")
    .select("id")
    .eq("slug", slug)
    .maybeSingle<{ id: string }>();
  if (!group) redirect("/club");

  const { data: membership } = await supabase
    .from("club_group_members")
    .select("role")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle<{ role: GroupMemberRole }>();
  if (membership?.role !== "admin") redirect(`/club/groups/${slug}`);

  const action = String(formData.get("action") ?? "save");
  if (action === "cancel") {
    await supabase.from("club_events").update({ status: "cancelled" }).eq("id", eventId);
    revalidatePath(`/club/groups/${slug}/events/${eventId}`);
    revalidatePath(`/club/groups/${slug}`);
    revalidatePath(`/events`);
    redirect(`/club/groups/${slug}/events/${eventId}`);
  }

  const updates: Record<string, string | number | null> = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim(),
    starts_at: new Date(String(formData.get("starts_at"))).toISOString(),
    capacity: Number(formData.get("capacity") ?? 0),
  };
  const ends = String(formData.get("ends_at") ?? "");
  updates.ends_at = ends ? new Date(ends).toISOString() : null;

  await supabase.from("club_events").update(updates).eq("id", eventId);
  revalidatePath(`/club/groups/${slug}/events/${eventId}`);
  revalidatePath(`/club/groups/${slug}`);
  revalidatePath(`/events`);
  redirect(`/club/groups/${slug}/events/${eventId}`);
}

export default async function EditEventPage({ params }: Props) {
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

  const toLocal = (iso: string | null) => (iso ? iso.slice(0, 16) : "");

  return (
    <section className="py-10 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href={`/club/groups/${slug}/events/${event.id}`}
          className="text-sm text-text-muted hover:text-text-primary"
        >
          ← {event.title}
        </Link>
        <h1 className="font-heading font-bold text-2xl text-text-primary mt-1 mb-2">Edit event</h1>
        <p className="text-text-muted mb-6 text-sm">
          Changing time, location, or status notifies everyone registered or waitlisted.
        </p>

        <form action={updateEvent} className="space-y-4">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="event_id" value={event.id} />
          <Field label="Title" name="title" required defaultValue={event.title} />
          <Field
            label="Description"
            name="description"
            type="textarea"
            defaultValue={event.description ?? ""}
          />
          <Field label="Location" name="location" required defaultValue={event.location} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Starts" name="starts_at" type="datetime-local" required defaultValue={toLocal(event.starts_at)} />
            <Field label="Ends" name="ends_at" type="datetime-local" defaultValue={toLocal(event.ends_at)} />
          </div>
          <Field
            label="Capacity"
            name="capacity"
            type="number"
            required
            min={1}
            max={200}
            defaultValue={String(event.capacity)}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              name="action"
              value="save"
              className="flex-1 rounded-lg bg-court-green px-4 py-3 font-semibold text-white hover:bg-court-green/90"
            >
              Save changes
            </button>
            {event.status === "scheduled" && (
              <button
                type="submit"
                name="action"
                value="cancel"
                className="rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Cancel event
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  min?: number;
  max?: number;
};

function Field({ label, name, type = "text", ...rest }: FieldProps) {
  const className =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-court-green focus:outline-none focus:ring-1 focus:ring-court-green";
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea id={name} name={name} rows={3} className={className} {...rest} />
      ) : (
        <input id={name} name={name} type={type} className={className} {...rest} />
      )}
    </div>
  );
}
