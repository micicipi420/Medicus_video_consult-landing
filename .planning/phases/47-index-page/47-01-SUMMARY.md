---
phase: 47-index-page
plan: 01
subsystem: frontend
tags: [migration, liquid-design-system, index-page, glass, squircle, grid]
dependency_graph:
  requires: [liquid-glass.css, squircles.css, theme.css]
  provides: [index.html sections 1-6 v4.0 migrated]
  affects: [css/styles.css]
tech_stack:
  added: []
  patterns: [liquid-card-wrap shadow-wrap, stats-glass grouped, shimmer-sweep, grid-cols-12]
key_files:
  created: []
  modified: [index.html, css/styles.css, .gitignore]
decisions:
  - "Keep all 15 rotating icon chips with border-radius (no squircle on rotate per anti-pattern rule)"
  - "Clinic cards use liquid-card-wrap > liquid-card squircle-xl with col-span-6 for 2-column layout"
  - "Stats bar uses single stats-glass squircle-xl grouped wrapper (DIFF-02)"
  - "Hero CTA uses shimmer-sweep (DIFF-01, max 1 per viewport)"
  - "Why Us image collage uses squircle-xl on image frames (no glass, just shape)"
  - "Info card in collage uses liquid-card squircle-xl (no shadow-wrap, inset shadows only)"
metrics:
  duration: 5m
  completed: 2026-04-09
  tasks: 2/2
  files_modified: 3
---

# Phase 47 Plan 01: Index Page Sections 1-6 Migration Summary

Migrated Hero, Stats, Services, Problem, How It Works, Why Us, and Clinics sections from v3.x manual glass classes to v4.0 Liquid Design System primitives with grid-cols-12 layout, shimmer-sweep on hero CTA, and grouped stats-glass wrapper.

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Migrate Hero + Stats + Sections 2-3 | 759b074 | Hero grid-cols-12, shimmer-sweep CTA, stats-glass grouped, service cards liquid-card-wrap, problem cards liquid-card-wrap |
| 2 | Migrate Sections 4-6 (How It Works, Why Us, Clinics) | 5cde2dd | How It Works liquid-card-wrap, Why Us grid-cols-12 + squircle-xl collage, all 8 clinic cards liquid-card-wrap |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] 4 clinic cards (South Korea, Turkey, UAE, India) not migrated in previous partial run**
- **Found during:** Task 2
- **Issue:** Cards 5-8 in Section 6 still had v3.x manual glass classes (bg-white/60 backdrop-blur-2xl rounded-[2.5rem]) and lacked grid col-span wrappers and liquid-card-wrap treatment
- **Fix:** Applied same pattern as cards 1-4: col-span-12 md:col-span-6 lg:col-span-6 wrapper + liquid-card-wrap > liquid-card squircle-xl
- **Files modified:** index.html
- **Commit:** 5cde2dd

**2. [Rule 2 - Missing functionality] tailwindcss binary not in .gitignore**
- **Found during:** Task 2
- **Issue:** `make build` downloads tailwindcss binary which was showing as untracked
- **Fix:** Added `tailwindcss` to .gitignore
- **Files modified:** .gitignore
- **Commit:** 5cde2dd

## Verification Results

### Build
- `make build` exits 0

### Protected Legacy Counts
| Item | Expected | Actual | Status |
|------|----------|--------|--------|
| `&nbsp;` entities | 83 | 83 | PASS |
| `visually-hidden` | 2 | 2 | PASS |
| `role="alert"` | 4 | 4 | PASS |
| `aria-live` | 4 | 4 | PASS |

### Design System Indicators
| Item | Expected | Actual | Status |
|------|----------|--------|--------|
| `shimmer-sweep` | >= 1 | 1 | PASS |
| `stats-glass` | >= 1 | 1 | PASS |
| `max-w-[1200px]` in sections 1-6 | > 0 | 8 | PASS |
| `liquid-card-wrap` | > 15 | 19 | PASS |
| `squircle-` | > 50 | 57 | PASS |

### Old Patterns Removed (Sections 1-6 only)
| Pattern | Count in Sections 1-6 | Status |
|---------|----------------------|--------|
| `container mx-auto` | 0 | PASS |
| `rounded-[2.5rem]` | 0 | PASS |
| `rounded-[3rem]` (main cards) | 0 | PASS |
| `bg-white/60 backdrop-blur-2xl rounded-[` | 0 | PASS |

### Rotating Icon Chips
All 15 icon chips with `group-hover:rotate-3` retain their `rounded-2xl` or `rounded-[1.5rem]` border-radius. No squircle applied to rotating elements per anti-pattern rule.

## Decisions Made

1. **Sections 1-3 + Stats already migrated** -- Task 1 was completed in a previous execution run (commit 759b074). Task 2 completed the remaining sections 4-6.
2. **Clinic card column spans: col-span-6** -- All 8 clinic cards use md:col-span-6 lg:col-span-6, maintaining the 2-column layout on tablet and desktop.
3. **No shadow-wrap on hero floating badges** -- Used liquid-regular squircle-lg directly on badges (inset shadows sufficient for small elements).
4. **Why Us info card: liquid-card without wrap** -- The bottom-right 100% confidentiality card uses liquid-card squircle-xl directly (inset shadows only, no outer shadow needed).

## Known Stubs

None -- all sections 1-6 are fully wired with design system classes.

## Self-Check: PASSED

- index.html: FOUND
- css/styles.css: FOUND
- .gitignore: FOUND
- 47-01-SUMMARY.md: FOUND
- Commit 759b074 (Task 1): FOUND
- Commit 5cde2dd (Task 2): FOUND
