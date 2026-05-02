import type { Metadata } from "next";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { LeadForm } from "@/components/LeadForm";
import { BusinessGrid } from "@/components/BusinessGrid";

export const metadata: Metadata = {
  title: "Pickleball Open Play in Montgomery County, MD",
  description:
    "Open play options for adult pickleball players in Montgomery County, MD.",
};

export default function OpenPlayPage() {
  return (
    <>
      <section className="hero-moco py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
            <span className="gradient-text-moco">Open Play Options</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-8">
            We&apos;re updating our open-play directory for Montgomery County. In the meantime, reach out via the lead form below for current recommendations.
          </p>
        </div>
      </section>

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

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
              Want to Level Up?
            </h2>
            <p className="text-text-muted mb-8">
              Open play is a great start. Here are ways to take your game further.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/lessons" className="card-moco p-5 text-center hover:border-court-green/30 transition-colors">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Lessons</h3>
                <p className="text-sm text-text-muted">Private coaching to improve faster</p>
              </Link>
              <Link href="/clinics" className="card-moco p-5 text-center hover:border-court-green/30 transition-colors">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Clinics</h3>
                <p className="text-sm text-text-muted">Group clinics for targeted skills</p>
              </Link>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-lg mx-auto">
            <LeadForm page="open-play" defaultInterest="open-play" />
          </div>
        </section>
      </AnimateOnScroll>

      <BusinessGrid />
    </>
  );
}
