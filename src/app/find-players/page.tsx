import type { Metadata } from "next";
import Link from "next/link";
import { hubUrl } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "Find Pickleball Players in Montgomery County, MD",
  description:
    "Connect with 2,000+ pickleball players in Montgomery County, Maryland. Get matched by skill level, find playing partners, and join games near you.",
};

const steps = [
  {
    number: "1",
    title: "Sign Up Free",
    description: "Create your profile in 30 seconds. No credit card required.",
  },
  {
    number: "2",
    title: "Set Your Level",
    description: "Tell us your skill level and preferences. We'll find players who match.",
  },
  {
    number: "3",
    title: "Start Playing",
    description: "Get matched with players, join groups, and find games near you.",
  },
];

export default function FindPlayersPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-moco py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-text-primary mb-6 leading-tight">
            Find Pickleball Players{" "}
            <span className="gradient-text-moco">Near You</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-xl mx-auto mb-10">
            Connect with 2,000+ pickleball players in Montgomery County. Get matched by skill level and start playing today.
          </p>
          <a
            href={hubUrl("/", "find_players_hero", "main_cta")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hub inline-block px-10 py-4 rounded-xl text-lg font-bold shadow-lg"
          >
            Join the Community — It&apos;s Free
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full bg-court-green text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-bg-alt">
        <div className="max-w-3xl mx-auto text-center">
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div>
              <div className="font-heading font-bold text-3xl gradient-text-moco">2,000+</div>
              <div className="text-sm text-text-muted">Active Players</div>
            </div>
            <div>
              <div className="font-heading font-bold text-3xl gradient-text-moco">15+</div>
              <div className="text-sm text-text-muted">Playing Groups</div>
            </div>
            <div>
              <div className="font-heading font-bold text-3xl gradient-text-moco">8</div>
              <div className="text-sm text-text-muted">Facilities</div>
            </div>
          </div>
          <a
            href={hubUrl("/", "find_players_proof", "secondary_cta")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hub inline-block px-8 py-3.5 rounded-xl text-base font-bold shadow-lg"
          >
            Find Your Next Game
          </a>
        </div>
      </section>

      {/* Alternative */}
      <section className="py-12 px-4 text-center">
        <p className="text-text-muted">
          Prefer to explore on your own?{" "}
          <Link href="/courts" className="text-court-green font-semibold hover:underline">
            Browse courts near you &rarr;
          </Link>
        </p>
      </section>
    </>
  );
}
