import { redirect } from "next/navigation";
import { requireClubUser } from "@/lib/club/auth";
import type { ClubGroup } from "@/lib/club/types";

type Props = { params: Promise<{ invite_code: string }> };

export default async function JoinPage({ params }: Props) {
  const { invite_code } = await params;
  const { supabase } = await requireClubUser();

  const { data, error } = await supabase.rpc("club_accept_invite", { p_code: invite_code });

  if (error || !data) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-heading font-bold text-2xl text-text-primary mb-2">
            Invite invalid
          </h1>
          <p className="text-text-muted">
            That link doesn&apos;t match any group. Ask the host for a fresh one.
          </p>
        </div>
      </section>
    );
  }

  const group = data as ClubGroup;
  redirect(`/club/groups/${group.slug}`);
}
