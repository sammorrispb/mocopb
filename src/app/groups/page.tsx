import type { Metadata } from "next";
import { groups } from "@/lib/groups";
import { GroupCard } from "@/components/GroupCard";
import { HubCTA } from "@/components/HubCTA";

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

      <HubCTA
        headline="Start your own group"
        subtext="Got a regular crew? Create a group on Link & Dink to organize games, track attendance, and grow your community."
        buttonText="Create a Group"
        campaign="groups_cta"
        content="bottom_banner"
      />
    </>
  );
}
