"use client";

import { getBusinessById, type Business } from "@/lib/businesses";
import { businessUrl } from "@/lib/tracking";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";

const defaults: Record<
  Business["id"],
  { headline: string; subtext: string; buttonText: string }
> = {
  hub: {
    headline: "Ready to find your next game?",
    subtext:
      "Join 2,000+ pickleball players in Montgomery County. Get matched with players at your level, discover groups, and never miss an event.",
    buttonText: "Join the Community",
  },
  coaching: {
    headline: "Ready to improve your game?",
    subtext:
      "Private lessons, skill evaluations, and coaching for all levels. PPR-certified with 10+ years experience.",
    buttonText: "Book a Lesson",
  },
  nga: {
    headline: "Give your child the best start in pickleball",
    subtext:
      "Structured programs for kids ages 5-16. Four skill levels from beginner to advanced competitive.",
    buttonText: "Enroll Your Child",
  },
  dd: {
    headline: "Ready to play indoors?",
    subtext:
      "Premier indoor pickleball facilities in Rockville and North Bethesda. Open play, leagues, and events.",
    buttonText: "Visit Dill Dinkers",
  },
  tournaments: {
    headline: "Ready to compete?",
    subtext:
      "Link & Dink indoor tournaments at Dill Dinkers. Skill-based brackets, round-robin plus playoffs. Every team guaranteed 5+ games.",
    buttonText: "Find Your Bracket",
  },
};

interface BusinessCTAProps {
  business?: Business["id"];
  headline?: string;
  subtext?: string;
  buttonText?: string;
  campaign?: string;
  content?: string;
}

export function BusinessCTA({
  business: businessId = "hub",
  headline,
  subtext,
  buttonText,
  campaign = "business_cta",
  content = "inline_banner",
}: BusinessCTAProps) {
  const biz = getBusinessById(businessId);
  const d = defaults[businessId];

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-court-green to-teal rounded-2xl p-10 md:p-14">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
          {headline ?? d.headline}
        </h2>
        <p className="text-green-100 mb-8 max-w-lg mx-auto">
          {subtext ?? d.subtext}
        </p>
        <TrackedExternalLink
          href={businessUrl(biz, campaign, content)}
          label={buttonText ?? d.buttonText}
          page="business_cta"
          className="btn-hub inline-block px-8 py-3.5 rounded-xl text-base font-bold shadow-lg"
        >
          {buttonText ?? d.buttonText}
        </TrackedExternalLink>
      </div>
    </section>
  );
}
