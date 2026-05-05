import { NextResponse } from "next/server";
import { createClubServerClient } from "@/lib/club/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/club";

  if (code) {
    const supabase = await createClubServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL("/club/sign-in?error=auth", url.origin));
}
