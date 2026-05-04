"use client";

export type AnalyticsEventMap = {
  cta_click: {
    label: string;
    page: string;
    destination: "coaching" | "nga" | "other" | "internal";
  };
  lead_form: {
    action: "started" | "submitted" | "error";
    interest: string;
    page: string;
  };
  external_link: {
    label: string;
    url: string;
    page: string;
  };
  scroll_depth: {
    depth: 25 | 50 | 75 | 100;
    page: string;
  };
  faq_expand: {
    question: string;
    page: string;
  };
};

const VISITOR_COOKIE = "ld_visitor";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;

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

// No-op since the unified funnel ingest (Hub) is offline as of 2026-05-02.
// Visitor cookie + analytics map are kept for future use.
/* eslint-disable @typescript-eslint/no-unused-vars */
export function trackEvent<K extends keyof AnalyticsEventMap>(
  name: K,
  props: AnalyticsEventMap[K],
  marketingRefOverride?: string,
): void {
  // intentionally empty
}
/* eslint-enable @typescript-eslint/no-unused-vars */
