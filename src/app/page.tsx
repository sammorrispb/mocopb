import Link from "next/link";
import { hubUrl } from "@/lib/tracking";
import { getFeaturedCourts } from "@/lib/courts";
import { getFeaturedGroups } from "@/lib/groups";
import { getTopFAQs } from "@/lib/faq";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StatBar } from "@/components/StatBar";
import { CourtCard } from "@/components/CourtCard";
import { GroupCard } from "@/components/GroupCard";
import { BusinessGrid } from "@/components/BusinessGrid";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HubCTA } from "@/components/HubCTA";
import { CityGrid } from "@/components/CityGrid";
import { LeadForm } from "@/components/LeadForm";

export default function HomePage() {
  const featuredCourts = getFeaturedCourts();
  const featuredGroups = getFeaturedGroups();
  const topFAQs = getTopFAQs(5);

  return (
    <>
      {/* Hero */}
      <section className="hero-moco py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight">
            Montgomery County{" "}
            <span className="gradient-text-moco">Pickleball</span>{" "}
            Community
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10">
            Find courts, connect with players, and join the fastest-growing sport in MoCo. Your complete guide to pickleball in Montgomery County, MD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courts"
              className="btn-primary px-8 py-3.5 rounded-xl text-base font-bold"
            >
              Find Courts
            </Link>
            <a
              href={hubUrl("/", "hero_cta", "join_button")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hub px-8 py-3.5 rounded-xl text-base font-bold"
            >
              Join the Community
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatBar />

      {/* Featured Courts */}
      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
                  Popular Courts
                </h2>
                <p className="text-text-muted mt-1">Top places to play in Montgomery County</p>
              </div>
              <Link
                href="/courts"
                className="text-sm font-semibold text-court-green hover:underline hidden sm:block"
              >
                View all courts &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredCourts.map((court) => (
                <CourtCard key={court.slug} court={court} />
              ))}
            </div>
            <Link
              href="/courts"
              className="block text-center text-sm font-semibold text-court-green hover:underline mt-6 sm:hidden"
            >
              View all courts &rarr;
            </Link>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Business Grid — all 4 businesses */}
      <AnimateOnScroll>
        <BusinessGrid />
      </AnimateOnScroll>

      {/* Featured Groups */}
      <AnimateOnScroll>
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
                  Active Groups
                </h2>
                <p className="text-text-muted mt-1">Join a pickleball community near you</p>
              </div>
              <Link
                href="/groups"
                className="text-sm font-semibold text-court-green hover:underline hidden sm:block"
              >
                View all groups &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredGroups.map((group) => (
                <GroupCard key={group.slug} group={group} />
              ))}
            </div>
            <Link
              href="/groups"
              className="block text-center text-sm font-semibold text-court-green hover:underline mt-6 sm:hidden"
            >
              View all groups &rarr;
            </Link>
          </div>
        </section>
      </AnimateOnScroll>

      {/* City Pages — Local SEO */}
      <AnimateOnScroll>
        <CityGrid />
      </AnimateOnScroll>

      {/* FAQ Preview */}
      <AnimateOnScroll>
        <section className="py-16 px-4 bg-section-alt">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary text-center mb-3">
              Common Questions
            </h2>
            <p className="text-text-muted text-center mb-8">
              New to pickleball? We&apos;ve got answers.
            </p>
            <FAQAccordion items={topFAQs} page="home" />
            <div className="text-center mt-8">
              <Link
                href="/faq"
                className="text-sm font-semibold text-court-green hover:underline"
              >
                View all FAQs &rarr;
              </Link>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Lead Capture */}
      <AnimateOnScroll>
        <section className="py-16 px-4">
          <LeadForm page="home" />
        </section>
      </AnimateOnScroll>

      {/* Hub CTA */}
      <HubCTA campaign="home_cta" content="bottom_banner" />
    </>
  );
}
