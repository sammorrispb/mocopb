import { SITE_URL } from "@/lib/constants";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type EventInput = {
  name: string;
  startDate: string;
  endDate?: string;
  url?: string;
  description?: string;
  locationName: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  organizerName?: string;
  organizerUrl?: string;
  eventStatus?:
    | "EventScheduled"
    | "EventCancelled"
    | "EventPostponed"
    | "EventRescheduled"
    | "EventMovedOnline";
  eventAttendanceMode?:
    | "OfflineEventAttendanceMode"
    | "OnlineEventAttendanceMode"
    | "MixedEventAttendanceMode";
};

function absoluteUrl(href: string) {
  if (/^https?:\/\//i.test(href)) return href;
  return `${SITE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function eventJsonLd(event: EventInput) {
  const location = {
    "@type": "Place",
    name: event.locationName,
    ...(event.streetAddress || event.city
      ? {
          address: {
            "@type": "PostalAddress",
            ...(event.streetAddress ? { streetAddress: event.streetAddress } : {}),
            ...(event.city ? { addressLocality: event.city } : {}),
            addressRegion: event.region ?? "MD",
            ...(event.postalCode ? { postalCode: event.postalCode } : {}),
            addressCountry: event.country ?? "US",
          },
        }
      : {}),
  };

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: `https://schema.org/${event.eventStatus ?? "EventScheduled"}`,
    eventAttendanceMode: `https://schema.org/${event.eventAttendanceMode ?? "OfflineEventAttendanceMode"}`,
    location,
    ...(event.url ? { url: absoluteUrl(event.url) } : {}),
    ...(event.description ? { description: event.description } : {}),
    ...(event.organizerName
      ? {
          organizer: {
            "@type": "Organization",
            name: event.organizerName,
            ...(event.organizerUrl ? { url: event.organizerUrl } : {}),
          },
        }
      : {}),
  };
}
