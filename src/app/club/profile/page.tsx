import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireClubUser } from "@/lib/club/auth";
import type { ClubProfile, RegistrationStatus } from "@/lib/club/types";

async function updateProfile(formData: FormData) {
  "use server";
  const { user, supabase } = await requireClubUser();
  const display_name = String(formData.get("display_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  if (!display_name || display_name.length > 60) redirect("/club/profile?error=name");
  await supabase.from("club_profiles").update({ display_name, phone }).eq("id", user.id);
  revalidatePath("/club/profile");
  revalidatePath("/club");
  redirect("/club/profile");
}

type AttendanceRow = {
  id: string;
  status: RegistrationStatus;
  event_id: string;
  event: {
    id: string;
    title: string;
    starts_at: string;
    location: string;
    group: { slug: string; name: string } | null;
  } | null;
};

export default async function ProfilePage() {
  const { user, supabase } = await requireClubUser();

  const { data: profile } = await supabase
    .from("club_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<ClubProfile>();

  // Past registrations sorted newest-first.
  const { data: history } = await supabase
    .from("club_event_registrations")
    .select(
      "id, status, event_id, event:club_events(id, title, starts_at, location, group:club_groups(slug, name))"
    )
    .eq("user_id", user.id)
    .order("registered_at", { ascending: false })
    .limit(100)
    .returns<AttendanceRow[]>();

  const attended = (history ?? []).filter((r) => r.status === "attended").length;
  const past = (history ?? []).filter(
    (r) => r.event && new Date(r.event.starts_at) < new Date()
  );

  return (
    <section className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading font-bold text-3xl text-text-primary mb-6">Profile</h1>

        <form action={updateProfile} className="card-moco p-5 mb-8 space-y-4">
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-text-primary mb-1">
              Display name
            </label>
            <input
              id="display_name"
              name="display_name"
              maxLength={60}
              defaultValue={profile?.display_name ?? ""}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-court-green focus:outline-none focus:ring-1 focus:ring-court-green"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-court-green focus:outline-none focus:ring-1 focus:ring-court-green"
            />
          </div>
          <div className="text-sm text-text-muted">Email: {user.email}</div>
          <button
            type="submit"
            className="rounded-lg bg-court-green px-4 py-2 text-sm font-semibold text-white hover:bg-court-green/90"
          >
            Save
          </button>
        </form>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Sessions attended" value={attended} />
          <Stat label="Total RSVPs" value={(history ?? []).length} />
          <Stat label="Past events" value={past.length} />
        </div>

        <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">Attendance history</h2>
        {past.length === 0 ? (
          <p className="text-text-muted">No past events yet.</p>
        ) : (
          <ul className="space-y-2">
            {past.map((r) => (
              <li key={r.id} className="card-moco p-3 flex items-center justify-between gap-3">
                <div>
                  {r.event && r.event.group ? (
                    <Link
                      href={`/club/groups/${r.event.group.slug}/events/${r.event.id}`}
                      className="font-semibold text-text-primary hover:text-court-green"
                    >
                      {r.event.title}
                    </Link>
                  ) : (
                    <div className="font-semibold text-text-primary">{r.event?.title ?? "Event"}</div>
                  )}
                  <div className="text-xs text-text-muted">
                    {r.event ? new Date(r.event.starts_at).toLocaleDateString() : ""}{" "}
                    {r.event?.location && `· ${r.event.location}`}{" "}
                    {r.event?.group?.name && `· ${r.event.group.name}`}
                  </div>
                </div>
                <span className={`text-xs rounded px-2 py-0.5 ${badge(r.status)}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-moco p-4 text-center">
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}

function badge(s: RegistrationStatus) {
  switch (s) {
    case "attended":
      return "bg-court-green/10 text-court-green";
    case "no_show":
      return "bg-red-100 text-red-700";
    case "registered":
      return "bg-blue-100 text-blue-700";
    case "waitlisted":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
