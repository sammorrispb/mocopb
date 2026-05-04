export interface Business {
  id: "coaching" | "nga";
  name: string;
  tagline: string;
  description: string;
  url: string;
  ctaText: string;
}

export const businesses: Business[] = [
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
];

export function getBusinessById(id: Business["id"]): Business {
  return businesses.find((b) => b.id === id)!;
}
