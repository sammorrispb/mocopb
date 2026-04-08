export interface Event {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: "tournament" | "social" | "clinic" | "open-play" | "league";
  registrationUrl?: string;
  hubPath?: string;
  featured: boolean;
}

export const events: Event[] = [
  {
    slug: "spring-league-2026",
    title: "Spring DUPR League",
    date: "2026-04-14",
    time: "6:00 PM - 9:00 PM",
    location: "Dill Dinkers Rockville",
    description: "8-week DUPR-rated league. Teams of 4. Monday evenings. All skill levels with divisions.",
    type: "league",
    hubPath: "/",
    featured: true,
  },
  {
    slug: "beginners-welcome-clinic",
    title: "Beginners Welcome Clinic",
    date: "2026-04-19",
    time: "10:00 AM - 12:00 PM",
    location: "Dill Dinkers North Bethesda",
    description: "Free intro clinic for brand new players. Paddles provided. Learn the basics in 2 hours.",
    type: "clinic",
    hubPath: "/",
    featured: true,
  },
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
