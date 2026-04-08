import type { Metadata } from "next";
import { courts } from "@/lib/courts";
import { CourtCard } from "@/components/CourtCard";
import { HubCTA } from "@/components/HubCTA";

export const metadata: Metadata = {
  title: "Pickleball Courts in Montgomery County, MD",
  description:
    "Complete directory of indoor and outdoor pickleball courts in Montgomery County, Maryland. Find courts near you with hours, amenities, and directions.",
};

export default function CourtsPage() {
  const indoor = courts.filter((c) => c.type === "indoor");
  const outdoor = courts.filter((c) => c.type === "outdoor");

  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-2">
            Pickleball Courts in Montgomery County
          </h1>
          <p className="text-text-muted text-lg mb-10">
            {courts.length} courts across {indoor.length} indoor and {outdoor.length} outdoor facilities.
          </p>

          {/* Indoor */}
          <h2 className="font-heading font-semibold text-xl text-text-primary mb-4 flex items-center gap-2">
            <span className="badge-indoor text-xs font-bold px-2.5 py-1 rounded-full">Indoor</span>
            Indoor Facilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {indoor.map((court) => (
              <CourtCard key={court.slug} court={court} />
            ))}
          </div>

          {/* Outdoor */}
          <h2 className="font-heading font-semibold text-xl text-text-primary mb-4 flex items-center gap-2">
            <span className="badge-outdoor text-xs font-bold px-2.5 py-1 rounded-full">Outdoor</span>
            Outdoor Courts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outdoor.map((court) => (
              <CourtCard key={court.slug} court={court} />
            ))}
          </div>
        </div>
      </section>

      <HubCTA
        headline="Can't find the right court?"
        subtext="Join the community to discover hidden gems, get real-time court availability, and connect with players near you."
        campaign="courts_cta"
        content="bottom_banner"
      />
    </>
  );
}
