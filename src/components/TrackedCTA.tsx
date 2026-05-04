"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedCTAProps = ComponentProps<typeof Link> & {
  label: string;
  destination?: string;
  children: ReactNode;
};

/**
 * Internal-link CTA wrapper that fires a `cta_click` analytics event
 * before navigating. Use for primary buttons like "Find Courts",
 * "Book a Lesson", etc. For external links, prefer TrackedExternalLink.
 */
export function TrackedCTA({
  label,
  destination,
  href,
  onClick,
  children,
  ...rest
}: TrackedCTAProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    trackEvent("cta_click", {
      label,
      destination: destination ?? (typeof href === "string" ? href : undefined),
    });
    onClick?.(e);
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
