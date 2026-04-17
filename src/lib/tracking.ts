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

// Keep hubUrl for backward compatibility
export function hubUrl(
  path: string = "/",
  campaign: string = "mocopb_general",
  content?: string,
): string {
  const url = new URL(path, "https://linkanddink.com");
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", UTM_MEDIUM);
  url.searchParams.set("utm_campaign", campaign);
  if (content) url.searchParams.set("utm_content", content);
  return url.toString();
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
