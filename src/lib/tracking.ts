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
