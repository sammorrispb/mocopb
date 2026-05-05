import { redirect } from "next/navigation";
import { requireClubUser } from "@/lib/club/auth";

async function createGroup(formData: FormData) {
  "use server";
  const { user, supabase } = await requireClubUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const visibility = String(formData.get("visibility") ?? "invite") as "open" | "invite";

  if (!name || name.length > 80) {
    redirect("/club/groups/new?error=name");
  }

  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32) || "group";

  // Try base, then base-2, base-3, … in case of collision.
  let slug = baseSlug;
  for (let i = 0; i < 5; i++) {
    const { data, error } = await supabase
      .from("club_groups")
      .insert({ slug, name, description, visibility, created_by: user.id })
      .select("slug")
      .single();
    if (!error && data) {
      redirect(`/club/groups/${data.slug}`);
    }
    if (error && error.code !== "23505") {
      // Not a unique-violation — surface the real error.
      redirect(`/club/groups/new?error=${encodeURIComponent(error.message)}`);
    }
    slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
  }
  redirect("/club/groups/new?error=slug");
}

export default async function NewGroupPage() {
  await requireClubUser();
  return (
    <section className="py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">New group</h1>
        <p className="text-text-muted mb-6">
          Create a private group for your regular crew, or an open one anyone can find.
        </p>

        <form action={createGroup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Group name
            </label>
            <input
              id="name"
              name="name"
              required
              maxLength={80}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-court-green focus:outline-none focus:ring-1 focus:ring-court-green"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-court-green focus:outline-none focus:ring-1 focus:ring-court-green"
            />
          </div>
          <fieldset>
            <legend className="block text-sm font-medium text-text-primary mb-2">Visibility</legend>
            <label className="flex items-start gap-2 mb-2 cursor-pointer">
              <input type="radio" name="visibility" value="invite" defaultChecked className="mt-1" />
              <span>
                <span className="font-semibold text-text-primary">Invite only</span>
                <span className="block text-sm text-text-muted">
                  Members join via your invite link.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="radio" name="visibility" value="open" className="mt-1" />
              <span>
                <span className="font-semibold text-text-primary">Open</span>
                <span className="block text-sm text-text-muted">
                  Anyone signed in can find and join.
                </span>
              </span>
            </label>
          </fieldset>
          <button
            type="submit"
            className="w-full rounded-lg bg-court-green px-4 py-3 font-semibold text-white hover:bg-court-green/90"
          >
            Create group
          </button>
        </form>
      </div>
    </section>
  );
}
