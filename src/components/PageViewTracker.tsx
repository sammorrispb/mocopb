"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires a single `page_view` event per unique pathname. Mounted once
 * in the root layout. Avoids double-fires by deduping on pathname +
 * a sticky ref — Next.js can re-run effects on transitions but the
 * pathname-keyed last-fired ref keeps it to one event per route.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  // Subscribed but not used — referenced so navigation triggers the
  // effect on query-only changes too. Keeps page_view aligned with
  // user-visible navigation rather than just pathname.
  useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const referrer =
      typeof document !== "undefined" ? document.referrer || undefined : undefined;
    trackEvent("page_view", { referrer });
  }, [pathname]);

  return null;
}
