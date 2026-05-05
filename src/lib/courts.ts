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
    slug: "bauer-drive-local-park",
    name: "Bauer Drive Local Park",
    type: "outdoor",
    address: "14536 Bauer Drive",
    city: "Rockville",
    zip: "20853",
    coordinates: { lat: 39.0920, lng: -77.1220 },
    courtCount: 6,
    surface: "Dedicated lighted pickleball courts",
    amenities: ["Lights", "Parking"],
    hours: "Dawn to dusk. Lights available evenings.",
    website: "https://montgomeryparks.org/parks-and-trails/bauer-drive-local-park/",
    notes: "Free. Six dedicated lighted courts — Montgomery Parks' first dedicated pickleball facility (opened October 2021). Popular morning and evening open play. First come, first served.",
    featured: true,
  },
  {
    slug: "mattie-stepanek-park",
    name: "Mattie Stepanek Park",
    type: "outdoor",
    address: "1800 Piccard Drive",
    city: "Rockville",
    zip: "20850",
    coordinates: { lat: 39.0892, lng: -77.1856 },
    courtCount: 4,
    surface: "Dedicated lighted pickleball courts",
    amenities: ["Lights", "Parking", "Restrooms", "Playground"],
    hours: "Dawn to dusk",
    website: "https://www.rockvillemd.gov/places/mattie-j-t-stepanek-park/",
    notes: "Free. Four dedicated lighted courts. Open play available — popular with morning and evening players.",
  },
  {
    slug: "olney-mill-neighborhood-park",
    name: "Olney Mill Neighborhood Park",
    type: "outdoor",
    address: "19600 Charline Manor Rd",
    city: "Olney",
    zip: "20832",
    coordinates: { lat: 39.1683, lng: -77.0683 },
    courtCount: 4,
    surface: "Dedicated lighted pickleball courts",
    amenities: ["Lights", "Parking"],
    hours: "Dawn to dusk. Lights available evenings.",
    notes: "Free. Four lined and lit dedicated courts — the go-to spot for pickleball players in Olney and northern Montgomery County.",
  },
  {
    slug: "seven-locks-local-park",
    name: "Seven Locks Local Park",
    type: "outdoor",
    address: "6922 Seven Locks Road",
    city: "Bethesda",
    zip: "20818",
    coordinates: { lat: 38.9847, lng: -77.1559 },
    courtCount: 2,
    surface: "Dedicated pickleball courts",
    amenities: ["Parking", "Playground"],
    hours: "Sunrise to sunset",
    website: "https://montgomeryparks.org/parks-and-trails/seven-locks-local-park/",
    notes: "Free. Two dedicated courts in the Cabin John area. First come, first served.",
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
    notes: "Private club. Dedicated lighted pickleball courts. Membership tiers available.",
  },
  {
    slug: "germantown-recreation-center",
    name: "Germantown Recreation Center",
    type: "indoor",
    address: "18905 Kingsview Road",
    city: "Germantown",
    zip: "20874",
    coordinates: { lat: 39.1732, lng: -77.2716 },
    courtCount: 4,
    surface: "Gymnasium floor",
    amenities: ["Parking", "Restrooms", "Water fountain"],
    hours: "Varies by schedule — check MoCo Rec for open play times",
    website: "https://www.montgomerycountymd.gov/rec",
    notes: "County recreation center. Registration may be required for programs.",
  },
];

export function getCourtBySlug(slug: string): Court | undefined {
  return courts.find((c) => c.slug === slug);
}

export function getFeaturedCourts(): Court[] {
  return courts.filter((c) => c.featured);
}
