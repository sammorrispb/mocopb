// Email templates for /club notifications. Plain HTML, mobile-friendly.
// Keep style minimal — no images, no external CSS.

const SHELL = (subject: string, body: string) => `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a2e1a; max-width: 560px; margin: 0 auto; padding: 24px;">
<h1 style="font-size: 20px; margin: 0 0 16px;">${subject}</h1>
${body}
<hr style="margin-top: 32px; border: 0; border-top: 1px solid #e2e8f0;" />
<p style="font-size: 12px; color: #64748b; margin-top: 16px;">
  MoCo PB Club — <a href="https://mocopb.com/club" style="color: #0d7c5f;">mocopb.com/club</a>
</p>
</body></html>`;

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
    });
  } catch {
    return iso;
  }
};

export type EventCtx = {
  title: string;
  starts_at: string;
  location: string;
  group_slug: string;
  event_id: string;
};

export type ChangePayload = {
  starts_at_old?: string;
  starts_at_new?: string;
  location_old?: string;
  location_new?: string;
  status_old?: string;
  status_new?: string;
};

export function rsvpConfirmedEmail(ctx: EventCtx) {
  const subject = `RSVP confirmed: ${ctx.title}`;
  const link = `https://mocopb.com/club/groups/${ctx.group_slug}/events/${ctx.event_id}`;
  return {
    subject,
    html: SHELL(
      subject,
      `<p>You're in for <strong>${ctx.title}</strong> on ${fmtDate(ctx.starts_at)} at ${ctx.location}.</p>
       <p><a href="${link}" style="color: #0d7c5f;">View event</a></p>`
    ),
  };
}

export function waitlistAddedEmail(ctx: EventCtx, position: number | null) {
  const subject = `You're on the waitlist: ${ctx.title}`;
  const link = `https://mocopb.com/club/groups/${ctx.group_slug}/events/${ctx.event_id}`;
  return {
    subject,
    html: SHELL(
      subject,
      `<p><strong>${ctx.title}</strong> is full — you're #${position ?? "?"} on the waitlist.</p>
       <p>We'll email you the moment a spot opens.</p>
       <p><a href="${link}" style="color: #0d7c5f;">View event</a></p>`
    ),
  };
}

export function waitlistPromotedEmail(ctx: EventCtx) {
  const subject = `You're in! ${ctx.title}`;
  const link = `https://mocopb.com/club/groups/${ctx.group_slug}/events/${ctx.event_id}`;
  return {
    subject,
    html: SHELL(
      subject,
      `<p>A spot opened up for <strong>${ctx.title}</strong> on ${fmtDate(ctx.starts_at)} at ${ctx.location}. You're now registered.</p>
       <p>If you can no longer make it, please cancel from the event page so the next person can move up.</p>
       <p><a href="${link}" style="color: #0d7c5f;">View event</a></p>`
    ),
  };
}

export function eventChangedEmail(ctx: EventCtx, changes: ChangePayload) {
  const subject = `Updated: ${ctx.title}`;
  const link = `https://mocopb.com/club/groups/${ctx.group_slug}/events/${ctx.event_id}`;
  const lines: string[] = [];
  if (changes.starts_at_old !== changes.starts_at_new) {
    lines.push(
      `<li><strong>Time:</strong> ${fmtDate(changes.starts_at_old ?? "")} → <strong>${fmtDate(changes.starts_at_new ?? "")}</strong></li>`
    );
  }
  if (changes.location_old !== changes.location_new) {
    lines.push(
      `<li><strong>Location:</strong> ${changes.location_old ?? ""} → <strong>${changes.location_new ?? ""}</strong></li>`
    );
  }
  return {
    subject,
    html: SHELL(
      subject,
      `<p>The host updated <strong>${ctx.title}</strong>:</p>
       <ul>${lines.join("")}</ul>
       <p><a href="${link}" style="color: #0d7c5f;">View event</a></p>`
    ),
  };
}

export function eventCancelledEmail(ctx: EventCtx) {
  const subject = `Cancelled: ${ctx.title}`;
  return {
    subject,
    html: SHELL(
      subject,
      `<p><strong>${ctx.title}</strong> on ${fmtDate(ctx.starts_at)} at ${ctx.location} was cancelled by the host.</p>
       <p>Sorry for the change of plans.</p>`
    ),
  };
}
