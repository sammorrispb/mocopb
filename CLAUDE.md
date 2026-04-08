# MoCo PB — CLAUDE.md

## What This Is
Montgomery County Pickleball community resource site. Local SEO funnel that drives traffic to The Hub (linkanddink.com). Positioned as a neutral community resource, not a Link & Dink marketing page.

## Ecosystem
- **Domain**: mocopb.com
- **Funnel target**: linkanddink.com (The Hub)
- **Related sites**: sammorrispb.com, nextgenacademypb.com
- **Deploy**: Vercel (auto-deploy on push to main)

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (light theme — green/teal palette)
- **Fonts**: Montserrat (headings), Inter (body)
- **Analytics**: @vercel/analytics + @vercel/speed-insights

## Key Routes
- `/` — Homepage (hero, stats, featured courts, groups preview, Hub CTA)
- `/courts` — Court directory (filterable)
- `/courts/[slug]` — Individual court detail pages (SEO)
- `/groups` — Groups overview (Link & Dink featured)
- `/events` — Events listing
- `/find-players` — Hub funnel page

## Critical Convention
ALL outbound links to linkanddink.com MUST use the `hubUrl()` helper from `src/lib/hub.ts`. This ensures UTM tracking on every link. Never hardcode bare linkanddink.com URLs.

## Design Direction
- **Light theme** — white background, green/teal accents
- **Not Link & Dink branded** — neutral community resource feel
- **Mobile-first** — most users on phones
- **CTA color**: Orange (#f97316) for all Hub buttons

## Development
```
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint
```
