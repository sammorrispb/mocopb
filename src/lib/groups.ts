export interface Group {
  slug: string;
  name: string;
  description: string;
  memberCount?: number;
  skillLevel: string;
  meetingLocation: string;
  frequency: string;
  platform: "linkanddink" | "facebook" | "whatsapp" | "meetup" | "other";
  hubPath?: string;
  externalUrl?: string;
  featured: boolean;
}

export const groups: Group[] = [
  {
    slug: "dd-rockville-open-play",
    name: "Dill Dinkers Rockville Open Play",
    description: "Daily open play sessions at DD Rockville. All skill levels welcome. Reserve your spot through CourtReserve.",
    memberCount: 350,
    skillLevel: "All Levels",
    meetingLocation: "Dill Dinkers Rockville",
    frequency: "Daily",
    platform: "linkanddink",
    hubPath: "/",
    featured: true,
  },
  {
    slug: "dd-north-bethesda-open-play",
    name: "Dill Dinkers North Bethesda Open Play",
    description: "Daily open play sessions at DD North Bethesda. All skill levels. Reserve through CourtReserve.",
    memberCount: 280,
    skillLevel: "All Levels",
    meetingLocation: "Dill Dinkers North Bethesda",
    frequency: "Daily",
    platform: "linkanddink",
    hubPath: "/",
    featured: true,
  },
  {
    slug: "cabin-john-morning-crew",
    name: "Cabin John Morning Crew",
    description: "Early morning open play at Cabin John Regional Park. Regulars show up by 7am. Friendly group, all levels.",
    skillLevel: "3.0-4.0",
    meetingLocation: "Cabin John Regional Park",
    frequency: "Daily (weather permitting)",
    platform: "whatsapp",
    featured: false,
  },
  {
    slug: "moco-pickleball-md",
    name: "MoCo Pickleball MD",
    description: "Community Facebook group for Montgomery County pickleball players. Events, meetups, and court updates.",
    memberCount: 500,
    skillLevel: "All Levels",
    meetingLocation: "Various MoCo locations",
    frequency: "Ongoing",
    platform: "facebook",
    externalUrl: "https://www.facebook.com/groups/mocopickleballmd",
    featured: false,
  },
  {
    slug: "dmv-pickleball",
    name: "DMV Pickleball",
    description: "Broader DC/Maryland/Virginia pickleball community. Tournaments, leagues, and social play across the DMV.",
    skillLevel: "All Levels",
    meetingLocation: "DMV Area",
    frequency: "Ongoing",
    platform: "facebook",
    externalUrl: "https://www.facebook.com/groups/DMVPickleball",
    featured: false,
  },
  {
    slug: "link-and-dink-community",
    name: "Link & Dink Community",
    description: "The MoCo pickleball community platform. Find players, join groups, track your skill level, and get matched for games.",
    memberCount: 2000,
    skillLevel: "All Levels",
    meetingLocation: "Montgomery County",
    frequency: "Always on",
    platform: "linkanddink",
    hubPath: "/",
    featured: true,
  },
];

export function getFeaturedGroups(): Group[] {
  return groups.filter((g) => g.featured);
}
