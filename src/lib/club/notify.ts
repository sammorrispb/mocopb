import { sendEmail } from "@/lib/send-email";
import { createClubServiceClient } from "@/lib/club/supabase-server";
import {
  rsvpConfirmedEmail,
  waitlistAddedEmail,
  waitlistPromotedEmail,
  eventChangedEmail,
  eventCancelledEmail,
  type ChangePayload,
  type EventCtx,
} from "@/lib/club/email-templates";
import type { ClubNotification } from "@/lib/club/types";

const MAX_ATTEMPTS = 3;

type EnrichedRow = {
  id: number;
  user_id: string;
  event_id: string | null;
  type: string;
  payload: Record<string, unknown>;
  attempts: number;
  email: string | null;
  event_title: string | null;
  event_starts_at: string | null;
  event_location: string | null;
  group_slug: string | null;
};

// Process up to `limit` pending or failed-with-attempts<3 notifications.
// Returns counts for telemetry.
export async function processPendingNotifications(limit = 50) {
  const svc = createClubServiceClient();
  const { data: pending } = await svc
    .from("club_notifications")
    .select("id, user_id, event_id, type, payload, attempts")
    .in("status", ["pending", "failed"])
    .lt("attempts", MAX_ATTEMPTS)
    .order("created_at", { ascending: true })
    .limit(limit)
    .returns<Pick<ClubNotification, "id" | "user_id" | "event_id" | "type" | "payload" | "attempts">[]>();

  if (!pending || pending.length === 0) return { sent: 0, failed: 0, dropped: 0 };

  const userIds = [...new Set(pending.map((n) => n.user_id))];
  const eventIds = [...new Set(pending.map((n) => n.event_id).filter((x): x is string => !!x))];

  const [emails, events] = await Promise.all([
    fetchEmailsForUsers(userIds),
    fetchEventCtxs(eventIds),
  ]);

  let sent = 0;
  let failed = 0;
  let dropped = 0;

  for (const n of pending) {
    const enriched: EnrichedRow = {
      id: n.id,
      user_id: n.user_id,
      event_id: n.event_id,
      type: n.type,
      payload: n.payload,
      attempts: n.attempts,
      email: emails.get(n.user_id) ?? null,
      event_title: events.get(n.event_id ?? "")?.title ?? null,
      event_starts_at: events.get(n.event_id ?? "")?.starts_at ?? null,
      event_location: events.get(n.event_id ?? "")?.location ?? null,
      group_slug: events.get(n.event_id ?? "")?.group_slug ?? null,
    };

    if (!enriched.email) {
      // No email on file — give up so we don't loop forever.
      await svc
        .from("club_notifications")
        .update({ status: "failed", attempts: MAX_ATTEMPTS, error: "no email on file" })
        .eq("id", n.id);
      dropped++;
      continue;
    }

    const tpl = renderTemplate(enriched);
    if (!tpl) {
      await svc
        .from("club_notifications")
        .update({ status: "failed", attempts: MAX_ATTEMPTS, error: `unknown type ${n.type}` })
        .eq("id", n.id);
      dropped++;
      continue;
    }

    try {
      await sendEmail({ to: enriched.email, subject: tpl.subject, html: tpl.html });
      await svc
        .from("club_notifications")
        .update({ status: "sent", sent_at: new Date().toISOString(), error: null })
        .eq("id", n.id);
      sent++;
    } catch (err) {
      await svc
        .from("club_notifications")
        .update({
          status: "failed",
          attempts: enriched.attempts + 1,
          error: err instanceof Error ? err.message : String(err),
        })
        .eq("id", n.id);
      failed++;
    }
  }

  return { sent, failed, dropped };
}

function renderTemplate(n: EnrichedRow) {
  if (!n.event_title || !n.event_starts_at || !n.event_location || !n.group_slug || !n.event_id) {
    // Some notifications need an event; if missing, skip.
    return null;
  }
  const ctx: EventCtx = {
    title: n.event_title,
    starts_at: n.event_starts_at,
    location: n.event_location,
    group_slug: n.group_slug,
    event_id: n.event_id,
  };
  switch (n.type) {
    case "rsvp_confirmed":
      return rsvpConfirmedEmail(ctx);
    case "waitlist_added":
      return waitlistAddedEmail(ctx, (n.payload?.position as number | null) ?? null);
    case "waitlist_promoted":
      return waitlistPromotedEmail(ctx);
    case "event_changed":
      return eventChangedEmail(ctx, n.payload as ChangePayload);
    case "event_cancelled":
      return eventCancelledEmail(ctx);
    default:
      return null;
  }
}

async function fetchEmailsForUsers(userIds: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (userIds.length === 0) return out;
  const svc = createClubServiceClient();
  // auth.users.email lookup — only available via service role.
  const { data } = await svc
    .schema("auth" as never)
    .from("users" as never)
    .select("id, email")
    .in("id", userIds);
  for (const u of (data ?? []) as { id: string; email: string | null }[]) {
    if (u.email) out.set(u.id, u.email);
  }
  return out;
}

type EventCtxRow = {
  title: string;
  starts_at: string;
  location: string;
  group_slug: string;
};

async function fetchEventCtxs(eventIds: string[]): Promise<Map<string, EventCtxRow>> {
  const out = new Map<string, EventCtxRow>();
  if (eventIds.length === 0) return out;
  const svc = createClubServiceClient();
  const { data } = await svc
    .from("club_events")
    .select("id, title, starts_at, location, group:club_groups(slug)")
    .in("id", eventIds)
    .returns<
      {
        id: string;
        title: string;
        starts_at: string;
        location: string;
        group: { slug: string } | null;
      }[]
    >();
  for (const e of data ?? []) {
    out.set(e.id, {
      title: e.title,
      starts_at: e.starts_at,
      location: e.location,
      group_slug: e.group?.slug ?? "",
    });
  }
  return out;
}
