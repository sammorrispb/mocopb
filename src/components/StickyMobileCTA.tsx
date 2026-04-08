"use client";

import { useState } from "react";
import { businessUrl } from "@/lib/tracking";
import { getBusinessById, type Business } from "@/lib/businesses";

export function StickyMobileCTA({ business: businessId = "hub" }: { business?: Business["id"] }) {
  const [dismissed, setDismissed] = useState(false);
  const biz = getBusinessById(businessId);

  if (dismissed) return null;

  return (
    <div className="sticky-mobile-cta md:hidden">
      <div className="flex items-center gap-3">
        <a
          href={businessUrl(biz, "sticky_mobile_cta", `${biz.id}_button`)}
          target="_blank"
          rel="noopener noreferrer"
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
