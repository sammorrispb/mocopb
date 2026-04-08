"use client";

import { useState } from "react";
import { hubUrl } from "@/lib/tracking";

export function StickyMobileCTA() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="sticky-mobile-cta md:hidden">
      <div className="flex items-center gap-3">
        <a
          href={hubUrl("/", "sticky_mobile_cta", "join_button")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hub flex-1 text-center py-2.5 rounded-lg text-sm font-bold"
        >
          Join the Community
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
