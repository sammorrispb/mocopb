import { trackEvent as trackFunnelEvent, type AnalyticsEventMap } from "./funnelClient";

export type { AnalyticsEventMap };

export function trackEvent<K extends keyof AnalyticsEventMap>(
  name: K,
  props: AnalyticsEventMap[K],
  marketingRefOverride?: string,
) {
  trackFunnelEvent(name, props, marketingRefOverride);
}
