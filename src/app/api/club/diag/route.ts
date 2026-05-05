import { NextResponse } from "next/server";

// Diagnostic endpoint — TEMPORARY, removed after E2E confirms env coverage.
// Returns boolean presence of env vars, never the values.
export async function GET() {
  return NextResponse.json({
    has_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    has_service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    has_cron: !!process.env.CRON_SECRET,
    has_gmail_user: !!process.env.GMAIL_USER,
    has_gmail_pass: !!process.env.GMAIL_APP_PASSWORD,
  });
}
