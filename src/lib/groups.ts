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
    slug: "maryland-pickleball",
    name: "Maryland Pickleball",
    description: "Statewide Facebook community for Maryland pickleball players. Events, meetups, and court updates across MD.",
    skillLevel: "All Levels",
    meetingLocation: "Maryland",
    frequency: "Ongoing",
    platform: "facebook",
    externalUrl: "https://www.facebook.com/share/g/17Ua8L3wZh/",
    featured: true,
  },
  {
    slug: "pickleball-with-sam-morris-whatsapp",
    name: "Pickleball with Sam Morris",
    description: "WhatsApp group for Sam Morris's adult coaching students, clinic regulars, and lesson clients.",
    skillLevel: "All Levels",
    meetingLocation: "Montgomery County",
    frequency: "Ongoing",
    platform: "whatsapp",
    externalUrl: "https://chat.whatsapp.com/LaRjBQT8O5p5aJS5vSAk0i?mode=gi_t",
    featured: true,
  },
  {
    slug: "nga-youth-whatsapp",
    name: "Next Gen Academy — Youth WhatsApp",
    description: "WhatsApp group for families in the Next Gen Pickleball Academy youth program (ages 5–16).",
    skillLevel: "Youth",
    meetingLocation: "Montgomery County",
    frequency: "Ongoing",
    platform: "whatsapp",
    externalUrl: "https://chat.whatsapp.com/D298cbHYUZo53zdBkbafq8?mode=gi_t",
    featured: false,
  },
  {
    slug: "moco-4-5-plus-whatsapp",
    name: "4.5+ WhatsApp Group",
    description: "WhatsApp group for advanced players (DUPR/skill 4.5+) coordinating high-level games in MoCo.",
    skillLevel: "4.5+",
    meetingLocation: "Montgomery County",
    frequency: "Ongoing",
    platform: "whatsapp",
    externalUrl: "https://chat.whatsapp.com/ESO3mXeZJyoGVpvCZnRpcO?mode=gi_t",
    featured: false,
  },
];

export function getFeaturedGroups(): Group[] {
  return groups.filter((g) => g.featured);
}
