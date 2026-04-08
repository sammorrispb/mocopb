import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";

export const metadata: Metadata = {
  title: "Pickleball Clinics in Montgomery County, MD",
  description:
    "Group pickleball clinics in Montgomery County, Maryland. Learn dinking, serving, strategy, and more. All skill levels at Dill Dinkers indoor facilities.",
};

const clinicTypes = [
  { title: "Beginner Clinics", desc: "Learn the fundamentals: grip, serve, return, basic court positioning. Perfect for first-time players.", level: "2.0 - 2.5" },
  { title: "Dinking & Kitchen Play", desc: "Master the soft game. Dink rallies, resets, and winning the kitchen battle.", level: "3.0+" },
  { title: "Serve & Return", desc: "Develop a reliable serve and aggressive return of serve. Placement over power.", level: "All Levels" },
  { title: "Strategy & Match Play", desc: "Game planning, shot selection, partner communication, and competitive scenarios.", level: "3.5+" },
];

export default function ClinicsPage() {
  const coachingUrl = "https://www.sammorrispb.com/programs?utm_source=mocopb&utm_medium=website&utm_campaign=clinics_page";

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

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-court-green to-teal rounded-2xl p-10 md:p-14">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
            Want personalized coaching?
          </h2>
          <p className="text-green-100 mb-8">
            Private lessons give you 1-on-1 attention with video analysis and custom drills.
          </p>
          <TrackedExternalLink
            href="https://www.sammorrispb.com/programs/coaching?utm_source=mocopb&utm_medium=website&utm_campaign=clinics_upsell"
            label="Book Private Lesson"
            page="clinics"
            className="btn-hub inline-block px-8 py-3.5 rounded-xl text-base font-bold shadow-lg"
          >
            Book a Private Lesson
          </TrackedExternalLink>
        </div>
      </section>
    </>
  );
}
