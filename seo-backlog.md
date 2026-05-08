# SEO/AEO Backlog — mocopb.com

Source of truth for the `seo-daily-sweep` agent. The agent reads this file each run,
picks the highest-priority `[ ]` item with the smallest size, ships one PR, then
moves the item to the **Done log** below.

## Status legend
`[ ]` open · `[~]` in-progress (claimed by today's run) · `[x]` done

## Task fields
- **Priority**: P0 (blocking) / P1 (high value) / P2 (nice-to-have)
- **Type**: schema / content / page / internal-link / technical
- **Size**: S (≤200 LOC diff) / M (200–400 LOC) / L (400+ — agent must split before claiming)

## Hard rules for any work on this repo
- Never reference Dill Dinkers, CourtReserve, linkanddink.com, or The Hub.
- Never push to main directly — always PR.
- Never auto-merge.
- Each city page must have unique substance — no template duplication.
- `npm run build` must pass before PR.
- JSON-LD must validate via `seo-sweep-state/tools/validate-jsonld.mjs`.

---

## P0 — Foundation Sweep

- [ ] (schema, S) Create `src/lib/seo.ts` with `breadcrumbJsonLd(items)` and `eventJsonLd(event)` helpers. Why: shared primitives for the rest of P0 + future schema work. Reference: schema.org/BreadcrumbList.
- [ ] (schema, S) Add BreadcrumbList JSON-LD to all static pages: `/courts`, `/lessons`, `/clinics`, `/youth`, `/leagues`, `/open-play`, `/groups`, `/events`, `/faq`. Why: rich-result eligibility, near-zero risk. Reuse the helper from the previous task.
- [ ] (schema, S) Add BreadcrumbList JSON-LD to dynamic routes `/courts/[slug]` and `/play/[city]`. Chains: `Home > Courts > [court name]` and `Home > Cities > [city]`.
- [ ] (schema, M) Add `LocalBusiness` JSON-LD to `src/app/layout.tsx` with `areaServed` covering all 9 (eventually 12) cities and `sameAs` linking to sammorrispb.com + nextgenpbacademy.com. Why: cross-site entity graph + map-pack candidacy.
- [ ] (technical, S) Verify Event schema on `src/app/club/groups/[slug]/events/[id]/page.tsx`. If missing, add `eventJsonLd` per club event row using the helper from task 1.
- [ ] (technical, S) `/open-play` placeholder hardening: add `robots: { index: false, follow: true }` via `generateMetadata`, and remove `/open-play` from `src/app/sitemap.ts` until the directory has real content. Why: thin content dilutes site-wide quality signal.

## P1 — Content Expansion

- [ ] (page, M) Populate `/open-play` with a court-by-court schedule grid driven by a new `src/data/open-play.ts` (Sam-curated: court → days → times → skill level). Each row gets `SportsEvent` or `EventSeries` JSON-LD. Re-add `/open-play` to sitemap. Remove the noindex.
- [ ] (page, M) Add `/play/kensington` city page. Add `kensington` entry to `src/lib/cities.ts` with description, neighborhoods, and 2-sentence intro in coach POV. Update `getCourtsForCity()` matching logic.
- [ ] (page, M) Add `/play/chevy-chase` city page. Same pattern.
- [ ] (page, M) Add `/play/takoma-park` city page. Same pattern.
- [ ] (page, M) Add `/play/damascus` city page. Same pattern. (Skip Poolesville — too thin.)
- [ ] (page, M) Add `/best/rockville` ranking page. Title: "Best Pickleball Courts in Rockville, MD". `ItemList` schema ranking the 5 Rockville courts with hand-written rationale. New component `src/components/RankedCourtList.tsx` (~50 lines). Cross-links to all 5 court detail pages.
- [ ] (page, M) Add `/best/silver-spring` ranking page. Same pattern. East Norbeck #1.
- [ ] (page, M) Add `/best/bethesda` ranking page. Same pattern.
- [ ] (page, M) Add `/best/gaithersburg` ranking page. Same pattern.
- [ ] (page, M) Add `/indoor-vs-outdoor` comparison hub. `Article` schema. Comparison table. Links to all indoor courts + all outdoor courts. Long-tail capture for "indoor pickleball MoCo" / "outdoor pickleball MoCo".
- [ ] (internal-link, S) FAQ-to-city audit on `/faq`: confirm every answer that mentions a city or court links to the corresponding `/play/[city]` or `/courts/[slug]`.

## P2 — AEO Depth

- [ ] (page, M) Add `/stats` — "Montgomery County Pickleball by the Numbers". Pull live from `src/lib/courts.ts` (12 cities, 40+ courts, indoor/outdoor counts, lighted-court count, free-vs-paid). `Dataset` schema. AI answer engines weight datasets heavily.
- [ ] (page, M) Convert `/best/[city]` to a single dynamic route that handles all 12 cities, factoring from `getCourtsForCity()` + a hand-written ranking rationale per city in new `src/data/rankings.ts`. Replaces the static `/best/rockville`, `/best/silver-spring`, etc.
- [ ] (page, M) Add `/glossary` — pickleball terms (kitchen, dink, ATP, Erne, third-shot drop, etc.) with `DefinedTermSet` schema. Each term cross-links to a sammorrispb `/learn/*` page where applicable. Federation play.
- [ ] (content, M) Expand `/faq` from current count to 25+ Qs covering long-tail intent: "year-round pickleball MoCo", "where do beginners play", "indoor pickleball winter MoCo", "MCPS pickleball", "where to play pickleball in [each city]", "is pickleball free in MoCo".
- [ ] (page, M) Add `/guides/find-courts` pillar page with `HowTo` schema explaining how to find pickleball courts in MoCo (filters: city, indoor/outdoor, lighted, free/private). Internal links to `/courts`, every `/play/[city]`.
- [ ] (page, M) Add `/guides/winter-pickleball` — winter/indoor pickleball guide for MoCo. `Article` schema. Long-tail seasonal capture.
- [ ] (internal-link, S) Cross-site `sameAs` audit: every `Organization`/`LocalBusiness` JSON-LD on this site references sammorrispb.com + nextgenpbacademy.com in `sameAs`.

---

## Done log (auto-pruned at 30 days)

- 2026-05-08 — (technical, S) Image alt-text audit on `CourtCard`, `BusinessGrid`, `CityGrid`, `Footer`, `Nav`, and homepage hero. Pattern for court images: `"${court.name} pickleball courts in ${court.city}, MD"`. Pattern for city heroes: `"Pickleball courts in ${city.name}, Montgomery County, MD"`. (PR #pending)
