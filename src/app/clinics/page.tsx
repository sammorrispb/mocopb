import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { BusinessCTA } from "@/components/BusinessCTA";
import { LeadForm } from "@/components/LeadForm";
import { businessUrl } from "@/lib/tracking";
import { getBusinessById } from "@/lib/businesses";

export const metadata: Metadata = {
  title: "Pickleball Clinics in Montgomery County, MD",
  description:
    "Group pickleball clinics in Montgomery County, Maryland. Learn dinking, serving, strategy, and more. All skill levels at indoor courts in Montgomery County.",
};

const clinicTypes = [
  { title: "Beginner Clinics", desc: "Learn the fundamentals: grip, serve, return, basic court positioning. Perfect for first-time players.", level: "2.0 - 2.5" },
  { title: "Dinking & Kitchen Play", desc: "Master the soft game. Dink rallies, resets, and winning the kitchen battle.", level: "3.0+" },
  { title: "Serve & Return", desc: "Develop a reliable serve and aggressive return of serve. Placement over power.", level: "All Levels" },
  { title: "Strategy & Match Play", desc: "Game planning, shot selection, partner communication, and competitive scenarios.", level: "3.5+" },
];

export default function ClinicsPage() {
  const coachingUrl = businessUrl(getBusinessById("coaching"), "clinics_page", "hero", "/programs");

  return (
    <>
      <section className="hero-moco py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
            Pickleball Clinics in{" "}
            <span className="gradient-text-moco">Montgomery County</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-8">
            Group instruction focused on specific skills. More affordable than private lessons and a great way to improve while meeting other players.
          </p>
          <TrackedExternalLink
            href={coachingUrl}
            label="View Clinics"
            page="clinics"
            className="btn-hub px-8 py-3.5 rounded-xl text-base font-bold"
          >
            View Upcoming Clinics
          </TrackedExternalLink>
        </div>
      </section>

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-8">Clinic Types</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clinicTypes.map((c) => (
                <div key={c.title} className="card-moco p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg text-text-primary">{c.title}</h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-text-muted">{c.level}</span>
                  </div>
                  <p className="text-sm text-text-muted">{c.desc}</p>
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
            <h2 className="font-heading font-bold text-2xl text-text-primary">Stay in the Loop</h2>
            <p className="text-text-muted mt-2">Get notified about upcoming clinics and group instruction.</p>
          </div>
          <LeadForm page="clinics" defaultInterest="clinics" />
        </section>
      </AnimateOnScroll>

      {/* CTA */}
      <BusinessCTA
        business="coaching"
        campaign="clinics_cta"
        content="bottom_banner"
        headline="Want personalized coaching?"
        subtext="Private lessons give you 1-on-1 attention with video analysis and custom drills."
        buttonText="Book a Private Lesson"
      />
    </>
  );
}
