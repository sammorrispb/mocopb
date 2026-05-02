"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-nav backdrop-blur-md border-b border-gray-200/60">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-xl text-court-green">
          {SITE_NAME}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-court-green ${
                pathname === link.href ? "text-court-green" : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/lessons"
            className="btn-hub px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Book a Lesson
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-medium py-2 ${
                  pathname === link.href ? "text-court-green" : "text-text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/lessons"
              onClick={() => setMobileOpen(false)}
              className="btn-hub px-4 py-3 rounded-lg text-sm font-semibold text-center mt-2"
            >
              Book a Lesson
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
