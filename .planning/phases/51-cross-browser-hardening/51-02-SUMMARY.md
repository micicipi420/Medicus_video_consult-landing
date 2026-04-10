---
phase: 51-cross-browser-hardening
plan: 02
subsystem: css-primitives
tags: [documentation, shadow-wrap, drop-shadow, anti-pattern, consistency]
dependency_graph:
  requires: [51-01]
  provides: [consistent-shadow-wrap-documentation, drop-shadow-anti-pattern]
  affects: [52-cleanup]
tech_stack:
  added: []
  patterns: [shadow-wrap-canonical, drop-shadow-prohibition]
key_files:
  created: []
  modified:
    - src/styles/liquid-glass.css
    - src/styles/squircles.css
decisions:
  - Shadow-wrap is the CANONICAL pattern for squircle + shadow; drop-shadow is prohibited on glass ancestors
  - .liquid-card-wrap documented as Active (no-op wrapper) with Phase 52 removal plan
metrics:
  duration: 227s
  completed: "2026-04-10T08:33:54Z"
  tasks: 1/1
  files: 2
---

# Phase 51 Plan 02: Shadow-Wrap Documentation Correction Summary

Corrected contradictory DEPRECATED label on .liquid-card-wrap and established drop-shadow prohibition as documented anti-pattern across both CSS primitive files.

## What Changed

### liquid-glass.css

1. **File header comment (lines 25-38):** Updated shadow-wrap pattern description from generic "use a wrapper div" to "CANONICAL for squircle + shadow" with Phase 52 removal reference and explicit drop-shadow prohibition citing commit ba29f8a.

2. **Anti-patterns list (line 52):** Added new anti-pattern: "NEVER use filter: drop-shadow() on ancestors of glass elements. Creates a backdrop root that breaks child backdrop-filter (commit ba29f8a)."

3. **.liquid-card-wrap comment block (lines 111-140):** Replaced the entire DEPRECATED comment with comprehensive documentation including:
   - STATUS: Active (no-op wrapper)
   - Background explanation of why shadow-wrap exists
   - Full version history (v4.0 creation, brief DEPRECATED period, v5.0 Phase 51 un-deprecation)
   - Current reality: box-shadow moved to glass classes directly
   - Forward reference: Phase 52 (CLEN-02) will remove wrapper divs
   - Chrome 139+ note about corner-shape removing mask-image need

### squircles.css

4. **Shadow-wrap pattern header (lines 14-24):** Updated from generic pattern description to match liquid-glass.css -- CANONICAL status, Phase 52 removal plan, drop-shadow prohibition with commit ba29f8a reference. Legacy pattern description preserved below.

## Verification Results

| Check | Result |
|-------|--------|
| DEPRECATED in shadow-wrap context | PASS (only in History section as past tense) |
| drop-shadow anti-pattern in liquid-glass.css | PASS (2 occurrences: header + anti-patterns list) |
| drop-shadow anti-pattern in squircles.css | PASS (1 occurrence in header) |
| Phase 52 forward reference | PASS (multiple references in liquid-glass.css) |
| liquid-card-wrap class exists | PASS (present as no-op) |
| Tailwind build | PASS (compiled in 56ms, no syntax errors) |
| Cross-file consistency | PASS (both files use identical CANONICAL + drop-shadow language) |

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | e402d3c | fix(51-02): correct shadow-wrap documentation and drop-shadow anti-pattern |

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED
