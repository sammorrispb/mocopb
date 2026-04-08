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
    description: "Rockville is a pickleball hotspot with Dill Dinkers' premier indoor facility plus free outdoor courts at Bauer Drive and Mattie Stepanek Park.",
    neighborhoods: ["Twinbrook", "King Farm", "Fallsgrove", "Town Center"],
  },
  {
    slug: "north-bethesda",
    name: "North Bethesda",
    state: "MD",
    description: "North Bethesda offers indoor pickleball at Dill Dinkers' 9-court facility, making it one of the top places to play year-round in Montgomery County.",
    neighborhoods: ["Pike & Rose", "White Flint", "Garrett Park"],
  },
  {
    slug: "bethesda",
    name: "Bethesda",
    state: "MD",
    description: "Bethesda players enjoy easy access to Cabin John Regional Park's 6 outdoor courts and multiple indoor options nearby in Rockville and North Bethesda.",
    neighborhoods: ["Downtown Bethesda", "Cabin John", "Glen Echo"],
  },
  {
    slug: "potomac",
    name: "Potomac",
    state: "MD",
    description: "Potomac residents are minutes from Cabin John courts and Westleigh Recreation Club's dedicated lighted pickleball courts in North Potomac.",
    neighborhoods: ["North Potomac", "Travilah", "Darnestown"],
  },
  {
    slug: "olney",
    name: "Olney",
    state: "MD",
    description: "Olney Manor Recreational Park features 4 lighted outdoor courts, making it the go-to spot for pickleball players in northern Montgomery County.",
    neighborhoods: ["Brookeville", "Sandy Spring", "Ashton"],
  },
  {
    slug: "germantown",
    name: "Germantown",
    state: "MD",
    description: "Germantown Recreation Center offers indoor pickleball with county programs and open play sessions for all skill levels.",
    neighborhoods: ["Clarksburg", "Boyds", "Damascus"],
  },
  {
    slug: "silver-spring",
    name: "Silver Spring",
    state: "MD",
    description: "Silver Spring players can find outdoor courts at Wheaton Regional Park and connect with the growing MoCo pickleball community for regular games.",
    neighborhoods: ["Downtown Silver Spring", "Takoma Park", "Four Corners", "Wheaton"],
  },
  {
    slug: "wheaton",
    name: "Wheaton",
    state: "MD",
    description: "Wheaton Regional Park has 4 outdoor pickleball courts and is a popular spot for drop-in play, especially on weekends.",
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
