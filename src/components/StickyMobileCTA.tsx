"use client";

import { useState } from "react";
import { businessUrl } from "@/lib/tracking";
import { getBusinessById, type Business } from "@/lib/businesses";
import { trackEvent } from "@/lib/analytics";

export function StickyMobileCTA({ business: businessId = "coaching" }: { business?: Business["id"] }) {
  const [dismissed, setDismissed] = useState(false);
  const biz = getBusinessById(businessId);

  if (dismissed) return null;

  const href = businessUrl(biz, "sticky_mobile_cta", `${biz.id}_button`);

  return (
    <div className="sticky-mobile-cta md:hidden">
      <div className="flex items-center gap-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("cta_click", {
              label: biz.ctaText,
              destination: biz.url,
              page: "sticky_mobile_cta",
            });
            trackEvent("external_link", {
              label: biz.ctaText,
              url: href,
              page: "sticky_mobile_cta",
            });
          }}
          className="btn-hub flex-1 text-center py-2.5 rounded-lg text-sm font-bold"
        >
          {biz.ctaText}
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-text-muted p-1"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
