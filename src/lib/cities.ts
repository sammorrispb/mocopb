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
    description: "Rockville is Montgomery County's pickleball hotspot — home to Bauer Drive Local Park (6 dedicated lighted courts), Mattie Stepanek Park (4 lighted), Broome Athletic Park, Dogwood Park, and a network of City of Rockville bring-your-own-net courts at parks like Welsh and Civic Center.",
    neighborhoods: ["Twinbrook", "King Farm", "Fallsgrove", "Town Center"],
  },
  {
    slug: "north-bethesda",
    name: "North Bethesda",
    state: "MD",
    description: "North Bethesda players are minutes from outdoor courts in the Cabin John area (Seven Locks Local Park) and the YMCA Bethesda-Chevy Chase, plus easy reach to Rockville's free dedicated courts.",
    neighborhoods: ["Pike & Rose", "White Flint", "Garrett Park"],
  },
  {
    slug: "bethesda",
    name: "Bethesda",
    state: "MD",
    description: "Bethesda players have access to Seven Locks Local Park (2 dedicated courts) in the Cabin John area and the YMCA Bethesda-Chevy Chase — Bethesda's primary public-access pickleball options.",
    neighborhoods: ["Downtown Bethesda", "Cabin John", "Glen Echo"],
  },
  {
    slug: "potomac",
    name: "Potomac",
    state: "MD",
    description: "Potomac residents are close to Westleigh Recreation Club (private, dedicated lighted courts) in North Potomac and Buck Branch Neighborhood Park (free, striped on tennis) for drop-in play.",
    neighborhoods: ["North Potomac", "Travilah", "Darnestown"],
  },
  {
    slug: "olney",
    name: "Olney",
    state: "MD",
    description: "Olney Mill Neighborhood Park features 4 lined and lighted dedicated courts, making it the go-to spot for pickleball players in northern Montgomery County.",
    neighborhoods: ["Brookeville", "Sandy Spring", "Ashton"],
  },
  {
    slug: "germantown",
    name: "Germantown",
    state: "MD",
    description: "Germantown players have indoor courts at the Germantown Recreation Center (4) and Plum Gar Recreation Center (2), plus outdoor striped courts at South Gunner's Branch Local Park.",
    neighborhoods: ["Clarksburg", "Boyds", "Damascus"],
  },
  {
    slug: "silver-spring",
    name: "Silver Spring",
    state: "MD",
    description: "Silver Spring is loaded with options: East Norbeck Local Park (6 dedicated lighted courts — M-NCPPC's flagship hub), Argyle, Cannon Road, and Calverton-Galway parks (striped outdoor), the Long Branch and Mid-County rec centers (indoor), and the YMCA Silver Spring.",
    neighborhoods: ["Downtown Silver Spring", "Takoma Park", "Four Corners", "Wheaton"],
  },
  {
    slug: "wheaton",
    name: "Wheaton",
    state: "MD",
    description: "Wheaton's primary verified pickleball venue is Wheaton Indoor Tennis (3 bays striped during designated windows). Free outdoor dedicated courts at Bauer Drive (Rockville) and Olney Mill (Olney) are a short drive away. The Rubini Athletic Complex outdoor project is currently in design phase.",
    neighborhoods: ["Glenmont", "Kensington", "Aspen Hill"],
  },
  {
    slug: "gaithersburg",
    name: "Gaithersburg",
    state: "MD",
    description: "Gaithersburg's flagship is the Activity Center at Bohrer Park (7 indoor courts — the largest year-round indoor program in MoCo), plus Diamond Farm Park for outdoor summer play and easy reach to Rockville and Germantown courts.",
    neighborhoods: ["Kentlands", "Lakeforest", "Quince Orchard", "Washingtonian"],
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getCourtsForCity(cityName: string): typeof courts {
  return courts.filter(
    (c) => c.city.toLowerCase() === cityName.toLowerCase() ||
    // Match nearby cities (post-codes/communities that fall under a SEO city page)
    (cityName === "Bethesda" && c.city === "North Bethesda") ||
    (cityName === "Potomac" && (c.city === "North Potomac" || c.city === "Bethesda")) ||
    (cityName === "Silver Spring" && (c.city === "Wheaton" || c.city === "Burtonsville")) ||
    (cityName === "Gaithersburg" && (c.city === "Rockville" || c.city === "Germantown"))
  );
}
