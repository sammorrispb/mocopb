import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { businesses } from "@/lib/businesses";
import { cities } from "@/lib/cities";
import { businessUrl } from "@/lib/tracking";
import { TrackedExternalLink } from "./TrackedExternalLink";

export function Footer() {
  return (
    <footer className="bg-bg-dark text-gray-300 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">{SITE_NAME}</h3>
            <p className="text-sm text-gray-400">
              Your guide to pickleball in Montgomery County, MD.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Explore</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/open-play" className="text-sm hover:text-white transition-colors">Open Play</Link>
              </li>
              <li>
                <Link href="/leagues" className="text-sm hover:text-white transition-colors">Leagues</Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/lessons" className="text-sm hover:text-white transition-colors">Private Lessons</Link>
              </li>
              <li>
                <Link href="/clinics" className="text-sm hover:text-white transition-colors">Clinics</Link>
              </li>
              <li>
                <Link href="/youth" className="text-sm hover:text-white transition-colors">Youth Academy</Link>
              </li>
              <li>
                <Link href="/find-players" className="text-sm hover:text-white transition-colors">Find Players</Link>
              </li>
            </ul>
          </div>

          {/* Businesses */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Our Network</h4>
            <ul className="space-y-2">
              {businesses.map((biz) => (
                <li key={biz.id}>
                  <TrackedExternalLink
                    href={businessUrl(biz, "footer", biz.id)}
                    label={biz.name}
                    page="footer"
                    className="text-sm hover:text-white transition-colors"
                  >
                    {biz.name}
                  </TrackedExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* City Links for SEO */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <h4 className="font-heading font-semibold text-white text-sm mb-3">Pickleball Near You</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {cities.map((city) => (
              <Link key={city.slug} href={`/play/${city.slug}`} className="text-xs text-gray-400 hover:text-white transition-colors">
                {city.name}, MD
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} MoCo PB. A community resource for Montgomery County pickleball players.
        </div>
      </div>
    </footer>
  );
}
