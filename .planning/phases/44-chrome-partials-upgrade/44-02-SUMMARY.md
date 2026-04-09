---
phase: 44-chrome-partials-upgrade
plan: 02
subsystem: chrome-partials
tags: [liquid-glass, squircle, header, footer, mobile-menu, sticky-bar, dark-mode]
dependency_graph:
  requires: [src/styles/liquid-glass.css, src/styles/squircles.css, partials/, scripts/build-pages.sh]
  provides: [glass-styled chrome on all 6 pages, dark mode header scroll state]
  affects: [index.html, online-consultations.html, treatment-abroad.html, checkup.html, contacts.html, 404.html]
tech_stack:
  added: []
  patterns: [CSS custom property override for component state variants, shadow-wrap avoidance via inset-only glass material]
key_files:
  created: []
  modified:
    - partials/header.html
    - partials/footer.html
    - partials/mobile-menu.html
    - partials/sticky-bar.html
    - scripts/build-pages.sh
    - index.html
    - online-consultations.html
    - treatment-abroad.html
    - checkup.html
    - contacts.html
    - 404.html
    - css/styles.css
decisions:
  - "Build script mobile nav tokens updated alongside partials to maintain consistency (rounded-2xl -> squircle-lg in INACTIVE_MOBILE and ACTIVE_MOBILE)"
  - "Header scroll state uses CSS custom property overrides (--liquid-bg, --liquid-blur-md, --liquid-saturate) instead of raw property values -- .liquid-regular auto-inherits via var()"
  - "Dark mode scroll state (.dark .header--scrolled) added to all 6 pages with denser tint (rgba(30,40,60,0.6))"
  - "backdrop-blur-[80px] kept on mobile menu as Tailwind utility override for heavier blur readability"
metrics:
  duration: 6min
  completed: 2026-04-09
  tasks: 2/3 (checkpoint pending)
  files: 12
---

# Phase 44 Plan 02: Chrome Partials Glass + Squircle Upgrade Summary

All 4 chrome partials upgraded to v4.0 Liquid Glass material classes and squircle shapes; per-page header--scrolled inline styles converted to CSS custom property overrides with dark mode variant; build pipeline tokens updated for consistency.

## What Was Done

### Task 1: Upgrade 4 chrome partials with glass + squircle classes (84a869c)

**Header (partials/header.html):**
- Replaced `bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%] border-[0.5px] border-white/50 shadow-glass-header rounded-[2.5rem] max-w-7xl` with `liquid-regular squircle-xl max-w-[1200px]`
- Menu button: replaced `bg-white/50 rounded-full backdrop-blur-xl backdrop-saturate-[180%] border border-white/50` with `liquid-regular squircle-full`
- Preserved all BEM classes, positioning, transitions, text content, SVG icons, CTA gradient button

**Footer (partials/footer.html):**
- Footer wrapper: replaced `bg-white/60 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-glass-lg` with `liquid-card squircle-xl`
- Tailwind `p-12` overrides liquid-card's default 1.5rem padding
- 2 contact icons: replaced `glass-icon bg-white/60 backdrop-blur-md rounded-xl border border-white/60 shadow-glass-inner-strong` with `liquid-regular squircle-md`
- All 6 nbsp entities preserved, text content unchanged

**Mobile Menu (partials/mobile-menu.html):**
- Panel: replaced `bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%] shadow-glass-lg rounded-3xl border-[0.5px] border-white/50` with `liquid-regular squircle-xl backdrop-blur-[80px]`
- Kept `backdrop-blur-[80px]` as Tailwind utility override for heavier mobile blur
- 3 elements: "O nas" link, phone link, CTA link -- `rounded-2xl` replaced with `squircle-lg`
- Build script: INACTIVE_MOBILE and ACTIVE_MOBILE template tokens updated `rounded-2xl` -> `squircle-lg`

