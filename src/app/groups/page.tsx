import type { Metadata } from "next";
import Link from "next/link";
import { groups } from "@/lib/groups";
import { GroupCard } from "@/components/GroupCard";

export const metadata: Metadata = {
  title: "Pickleball Groups in Montgomery County, MD",
  description:
    "Find pickleball groups and communities in Montgomery County, Maryland. Join open play groups, leagues, and social communities for all skill levels.",
};

export default function GroupsPage() {
  const featured = groups.filter((g) => g.featured);
  const other = groups.filter((g) => !g.featured);

  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-2">
            Pickleball Groups in Montgomery County
          </h1>
          <p className="text-text-muted text-lg mb-10">
            Join a group to find regular playing partners and never play alone.
          </p>

          {/* Featured */}
          <h2 className="font-heading font-semibold text-xl text-text-primary mb-4">
            Featured Communities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {featured.map((group) => (
              <GroupCard key={group.slug} group={group} />
            ))}
          </div>

          {/* Run your own group — Club CTA */}
          <div className="mb-12 rounded-xl border border-court-green/20 bg-section-alt p-6">
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-1">
              Running your own crew?
            </h2>
            <p className="text-text-muted mb-4">
              MoCo PB Club is a free tool to organize your group&apos;s events, capacity,
              waitlist, and attendance — all in one place.
            </p>
            <Link
              href="/club"
              className="inline-block rounded-lg bg-court-green px-4 py-2 text-sm font-semibold text-white hover:bg-court-green/90"
            >
              Open the Club →
            </Link>
          </div>

          {/* Other */}
          {other.length > 0 && (
            <>
              <h2 className="font-heading font-semibold text-xl text-text-primary mb-4">
                More Groups
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {other.map((group) => (
                  <GroupCard key={group.slug} group={group} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </>
  );
}
