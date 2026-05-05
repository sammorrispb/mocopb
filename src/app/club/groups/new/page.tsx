import { redirect } from "next/navigation";
import { requireClubUser } from "@/lib/club/auth";
import type { ClubGroup } from "@/lib/club/types";

async function createGroup(formData: FormData) {
  "use server";
  const { supabase } = await requireClubUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const visibility = String(formData.get("visibility") ?? "invite") as "open" | "invite";

  if (!name) redirect("/club/groups/new?error=Group+name+is+required");
  if (name.length > 80) redirect("/club/groups/new?error=Group+name+too+long+(max+80)");

  const { data, error } = await supabase.rpc("club_create_group", {
    p_name: name,
    p_description: description,
    p_visibility: visibility,
  });

  if (error || !data) {
    const msg = error?.message ?? "Could not create group";
    redirect(`/club/groups/new?error=${encodeURIComponent(msg)}`);
  }

  const group = data as ClubGroup;
  redirect(`/club/groups/${group.slug}`);
}

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewGroupPage({ searchParams }: Props) {
  await requireClubUser();
  const { error } = await searchParams;

  return (
    <section className="py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">New group</h1>
        <p className="text-text-muted mb-6">
          Create a private group for your regular crew, or an open one anyone can find.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <strong className="font-semibold">Couldn&apos;t create the group:</strong> {error}
          </div>
        )}

        <form action={createGroup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Group name
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={1}
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
