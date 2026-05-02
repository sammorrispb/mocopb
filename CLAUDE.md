# MoCo PB — CLAUDE.md

**NOTE (2026-05-01):** This site was decoupled from Dill Dinkers / CourtReserve on 2026-05-01 and from the Hub on 2026-05-02. No DD/CR/linkanddink.com references should be re-introduced.

## What This Is
Lead generation site for Sam's pickleball businesses. Positioned as a neutral Montgomery County pickleball community resource. Drives traffic to Sam-owned businesses based on visitor intent.

## Ecosystem
- **Domain**: mocopb.com (GoDaddy registrar, Vercel nameservers)
- **Git**: github.com/sammorrispb/mocopb
- **Deploy**: Vercel (auto-deploy on push to main)
- **Google Search Console**: Verified (HTML file method)
- **Funnel targets**:
  - sammorrispb.com — private lessons, coaching, clinics
  - nextgenacademypb.com — youth programs (ages 5-16)
  - tournamentwebsite.vercel.app — LD Tournament Series

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (light theme — green/teal palette)
- **Fonts**: Montserrat (headings), Inter (body)
- **Analytics**: @vercel/analytics + @vercel/speed-insights + custom typed events (src/lib/analytics.ts)

## Key Routes
- `/` — Homepage (hero, stats, courts, business grid, groups, city grid, FAQ preview)
- `/courts` — Court directory (indoor/outdoor split)
- `/courts/[slug]` — Individual court detail pages with JSON-LD SportsActivityLocation
- `/play/[city]` — 9 city landing pages (Rockville, Bethesda, North Bethesda, Potomac, Olney, Germantown, Silver Spring, Wheaton, Gaithersburg) — each with nearby courts, city FAQ, business grid
- `/groups` — Groups overview
- `/events` — Events listing
- `/faq` — FAQ items with FAQPage JSON-LD schema (AEO)
- `/lessons` — Coaching → sammorrispb.com
- `/clinics` — Group instruction → sammorrispb.com
- `/youth` — NGA programs → nextgenacademypb.com
- `/open-play` — Open play guide
- `/leagues` — League info

## Critical Conventions

### Tracking
ALL outbound links to any business MUST use tracked helpers:
- `businessUrl(business, campaign, content)` from `src/lib/tracking.ts` — for business objects
- `TrackedExternalLink` component — wraps `<a>` with analytics event logging
- NEVER hardcode bare business URLs without UTM params

### Analytics Events (src/lib/analytics.ts)
Typed event system using Vercel Analytics:
- `cta_click` — label, page, destination
- `lead_form` — action (started/submitted/error), interest, page
- `external_link` — label, url, page
- `scroll_depth` — depth (25/50/75/100), page
- `faq_expand` — question, page

### SEO
- Every page has unique `generateMetadata()` with title, description, keywords
- JSON-LD schemas: Organization (root), FAQPage (/faq + city pages), SportsActivityLocation (courts), Service (lessons/clinics/youth)
- `sitemap.ts` dynamically generates from courts + cities data
- City pages target "pickleball near me" + "pickleball [city] md"
- DO NOT add pricing to any page — prices change and belong on the business sites

### Data Layer
All content lives in typed `src/lib/*.ts` files:
- `courts.ts` — courts with slugs, addresses, coordinates, amenities
- `cities.ts` — 9 MoCo cities with descriptions, neighborhoods, nearby court matching
- `groups.ts` — community groups (Facebook, WhatsApp, etc.)
- `events.ts` — events with type badges and date sorting
- `faq.ts` — categorized FAQ items with per-answer CTAs routing to appropriate business
- `businesses.ts` — Sam-owned businesses with id, name, tagline, description, url, ctaText

### Components
- `AnimateOnScroll` — IntersectionObserver fade-up (one-shot)
- `FAQAccordion` — ARIA accordion with tracked expansions
- `BusinessGrid` — business card grid with intent routing
- `CityGrid` — 9-city link grid for internal SEO mesh
- `TrackedExternalLink` — analytics-wrapped external `<a>`
- `ScrollDepthTracker` — fires events at 25/50/75/100% scroll
- `StickyMobileCTA` — dismissible bottom bar on mobile

## Design Direction
- **Light theme** — white background (#fff), green tint alt sections (#f0fdf4)
- **Not branded as any single business** — neutral community resource
- **Mobile-first** — sticky CTA, responsive grids, 48px min tap targets
- **CTA hierarchy**: Green buttons (primary/explore) → Orange buttons (business CTAs)
- **Cards**: Always have box-shadow by default (not just on hover) for visibility

## Development
```
npm run dev    # Start dev server
npm run build  # Production build (must pass with 0 errors)
npm run lint   # ESLint (must be clean)
```

## Competitor
- **mocopickleball.com** (Emer Daly) — Wix site, ~6 pages, no city pages, no schema, no court directory. Our primary SEO competitor for MoCo pickleball searches.
