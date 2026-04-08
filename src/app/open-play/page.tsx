import type { Metadata } from "next";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { HubCTA } from "@/components/HubCTA";

export const metadata: Metadata = {
  title: "Pickleball Open Play in Montgomery County, MD",
  description:
    "Find pickleball open play sessions in Montgomery County, Maryland. Drop-in play at Dill Dinkers, Cabin John, and more. All skill levels welcome.",
};

const venues = [
  { name: "Dill Dinkers Rockville", type: "Indoor", schedule: "Daily sessions — morning, afternoon, evening", notes: "Reserve through CourtReserve. Membership or day pass required.", link: "/courts/dill-dinkers-rockville" },
  { name: "Dill Dinkers North Bethesda", type: "Indoor", schedule: "Daily sessions — morning, afternoon, evening", notes: "Reserve through CourtReserve. Membership or day pass required.", link: "/courts/dill-dinkers-north-bethesda" },
  { name: "Cabin John Regional Park", type: "Outdoor", schedule: "Dawn to dusk, daily. Lit courts until 11pm.", notes: "Free. First come, first served. Busy weekends — arrive early.", link: "/courts/cabin-john-regional-park" },
  { name: "Olney Manor", type: "Outdoor", schedule: "Dawn to dusk, daily. Lit courts until 11pm.", notes: "Free. First come, first served.", link: "/courts/olney-manor-recreational-park" },
];

export default function OpenPlayPage() {
  return (
    <>
      <section className="hero-moco py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
            Pickleball Open Play in{" "}
            <span className="gradient-text-moco">Montgomery County</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-8">
            Drop in, play, and meet other players. Open play is the easiest way to get games and make friends in the MoCo pickleball community.
          </p>
        </div>
      </section>

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-8">
              Where to Find Open Play
            </h2>
            <div className="space-y-4">
              {venues.map((v) => (
                <Link key={v.name} href={v.link} className="card-moco block p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg text-text-primary">{v.name}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${v.type === "Indoor" ? "badge-indoor" : "badge-outdoor"}`}>
                      {v.type}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mb-1">{v.schedule}</p>
                  <p className="text-xs text-text-muted">{v.notes}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <section className="py-12 px-4 bg-section-alt">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">What to Expect at Open Play</h2>
            <div className="space-y-3 text-text-muted">
              <p>Open play is drop-in pickleball — no reservation needed at outdoor courts (indoor facilities may require booking). Players typically place their paddles in a queue and rotate partners every game.</p>
              <p>Most sessions welcome all skill levels, though some facilities offer level-specific open play times. Bring your own paddle, water, and court shoes. Many venues have loaner paddles for beginners.</p>
              <p>Open play etiquette: rotate partners, call your own lines honestly, and keep games moving. It&apos;s the most social way to play.</p>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <HubCTA
        headline="Want to find regular playing partners?"
        subtext="Join the community to connect with players at your level and get notified about open play sessions."
        campaign="open_play_cta"
        content="bottom_banner"
      />
    </>
  );
}
