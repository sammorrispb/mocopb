"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  page: string;
  marketingRefOverride?: string;
};

export function TrackedExternalLink({
  label,
  page,
  href,
  onClick,
  children,
  marketingRefOverride,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      onClick={(e) => {
        trackEvent(
          "external_link",
          { label, url: href ?? "", page },
          marketingRefOverride,
        );
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
