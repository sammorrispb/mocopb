import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCityBySlug, getCourtsForCity } from "@/lib/cities";
import { CourtCard } from "@/components/CourtCard";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BusinessGrid } from "@/components/BusinessGrid";
import { FAQAccordion, type FAQItem } from "@/components/FAQAccordion";
import { SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  return {
    title: `Pickleball in ${city.name}, MD — Courts, Lessons & Open Play`,
    description: `Find pickleball courts, lessons, open play, and groups in ${city.name}, Montgomery County MD. Indoor and outdoor courts, leagues, clinics, and a community of 2,000+ players.`,
    keywords: [
      `pickleball ${city.name.toLowerCase()} md`,
      `pickleball near me ${city.name.toLowerCase()}`,
      `pickleball courts ${city.name.toLowerCase()}`,
      `pickleball lessons ${city.name.toLowerCase()}`,
      `pickleball open play ${city.name.toLowerCase()}`,
      `where to play pickleball ${city.name.toLowerCase()}`,
      `pickleball groups ${city.name.toLowerCase()} maryland`,
    ],
    alternates: { canonical: `${SITE_URL}/play/${slug}` },
  };
}

function getCityFAQs(cityName: string): FAQItem[] {
  return [
    {
      question: `Where can I play pickleball in ${cityName}?`,
      answer: `There are multiple pickleball courts near ${cityName}, Montgomery County MD. Free outdoor courts at parks throughout the county. Check our courts directory for addresses, hours, and amenities.`,
      cta: { text: "View all courts", href: "/courts" },
    },
    {
      question: `Are there pickleball lessons in ${cityName}?`,
      answer: `Yes! Coach Sam Morris offers private pickleball lessons and clinics, serving players from ${cityName} and all of Montgomery County. All skill levels welcome — from complete beginners to competitive players.`,
      cta: { text: "Book a lesson", href: "/lessons" },
    },
    {
      question: `Is there pickleball open play near ${cityName}?`,
      answer: `Open play is available daily at outdoor courts in county parks near ${cityName}. Morning and evening are the most popular times — courts are first-come, first-served.`,
      cta: { text: "Find open play", href: "/open-play" },
    },
    {
      question: `Are there youth pickleball programs near ${cityName}?`,
      answer: `Next Gen Pickleball Academy offers structured youth programs for kids ages 5-16 in Montgomery County, easily accessible from ${cityName}. Four skill levels from beginner to advanced competitive.`,
      cta: { text: "Explore youth programs", href: "/youth" },
    },
  ];
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const nearbyCourts = getCourtsForCity(city.name);
  const cityFAQs = getCityFAQs(city.name);

  return (
    <>
      {/* Hero */}
      <section className="hero-moco py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
            Pickleball in{" "}
            <span className="gradient-text-moco">{city.name}, MD</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-8">
            {city.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courts" className="btn-primary px-8 py-3.5 rounded-xl text-base font-bold">
              Find Courts
            </Link>
            <Link href="/lessons" className="btn-hub px-8 py-3.5 rounded-xl text-base font-bold">
              Book a Lesson
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby Courts */}
      {nearbyCourts.length > 0 && (
        <AnimateOnScroll>
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-2">
                Courts Near {city.name}
              </h2>
              <p className="text-text-muted mb-8">
                {nearbyCourts.length} pickleball {nearbyCourts.length === 1 ? "facility" : "facilities"} near {city.name}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyCourts.map((court) => (
                  <CourtCard key={court.slug} court={court} />
                ))}
              </div>
              <Link href="/courts" className="block text-center text-sm font-semibold text-court-green hover:underline mt-6">
                View all {city.name} area courts &rarr;
              </Link>
            </div>
          </section>
        </AnimateOnScroll>
      )}

      {/* What's Available */}
      <AnimateOnScroll>
        <section className="py-16 px-4 bg-section-alt">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-8 text-center">
              Pickleball Options in {city.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/open-play" className="card-moco p-5 text-center">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Open Play</h3>
                <p className="text-sm text-text-muted">Drop in and play with other locals</p>
              </Link>
              <Link href="/lessons" className="card-moco p-5 text-center">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Private Lessons</h3>
                <p className="text-sm text-text-muted">1-on-1 coaching for all levels</p>
              </Link>
              <Link href="/clinics" className="card-moco p-5 text-center">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Clinics</h3>
                <p className="text-sm text-text-muted">Group skill-building sessions</p>
              </Link>
              <Link href="/leagues" className="card-moco p-5 text-center">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Leagues</h3>
                <p className="text-sm text-text-muted">Competitive weekly matches</p>
              </Link>
              <Link href="/youth" className="card-moco p-5 text-center">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">Youth Programs</h3>
                <p className="text-sm text-text-muted">Academy for kids ages 5-16</p>
              </Link>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Businesses */}
      <AnimateOnScroll>
        <BusinessGrid />
      </AnimateOnScroll>

      {/* City-specific FAQ */}
      <AnimateOnScroll>
        <section className="py-16 px-4 bg-section-alt">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-text-primary text-center mb-8">
              Pickleball FAQ — {city.name}
            </h2>
            <FAQAccordion items={cityFAQs} page={`play-${slug}`} />
          </div>
        </section>
      </AnimateOnScroll>

      {/* Neighborhoods */}
      {city.neighborhoods && city.neighborhoods.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-text-muted">
              Serving pickleball players in {city.name} and nearby areas including{" "}
              {city.neighborhoods.join(", ")}.
            </p>
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Pickleball in ${city.name}, MD`,
            description: city.description,
            url: `${SITE_URL}/play/${slug}`,
            about: {
              "@type": "SportsActivityLocation",
              name: `Pickleball in ${city.name}, Montgomery County`,
              address: {
                "@type": "PostalAddress",
                addressLocality: city.name,
                addressRegion: "MD",
                addressCountry: "US",
              },
              sport: "Pickleball",
            },
            mainEntity: {
              "@type": "FAQPage",
              mainEntity: cityFAQs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          }),
        }}
      />

    </>
  );
}
