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
    address: "14900 Dufief Mill Road",
    city: "North Potomac",
    zip: "20878",
    coordinates: { lat: 39.0963, lng: -77.1962 },
    courtCount: 4,
    surface: "Dedicated lighted pickleball courts",
    amenities: ["Lights", "Parking", "Restrooms"],
    hours: "Members only — check with club for hours",
    website: "https://www.westleighclub.com",
    notes: "Private club. Multiple dedicated, lighted pickleball courts. Membership tiers available. Home base of MoCo Pickleball coaching.",
  },
  {
    slug: "bauer-drive-local-park",
    name: "Bauer Drive Local Park",
    type: "outdoor",
    address: "14536 Bauer Drive",
    city: "Rockville",
    zip: "20853",
    coordinates: { lat: 39.0920, lng: -77.1220 },
    courtCount: 2,
    surface: "Asphalt",
    amenities: ["Lights", "Parking"],
    hours: "Dawn to dusk. Lights available evenings.",
    notes: "Free. Popular morning and evening open play. First come, first served.",
  },
  {
    slug: "mattie-stepanek-park",
    name: "Mattie Stepanek Park",
    type: "outdoor",
    address: "1800 Piccard Drive",
    city: "Rockville",
    zip: "20850",
    coordinates: { lat: 39.0892, lng: -77.1856 },
    courtCount: 2,
    surface: "Asphalt",
    amenities: ["Parking", "Restrooms", "Playground"],
    hours: "Dawn to dusk",
    notes: "Free. Open play available — popular with morning and evening players.",
  },
];

export function getCourtBySlug(slug: string): Court | undefined {
  return courts.find((c) => c.slug === slug);
}

export function getFeaturedCourts(): Court[] {
  return courts.filter((c) => c.featured);
}
