import { NextResponse } from "next/server";

/**
 * Analytics proxy — forwards browser-fired analytics events to the
 * Open Brain analytics-ingest Edge Function with the shared-secret
 * header attached server-side so it never reaches the client.
 *
 * Required env vars:
 *   OPEN_BRAIN_ANALYTICS_URL — full URL of the analytics-ingest function
 *                              (e.g. https://lfazndedomuhgcssxkrx.supabase.co
 *                                    /functions/v1/analytics-ingest)
 *   LEAD_INGEST_TOKEN        — shared secret (already used for leads-ingest)
 *
 * Always responds 204 to keep the browser fire-and-forget pattern simple.
 * Failures are logged but never bubbled up to the client.
 */
export async function POST(request: Request) {
  const url = process.env.OPEN_BRAIN_ANALYTICS_URL;
  const token = process.env.LEAD_INGEST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[analytics] skipped — env vars missing");
    }
    return new NextResponse(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  // Forward as-is. analytics-ingest accepts a single event or array
  // batch (max 50). The client only ever sends one at a time today,
  // but pass-through arrays for forward-compat.
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lead-ingest-token": token,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[analytics] forward ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error("[analytics] forward failed:", err);
  }

  return new NextResponse(null, { status: 204 });
}
