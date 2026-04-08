"use client";

import { usePathname } from "next/navigation";
import { StickyMobileCTA } from "./StickyMobileCTA";
import type { Business } from "@/lib/businesses";

function getBusinessForPath(pathname: string): Business["id"] {
  if (pathname === "/lessons" || pathname === "/clinics") return "coaching";
  if (pathname === "/youth") return "nga";
  if (pathname.startsWith("/courts/dill-dinkers-")) return "dd";
  return "hub";
}

export function StickyMobileCTARouter() {
  const pathname = usePathname();
  const businessId = getBusinessForPath(pathname);

  return <StickyMobileCTA business={businessId} />;
}
