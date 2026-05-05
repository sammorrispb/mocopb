import { courts } from "./courts";

export interface City {
  slug: string;
  name: string;
  state: "MD";
  description: string;
  neighborhoods?: string[];
}

export const cities: City[] = [
  {
    slug: "rockville",
    name: "Rockville",
    state: "MD",
    description: "Rockville is a pickleball hotspot, home to free outdoor courts at Bauer Drive and Mattie Stepanek Park, with strong open-play communities.",
    neighborhoods: ["Twinbrook", "King Farm", "Fallsgrove", "Town Center"],
  },
  {
    slug: "north-bethesda",
    name: "North Bethesda",
    state: "MD",
    description: "North Bethesda players are minutes from outdoor courts in the Cabin John area and active MoCo open-play groups.",
    neighborhoods: ["Pike & Rose", "White Flint", "Garrett Park"],
  },
  {
    slug: "bethesda",
    name: "Bethesda",
    state: "MD",
    description: "Bethesda players enjoy easy access to Seven Locks Local Park in the Cabin John area and a vibrant local pickleball community.",
    neighborhoods: ["Downtown Bethesda", "Cabin John", "Glen Echo"],
  },
  {
    slug: "potomac",
    name: "Potomac",
    state: "MD",
    description: "Potomac residents are close to Westleigh Recreation Club's dedicated lighted pickleball courts in North Potomac.",
    neighborhoods: ["North Potomac", "Travilah", "Darnestown"],
  },
  {
    slug: "olney",
    name: "Olney",
    state: "MD",
    description: "Olney Mill Neighborhood Park features 4 lined and lighted outdoor courts, making it the go-to spot for pickleball players in northern Montgomery County.",
    neighborhoods: ["Brookeville", "Sandy Spring", "Ashton"],
  },
  {
    slug: "germantown",
    name: "Germantown",
    state: "MD",
    description: "Germantown players have access to indoor courts at the Germantown Recreation Center and county-park programs for all skill levels.",
    neighborhoods: ["Clarksburg", "Boyds", "Damascus"],
  },
  {
    slug: "silver-spring",
    name: "Silver Spring",
    state: "MD",
    description: "Silver Spring players connect with the growing MoCo pickleball community and travel to nearby outdoor courts in Wheaton, Rockville, and Olney.",
    neighborhoods: ["Downtown Silver Spring", "Takoma Park", "Four Corners", "Wheaton"],
  },
  {
    slug: "wheaton",
    name: "Wheaton",
    state: "MD",
    description: "Wheaton sits between MoCo's busiest outdoor pickleball spots — Bauer Drive in Rockville and Olney Mill in Olney — making it a convenient base for regular drop-in play.",
    neighborhoods: ["Glenmont", "Kensington", "Aspen Hill"],
  },
  {
    slug: "gaithersburg",
    name: "Gaithersburg",
    state: "MD",
    description: "Gaithersburg players are close to courts in both Rockville and Germantown. The area's growing pickleball community organizes regular open play and social events.",
    neighborhoods: ["Kentlands", "Lakeforest", "Quince Orchard", "Washingtonian"],
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getCourtsForCity(cityName: string): typeof courts {
  return courts.filter(
    (c) => c.city.toLowerCase() === cityName.toLowerCase() ||
    // Match nearby cities
    (cityName === "Bethesda" && c.city === "North Bethesda") ||
    (cityName === "Potomac" && (c.city === "North Potomac" || c.city === "Bethesda")) ||
    (cityName === "Silver Spring" && c.city === "Wheaton") ||
    (cityName === "Gaithersburg" && (c.city === "Rockville" || c.city === "Germantown"))
  );
}
