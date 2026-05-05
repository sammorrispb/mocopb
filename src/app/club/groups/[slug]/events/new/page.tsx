import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireClubUser } from "@/lib/club/auth";
import type { ClubGroup, GroupMemberRole } from "@/lib/club/types";

type Props = { params: Promise<{ slug: string }> };

async function createEvent(formData: FormData) {
  "use server";
  const { user, supabase } = await requireClubUser();

  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "");
  const endsAt = String(formData.get("ends_at") ?? "") || null;
  const capacity = Number(formData.get("capacity") ?? 0);

  const { data: group } = await supabase
    .from("club_groups")
    .select("id")
    .eq("slug", slug)
    .maybeSingle<{ id: string }>();
  if (!group) redirect(`/club`);

  if (!title || !location || !startsAt || capacity < 1 || capacity > 200) {
    redirect(`/club/groups/${slug}/events/new?error=fields`);
  }

  const { data: created, error } = await supabase
    .from("club_events")
    .insert({
      group_id: group.id,
      title,
      description,
      location,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      capacity,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (error || !created) {
    redirect(`/club/groups/${slug}/events/new?error=${encodeURIComponent(error?.message ?? "create")}`);
  }
  redirect(`/club/groups/${slug}/events/${created.id}`);
}

export default async function NewEventPage({ params }: Props) {
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
  if (membership?.role !== "admin") notFound();

  // Default start: tomorrow 6pm local. Datetime-local input wants YYYY-MM-DDTHH:mm.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(18, 0, 0, 0);
  const defaultStart = tomorrow.toISOString().slice(0, 16);

  return (
    <section className="py-10 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href={`/club/groups/${group.slug}`}
          className="text-sm text-text-muted hover:text-text-primary"
        >
          ← {group.name}
        </Link>
        <h1 className="font-heading font-bold text-2xl text-text-primary mt-1 mb-6">New event</h1>

        <form action={createEvent} className="space-y-4">
          <input type="hidden" name="slug" value={group.slug} />
          <Field label="Title" name="title" required maxLength={120} />
          <Field
            label="Description"
            name="description"
            type="textarea"
            placeholder="Skill level, format, what to bring…"
          />
          <Field
            label="Location"
            name="location"
            required
            placeholder="e.g. Olney Manor — Court 3"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Starts" name="starts_at" type="datetime-local" required defaultValue={defaultStart} />
            <Field label="Ends (optional)" name="ends_at" type="datetime-local" />
          </div>
          <Field label="Capacity" name="capacity" type="number" required min={1} max={200} defaultValue="8" />
          <button
            type="submit"
            className="w-full rounded-lg bg-court-green px-4 py-3 font-semibold text-white hover:bg-court-green/90"
          >
            Create event
          </button>
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
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
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
