export interface Group {
  slug: string;
  name: string;
  description: string;
  memberCount?: number;
  skillLevel: string;
  meetingLocation: string;
  frequency: string;
  platform: "facebook" | "whatsapp" | "meetup" | "other";
  externalUrl?: string;
  featured: boolean;
}

export const groups: Group[] = [
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
    featured: true,
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
    featured: true,
  },
];

export function getFeaturedGroups(): Group[] {
  return groups.filter((g) => g.featured);
}
