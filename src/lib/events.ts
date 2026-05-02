export interface Event {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: "tournament" | "social" | "clinic" | "open-play" | "league";
  registrationUrl?: string;
  featured: boolean;
}

export const events: Event[] = [
  {
    slug: "cabin-john-saturday-social",
    title: "Cabin John Saturday Social",
    date: "2026-04-19",
    time: "8:00 AM - 12:00 PM",
    location: "Cabin John Regional Park",
    description: "Weekly open play social at Cabin John. All levels. Bring your own paddle and water.",
    type: "social",
    featured: false,
  },
];

export function getUpcomingEvents(): Event[] {
  const now = new Date().toISOString().split("T")[0];
  return events
    .filter((e) => e.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getFeaturedEvents(): Event[] {
  return events.filter((e) => e.featured);
}

export const EVENT_TYPE_LABELS: Record<Event["type"], string> = {
  tournament: "Tournament",
  social: "Social",
  clinic: "Clinic",
  "open-play": "Open Play",
  league: "League",
};
