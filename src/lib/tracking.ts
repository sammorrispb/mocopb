import type { Business } from "./businesses";

const UTM_SOURCE = "mocopb";
const UTM_MEDIUM = "website";

export function businessUrl(
  business: Business,
  campaign: string = "general",
  content?: string,
  path?: string,
): string {
  const url = new URL(business.url);
  if (path) url.pathname = path;
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", UTM_MEDIUM);
  url.searchParams.set("utm_campaign", campaign);
  if (content) url.searchParams.set("utm_content", content);
  return url.toString();
}

// Family reciprocal nav: destination slug per business id. Used by both
// familyBusinessUrl (utm_content + ref=) and familyMarketingRef.
const FAMILY_DEST_SLUG: Record<Business["id"], string> = {
  coaching: "sammorrispb",
  nga: "nga",
  tournaments: "tournaments",
};

// SSR-safe reader for the `ld_visitor` cookie set by funnelClient.
// Returns null on the server, when the cookie is missing, or on any parse
// error (fail-open — family-nav links must keep working without the cookie).
function readLdVisitorCookie(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const pair = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ld_visitor="));
    if (!pair) return null;
    const value = decodeURIComponent(pair.slice("ld_visitor=".length));
    return value || null;
  } catch {
    return null;
  }
}

// Footer "Our Network" link URL with canonical family-nav UTMs. Matches the
// cross_family_nav / family_reciprocal scheme used by sibling sites.
// When the ld_visitor cookie is present, appends &ld_pid=<cookie> so the
// destination landing can adopt the anonymous trail across domains.
export function familyBusinessUrl(business: Business): string {
  const url = new URL(business.url);
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", "cross_family_nav");
  url.searchParams.set("utm_campaign", "family_reciprocal");
  url.searchParams.set("utm_content", `footer_${FAMILY_DEST_SLUG[business.id]}`);
  const ldPid = readLdVisitorCookie();
  if (ldPid) {
    url.searchParams.set("ld_pid", ldPid);
  }
  return url.toString();
}

// Per-destination marketing_ref for footer "Our Network" clicks so each
// sibling site sees a distinct cohort.
export function familyMarketingRef(business: Business): string {
  return `mocopb_footer_${FAMILY_DEST_SLUG[business.id]}`;
}

// Derive the unified funnel's marketing_ref from the current pathname.
// Maps city/business/courts/faq to stable refs; other pages fall back to the
// first path segment (or "mocopb" at the root).
export function getRefSource(pathname: string): string {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  if (!clean) return "mocopb";
  const segments = clean.split("/");
  const [first, second] = segments;
  if (first === "play" && second) return `mocopb_city_${second}`;
  if (first === "city" && second) return `mocopb_city_${second}`;
  if (first === "business" && second) return `mocopb_business_${second}`;
  if (first === "courts") return "mocopb_courts";
  if (first === "faq") return "mocopb_faq";
  return `mocopb_${first}`;
}
