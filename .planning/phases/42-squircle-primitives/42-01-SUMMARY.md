---
phase: 42-squircle-primitives
plan: 01
subsystem: css-utilities
tags: [squircle, mask-image, corner-shape, progressive-enhancement, css-primitives]
dependency_graph:
  requires: [phase-41-foundation-tokens]
  provides: [squircle-md, squircle-lg, squircle-xl, squircle-full]
  affects: [phase-44-through-47-html-application]
tech_stack:
  added: [corner-shape-superellipse-PE]
  patterns: [three-tier-degradation, shadow-wrap-idiom]
key_files:
  created:
    - src/styles/squircles.css
  modified:
    - src/styles/tailwind.css
    - css/styles.css
decisions:
  - Plain CSS classes survive Tailwind v4 JIT without @layer components wrapper
  - Shadow-wrap documented as HTML pattern only (not a utility class)
  - superellipse(2) chosen over squircle keyword per CONTEXT.md locked decision
metrics:
  duration: 4min
  completed: 2026-04-09
  tasks: 2
  files: 3
---

# Phase 42 Plan 01: Squircle CSS Primitives Summary

Four squircle utility classes (.squircle-md/lg/xl/full) with three-tier progressive enhancement: Chrome 139+ native corner-shape, mask-image SVG production default, border-radius fallback

## What Was Done

### Task 1: Create squircles.css and wire import (286cd5f)
- Created `src/styles/squircles.css` with 4 utility classes
- Each of md/lg/xl has 5 declarations: border-radius + -webkit-mask-image + mask-image + -webkit-mask-size + mask-size
- .squircle-full uses border-radius: 9999px only (no mask -- per Research Pitfall 4)
- @supports (corner-shape: superellipse(2)) block strips mask and applies native rendering for Chrome 139+
- Shadow-wrap pattern documented in file header with card, button, inset, and badge examples
- Anti-patterns documented: no box-shadow+mask on same element, no border on squircle elements, no mask on rotating elements
- Wired @import into tailwind.css after theme.css

### Task 2: Build verification and tree-shaking fix (2162a5c)
- make build exits 0 -- all squircle classes compiled into css/styles.css
- All 4 class names verified present in compiled output
- mask-image, corner-shape, and border-radius declarations confirmed
- make check passes: zero HTML drift (byte-identity gate)
- No @layer components wrapper needed -- plain CSS survived Tailwind v4.2.2 JIT (Research Assumption A2 resolved: classes in @imported files ARE included)

## Verification Results

| Check | Result |
|-------|--------|
| src/styles/squircles.css exists | PASS |
| 4 utility classes present | PASS |
| mask-image count (non-comment) = 8 | PASS |
| border-radius count = 4 | PASS |
| -webkit- prefix on all mask declarations | PASS |
| @supports (corner-shape: superellipse(2)) block | PASS |
| Shadow-wrap pattern documented | PASS |
| @import in tailwind.css after theme.css | PASS |
| make build exits 0 | PASS |
| squircle classes in css/styles.css | PASS |
| make check exits 0 | PASS |
| Zero HTML pages modified | PASS |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Plain CSS survives Tailwind JIT:** Research Assumption A2 was validated -- Tailwind v4.2.2 includes plain CSS classes from @imported files in the compiled output without needing @layer components wrapper. This is important for future CSS primitive files.

2. **Shadow-wrap as documentation only:** Per ARCHITECTURE.md recommendation and Research Open Question 2, the shadow-wrap pattern is documented as an HTML pattern in the file header comment rather than as a utility class. The outer wrapper's shadow varies by surface type, making a single class too generic.

3. **superellipse(2) over squircle keyword:** Used `@supports (corner-shape: superellipse(2))` per CONTEXT.md locked decision, even though MDN documents `squircle` as an alias.

## Self-Check: PASSED
