export interface Business {
  id: "hub" | "coaching" | "nga" | "dd" | "tournaments";
  name: string;
  tagline: string;
  description: string;
  url: string;
  ctaText: string;
}

export const businesses: Business[] = [
  {
    id: "hub",
    name: "Link & Dink",
    tagline: "Find Your People",
    description: "Connect with 2,000+ pickleball players in MoCo. Find groups, get matched, and never play alone.",
    url: "https://linkanddink.com",
    ctaText: "Join the Community",
  },
  {
    id: "coaching",
    name: "Coach Sam Morris",
    tagline: "Level Up Your Game",
    description: "Private lessons, skill evaluations, and coaching for all levels. PPR-certified with 10+ years experience.",
    url: "https://www.sammorrispb.com",
    ctaText: "Book a Lesson",
  },
  {
    id: "nga",
    name: "Next Gen Academy",
    tagline: "Youth Pickleball",
    description: "Structured programs for kids ages 5-16. Four skill levels from beginner to advanced competitive.",
    url: "https://www.nextgenacademypb.com",
    ctaText: "Enroll Your Child",
  },
  {
    id: "dd",
    name: "Dill Dinkers",
    tagline: "Indoor Courts",
    description: "Premier indoor pickleball facilities in Rockville and North Bethesda. Open play, leagues, and events.",
    url: "https://dilldinkers.com",
    ctaText: "Visit Dill Dinkers",
  },
  {
    id: "tournaments",
    name: "LD Tournament Series",
    tagline: "Compete in MoCo",
    description: "Link & Dink indoor pickleball tournaments at Dill Dinkers. Skill-based brackets, round-robin + playoffs. Every team guaranteed 5+ games.",
    url: "https://tournamentwebsite.vercel.app",
    ctaText: "Find Your Bracket",
  },
];

export function getBusinessById(id: Business["id"]): Business {
  return businesses.find((b) => b.id === id)!;
}
