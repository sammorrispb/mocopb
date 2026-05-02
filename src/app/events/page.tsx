import type { Metadata } from "next";
import Link from "next/link";
import { events } from "@/lib/events";
import { EventCard } from "@/components/EventCard";
import { LeadForm } from "@/components/LeadForm";
import { BusinessGrid } from "@/components/BusinessGrid";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Pickleball Events in Montgomery County, MD",
  description:
    "Upcoming pickleball tournaments, leagues, clinics, and social events in Montgomery County, Maryland. Find your next game.",
};

export default function EventsPage() {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-2">
            Pickleball Events in Montgomery County
          </h1>
          <p className="text-text-muted text-lg mb-10">
            Tournaments, leagues, clinics, and social play across MoCo.
          </p>

          {sorted.length > 0 ? (
            <div className="space-y-4">
              {sorted.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-muted text-lg">No upcoming events right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-lg mx-auto">
            <LeadForm page="events" defaultInterest="other" />
          </div>
        </section>
      </AnimateOnScroll>

      <BusinessGrid />

      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
              Looking for Regular Play?
            </h2>
            <p className="text-text-muted mb-8">
              Events are great, but there are more ways to get on the court every week.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/leagues" className="card-moco p-5 text-center hover:border-court-green/30 transition-colors">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Leagues</h3>
                <p className="text-sm text-text-muted">Competitive weekly matches</p>
              </Link>
              <Link href="/open-play" className="card-moco p-5 text-center hover:border-court-green/30 transition-colors">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Open Play</h3>
                <p className="text-sm text-text-muted">Drop-in sessions across MoCo</p>
              </Link>
              <Link href="/lessons" className="card-moco p-5 text-center hover:border-court-green/30 transition-colors">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Lessons</h3>
                <p className="text-sm text-text-muted">Private coaching to level up</p>
              </Link>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

    </>
  );
}
