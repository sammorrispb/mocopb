const HUB_BASE = "https://linkanddink.com";

export function hubUrl(
  path: string = "/",
  campaign: string = "mocopb_general",
  content?: string,
): string {
  const url = new URL(path, HUB_BASE);
  url.searchParams.set("utm_source", "mocopb");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", campaign);
  if (content) url.searchParams.set("utm_content", content);
  return url.toString();
}
