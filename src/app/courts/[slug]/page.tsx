import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courts, getCourtBySlug } from "@/lib/courts";
import { BusinessCTA } from "@/components/BusinessCTA";
import { SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return courts.map((court) => ({ slug: court.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const court = getCourtBySlug(slug);
  if (!court) return {};
  return {
    title: `${court.name} — Pickleball in ${court.city}, MD`,
    description: `${court.name}: ${court.courtCount} ${court.type} pickleball courts in ${court.city}, Montgomery County MD. ${court.surface}. ${court.amenities.join(", ")}.`,
  };
}

export default async function CourtDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const court = getCourtBySlug(slug);
  if (!court) notFound();

  const mapQuery = encodeURIComponent(`${court.address}, ${court.city}, MD ${court.zip}`);

  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/courts"
            className="text-sm text-court-green hover:underline mb-6 inline-block"
          >
            &larr; All Courts
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
              {court.name}
            </h1>
            <span
              className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                court.type === "indoor" ? "badge-indoor" : "badge-outdoor"
              }`}
            >
              {court.type === "indoor" ? "Indoor" : "Outdoor"}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card-moco p-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Address</h3>
                <p className="text-text-primary">{court.address}, {court.city}, MD {court.zip}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Courts</h3>
                <p className="text-text-primary">{court.courtCount} {court.type} courts &middot; {court.surface}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Hours</h3>
                <p className="text-text-primary">{court.hours}</p>
              </div>
              {court.phone && (
                <div>
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Phone</h3>
                  <a href={`tel:${court.phone}`} className="text-court-green hover:underline">{court.phone}</a>
                </div>
              )}
              {court.website && (
                <div>
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Website</h3>
                  <a href={court.website} target="_blank" rel="noopener noreferrer" className="text-court-green hover:underline">
                    Visit website &rarr;
                  </a>
                </div>
              )}
            </div>

            <div className="card-moco p-5">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {court.amenities.map((a) => (
                  <span key={a} className="bg-bg-alt text-text-primary text-sm px-3 py-1.5 rounded-lg">
                    {a}
                  </span>
                ))}
              </div>
              {court.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Notes</h3>
                  <p className="text-sm text-text-muted">{court.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Map embed */}
          <div className="card-moco overflow-hidden">
            <iframe
              title={`Map of ${court.name}`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsActivityLocation",
            name: court.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: court.address,
              addressLocality: court.city,
              addressRegion: "MD",
              postalCode: court.zip,
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: court.coordinates.lat,
              longitude: court.coordinates.lng,
            },
            url: `${SITE_URL}/courts/${court.slug}`,
            sport: "Pickleball",
          }),
        }}
      />

      <BusinessCTA
        business="coaching"
        campaign="court_detail_cta"
        content={court.slug}
      />
    </>
  );
}
