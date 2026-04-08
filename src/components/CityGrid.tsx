import Link from "next/link";
import { cities } from "@/lib/cities";

export function CityGrid() {
  return (
    <section className="py-16 px-4 bg-section-alt">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary text-center mb-3">
          Pickleball Near You
        </h2>
        <p className="text-text-muted text-center mb-10 max-w-xl mx-auto">
          Find courts, lessons, and players in your area.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/play/${city.slug}`}
              className="card-moco p-4 text-center group"
            >
              <span className="font-heading font-semibold text-text-primary group-hover:text-court-green transition-colors">
                {city.name}
              </span>
              <span className="block text-xs text-text-muted mt-0.5">MD</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
