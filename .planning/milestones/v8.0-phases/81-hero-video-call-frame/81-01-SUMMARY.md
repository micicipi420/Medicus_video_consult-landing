# Plan 81-01 Summary — Hero Video-Call Frame

**Status:** Complete
**Date:** 2026-04-30
**Files modified:** 1 source file (HeroHub.tsx — full rewrite)

## What was built

Replaced the dual-photo hero composition with a single doctor portrait wrapped as a video-call window. The metaphor delivers the v8.0 value comprehension goal — "this is a real video consultation with a European doctor" — within the 3-second above-the-fold window.

### Visual changes
- **Frame:** Dark `border-mu-text-900/85` (6px mobile, 8px sm+) over `bg-mu-text-900` — reads as a video-call window bezel, not a decorative photo frame
- **Photo:** Single `<Image>` of `hero-doctor.webp` with `aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]` — keeps the doctor's face prominent on every viewport
- **Top-left name pill:** "Dr. Ferdinand K. · Vienna" + green presence dot (`mu-green-500` with halo `box-shadow`) — establishes "real European doctor" credibility
- **Top-right live indicator:** Red dot with `animate-ping` halo + uppercase "В эфире" — universal "live broadcast" affordance; halo hidden under `prefers-reduced-motion` via `motion-reduce:hidden`
- **Bottom-center control row:** Glass pill containing Mic + Video icons + HD badge — recognizable video-call UI; `aria-hidden="true"` since none are interactive
- **Floating credibility badge:** "43 клиники в 11 странах" repositioned to top-right of frame; second badge ("15+ лет опыта") removed because the data is already in the trust line below CTAs

### Responsive tightening (carried forward from user's stash@{0} draft)
- Section min-height: `min-h-[calc(100svh-1rem)]` mobile / `lg:min-h-[calc(100svh-5rem)]` desktop — `svh` accounts for mobile browser chrome; spacing reserves room for floating Phase 80 header
- Mobile padding: `pt-20 pb-10` (was `pt-32 pb-16`)
- Headline scale capped at `xl:text-6xl` (was `xl:text-8xl`) — prior 8xl overflowed 1366px laptops
- Left content: `max-w-[calc(100vw-2rem)]` overflow guard
- Subtitle: `text-lg sm:text-xl` (mobile down-step)
- CTAs: scoped `transition-[transform,box-shadow,filter]` and `transition-[background-color,border-color,box-shadow]` (no more `transition-all`); `active:scale-[0.98]` on primary

### Accessibility
- Frame container: `role="img"` + `aria-label="Видеоконсультация с европейским врачом MedicusUnion"` — screen readers announce the metaphor as a single image
- Mic, Video, HD chrome marked `aria-hidden="true"` (decorative)
- `<Image alt="Врач на платформе MedicusUnion">` retained as fallback
- `motion-reduce:hidden` on the live-indicator `animate-ping` halo
- Single decorative `priority` `<Image>` (above-the-fold)

## Requirements covered

- **HERO-01** (Hero communicates international video consultation in <3 seconds): video-call frame metaphor, name pill identifying European doctor, live indicator
- **HERO-02** (Hero responsive on 375px without overflow or layout break): svh sizing, capped headline, max-w guards, mobile aspect ratios, control-row scales down to `gap-2 px-3 py-2` on small viewports

## Self-Check: PASSED

| # | Truth | Evidence |
|---|-------|----------|
| 1 | Single doctor photo (no secondary overlap) | `grep "hero-consultation.webp"` returns 0 matches |
| 2 | Video-call frame chrome | 4 matches for `border-mu-text-900/85` + `bg-mu-text-900` |
| 3 | Top-left "Vienna" name pill | line 88 |
| 4 | Live indicator (red dot, animate-ping, motion-reduce, "В эфире") | lines 99–110 |
| 5 | Control row (Mic + Video + HD) | lines 121–135 |
| 6 | `role="img"` + `aria-label` on frame | lines 76–79 |
| 7 | `100svh` viewport math | line 7 (both `calc(100svh-1rem)` and `calc(100svh-5rem)`) |
| 8 | Second badge (`ShieldCheck`/"15+ лет") removed | `grep "ShieldCheck"` returns 0; "15+ лет" in trust line only |
| 9 | Headline cap at `text-6xl` | `grep -E "text-7xl\|text-8xl"` returns 0 |
| 10 | No `transition-all` | `grep "transition-all"` returns 0 |

## Live verification deferred

Browser confirmation of:
- `animate-ping` actually stopping under `prefers-reduced-motion: reduce`
- `aspect-[4/5]` rendering correctly with `next/image fill`
- HD badge color contrast against any photo background

…tracked under Phase 85 (Glass Hardening & Accessibility Verification).

## Provenance

The responsive-tightening fragments (svh, padding, headline cap, scoped transitions) match the user's `stash@{0}` draft for HeroHub. The video-call frame chrome (frame border, name pill, live indicator, control row) is **new design** authored in this phase to satisfy Phase 81's redesign goal — the stash did not contain this metaphor.

The `/public/hero-consultation.webp` asset is no longer consumed by the hero but remains on disk for potential reuse in a downstream phase.
