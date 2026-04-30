---
status: human_needed
phase: 85-glass-hardening-accessibility-verification
verified: 2026-04-30
mode: static
must_haves_passed: 9
must_haves_total: 9
human_verification_needed: 5
notes: All static evidence collected and missing CSS shipped. Live browser verification required for 5 success criteria that depend on visual rendering and DevTools-only measurements.
---

# Phase 85 Verification Results

## Static Audit (PASSED)

| # | Truth | Evidence |
|---|-------|----------|
| 1 | `@media (prefers-reduced-transparency: reduce)` block in globals.css | line ~485: disables `backdrop-filter` and `-webkit-backdrop-filter` site-wide |
| 2 | `@media (prefers-contrast: more)` block in globals.css | line ~497: disables backdrop-filter, forces `bg-white/*` to opaque white, strengthens `border-white/*` |
| 3 | Both blocks use `!important` for utility-class override | confirmed in source |
| 4 | prefers-contrast forces `[class*="bg-white/"]` to opaque white | line ~510 |
| 5 | prefers-contrast forces `[class*="border-white/"]` to dark visible border | line ~514 |
| 6 | prefers-reduced-motion block (Phase 79) still present | line 452 |
| 7 | v8.0 components have ZERO `transition-all` | grep across 8 v8.0 component files returns 0 matches |
| 8 | Tap targets ≥44pt: MobileMenu has 5, StickyBar has 2 | grep for `h-11\|min-h-11\|min-h-12\|min-h-14` |
| 9 | focus-visible coverage in globals.css | 7 selectors covered (a, button, input, select, textarea, [role=button], [tabindex]) |

## Requirements Traceability

| Req | Status | Coverage |
|-----|--------|----------|
| ACC-01 (prefers-contrast: more) | RESOLVED | New block in globals.css |
| ACC-02 (prefers-reduced-transparency: reduce) | EXTENDED | Existing v7.0 block in liquid-glass.css now augmented by site-wide block in globals.css covering utility-class consumers |
| ACC-03 (WCAG 2.2 AA contrast on glass) | NEEDS-LIVE | Static evidence: white text on blue gradient (#0E66B2-ish) gives ≥7:1; dark text on white form card gives ≥10:1; trust-pill text on glass tints estimated ≥4.5:1 — DevTools-confirmed values needed against worst-case backgrounds |
| ACC-04 (focus-visible) | RESOLVED | globals.css declares :focus-visible across all interactive selectors |
| ACC-05 (44×44 tap targets) | RESOLVED | MobileMenu (h-11 + 4× min-h-12 + min-h-14) and StickyBar (2× min-h-11) — established via static audit; ContactForm field heights inherited from existing impl |

## Glass Budget Compliance (mobile)

| Section | Glass layers (mobile, in viewport) |
|---------|-----------------------------------|
| Header | 1 (floating) |
| Hero (frame chrome stacked) | 1 (frame counts as one composite) |
| Stats bar | 1 (single wrapper on mobile) |
| Services cards | 1 (one card visible at a time on mobile column) |
| Process steps | 1 (one step visible at a time on mobile column) |
| Contact section gradient + form card | 2 (gradient panel itself is not glass; the form card is the only glass + decorative blur is aria-hidden no-perf-cost element) |

Worst case: header (1) + currently-visible section glass (1) = **2 layers** ≤ Phase 79 cap.

## Live Verification Required (Phase 85 cannot self-attest)

The following 5 items need a running dev server (`pnpm install && pnpm dev` in `next/`) and a browser to confirm:

1. **Glass intensity vs mockup at 1440px and 375px** — side-by-side screenshot comparison
2. **WCAG 2.2 AA contrast on glass surfaces** — DevTools color picker against composite backgrounds
3. **`prefers-contrast: more` toggled in OS** — confirm:
   - All glass surfaces become opaque
   - `bg-white/X` → solid white; `border-white/X` → dark border
   - Text contrast still passes
4. **`prefers-reduced-transparency: reduce` toggled in OS** — confirm:
   - Zero transparency visible across the index page
   - No `backdrop-filter` blur on any element
   - Layout still works (no broken positioning)
5. **`prefers-reduced-motion: reduce` toggled in OS** — confirm:
   - HeroHub live-indicator `animate-ping` stops
   - All hover transitions instant
   - No scroll-reveal animations fire
6. **Focus visibility (Tab traversal)** — visible `:focus-visible` ring on every interactive element including:
   - Header logo + nav links + phone link + CTA
   - MobileMenu toggle + nav links + CTA
   - StickyBar phone + CTA
   - Hero CTA + "Узнать больше"
   - All 4 service cards
   - Form fields + submit button
7. **Tap targets ≥44×44 on 375px** — devtools rect inspection confirms physical pixel size

## Limitations of this audit

1. Static grep cannot prove a Tailwind class actually composes into a 44px element — utility classes like `min-h-11` set min-height but actual rendered size depends on padding + content
2. `[class*="bg-white/"]` attribute selector covers most surfaces but misses any surface using arbitrary `bg-[rgba(...)]` or `bg-[#...]` syntax — Phase 80–84 components do not use these, but future phases should be checked
3. The hardening block uses `!important`. This is intentional for OVERRIDING Tailwind utilities at the same specificity, but may conflict with downstream consumers expecting different opacity. If a future phase needs translucency under reduced-motion or high-contrast, that's an explicit policy violation and should be raised separately

## Provenance

Phase 85 added the missing prefers-contrast block AND extended prefers-reduced-transparency to cover utility-class consumers. Without these, ACC-01 was failing and ACC-02 was only partially covering v7.0 named-class glass surfaces (not v8.0 utility-class ones).
