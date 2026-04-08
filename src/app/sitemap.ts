import type { MetadataRoute } from "next";
import { courts } from "@/lib/courts";

const SITE_URL = "https://www.mocopb.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const courtPages = courts.map((court) => ({
    url: `${SITE_URL}/courts/${court.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/courts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...courtPages,
    { url: `${SITE_URL}/groups`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/find-players`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/lessons`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/youth`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/open-play`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/leagues`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/clinics`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
