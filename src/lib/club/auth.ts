import { redirect } from "next/navigation";
import { createClubServerClient } from "./supabase-server";

export async function getClubUser() {
  const supabase = await createClubServerClient();
  const { data } = await supabase.auth.getUser();
  return { user: data.user ?? null, supabase };
}

export async function requireClubUser() {
  const { user, supabase } = await getClubUser();
  if (!user) redirect("/club/sign-in");
  return { user, supabase };
}
