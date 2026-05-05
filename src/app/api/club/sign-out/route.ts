import { NextResponse } from "next/server";
import { createClubServerClient } from "@/lib/club/supabase-server";

export async function POST(request: Request) {
  const supabase = await createClubServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/club/sign-in", request.url), { status: 303 });
}
