import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireClubUser } from "@/lib/club/auth";
import type { ClubGroup, ClubProfile, GroupMemberRole } from "@/lib/club/types";

type Props = { params: Promise<{ slug: string }> };

async function leaveOrRemove(formData: FormData) {
  "use server";
  const { user, supabase } = await requireClubUser();
  const groupId = String(formData.get("group_id"));
  const userId = String(formData.get("user_id"));
  const slug = String(formData.get("slug"));

  await supabase
    .from("club_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  revalidatePath(`/club/groups/${slug}/members`);
  revalidatePath(`/club/groups/${slug}`);
  revalidatePath(`/club`);
  redirect(userId === user.id ? "/club" : `/club/groups/${slug}/members`);
}

export default async function MembersPage({ params }: Props) {
  const { slug } = await params;
  const { user, supabase } = await requireClubUser();

  const { data: group } = await supabase
    .from("club_groups")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<ClubGroup>();
  if (!group) notFound();

  const { data: myMembership } = await supabase
    .from("club_group_members")
    .select("role")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle<{ role: GroupMemberRole }>();
  if (!myMembership) notFound();

  const { data: members } = await supabase
    .from("club_group_members")
    .select("role, joined_at, user_id, profile:club_profiles(display_name, avatar_url)")
    .eq("group_id", group.id)
    .order("role", { ascending: true })
    .order("joined_at", { ascending: true })
    .returns<
      {
        role: GroupMemberRole;
        joined_at: string;
        user_id: string;
        profile: Pick<ClubProfile, "display_name" | "avatar_url"> | null;
      }[]
    >();

  const isAdmin = myMembership.role === "admin";
  const inviteUrl = `/club/join/${group.invite_code}`;

  return (
    <section className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/club/groups/${group.slug}`}
            className="text-sm text-text-muted hover:text-text-primary"
          >
            ← {group.name}
          </Link>
          <h1 className="font-heading font-bold text-2xl text-text-primary mt-1">Members</h1>
        </div>

        {isAdmin && (
          <div className="card-moco p-4 mb-6">
            <div className="text-sm font-semibold text-text-primary mb-1">Invite link</div>
            <div className="text-sm text-text-muted break-all">
              <code>{inviteUrl}</code>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Anyone with this link can join. Share it in WhatsApp, email, etc.
            </p>
          </div>
        )}

        <ul className="space-y-2">
          {members?.map((m) => (
            <li key={m.user_id} className="card-moco p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">
                  {m.profile?.display_name ?? "Player"}
                  {m.role === "admin" && (
                    <span className="ml-2 text-xs rounded bg-court-green/10 text-court-green px-2 py-0.5">
                      admin
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-muted">
                  joined {new Date(m.joined_at).toLocaleDateString()}
                </div>
              </div>
              {(m.user_id === user.id || isAdmin) && (
                <form action={leaveOrRemove}>
                  <input type="hidden" name="group_id" value={group.id} />
                  <input type="hidden" name="user_id" value={m.user_id} />
                  <input type="hidden" name="slug" value={group.slug} />
                  <button
                    type="submit"
                    className="text-sm text-text-muted hover:text-red-600"
                  >
                    {m.user_id === user.id ? "Leave" : "Remove"}
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
