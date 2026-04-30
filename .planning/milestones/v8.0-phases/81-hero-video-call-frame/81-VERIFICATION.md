---
status: passed
phase: 81-hero-video-call-frame
verified: 2026-04-30
mode: static
must_haves_passed: 10
must_haves_total: 10
notes: Live confirmation of animate-ping motion-reduce stop, aspect ratio rendering, and HD badge contrast deferred to Phase 85.
---

# Phase 81 Verification Results

**Phase:** 81 — Hero Video-Call Frame
**Plan executed:** 81-01
**Mode:** Static evidence via direct source inspection. Live DOM probes deferred to Phase 85.

## Must-Have Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Single doctor photo (no secondary overlapping photo) | STATIC ✅ | `grep "hero-consultation.webp"` returns 0 matches; only one `<Image src="/hero-doctor.webp">` at line 80 |
| 2 | Video-call frame chrome via dark frame + dark background | STATIC ✅ | line 75 `border-[6px] border-mu-text-900/85 bg-mu-text-900 ...` and chrome elements use `bg-mu-text-900/55` |
| 3 | Top-left name pill with green presence dot and "Vienna" label | STATIC ✅ | lines 88–96: pill with `bg-mu-green-500` dot + "Dr. Ferdinand K. · Vienna" |
| 4 | Top-right live indicator with `animate-ping` + `motion-reduce:hidden` + "В эфире" | STATIC ✅ | line 102 `animate-ping ... motion-reduce:hidden`; line 108 "В&nbsp;эфире" wordmark |
| 5 | Bottom-center control row with Mic + Video + HD | STATIC ✅ | line 117 control row container; `<Mic>` line 122, `<Video>` line 128, "HD" badge lines 130–132 |
| 6 | Frame container has `role="img"` + descriptive `aria-label` | STATIC ✅ | lines 73–78 `role="img"` + `aria-label="Видеоконсультация с европейским врачом MedicusUnion"` |
| 7 | Section min-height uses svh (mobile + lg breakpoints) | STATIC ✅ | line 7: `min-h-[calc(100svh-1rem)] ... lg:min-h-[calc(100svh-5rem)]` |
| 8 | Single floating credibility badge (43 clinics) — second badge removed | STATIC ✅ | `grep "ShieldCheck"` returns 0; only the "43 / Клиники в 11 странах" badge remains (lines 141–155) |
| 9 | Headline scale capped at `text-6xl` (no 7xl/8xl overflow) | STATIC ✅ | line 25 caps at `xl:text-6xl`; `grep -E "text-7xl\|text-8xl"` returns 0 |
| 10 | All transitions scoped (no `transition-all`) | STATIC ✅ | `grep "transition-all"` returns 0; CTAs use `transition-[transform,box-shadow,filter]` and `transition-[background-color,border-color,box-shadow]` |

## Requirements Traceability

| Req ID | Requirement | Coverage |
|--------|-------------|----------|
| HERO-01 | Hero communicates international video consultation in <3 seconds | Video-call frame metaphor + name pill ("Dr. Ferdinand K. · Vienna") + live indicator + control row chrome |
| HERO-02 | Hero responsive on 375px without overflow | `svh` sizing, capped headline, `max-w-[calc(100vw-2rem)]` overflow guard, mobile aspect-ratio swap, scaled-down control row |

## Key Links (verified via grep)

| Link | Pattern | Match |
|------|---------|-------|
| Frame container → screen-reader announcement | `role="img"` | line 76 ✅ |
| Live indicator halo → `prefers-reduced-motion` | `motion-reduce:hidden` | line 102 ✅ |

## Live Verification Plan (Phase 85)

1. Confirm `animate-ping` actually stops painting under `prefers-reduced-motion: reduce`
2. Verify `aspect-[4/5]` and `aspect-[3/4]` render correctly with `next/image fill`
3. HD badge red-on-white contrast ≥ 4.5:1 against actual photo content
4. Mic/Video icon visibility under all photo brightness ranges
5. Layout-shift (CLS) measurement when the priority image swaps from blur placeholder to full-res
6. `prefers-reduced-transparency: reduce` swapping to opaque chrome elements (declared globally)

## Deviations from PLAN.md

None.

## Provenance

The responsive-tightening fragments mirror user's `stash@{0}` draft. The video-call frame metaphor (dark frame, name pill, live indicator with `animate-ping`, control row with mic/camera/HD badge) is original design work in this phase to satisfy Phase 81's redesign goal — the stash did not contain this metaphor.

The `/public/hero-consultation.webp` asset remains on disk but is no longer consumed by the hero.
