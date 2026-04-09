---
status: resolved
trigger: "v4.0-layout-regressions: After v4.0 Liquid Design System migration, all 6 pages have broken paddings, margins, and container spacing."
created: 2026-04-09T00:00:00Z
updated: 2026-04-09T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED - Multiple root causes identified and fixed
test: Visual inspection of all pages at http://localhost:8080
expecting: Layout spacing restored to pre-migration quality
next_action: User verification

## Symptoms

expected: Pages should look like they did before v4.0 migration -- proper spacing between sections, cards with correct padding, containers properly centered with breathing room.
actual: Paddings and margins are broken across all pages. Container widths, section spacing, card padding -- all look wrong. Design is cramped.
errors: No JS errors. Pure CSS layout regression.
reproduction: Open any page -- layout issues visible immediately.
started: After v4.0 migration Phases 44-47 modified all 6 HTML pages.

## Eliminated

## Evidence

- timestamp: 2026-04-09
  checked: git diff b141e31..HEAD on all HTML files
  found: Migration replaced `container mx-auto px-4 lg:px-6` with `mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8` on all section containers. Also replaced `max-w-7xl` (1280px) with `max-w-[1200px]` on header.
  implication: Container lost responsive max-width stepping. Padding changed from `px-4 lg:px-6` to `px-4 md:px-6 lg:px-8` eating more content space.

- timestamp: 2026-04-09
  checked: liquid-glass.css .liquid-card class
  found: `.liquid-card` has built-in `padding: 1.5rem` (24px). Service cards in index.html have NO explicit padding on outer card div (children manage their own p-8/p-3). Result: extra 24px padding layer on cards.
  implication: Double-padding on cards with internal padding management. Cramped card content.

- timestamp: 2026-04-09
  checked: index.html services grid column spans
  found: `grid-cols-12` with `md:col-span-4` gives 3 columns on tablet. Pre-migration had `md:grid-cols-2` (2 columns on tablet).
  implication: Cards too narrow on tablet screens.

- timestamp: 2026-04-09
  checked: index.html clinics cards
  found: Pre-migration had `p-8` on each card. Migration removed it and relied on liquid-card built-in padding (only 1.5rem = 24px vs p-8 = 32px).
  implication: Clinics cards lost 8px padding on each side.

## Resolution

root_cause: The v4.0 migration (Phases 44-47) introduced 4 layout regressions across all pages: (1) `container mx-auto` replaced with fixed `max-w-[1200px]` losing responsive container stepping; (2) `.liquid-card` CSS class included built-in `padding: 1.5rem` causing double-padding on cards with internal padding; (3) header narrowed from `max-w-7xl` (1280px) to `max-w-[1200px]`; (4) service cards grid changed from `md:grid-cols-2` to `md:col-span-4` on 12-col grid giving 3 cols on tablet instead of 2.

fix: (1) Restored `container mx-auto px-4 lg:px-6` on all section containers across all 7 pages. (2) Removed built-in padding from `.liquid-card` and `.stats-glass` CSS classes -- padding now managed via Tailwind utilities. (3) Restored `max-w-7xl` on header partial and all pages. (4) Fixed service cards to `md:col-span-6 lg:col-span-4`. (5) Added explicit `p-8` to clinics cards and `p-6` to stats-glass/styleguide demos that relied on built-in padding.

verification: `make build` succeeds. All headers show max-w-7xl. No remaining max-w-[1200px]. Compiled CSS confirms no padding in liquid-card/stats-glass.

files_changed:
  - src/styles/liquid-glass.css
  - partials/header.html
  - index.html
  - checkup.html
  - online-consultations.html
  - treatment-abroad.html
  - contacts.html
  - 404.html
  - styleguide.html
  - css/styles.css
