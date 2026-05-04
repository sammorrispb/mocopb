"use client";

export type AnalyticsEventMap = {
  page_view: {
    referrer?: string;
  };
  cta_click: {
    label: string;
    page?: string;
    destination?: string;
  };
  lead_form: {
    action: "started" | "submitted" | "error";
    interest: string;
    page: string;
  };
  lead_form_started: {
    interest?: string;
    page?: string;
  };
  lead_form_submitted: {
    interest?: string;
    page?: string;
  };
  external_link: {
    label: string;
    url: string;
    page?: string;
  };
  faq_expand: {
    question: string;
    page: string;
  };
  // Retained in the map for type compatibility with any older callers,
  // but trackEvent() never forwards it. See BUSINESS_NAME constraint.
  scroll_depth: {
    depth: 25 | 50 | 75 | 100;
    page: string;
  };
};

const VISITOR_COOKIE = "ld_visitor";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;
const UTM_SESSION_KEY = "ld_utm";
export const BUSINESS_NAME = "mocopb" as const;

export type CapturedUtm = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref?: string;
};

function generateVisitorId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const pair = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${VISITOR_MAX_AGE}; Path=/; SameSite=Lax`;
}

export function getOrCreateVisitorId(): string {
  const existing = readCookie(VISITOR_COOKIE);
  if (existing) return existing;
  const id = generateVisitorId();
  writeCookie(VISITOR_COOKIE, id);
  return id;
}

/**
 * Safe visitor-id accessor for use inside form submit handlers.
 * Returns null on the server (no document/cookie) so it can be
 * forwarded as `visitor_id: getVisitorIdForForm()` without branching.
 */
export function getVisitorIdForForm(): string | null {
  if (typeof document === "undefined") return null;
  return getOrCreateVisitorId();
}

/**
 * Reads UTM/ref params from the current URL and stashes them in
 * sessionStorage under `ld_utm`. Idempotent — once captured, won't
 * overwrite on subsequent calls within the same session.
 */
export function captureUtm(): void {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") return;

  try {
    if (sessionStorage.getItem(UTM_SESSION_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const utm: CapturedUtm = {};
    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    const content = params.get("utm_content");
    const term = params.get("utm_term");
    const ref = params.get("ref");

    if (source) utm.utm_source = source;
    if (medium) utm.utm_medium = medium;
    if (campaign) utm.utm_campaign = campaign;
    if (content) utm.utm_content = content;
    if (term) utm.utm_term = term;
    if (ref) utm.ref = ref;

    if (Object.keys(utm).length > 0) {
      sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(utm));
    }
  } catch {
    // sessionStorage can throw in privacy-mode browsers — fail-open.
  }
}

export function getUtm(): CapturedUtm {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CapturedUtm;
  } catch {
    return {};
  }
}

function safeBeacon(url: string, payload: unknown): boolean {
  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      return navigator.sendBeacon(url, blob);
    }
  } catch {
    // fall through to fetch
  }
  return false;
}

/**
 * Fire an analytics event to the server-side proxy, which forwards
 * to Open Brain's analytics-ingest. Never throws. Drops scroll_depth
 * (intentionally not forwarded).
 */
export function trackEvent<K extends keyof AnalyticsEventMap>(
  name: K,
  props: AnalyticsEventMap[K],
  // marketingRefOverride retained for API compatibility with previous
  // callers; not currently forwarded since OB ingest derives source
  // server-side. Safe to drop in a follow-up cleanup.
  _marketingRefOverride?: string,
): void {
  void _marketingRefOverride;
  if (typeof window === "undefined") return;
  if (name === "scroll_depth") return;

  try {
    const visitor_id = getOrCreateVisitorId();
    const utm = getUtm();
    const page =
      typeof location !== "undefined" ? location.pathname : undefined;

    const body = {
      event_name: name,
      props: {
        ...(props as Record<string, unknown>),
        visitor_id,
        ...utm,
        business: BUSINESS_NAME,
      },
      page,
    };

    const url = "/api/analytics";
    if (safeBeacon(url, body)) return;

    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {
      // swallow — analytics must never break the UX
    });
  } catch {
    // never throw
  }
}
