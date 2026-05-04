import { businesses } from "@/lib/businesses";
import { businessUrl } from "@/lib/tracking";
import { TrackedExternalLink } from "./TrackedExternalLink";

export function BusinessGrid() {
  return (
    <section className="py-16 px-4 bg-section-alt">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary text-center mb-3">
          Your Pickleball Home in MoCo
        </h2>
        <p className="text-text-muted text-center mb-10 max-w-xl mx-auto">
          Whether you&apos;re a beginner or a competitor, we have something for you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {businesses.map((biz) => (
            <TrackedExternalLink
              key={biz.id}
              href={businessUrl(biz, "business_grid", biz.id)}
              label={biz.ctaText}
              page="home"
              className="card-business group"
            >
              <div className="text-xs font-bold text-court-green uppercase tracking-wider mb-1">
                {biz.tagline}
              </div>
              <h3 className="font-heading font-bold text-lg text-text-primary mb-2">
                {biz.name}
              </h3>
              <p className="text-sm text-text-muted mb-4 leading-relaxed">
                {biz.description}
              </p>
              <span className="text-sm font-semibold text-cta-orange group-hover:underline">
                {biz.ctaText} &rarr;
              </span>
            </TrackedExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}
