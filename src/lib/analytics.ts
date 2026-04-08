import { track } from "@vercel/analytics";

type AnalyticsEventMap = {
  cta_click: { label: string; page: string; destination: "hub" | "coaching" | "nga" | "dd" | "other" | "internal" };
  lead_form: { action: "started" | "submitted" | "error"; interest: string; page: string };
  external_link: { label: string; url: string; page: string };
  nav_click: { label: string; device: "desktop" | "mobile" };
  scroll_depth: { depth: 25 | 50 | 75 | 100; page: string };
  faq_expand: { question: string; page: string };
};

export function trackEvent<K extends keyof AnalyticsEventMap>(
  name: K,
  props: AnalyticsEventMap[K],
) {
  track(name, props);
}
