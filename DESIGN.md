---
name: MedicusUnion KZ
version: 0.1.0
description: >
  Design system for medicusunion.kz — a multi-page hub providing access to
  European and Asian medicine for the Kazakhstan audience (45+). Stack:
  Next.js + React + TypeScript + Tailwind. Visual language follows the
  MedicusUnion brand family (medicusunion.com / medicusunion.kz) and
  Apple Human Interface Guidelines for Liquid Glass and related materials.

colors:
  # ── Brand core ──────────────────────────────────────────────
  brand-blue: "#38C6F4"
  brand-black: "#010101"
  brand-white: "#FFFFFF"

  # ── Green scale (CTA / success) ─────────────────────────────
  green-50: "#E4FAEF"
  green-100: "#D3F8E4"
  green-200: "#A6EECB"
  green-300: "#A6EECB"
  green-400: "#79E9B3"
  green-500: "#6FDEA9"
  green-600: "#35B678"
  green-700: "#2D9E68"
  green-900: "#35B678"

  # ── Neutral / text scale ────────────────────────────────────
  text-50: "#FBFBFB"
  text-100: "#F5F6F8"
  text-200: "#D8DDE2"
  text-300: "#C6C9D1"
  text-500: "#6B6F80"
  text-700: "#4A4E5C"
  text-900: "#1B212C"
  text-primary: "#18212C"
  text-muted: "rgba(24, 33, 44, 0.55)"

  # ── Accent palette (use sparingly — one accent per section) ──
  accent-blue: "#4F84E8"
  accent-blue-text: "#3B6DD0"
  accent-red: "#F50057"
  accent-red-bg: "#FFF0F5"
  accent-orange: "#FFA25C"
  accent-orange-bg: "#FFF5ED"
  accent-orange-text: "#B5621D"
  accent-teal: "#78C3BF"
  accent-teal-bg: "#EBFAF9"
  accent-teal-text: "#3D7E7A"
  accent-blue-text-deep: "#0B7A9A"

  # ── Backgrounds ─────────────────────────────────────────────
  bg-blue: "#F0F7FF"
  bg-cream: "#FFF8F0"
  bg-gray: "#F5F7F9"
  bg-white: "#FFFFFF"

  # ── Mint badge ──────────────────────────────────────────────
  badge-mint-bg: "#D0FAE4"
  badge-mint-text: "#007955"

  # ── Gradient endpoints (for CTA fills) ──────────────────────
  cta-gradient-from: "#1AC67E"
  cta-gradient-to: "#0D9DB5"
  cta-gradient-from-v6: "#0E8FB5"
  cta-gradient-to-v6: "#3B6DD0"

  # ── Semantic aliases ────────────────────────────────────────
  primary: "#35B678"
  primary-hover: "#25A467"
  navy: "#1A365D"
  primary-dark: "#1A4D80"
  secondary-dark: "#047857"

  # ── v9.0 Living Blob palette (Phase 90, FND-01) ─────────────
  blob-core: "#35B678"                       # alias of green-600 / mu-primary
  blob-hot: "#4FE098"                        # KD-v9-001 — pending brand approval
  blob-halo: "rgba(98, 221, 177, 0.5)"
  blob-edge: "rgba(125, 205, 255, 0.18)"
  blob-glint: "rgba(255, 255, 255, 0.65)"

glass:
  # v9.0 Phase 90 (FND-02) — 4 surface depths × {fill, blur} × {desktop, mobile}
  # Mobile blur values capped at 12px per Phase 79 hard constraint.
  section:
    fill: { desktop: "rgba(255, 255, 255, 0.06)", mobile: "rgba(255, 255, 255, 0.10)" }
    blur: { desktop: "24px", mobile: "12px" }
  card:
    fill: { desktop: "rgba(255, 255, 255, 0.10)", mobile: "rgba(255, 255, 255, 0.14)" }
    blur: { desktop: "20px", mobile: "12px" }
  form:
    fill: { desktop: "rgba(255, 255, 255, 0.14)", mobile: "rgba(255, 255, 255, 0.18)" }
    blur: { desktop: "18px", mobile: "12px" }
  button:
    fill: { desktop: "rgba(255, 255, 255, 0.12)", mobile: "rgba(255, 255, 255, 0.16)" }
    blur: { desktop: "16px", mobile: "12px" }

typography:
  display:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h1:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  h3:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.375rem, 2.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.3
  body-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
  body-base:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4

rounded:
  # All rounded values render as Apple-style continuous-curve squircles
  # (super-ellipses). See the Shapes section in the body for the
  # 3-tier rendering strategy and the anti-patterns list.
  # Plain CSS `border-radius` rounding is forbidden in components.
  none: "0px"
  sm: "8px"      # squircle-sm — inputs, small chips
  md: "16px"     # squircle-md — buttons, default
  lg: "24px"     # squircle-lg — cards (default card radius)
  xl: "40px"    # squircle-xl — hero, sections, large surfaces
  full: "9999px" # squircle-full — pills, circular elements

