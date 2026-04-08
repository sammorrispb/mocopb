export interface Court {
  slug: string;
  name: string;
  type: "indoor" | "outdoor";
  address: string;
  city: string;
  zip: string;
  coordinates: { lat: number; lng: number };
  courtCount: number;
  surface: string;
  amenities: string[];
  hours: string;
  website?: string;
  phone?: string;
  notes?: string;
  hubGroupSlug?: string;
  featured?: boolean;
}

export const courts: Court[] = [
  {
    slug: "dill-dinkers-rockville",
    name: "Dill Dinkers Rockville",
    type: "indoor",
    address: "40C Southlawn Court",
    city: "Rockville",
    zip: "20850",
    coordinates: { lat: 39.0753, lng: -77.1249 },
    courtCount: 8,
    surface: "Indoor sport court",
    amenities: ["Pro shop", "Lessons", "Leagues", "Tournaments", "Parking", "Restrooms"],
    hours: "Mon-Fri 6am-10pm, Sat-Sun 7am-9pm",
    website: "https://dilldinkers.com",
    phone: "240-912-4579",
    notes: "Membership required. Drop-in available.",
    featured: true,
  },
  {
    slug: "dill-dinkers-north-bethesda",
    name: "Dill Dinkers North Bethesda",
    type: "indoor",
    address: "4942 Boiling Brook Pkwy",
    city: "North Bethesda",
    zip: "20852",
    coordinates: { lat: 39.0334, lng: -77.1144 },
    courtCount: 9,
    surface: "Indoor sport court",
    amenities: ["Pro shop", "Lessons", "Leagues", "Tournaments", "Parking", "Restrooms"],
    hours: "Mon-Fri 6am-10pm, Sat-Sun 7am-9pm",
    website: "https://dilldinkers.com",
    phone: "240-912-4579",
    notes: "Membership required. Drop-in available.",
    featured: true,
  },
  {
    slug: "cabin-john-regional-park",
    name: "Cabin John Regional Park",
    type: "outdoor",
    address: "7400 Tuckerman Lane",
    city: "Bethesda",
    zip: "20817",
    coordinates: { lat: 39.0294, lng: -77.1386 },
    courtCount: 6,
    surface: "Asphalt",
    amenities: ["Lights", "Parking", "Restrooms", "Water fountain"],
    hours: "Dawn to dusk (lit courts until 11pm)",
    website: "https://montgomeryparks.org",
    notes: "Free. First come, first served. Very popular — arrive early on weekends.",
    featured: true,
  },
  {
    slug: "olney-manor-recreational-park",
    name: "Olney Manor Recreational Park",
    type: "outdoor",
    address: "16601 Georgia Ave",
    city: "Olney",
    zip: "20832",
    coordinates: { lat: 39.1531, lng: -77.0669 },
    courtCount: 4,
    surface: "Asphalt",
    amenities: ["Lights", "Parking", "Restrooms"],
    hours: "Dawn to dusk (lit courts until 11pm)",
    notes: "Free. First come, first served.",
  },
  {
    slug: "wheaton-regional-park",
    name: "Wheaton Regional Park",
    type: "outdoor",
    address: "2000 Shorefield Road",
    city: "Wheaton",
    zip: "20902",
    coordinates: { lat: 39.0651, lng: -77.0478 },
    courtCount: 4,
    surface: "Asphalt",
    amenities: ["Parking", "Restrooms"],
    hours: "Dawn to dusk",
    notes: "Free. First come, first served.",
  },
  {
    slug: "germantown-recreation-center",
    name: "Germantown Recreation Center",
    type: "indoor",
    address: "18905 Kingsview Road",
    city: "Germantown",
    zip: "20874",
    coordinates: { lat: 39.1732, lng: -77.2716 },
    courtCount: 3,
    surface: "Gymnasium floor",
    amenities: ["Parking", "Restrooms", "Water fountain"],
    hours: "Varies by schedule — check MoCo Rec for open play times",
    website: "https://www.montgomerycountymd.gov/rec",
    notes: "County recreation center. Registration may be required for programs.",
  },
  {
    slug: "westleigh-recreation-club",
    name: "Westleigh Recreation Club",
    type: "outdoor",
    address: "7805 Westleigh Drive",
    city: "Bethesda",
    zip: "20817",
    coordinates: { lat: 39.0195, lng: -77.1475 },
    courtCount: 2,
    surface: "Asphalt",
    amenities: ["Parking"],
    hours: "Members only — check with club for hours",
    notes: "Private club. Membership required.",
  },
  {
    slug: "montgomery-tennisplex",
    name: "Montgomery TennisPlex at Cabin John",
    type: "indoor",
    address: "7801 Democracy Blvd",
    city: "Bethesda",
    zip: "20817",
    coordinates: { lat: 39.0282, lng: -77.1451 },
    courtCount: 4,
    surface: "Indoor hard court",
    amenities: ["Pro shop", "Lessons", "Parking", "Restrooms", "Food"],
    hours: "Mon-Fri 6am-10pm, Sat-Sun 7am-8pm",
    website: "https://www.montgomerytennisplex.com",
    notes: "Primarily a tennis facility with dedicated pickleball courts and programs.",
    featured: true,
  },
];

export function getCourtBySlug(slug: string): Court | undefined {
  return courts.find((c) => c.slug === slug);
}

export function getFeaturedCourts(): Court[] {
  return courts.filter((c) => c.featured);
}
