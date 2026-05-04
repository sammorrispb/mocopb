"use client";

import { usePathname } from "next/navigation";
import { StickyMobileCTA } from "./StickyMobileCTA";
import type { Business } from "@/lib/businesses";

function getBusinessForPath(pathname: string): Business["id"] {
  if (pathname === "/youth") return "nga";
  return "coaching";
}

export function StickyMobileCTARouter() {
  const pathname = usePathname();
  const businessId = getBusinessForPath(pathname);

  return <StickyMobileCTA business={businessId} />;
}
