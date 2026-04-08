import type { Metadata } from "next";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { LeadForm } from "@/components/LeadForm";
import { BusinessGrid } from "@/components/BusinessGrid";
import { HubCTA } from "@/components/HubCTA";

export const metadata: Metadata = {
  title: "Pickleball Leagues in Montgomery County, MD",
  description:
    "Join DUPR-rated pickleball leagues in Montgomery County, Maryland. Weekly matches at Dill Dinkers, organized by skill level. Spring, summer, fall, and winter seasons.",
};

const seasons = [
  { name: "Spring League", months: "April - June", status: "Registering Now" },
  { name: "Summer League", months: "July - August", status: "Coming Soon" },
  { name: "Fall League", months: "September - November", status: "Coming Soon" },
  { name: "Winter League", months: "January - March", status: "Coming Soon" },
];

export default function LeaguesPage() {
  return (
    <>
      <section className="hero-moco py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
            Pickleball Leagues in{" "}
            <span className="gradient-text-moco">Montgomery County</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto">
            Competitive, organized play with DUPR ratings. Weekly matches at Dill Dinkers, organized by skill level.
          </p>
        </div>
      </section>

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-8">Seasons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seasons.map((s) => (
                <div key={s.name} className="card-moco p-5">
                  <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">{s.name}</h3>
                  <p className="text-sm text-text-muted mb-2">{s.months}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.status === "Registering Now" ? "bg-court-green/10 text-court-green border border-court-green/20" : "bg-gray-100 text-text-muted"}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <section className="py-12 px-4 bg-section-alt">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">How Leagues Work</h2>
            <div className="space-y-3 text-text-muted">
              <p>Leagues run 6-8 weeks with weekly matches at Dill Dinkers facilities. Teams are organized by DUPR rating so you play competitive matches against similar-level players.</p>
              <p>Each match is DUPR-rated, which means your rating adjusts based on results. It&apos;s the best way to track your improvement and compete against appropriately skilled opponents.</p>
              <p>Don&apos;t have a DUPR rating? No problem — beginners are placed in the introductory division. You can also get a skill evaluation from Coach Sam Morris.</p>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
              Not Ready for Leagues?
            </h2>
            <p className="text-text-muted mb-8">
              No worries — there are plenty of ways to play and improve at your own pace.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/clinics" className="card-moco p-5 text-center hover:border-court-green/30 transition-colors">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Clinics</h3>
                <p className="text-sm text-text-muted">Improve your skills first</p>
              </Link>
              <Link href="/open-play" className="card-moco p-5 text-center hover:border-court-green/30 transition-colors">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Open Play</h3>
                <p className="text-sm text-text-muted">Try casual play</p>
              </Link>
              <Link href="/lessons" className="card-moco p-5 text-center hover:border-court-green/30 transition-colors">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Lessons</h3>
                <p className="text-sm text-text-muted">Get private coaching</p>
              </Link>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <BusinessGrid />

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-lg mx-auto">
            <LeadForm page="leagues" defaultInterest="leagues" />
          </div>
        </section>
      </AnimateOnScroll>

      <HubCTA
        headline="Ready to compete?"
        subtext="Join the community to get notified when league registration opens and find teams looking for players."
        campaign="leagues_cta"
        content="bottom_banner"
      />
    </>
  );
}
