import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Youth Pickleball Programs in Montgomery County, MD",
  description:
    "Next Gen Pickleball Academy: structured youth programs for kids ages 5-16 in Montgomery County, Maryland. Four skill levels, certified coaches, indoor facilities.",
};

const levels = [
  { name: "Red", ages: "5-8", desc: "First-time players. Grip, stance, basic serves, court awareness." },
  { name: "Orange", ages: "7-12", desc: "Developing players. Rallies, dinking, serve placement, scoring." },
  { name: "Green", ages: "10-14", desc: "Intermediate. Strategy, volleys, third shot drops, match play." },
  { name: "Yellow", ages: "12-16", desc: "Advanced competitive. Tournament prep, DUPR tracking, team play." },
];

export default function YouthPage() {
  const ngaUrl = "https://www.nextgenacademypb.com?utm_source=mocopb&utm_medium=website&utm_campaign=youth_page";

  return (
    <>
      <section className="hero-moco py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
            Youth Pickleball in{" "}
            <span className="gradient-text-moco">Montgomery County</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-8">
            Next Gen Pickleball Academy offers structured programs for kids ages 5-16 at Dill Dinkers facilities. The only dedicated youth academy in MoCo.
          </p>
          <TrackedExternalLink
            href={ngaUrl}
            label="Enroll Your Child"
            page="youth"
            className="btn-hub px-8 py-3.5 rounded-xl text-base font-bold"
          >
            Enroll Your Child
          </TrackedExternalLink>
        </div>
      </section>

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-text-primary text-center mb-10">
              Four Skill Levels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {levels.map((l) => (
                <div key={l.name} className="card-moco p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-heading font-bold text-lg text-text-primary">{l.name} Level</span>
                    <span className="text-xs font-semibold text-text-muted bg-gray-100 px-2 py-0.5 rounded">Ages {l.ages}</span>
                  </div>
                  <p className="text-sm text-text-muted">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-court-green to-teal rounded-2xl p-10 md:p-14">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
            Give your child the best start in pickleball
          </h2>
          <p className="text-green-100 mb-8">
            Certified coaches, indoor facilities, and a clear progression path.
          </p>
          <TrackedExternalLink
            href={ngaUrl}
            label="View Programs"
            page="youth"
            className="btn-hub inline-block px-8 py-3.5 rounded-xl text-base font-bold shadow-lg"
          >
            View Programs &amp; Schedule
          </TrackedExternalLink>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Next Gen Pickleball Academy — Youth Programs",
            description: "Structured youth pickleball programs for kids ages 5-16 in Montgomery County, MD.",
            provider: { "@type": "Organization", name: "Next Gen Pickleball Academy" },
            areaServed: { "@type": "AdministrativeArea", name: "Montgomery County, Maryland" },
            url: `${SITE_URL}/youth`,
          }),
        }}
      />
    </>
  );
}