shapes:
  # Custom block extending the canonical schema. Documents the squircle
  # contract that backs the `rounded` tokens above.
  rendering: squircle-only
  reference: Apple HIG Materials / continuous corners (iOS)
  squircle:
    sm:
      radius: "8px"
      utility: ".squircle-sm"
      status: "scheduled — token defined, utility to land in v8.0 phase 79"
    md:
      radius: "16px"
      utility: ".squircle-md"
      mask: "var(--squircle-mask-md)"
      nativeCornerRadius: "6%"
      status: "live"
    lg:
      radius: "24px"
      utility: ".squircle-lg"
      mask: "var(--squircle-mask-lg)"
      nativeCornerRadius: "7%"
      status: "live"
    xl:
      radius: "40px"
      utility: ".squircle-xl"
      mask: "var(--squircle-mask-xl)"
      nativeCornerRadius: "8%"
      status: "live"
    full:
      radius: "9999px"
      utility: ".squircle-full"
      mask: none
      status: "live (degenerate squircle = circle/pill at full radius)"
  tiers:
    tier1: "Chrome 139+ — native corner-shape: squircle (GPU, no mask)"
    tier2: "Safari 17+, Firefox 120+, Chrome <139 — mask-image SVG superellipse (production default)"
    tier3: "no mask-image support — plain border-radius (visible degradation, acceptable for legacy browsers)"

spacing:
  0: "0"
  1: "8px"
  2: "16px"
  3: "24px"
  4: "32px"
  5: "40px"
  6: "48px"
  8: "64px"
  10: "80px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.brand-white}"
    typography: "{typography.body-base}"
    rounded: "{rounded.md}"
    padding: "{spacing.2} {spacing.3}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.brand-white}"
    rounded: "{rounded.md}"
  button-cta-gradient:
    backgroundColor: "linear-gradient(90deg, {colors.cta-gradient-from} 0%, {colors.cta-gradient-to} 100%)"
    textColor: "{colors.brand-white}"
    typography: "{typography.body-base}"
    rounded: "{rounded.md}"
    padding: "{spacing.2} {spacing.4}"
  button-cta-gradient-hover:
    backgroundColor: "linear-gradient(90deg, {colors.cta-gradient-from} 0%, {colors.cta-gradient-to} 100%)"
    textColor: "{colors.brand-white}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.brand-white}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-base}"
    rounded: "{rounded.md}"
    padding: "{spacing.2} {spacing.3}"
  card:
    backgroundColor: "{colors.bg-white}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-base}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4}"
  card-glass:
    backgroundColor: "rgba(255, 255, 255, 0.6)"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-base}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4}"
  card-hero:
    backgroundColor: "{colors.bg-white}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-base}"
    rounded: "{rounded.xl}"
    padding: "{spacing.5}"
  badge-mint:
    backgroundColor: "{colors.badge-mint-bg}"
    textColor: "{colors.badge-mint-text}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.1} {spacing.2}"
  badge-accent-orange:
    backgroundColor: "{colors.accent-orange-bg}"
    textColor: "{colors.accent-orange-text}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.1} {spacing.2}"
  badge-accent-teal:
    backgroundColor: "{colors.accent-teal-bg}"
    textColor: "{colors.accent-teal-text}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.1} {spacing.2}"
  header:
    backgroundColor: "rgba(255, 255, 255, 0.8)"
    textColor: "{colors.text-primary}"
    height: "76px"
  input-field:
    backgroundColor: "{colors.bg-white}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-base}"
    rounded: "{rounded.sm}"
    padding: "{spacing.2}"

# v9.0 Phase 90 (FND-05) — anti-pattern register; full rationale in body section "## v9.0 Anti-Patterns"
antiPatterns:
  - name: "Multiple blobs"
    why: "TZ §1 single-protagonist rule; multiple blobs read as decoration not protagonist"
    addedIn: "v9.0 Phase 90"
  - name: "Cursor trail (N copies)"
    why: "TZ §14 explicit ban; trails read as gaming/playful, violate medical tone"
    addedIn: "v9.0 Phase 90"
  - name: "Per-frame React useState from pointer events"
    why: "TZ §16; consume rAF + CSS vars instead of state"
    addedIn: "v9.0 Phase 90"
  - name: "Solid-white / milky glass fills above 0.16"
    why: "TZ §9; breaks the transparent register the blob is meant to inhabit"
    addedIn: "v9.0 Phase 90"
  - name: "Green tint on cards"
    why: "TZ §9; brand parity violation; tint must come from blob behind glass, not from card surface"
    addedIn: "v9.0 Phase 90"
  - name: "Animated backdrop-filter blur values"
    why: "TZ §16; GPU-poison on mobile, especially Safari iOS"
    addedIn: "v9.0 Phase 90"
  - name: "Animated box-shadow on dozens of elements"
    why: "TZ §16; layer-thrash on mid-scroll"
    addedIn: "v9.0 Phase 90"
  - name: "mix-blend-mode on glass surfaces"
    why: "TZ §16; unpredictable contrast under varied backgrounds"
    addedIn: "v9.0 Phase 90"
  - name: "Spring physics with overshoot"
    why: "Tone violation; medical tone is calm and confident, not playful"
    addedIn: "v9.0 Phase 90"
  - name: "Heat-driven color shift toward red/orange"
    why: "Brand parity violation; v9.0 stays within brand greens (TZ §5)"
    addedIn: "v9.0 Phase 90"
  - name: "backdrop-filter on .living-blob-field itself"
    why: "Blob is BEHIND glass, not glass; applying backdrop-filter inverts the optical model"
    addedIn: "v9.0 Phase 90"
  - name: "Mobile blur >12px"
    why: "DESIGN.md hard constraint (Phase 79 cap); regressed historically; GPU + readability budget"
    addedIn: "v9.0 Phase 90"
  - name: ">2 glass layers per viewport"
    why: "DESIGN.md hard constraint; mobile-first ЦА 45+ readability + GPU budget"
    addedIn: "v9.0 Phase 90"
  - name: "Adding a new glass class without registering it in liquid-glass.css @a11y-layer-coverage block"
    why: "Phase 89 cheat-pass failure mode; coverage grep MUST find the new class between markers"
    addedIn: "v9.0 Phase 90"
  - name: "Cheat-passing a11y verification (declaring rules without live OS-toggle test)"
    why: "Phase 89 ACC-01..05 lesson; v9.0 Phase 94 forbids cheat-pass — real-device UAT required"
    addedIn: "v9.0 Phase 90"
  - name: "Propagating ContactForm honeypot + 3-second timing trap to new form components without an explicit anti-bot decision phase"
    why: "BL-04 silent-drop pattern (sub-3s submissions + filled honeypot return fake-success UI) breaks legitimate slow typists and accessibility-aided users; ContactForm grandfathered for v8.0 only, deferred for separate triage; new forms must use a non-silent-drop strategy"
    addedIn: "v9.0 Phase 93"
