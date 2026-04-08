"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function ScrollDepthTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const thresholds = [25, 50, 75, 100] as const;
    const fired = new Set<number>();

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const t of thresholds) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", { depth: t, page: pathname });
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}
