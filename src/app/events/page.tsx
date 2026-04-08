import type { Metadata } from "next";
import { events } from "@/lib/events";
import { EventCard } from "@/components/EventCard";
import { HubCTA } from "@/components/HubCTA";

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

      <HubCTA
        headline="Never miss an event"
        subtext="Join the community to get notified about tournaments, leagues, and social play near you."
        campaign="events_cta"
        content="bottom_banner"
      />
    </>
  );
}
