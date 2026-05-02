import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { BusinessCTA } from "@/components/BusinessCTA";
import { LeadForm } from "@/components/LeadForm";
import { businessUrl } from "@/lib/tracking";
import { getBusinessById } from "@/lib/businesses";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pickleball Lessons in Montgomery County, MD",
  description:
    "Private pickleball lessons and coaching in Montgomery County, Maryland. PPR-certified coach, all skill levels, video analysis, and DUPR skill evaluations.",
};

const benefits = [
  { title: "All Skill Levels", desc: "From first-time players to 5.0+ competitors" },
  { title: "Video Analysis", desc: "See your game from a coach's perspective" },
  { title: "Custom Practice Plans", desc: "Drills and strategies tailored to your goals" },
  { title: "DUPR Evaluations", desc: "Get your official rating from a certified coach" },
  { title: "Flexible Scheduling", desc: "Weekday and weekend availability" },
  { title: "Indoor Facilities", desc: "Climate-controlled indoor courts in Montgomery County" },
];

export default function LessonsPage() {
  const coachingUrl = businessUrl(getBusinessById("coaching"), "lessons_page", "hero", "/programs/coaching");

  return (
    <>
      {/* Hero */}
      <section className="hero-moco py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
            Pickleball Lessons in{" "}
            <span className="gradient-text-moco">Montgomery County</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-8">
            Work with PPR-certified Coach Sam Morris. Private lessons, group clinics, and skill evaluations for all levels at indoor courts in Montgomery County.
          </p>
          <TrackedExternalLink
            href={coachingUrl}
            label="Book a Lesson"
            page="lessons"
            className="btn-hub px-8 py-3.5 rounded-xl text-base font-bold"
          >
            Book a Lesson
          </TrackedExternalLink>
        </div>
      </section>

      {/* Benefits */}
      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-text-primary text-center mb-10">
              What You Get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((b) => (
                <div key={b.title} className="card-moco p-5">
                  <h3 className="font-heading font-semibold text-text-primary mb-1">{b.title}</h3>
                  <p className="text-sm text-text-muted">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Lead Form */}
      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="font-heading font-bold text-2xl text-text-primary">Get Started</h2>
            <p className="text-text-muted mt-2">Tell us what you need and we&apos;ll point you in the right direction.</p>
          </div>
          <LeadForm page="lessons" defaultInterest="lessons" />
        </section>
      </AnimateOnScroll>

      {/* CTA */}
      <BusinessCTA business="coaching" campaign="lessons_cta" content="bottom_banner" />

      {/* Service schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Pickleball Lessons — Coach Sam Morris",
            description: "Private pickleball lessons and coaching in Montgomery County, MD. PPR-certified, all levels.",
            provider: { "@type": "Person", name: "Sam Morris" },
            areaServed: { "@type": "AdministrativeArea", name: "Montgomery County, Maryland" },
            url: `${SITE_URL}/lessons`,
          }),
        }}
      />
    </>
  );
}
