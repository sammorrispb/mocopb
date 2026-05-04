"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/funnelClient";

/**
 * Mount once in the root layout. Captures UTM/ref params from the
 * landing URL into sessionStorage so subsequent analytics events
 * (and the lead form POST) can attach the original attribution.
 */
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);
  return null;
}