---

# DESIGN.md — MedicusUnion KZ

This document defines the design contract for `medicusunion.kz`. It follows the [Google Labs DESIGN.md specification](https://github.com/google-labs-code/design.md) — YAML front matter for machine-readable tokens, markdown body for human-readable rationale.

## Overview

`medicusunion.kz` is a multi-page hub offering three medical services for a Kazakhstan audience (45+):

- **Treatment abroad** (`/treatment-abroad`) — primary offer, 43 clinics, 11 countries
- **Checkup abroad** (`/checkup`) — Samsung Medical Center, Severance Hospital, Istanbul clinics; B2B variant
- **Online consultations** (`/consultations`) — entry-point service, video consultations with European doctors

The visual language is anchored in two non-negotiable constraints:

1. **Brand parity** with the MedicusUnion family — `medicusunion.com` (Vienna HQ) and `medicusunion.kz` (live KZ production).
2. **Apple Human Interface Guidelines** compliance for Liquid Glass and related materials.

Tokens defined in this file are the source of truth. They are mirrored in CSS at `next/src/app/globals.css` (as `--mu-*` and related custom properties). When the two diverge, this file wins — update the CSS to match.

## Colors

The palette is structured into four groups: brand core, scales (green / text), accents, and semantic aliases.

### Brand core

`{colors.brand-blue}` `#38C6F4` is the signature accent — used for icon outlines, decorative strokes, and fine details. `{colors.brand-black}` `#010101` and `{colors.brand-white}` `#FFFFFF` are reserved for high-contrast surfaces.

### Green scale (CTA / success)

The green scale runs `green-50` → `green-700`, with `green-600` `#35B678` as the canonical CTA fill. Hover state shifts to `primary-hover` `#25A467`. The mint shade `green-100` `#D3F8E4` is reused for success states.

> **WCAG note:** White text on `{colors.primary}` `#35B678` produces a contrast ratio of ≈2.6:1 — below WCAG AA for both normal (4.5:1) and large text (3:1). This matches the live `medicusunion.kz` and is preserved for brand parity. Compensating measures: large/bold typography on CTAs; AAA contrast on supporting text. New CTAs introducing smaller text must use `green-700` `#2D9E68` or darker.

### Text / neutral scale

A 7-step neutral scale for body text and structural surfaces. Body copy defaults to `{colors.text-primary}` `#18212C`. Muted copy uses `{colors.text-muted}` (55% opacity over the same base). Use `text-500` `#6B6F80` for labels.

### Accents

Four accent families — blue, red, orange, teal — each with `bg` and `text` companions. Rule: **one accent per section**. Mixing two accents in the same viewport is forbidden unless explicitly approved as a Key Decision.

### Backgrounds

`bg-white`, `bg-blue`, `bg-cream`, `bg-gray` rotate to create rhythm between sections. The hero background has been locked to white since v1.3 and must not change without a Key Decision.

### Gradients

Two canonical CTA gradients exist:

- **v1.3 gradient:** `{colors.cta-gradient-from}` → `{colors.cta-gradient-to}` (`#1AC67E` → `#0D9DB5`). Green-to-teal. Matches `medicusunion.kz` exactly. Use on standalone CTAs.
- **v6+ gradient:** `{colors.cta-gradient-from-v6}` → `{colors.cta-gradient-to-v6}` (`#0E8FB5` → `#3B6DD0`). Teal-to-blue. Used on the index hero and full-width CTA sections.

## Typography

Two font families, both self-hosted as variable WOFF2:

- **Body:** Inter (400, 500)
- **Headings:** Manrope (700, 800)

The display and heading scale uses fluid `clamp()` to bridge mobile and desktop without media-query breakpoints. `text-wrap: balance` is applied to all headings to avoid orphaned words on the last line. `letterSpacing` is tightened on display-size headings (`-0.02em`).

| Token | Use |
|-------|-----|
| `display` / `h1` | Hero titles, section openers |
| `h2` | Section headers |
| `h3` | Sub-section headers, card titles |
| `body-lg` | Lead paragraphs, hero subtitles |
| `body-base` | Default body copy |
| `body-sm` | Compact contexts (dense tables, captions on cards) |
| `caption` | Badge text, fine print, footnotes |

Line height ranges 1.1–1.6 — tighter for headings, looser for long-form body. The 45+ audience benefits from generous line height; do not compress below the values in the YAML schema.

## Layout

### Spacing scale

A power-of-two-ish scale (in 8px increments) covering both inline and block rhythms:

| Token | Pixels | Typical use |
|-------|--------|-------------|
| `spacing.1` | 8 | Inline gaps, icon padding |
| `spacing.2` | 16 | Default gap, button padding (Y) |
| `spacing.3` | 24 | Card content gap, button padding (X) |
| `spacing.4` | 32 | Card padding, mid-size gaps |
| `spacing.5` | 40 | Section internal gaps |
| `spacing.6` | 48 | Block separation |
| `spacing.8` | 64 | Section padding (mobile) |
| `spacing.10` | 80 | Section padding (desktop) |

### Section rhythm

- **Mobile:** 64px top + bottom (`spacing.8`).
- **Desktop:** 80–100px top + bottom (`spacing.10` and beyond).
- Wave dividers of 80px exist between alternating-bg sections (legacy v1.1 decoration; retained for visual rhythm).

### Container

Max content width `1200px`, centered, with responsive gutters (16px mobile / 24px tablet / 32px desktop).

### Grid

12-column grid implied via Tailwind (`grid-cols-12`); most sections use 1 / 2 / 3 / 4-column layouts at desktop and collapse to single-column at mobile.

## Elevation & Depth

The site has **two elevation systems** running in parallel:

### Flat surfaces (legacy v1.3 default for cards)

Cards use **no box-shadow** at rest. Elevation is implied by background contrast and rounding. Hover state lifts via `translateY(-2px)` rather than scale or shadow change.

### Liquid Glass surfaces

Glass elements use composite shadows that combine an outer drop shadow with an inner edge-light glow. Token tiers:

- `shadow-glass-sm` — cards, badges, small surfaces
- `shadow-glass` — default glass surface
- `shadow-glass-lg` — modals, popovers, elevated overlays
- `shadow-glass-header` — sticky chrome composite (asymmetric, with bottom edge darkening)

Inner edge-light tokens (`shadow-glass-inner`, `shadow-glass-inner-strong`) can be combined with custom outer shadows for one-off compositions, but new compositions are discouraged in favor of the named tiers.

For the full Liquid Glass token set and Apple HIG compliance rules, see the [Apple Liquid Glass HIG Compliance](#apple-liquid-glass-hig-compliance) custom section below.

## Shapes

**The only shape system on this site is the squircle (super-ellipse) — Apple-style continuous corners.** Plain CSS `border-radius` rounding is forbidden on visible UI surfaces. Every rounded element ships through the squircle utility classes.

This is non-negotiable. The visual difference between a CSS rounded corner and a continuous-curve squircle is the difference between a generic web app and a brand-grade product. Apple has set the bar; we match it.

### Squircle scale (degrees of curvature)

| Token | Radius | Utility | Use |
|-------|--------|---------|-----|
| `rounded.none` | `0px` | — | Hairlines, dividers, technical surfaces |
| `rounded.sm` | `8px` | `.squircle-sm` ⏳ | Inputs, form fields, small chips |
| `rounded.md` | `16px` | `.squircle-md` ✅ | Buttons (default), tags |
| `rounded.lg` | `24px` | `.squircle-lg` ✅ | Cards (default), small surfaces |
| `rounded.xl` | `40px` | `.squircle-xl` ✅ | Hero, sections, large surfaces, modals |
| `rounded.full` | `9999px` | `.squircle-full` ✅ | Pills, badges, circular elements |

✅ = utility live in `next/src/styles/squircles.css`
⏳ = token defined; utility scheduled for v8.0 phase 79 (Visual Foundation token work)

The scale is based on the existing 3-tier system (`md` / `lg` / `xl` / `full`) extended with `sm` for inputs. Smaller `sm` curves still use squircle smoothing — Apple applies continuous corners even at 8px radius on iOS.

### Three-tier rendering strategy

The squircle utility classes degrade gracefully across browsers:

#### Tier 1 — Chrome 139+ (native, GPU-accelerated)

```css
@supports (corner-shape: squircle) {
  .squircle-md { corner-shape: squircle; border-radius: 6%; }
  .squircle-lg { corner-shape: squircle; border-radius: 7%; }
  .squircle-xl { corner-shape: squircle; border-radius: 8%; }
}
```

The native CSS `corner-shape: squircle` proposal renders true superellipses without GPU mask cost. Native radii expressed as percentages (6/7/8%) match Apple's iOS app icon ratios.

#### Tier 2 — Safari 17+, Firefox 120+, Chrome <139 (production default)

`mask-image` with hand-tuned inline-SVG superellipse paths. Tokens `--squircle-mask-md/lg/xl` defined in `globals.css`. This is the workhorse — covers ~95% of real traffic.

#### Tier 3 — no `mask-image` support (legacy fallback)

Plain `border-radius` rounded corners. Visible degradation but acceptable for ancient browsers (mostly KZ-market WebView edge cases).

### Apple parity baseline

The squircle paths in `globals.css` (`--squircle-mask-md/lg/xl`) are tuned to approximate iOS continuous-corner geometry:

- `md` (16px / 6%) — comparable to iOS button corner.
- `lg` (24px / 7%) — comparable to iOS card / sheet corner.
- `xl` (40px / 8%) — comparable to iOS app icon corner radius family.

If a Figma design uses Figma's "Corner smoothing" slider, the matching value is **~60% smoothing** for parity with our masks, which approximates iOS `RoundedRectangle(... style: .continuous)`.

### Anti-patterns (forbidden)

These all break the squircle system. Each has burned us at least once.

- ❌ **`border` on a squircle element.** Borders are clipped by `mask-image`. Use `box-shadow: inset 0 0 0 1px <color>` instead.
- ❌ **`box-shadow` + `mask-image` on the same element.** The shadow gets clipped to the mask silhouette and renders as two thin arcs. Wrap the squircle in a parent that owns the shadow, or use the documented shadow-wrap pattern in `squircles.css`.
- ❌ **`filter: drop-shadow()` on a glass ancestor.** Breaks `backdrop-filter` on children (regression introduced and fixed in commit `ba29f8a`).
- ❌ **Squircle on a rotating element.** `mask-image` distorts under `transform: rotate()`. Keep plain `border-radius` for any element that rotates (loaders, decorative spinners).
- ❌ **Plain `rounded-*` Tailwind classes for visible UI.** They produce CSS rounded corners, not squircles. Use the `.squircle-*` utilities or the matching design token. Plain `rounded-*` is allowed only on offscreen / technical surfaces.
- ❌ **Mixing squircle and plain rounded in the same component family.** All buttons squircle. All cards squircle. No mixed siblings.

### Print

Print engines clip squircles via `mask-image` and produce broken silhouettes on paper. The `squircles.css` print rule strips masks in `@media print`. Do not override.

## Components

The `components` block in YAML defines the canonical visual contract for each named component. Full list above; key components called out here:

### `button-primary` and `button-cta-gradient`

The primary CTA fills a button with `{colors.primary}` `#35B678` and white text. The gradient variant uses the v1.3 green→teal gradient. Both render as `.squircle-md` (16px continuous-curve).

**Variants:**
- Hover (`button-primary-hover`): swap fill to `{colors.primary-hover}` `#25A467`. The gradient variant retains the same gradient and applies a subtle opacity reduction (`opacity: 0.9`) to avoid gradient-direction reversal.
- Active: `transform: scale(0.97)` for 100ms (tactile feedback).
- Disabled: 50% opacity, `pointer-events: none`.

### `card` and `card-glass`

`card` is the flat default — white background, `.squircle-lg` (24px continuous-curve), no shadow at rest, `translateY(-2px)` on hover. `card-glass` is the Liquid Glass variant — semi-transparent white over a `backdrop-filter: blur(...)` surface, with shadow-glass and the same `.squircle-lg`. The `card-hero` variant scales up to `.squircle-xl` (40px) for hero-sized surfaces.

Glass cards must respect the mobile blur budget (≤12px) and the per-viewport limit (≤2 stacked glass surfaces). Borders on glass cards must use `box-shadow: inset 0 0 0 1px ...` (not `border`) — see Shapes anti-patterns.

### `badge-mint` / `badge-accent-*`

`.squircle-full` (pill at full radius — degenerates to a clean circle/pill, no mask needed), caption-sized. The mint variant is the most common (used for "v3.1", "Новое" markers, certifications). Accent variants are used for status (`accent-orange-bg` for "warning", `accent-teal-bg` for "info").

### `header`

Sticky-positioned, height 76px, glass background at 80% white opacity, frosted via `backdrop-filter` (chrome-tier blur 16px). The header chrome is the only glass element allowed in the persistent viewport, which keeps the per-viewport count budget for sections.

### `input-field`

Form fields default to `.squircle-sm` (8px continuous-curve), white background, body-base typography. Focus state uses `outline: 2px solid {colors.primary}` — outlines render outside the squircle mask, which is the desired behaviour (no clipping).

## Do's and Don'ts

### ✅ Do

- Use tokens (`{colors.X}`, `{rounded.Y}`, `{spacing.Z}`) for every value. Never hard-code hex, pixel, or rem values in components.
- **Use `.squircle-*` utilities for every visible rounded surface.** Apple-style continuous corners are mandatory — see the Shapes section.
- Match `medicusunion.com` and `medicusunion.kz` for any visual decision the tokens don't cover. Pixel-pick from the live site.
- Apply `text-wrap: balance` to every heading.
- Verify `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` for every glass surface.
- Test mobile viewports (`< 768px`) with throttled CPU before declaring a glass surface done.
- Add `@supports` fallbacks for every `backdrop-filter` rule.
- Lift on hover with `translateY(-2px)` for cards (subtler than scale).
- Use `box-shadow: inset 0 0 0 1px <color>` for borders on squircle elements (CSS `border` is clipped by the mask).

### ❌ Don't

- Hard-code hex values in components. Use tokens.
- Use Tailwind arbitrary values for color (`bg-[#…]`).
- Invent a new color "close to" the palette. Either pick from the existing scale or log a Key Decision.
- **Use plain CSS `border-radius` rounding for visible UI.** Squircles are mandatory. Use `.squircle-*` utilities.
- **Apply `border` to a squircle element.** It gets clipped by the mask. Use `inset` shadow instead.
- **Apply `box-shadow` and `mask-image` to the same element.** The shadow renders as two thin clipped arcs. Use the documented shadow-wrap pattern.
- **Apply `filter: drop-shadow()` on a glass ancestor.** Breaks `backdrop-filter` on children.
- **Apply squircle to a rotating element.** `mask-image` distorts under `transform: rotate()`.
- Stack glass on glass. The persistent header counts as one glass layer.
- Apply blur > 12px on viewports < 768px.
- Mix two accents in one section (violates accent-per-section rule).
- Mix squircle and plain rounded in sibling components — all buttons squircle, all cards squircle, no exceptions.
- Skip `prefers-reduced-*` opt-outs. They are mandatory.
- Use `prefers-reduced-motion` with `duration: 0` only — also strip `transform`. Otherwise scroll-reveal snaps from offset.
- Apply CTA gradient to non-CTA elements (creates fake call-to-action ambiguity).
- Change hero background to anything other than white without a Key Decision.

---

## Brand Parity Rule (custom section)

Every color, every gradient, every spacing decision must trace to one of two canonical sources:

- **`medicusunion.com`** — parent brand site (Vienna HQ).
- **`medicusunion.kz`** — live KZ production.

When a needed shade is not represented in either site, the correct response is **not** to invent — it is to:

1. Pull from the existing token scale defined in this file's YAML.
2. If the scale doesn't cover the need, log a Key Decision in `.planning/PROJECT.md` and update this DESIGN.md *before* introducing the new token.

When the two reference sites disagree, `medicusunion.kz` takes precedence for KZ-facing UI choices (cultural and audience reasons), but the visual language must remain recognizable as the same brand family.

## Apple Liquid Glass HIG Compliance (custom section)

All glass / frosted / translucent surfaces must follow Apple's Human Interface Guidelines for **Materials** and **Liquid Glass**.

### Authoritative references

- [Apple HIG → Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple HIG → Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Apple HIG → Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- WWDC sessions on materials and Liquid Glass (most recent applies).

### Liquid Glass blur scale

Defined in `next/src/styles/liquid-glass.css`:

| Token | Value | Material analogue |
|-------|-------|-------------------|
| `--liquid-blur-sm` | 16px | UltraThin |
| `--liquid-blur-md` | 24px | Thin |
| `--liquid-blur-lg` | 40px | Regular |
| `--liquid-blur-xl` | 60px | Thick |
| `--liquid-nav-blur` | 16px | Header chrome |
| `--liquid-clear-blur` | 20px | Modal / popover |

### Project-specific hard constraints (stricter than HIG floor)

- **Mobile blur budget:** ≤ 12px on viewports < 768px. `Regular` (40px) and `Thick` (60px) are **not used** on mobile.
- **Glass layer count:** ≤ 2 glass elements per viewport. Stacked glass-on-glass is forbidden — kills GPU on budget Android devices that dominate the KZ market.
- **Dark mode glass-off:** When `[data-theme="dark"]` is active, `backdrop-filter` is disabled on most surfaces. Glass on `#0F1923` reads as a murky smear; opaque dark surfaces are clearer.
- **`@supports` fallbacks required:** Every `backdrop-filter` rule must have a fallback for browsers without support.

### Mandatory accessibility opt-outs

| Media query | Required behaviour |
|-------------|--------------------|
| `prefers-reduced-transparency` | Disable `backdrop-filter`. Replace glass with opaque surfaces matching the surrounding bg. |
| `prefers-contrast: more` | Increase border opacity (`rgba(255,255,255,0.95)+`) and text contrast to AAA. |
| `prefers-reduced-motion` | Strip shimmer / sheen animations entirely (`transform: none`, not just `duration: 0`). |

## Audit Baseline & Known Gaps (custom section)

**Last audit:** ~85% Apple HIG compliance (logged in `.planning/PROJECT.md`).

Known gaps (target: close in v8.0 phase 85 *Glass Hardening & Accessibility Verification*):

- Mobile blur budget enforcement is partial — some sections still ship 24px on small viewports.
- Glass layer count is exceeded in 2 sections (services grid + sticky bar overlap).
- `prefers-contrast` is wired but not visually verified across all glass surfaces.
- Shimmer / sheen animations on hero do not all respect `prefers-reduced-motion`.

## References

- `next/src/app/globals.css` — token definitions (CSS mirror of the YAML schema above)
- `next/src/styles/liquid-glass.css` — Liquid Glass token bundle
- `.planning/PROJECT.md` — Key Decisions log (palette, glass policy)
- Live sites — [medicusunion.com](https://medicusunion.com), [medicusunion.kz](https://medicusunion.kz)
- [Google Labs DESIGN.md spec](https://github.com/google-labs-code/design.md) — format used by this file
- Apple HIG — Materials, Color, Motion (URLs in the Liquid Glass section above)

## v9.0 Custom Rules

Added 2026-04-30 (Phase 90, FND-04 + FND-05). Reference: `.planning/REQUIREMENTS.md` v9.0 section, `design/LIQUID_GLASS_BLOB_TZ.md` §1, §5, §9, §11, §16, §17.

### Z-index contract (FND-04)

The v9.0 living-blob composition has a fixed z-stacking order. Every layer in the app MUST fit one of these bands:

| Layer                                      | z-index   | Notes |
|--------------------------------------------|-----------|-------|
| `.living-blob-field` (blob field)          | `z-0`     | Always behind everything; `position: fixed; inset: 0`. Single instance, mounted in `layout.tsx`. |
| `<main>` content + glass surfaces          | `z-1..10` | Page-content cards, sections, forms. Existing `<main className="relative z-10">` is the anchor. |
| `Header`, `StickyBar`, sticky chrome       | `z-50+`   | Always-visible chrome rides above content; below modals. |
| Modals, dialogs, popovers                  | `z-100+`  | Top of stack; backdrop sits above all other UI. |

Any new component MUST declare its `z-index` (or use a Tailwind utility like `z-0`, `z-10`, `z-50`, `z-[100]`) within these bands. Numbers outside these bands require a Key Decision in `.planning/PROJECT.md`.

### CTA opaque-forever rule (FND-05)

The v6 CTA gradient (`from-mu-cta-from-v6 → to-mu-cta-to-v6`, brand greens) is the page's primary conversion signal. It MUST stay fully opaque under every condition — no `backdrop-filter`, no `bg-white/{n}` glass utilities, no transparency from the v9.0 4-tier glass system. Rationale: `.planning/research/PITFALLS.md` §3.1 — CTA disappears into the green blob ambient when glass is applied.

**Master list of CTA-opaque components (every consumer of the v6 gradient or `.btn-primary`):**

1. `HeroHub` primary CTA (заявка на консультацию)
2. `FinalCTA` primary submit
3. `ContactForm` submit button
4. `StickyBar` primary action (mobile sticky CTA)
5. `Header` phone CTA (where rendered with gradient)
6. Service-page `LeadFormSection` submit
7. Any future component using `.btn-primary` or v6 gradient utility classes (`from-mu-cta-from-v6`, `to-mu-cta-to-v6`)

**Enforcement (Phase 90):**
- `next/src/styles/liquid-glass.css` `@a11y-layer-coverage:start/end` block carries a comment block documenting the rule and excludes `.btn-primary` / `.liquid-btn-primary` from a11y enumeration.
- `next/src/styles/blob.css` does NOT define any CTA-related class.
- Phase 92 (Glass Rework) will physically verify each component matches the rule during the glass sweep.
- Stylelint / ESLint enforcement is deferred to v9.1+ (per CONTEXT.md `<deferred>`).

### Source artifacts

- TZ §1 (single-protagonist), §5 (palette), §9 (alpha tiers), §11 (mobile compensation), §16 (anti-patterns), §17 (heat timing): `design/LIQUID_GLASS_BLOB_TZ.md`
- Phase 90 locked decisions: `.planning/phases/90-foundation-tokens-a11y-wiring-dom-skeleton/90-CONTEXT.md`
- Mobile blur cap (Phase 79 hard constraint, ≤12px): `.planning/research/PITFALLS.md` §1.1
- Cheat-pass failure mode (Phase 89 ACC-01..05): `.planning/phases/89-milestone-closeout/89-VERIFICATION.md`

## v9.0 Anti-Patterns

Added 2026-04-30 (Phase 90, FND-05). Machine-readable mirror in YAML front matter `antiPatterns:` field. Each entry expands the YAML with: where it would manifest, what to do instead.

Phase 91-94 planners MUST grep this section before generating tasks; any task that would violate an entry must be rewritten.

1. **Multiple blobs.** Why: TZ §1 single-protagonist rule; multiple blobs read as decoration not protagonist. Where it manifests: tempting to add per-section accent blobs in `*Section.tsx` components or duplicate `.living-blob-field` per route. Do instead: single `.living-blob-field` in `layout.tsx`; section accents come via heat-leak `radial-gradient` on glass cards (Phase 92).

2. **Cursor trail (N copies).** Why: TZ §14 explicit ban; trails read as gaming/playful, violate medical tone. Where it manifests: tempting to render N afterimages as the blob lerps. Do instead: 4 sublayers (core/body/halo/glint) with different lerp factors deliver the impression of a trail without the playful read.

3. **Per-frame React useState from pointer events.** Why: TZ §16; consumes the React tree on every pointer move; causes scroll/INP regressions. Where it manifests: `onPointerMove` calling `setState` for blob position. Do instead: write directly to `document.documentElement.style.setProperty('--blob-x', ...)` inside a single `pointermove` listener and a single rAF loop; CSS consumes the var (Phase 91).

4. **Solid-white / milky glass fills above 0.16.** Why: TZ §9; breaks the transparent register the blob is meant to inhabit. Where it manifests: copying pre-v9.0 `--liquid-bg: rgba(255,255,255,0.42)` into new components. Do instead: use the v9.0 `--glass-{section,card,form,button}-fill` tier tokens (≤0.16 desktop / ≤0.18 mobile) introduced in Phase 90 (FND-02).

5. **Green tint on cards.** Why: TZ §9; brand parity violation; tint must come from blob behind glass. Where it manifests: applying `bg-mu-green-100/{n}` directly to a card. Do instead: leave card surface neutral; the `.liquid-card` heat-leak `radial-gradient(... at var(--blob-x) var(--blob-y), ...)` (Phase 92) tints the surface optically when the blob is behind it.

6. **Animated `backdrop-filter` blur values.** Why: TZ §16; GPU-poison on mobile, especially Safari iOS. Where it manifests: tempting to ramp `backdrop-filter: blur(N)` from 8px to 24px on hover. Do instead: keep `backdrop-filter` value static; animate `opacity` or `transform` instead.

7. **Animated `box-shadow` on dozens of elements.** Why: TZ §16; layer-thrash on mid-scroll. Where it manifests: card hover effects with `box-shadow` transitions across many cards simultaneously. Do instead: animate `transform: scale()` or `opacity`; use `box-shadow` as a static accent only.

8. **`mix-blend-mode` on glass surfaces.** Why: TZ §16; unpredictable contrast under varied backgrounds (especially with the moving blob). Where it manifests: copy-paste from `MeshBackground.tsx` (deleted in Phase 90). Do instead: use solid alpha-channel colors; rely on the heat-leak `radial-gradient` for compositional response.

9. **Spring physics with overshoot.** Why: tone violation; medical tone is calm and confident, not playful. Where it manifests: framer-motion springs with `stiffness > 200, damping < 15`. Do instead: lerp toward target each frame (linear interpolation, no overshoot — Phase 91 BLOB-02).

10. **Heat-driven color shift toward red/orange.** Why: brand parity violation; v9.0 stays within brand greens (TZ §5). Where it manifests: tempting to drive `--blob-heat` toward red/orange to signal "high engagement." Do instead: let `--blob-hot: #4FE098` (KD-v9-001) be the only "hot" color — slightly cooler/brighter green than `--blob-core: #35B678`.

11. **`backdrop-filter` on `.living-blob-field` itself.** Why: blob is BEHIND glass, not glass; applying `backdrop-filter` inverts the optical model. Where it manifests: copying glass-component CSS to the blob field. Do instead: `.living-blob-field` is `position: fixed; z-index: 0; pointer-events: none`. NO `backdrop-filter`. Verified by `grep -A 30 '.living-blob-field {' next/src/styles/blob.css | grep -v backdrop-filter`.

12. **Mobile blur >12px.** Why: `DESIGN.md` hard constraint (Phase 79 cap); regressed historically. Where it manifests: hardcoded `filter: blur(40px)` or `backdrop-filter: blur(24px)` without a `clamp(12px, …)` mobile floor. Do instead: every blur value uses `clamp(12px, fluid-vw, desktop-ceiling)`; mobile media queries cap `filter: blur` at 12px (see `next/src/styles/blob.css` Phase 90 mobile media query).

13. **>2 glass layers per viewport.** Why: `DESIGN.md` hard constraint; mobile-first ЦА 45+ readability + GPU budget. Where it manifests: nested glass cards inside a glass section inside a glass container. Do instead: respect responsive-glass-nesting (mobile = 1 wrapper, desktop = N cards). Phase 82 `StatsBar` is the reference implementation.

14. **Adding a new glass class without registering it in `liquid-glass.css` `@a11y-layer-coverage` block.** Why: Phase 89 cheat-pass failure mode; coverage grep MUST find the new class between markers. Where it manifests: shipping a new `.glass-foo` utility for one component, forgetting to enumerate it under `prefers-reduced-motion` / `-transparency` / `prefers-contrast: more`. Do instead: every new `.liquid-*`, `.glass-*`, `.blob-*`, `.stats-*`, `.living-blob-*` class MUST be appended to all 3 `@media` blocks inside the `@a11y-layer-coverage:start/end` markers (CTA classes excepted: `.btn-primary`, `.liquid-btn-primary`).

15. **Cheat-passing a11y verification (declaring rules without live OS-toggle test).** Why: Phase 89 ACC-01..05 lesson; v9.0 Phase 94 forbids cheat-pass — real-device UAT required. Where it manifests: marking ACC-* tasks complete because the CSS block exists, without toggling macOS / iOS accessibility settings and reloading the page. Do instead: Phase 94 hard gate — record screenshot/video evidence of `prefers-reduced-motion` / `-transparency` / `prefers-contrast: more` actually applied; phase blocked without artifacts.

16. **Propagating the ContactForm honeypot + 3-second timing trap pattern to new form components without an explicit anti-bot decision phase.** Why: ContactForm (Phase 92, BL-04) silently drops sub-3 s submissions and honeypot-tripped submissions while showing a fake-success UI. The pattern was grandfathered for the v8.0 ContactSection only and remains DEFERRED for separate triage — it breaks legitimate slow typists and accessibility-aided users. Where it manifests: copy-pasting `loadTimeRef` + `if (Date.now() - loadTime < 3000) return success` from `ContactForm.tsx` into a new form component, or adding a hidden `name="website"` honeypot field with the same silent-success branch. Do instead: leave anti-bot for new forms OUT OF SCOPE until a future explicit anti-bot decision phase designs a non-silent-drop strategy (reCAPTCHA v3, hCaptcha, server-side rate-limiting, or accessible challenge UI). Phase 93 honors this — `LeadFormSection` ships without honeypot/timing per Decision C in `93-CONTEXT.md`. Verification grep (any new form component MUST NOT match): `grep -irE '(honeypot|loadTimeRef|Date\.now\(\) - loadTime|name="website")' next/src/components/sections/`.