**Sticky Bar (partials/sticky-bar.html):**
- Bar: replaced `bg-white/60 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-glass-lg` with `liquid-regular squircle-lg`
- CTA button: `rounded-xl` replaced with `squircle-md`
- All ARIA attributes, text content, phone nbsp entities preserved

### Task 2: Update per-page header--scrolled inline styles (63e77a0)

In all 6 HTML pages, replaced the `.header--scrolled` inline style block:

**Before (identical in all 6 pages):**
```css
.header--scrolled {
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(60px) saturate(180%);
  -webkit-backdrop-filter: blur(60px) saturate(180%);
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
```

**After (identical in all 6 pages):**
```css
.header--scrolled {
  --liquid-bg: rgba(255, 255, 255, 0.45);
  --liquid-blur-md: 60px;
  --liquid-saturate: 200%;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.dark .header--scrolled {
  --liquid-bg: rgba(30, 40, 60, 0.6);
  --liquid-blur-md: 60px;
  --liquid-saturate: 200%;
}
```

- CSS custom properties override `.liquid-regular`'s var() references -- glass material auto-applies denser scroll-state values
- `-webkit-backdrop-filter` removed -- `.liquid-regular` already includes webkit prefix with same var() references
- Dark mode variant ensures scroll state works when `.dark` class is on html
- No other inline styles in any page's `<style>` block were modified

### Task 3: Visual verification checkpoint

Pending human visual verification.

## Verification Results

| Check | Result |
|-------|--------|
| header.html: liquid-regular + squircle-xl + max-w-[1200px] | PASS |
| header.html: no shadow-glass-header, bg-white/30, backdrop-blur-[40px], max-w-7xl, rounded-[2.5rem] | PASS |
| footer.html: liquid-card + squircle-xl | PASS |
| footer.html: no bg-white/60, backdrop-blur-3xl, shadow-glass-lg, rounded-[3rem] | PASS |
| footer.html: nbsp count unchanged (6) | PASS |
| mobile-menu.html: liquid-regular + squircle-xl | PASS |
| mobile-menu.html: no bg-white/60, shadow-glass-lg, rounded-3xl | PASS |
| sticky-bar.html: liquid-regular + squircle-lg | PASS |
| sticky-bar.html: no bg-white/60, backdrop-blur-3xl, shadow-glass-lg, rounded-2xl | PASS |
| All 6 pages: --liquid-bg in header--scrolled | PASS |
| All 6 pages: .dark .header--scrolled block present | PASS |
| All 6 pages: no raw background/backdrop-filter in header--scrolled | PASS |
| make build exits 0 | PASS |
| make check exits 0 (byte-identity) | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Build script mobile nav tokens required update**
- **Found during:** Task 1
- **Issue:** `scripts/build-pages.sh` contains INACTIVE_MOBILE and ACTIVE_MOBILE template strings with `rounded-2xl` that get substituted into mobile menu nav links during build. Updating only the partial would cause build to overwrite the changes.
- **Fix:** Updated both template strings in build-pages.sh from `rounded-2xl` to `squircle-lg`
- **Files modified:** scripts/build-pages.sh
- **Commit:** 84a869c

## Decisions Made

1. **Build script token consistency**: INACTIVE_MOBILE and ACTIVE_MOBILE in build-pages.sh updated alongside partials -- without this, `make build` would revert the squircle changes on nav links
2. **CSS custom property override pattern**: header--scrolled uses `--liquid-bg`, `--liquid-blur-md`, `--liquid-saturate` overrides instead of raw properties -- `.liquid-regular` auto-inherits via var()
3. **Dark mode scroll state**: Added `.dark .header--scrolled` block to all 6 pages with denser glass values (rgba(30,40,60,0.6) bg, 60px blur, 200% saturate)
4. **Mobile menu blur override**: Kept `backdrop-blur-[80px]` as Tailwind utility on mobile menu panel for readability over the dark overlay

## Self-Check: PASSED
