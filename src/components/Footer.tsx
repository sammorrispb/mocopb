import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { hubUrl } from "@/lib/hub";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">{SITE_NAME}</h3>
            <p className="text-sm text-gray-400">
              Your guide to pickleball in Montgomery County, MD. Find courts, connect with players, and join the community.
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
            </ul>
          </div>

          {/* Hub CTA */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Join the Community</h4>
            <p className="text-sm text-gray-400 mb-4">
              Connect with 2,000+ pickleball players in Montgomery County.
            </p>
            <a
              href={hubUrl("/", "footer_cta", "join_button")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hub inline-block px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Join Link &amp; Dink
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} MoCo PB. A community resource for Montgomery County pickleball players.
        </div>
      </div>
    </footer>
  );
}
