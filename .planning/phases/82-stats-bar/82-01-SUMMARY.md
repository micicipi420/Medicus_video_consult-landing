# Plan 82-01 Summary — Stats Bar

**Status:** Complete
**Date:** 2026-04-30
**Files modified:** 1 source file (StatsBar.tsx — full rewrite)

## What was built

Upgraded StatsBar to add per-stat icons (STATS-01) and adopt a mobile-budget-compliant responsive glass strategy.

### Icons added
| Stat | Icon | Color |
|------|------|-------|
| 43 клиники | Building2 | mu-accent-blue |
| 11 стран | Globe | mu-accent-teal |
| 500+ врачей | Stethoscope | mu-accent-orange |
| 15+ лет опыта | Award | mu-green-600 |

Each icon sits in a tinted `{accent}/12` square and shares its color with the number — repeats the chromatic anchor twice for instant scanability on mobile.

### Responsive glass strategy
- **Mobile (<sm):** Single outer glass wrapper (`bg-white/60 backdrop-blur-2xl`) holds a 2×2 grid of flat (transparent) cells. Counting Phase 80's floating header (1 layer) + this wrapper (1 layer) = 2 layers — exactly at the Phase 79 mobile cap.
- **sm and above (≥640px):** Outer wrapper flattens (`sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:border-0 sm:shadow-none`); each cell gains its own glass surface (`sm:bg-white/60 sm:backdrop-blur-2xl sm:border sm:border-glass-border sm:shadow-glass`). Hover state activates only at `sm:` (no hover concept on touch).

### Layout
- Mobile: 2×2 grid, padding `p-4` outside, `px-3 py-5` per cell
- Desktop: 1×4 grid, `gap-6`, `sm:p-7` per cell
- Number: `text-3xl` mobile → `sm:text-5xl` → `md:text-6xl`
- Label: uppercase, `tracking-wider`, color-neutral

### Accessibility
- Icons marked `aria-hidden="true"` (decorative — number+label carry meaning)
- `<section aria-label="Ключевые цифры">` preserved
- Hover transitions scoped to `[background-color,border-color,box-shadow]` (no `transition-all`)

## Requirements covered

- **STATS-01** (4 metrics, each with an icon, glass-style cards): 4 stats, 4 icons, glass on desktop cards (mobile uses single-wrapper trick to stay within budget)
- **STATS-02** (Stats bar sits directly below hero): no change needed — `app/page.tsx:3` already mounts `<StatsBar />` immediately after `<HeroHub />`

## Self-Check: PASSED

| # | Truth | Evidence |
|---|-------|----------|
| 1 | Exactly 4 metrics with correct labels | `STATS` array length = 4, labels: "клиники", "стран", "врачей", "лет опыта" |
| 2 | Lucide icons in correct order | `Building2 → Globe → Stethoscope → Award` |
| 3 | Mobile single glass wrapper, transparent inner cells | 1 match for `sm:backdrop-blur-none` |
| 4 | sm+: cards gain own glass | 1 match for `sm:backdrop-blur-2xl` |
| 5 | StatsBar wired in `app/page.tsx` | 1 match for `<StatsBar` |
| 6 | 2×2 mobile, 1×4 desktop | 1 match for `grid-cols-2.*sm:grid-cols-4` |
| 7 | No `transition-all` | 0 matches |
| 8 | Icons `aria-hidden="true"` | 1 match |
| 9 | Section `aria-label="Ключевые цифры"` | 1 match |

## Live verification deferred

- Actual layout rendering at 375px (2×2) and 1440px (1×4) — needs browser
- Hover state behaving correctly only at `sm:` breakpoint
- `prefers-reduced-transparency` opaque fallback on the mobile wrapper

…tracked under Phase 85.

## Provenance

Original component logic. The user's `stash@{0}` did not contain StatsBar changes (the file is not in the stash diff). Built from spec: STATS-01 + STATS-02 + Phase 79 mobile budget constraint.
