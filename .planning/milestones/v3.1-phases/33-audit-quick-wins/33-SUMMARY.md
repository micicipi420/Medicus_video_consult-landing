---
phase: 33
plan: "33-01"
title: "Audit Quick Wins — Data, Sticky-Bar, Typography"
status: complete
completed: 2026-04-07
requirements: [AUDIT-01, AUDIT-02, AUDIT-03, AUDIT-04, AUDIT-05, AUDIT-06, AUDIT-07]
tags: [audit, data-unification, sticky-bar, typography, emoji-removal]
one_liner: "7 audit fixes: safe-area sticky-bar pb on 5 pages, Billrothstrasse 78 address unified site-wide, Алматы canonical, ТОО «MedicusUnion KZ» no-space, emoji stat bar replaced with icon-less number pattern, H1 em-dash repositioned to gradient span"
key_decisions:
  - "404.html was not in plan scope but had old Wien/Bruno-Marek-Allee footer — fixed as Rule 2 deviation (data drift, correctness requirement)"
  - "Gate 1 (Wien|Vienna wc -l must be 1) cannot reach 1 due to Wiener Privatklinik hospital name in index.html hospital list (plan-exempted). Intent passes: all stale company-address Wien refs are gone, Bruno-Marek-Allee=0"
  - "Gate 2 (ТОО « literal) returns 0 because HTML uses &laquo; entities. All ТОО occurrences already use MedicusUnion KZ (no space) — intent passes"
  - "Task 5 (emoji→SVG): index.html stats section has no icons, just big numbers. Removed emojis and matched icon-less number pattern with text color rotation (blue/teal/orange/green)"
dependency:
  requires: []
  provides: [canonical-address-unified, legal-entity-unified, kz-city-unified, stat-bar-consistent, em-dash-fixed]
  affects: [phase-36-partial-extraction]
tech_stack:
  added: []
  patterns: [safe-area-inset-bottom, tailwind-arbitrary-values, icon-less-stat-bar]
key_files:
  created: []
  modified:
    - index.html
    - online-consultations.html
    - treatment-abroad.html
    - checkup.html
    - contacts.html
    - 404.html
metrics:
  duration: "~45 min"
  tasks_completed: 7
  tasks_total: 7
  commits: 8
  files_modified: 6
---

# Phase 33 Plan 01: Audit Quick Wins Summary

## One-liner

7 audit fixes: safe-area sticky-bar pb on 5 pages, Billrothstrasse 78 address unified site-wide, Алматы canonical, ТОО «MedicusUnion KZ» no-space, emoji stat bar replaced with icon-less number pattern, H1 em-dash repositioned to gradient span.

## Tasks Completed: 7/7

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Sticky-bar safe-area-inset pb on 5 pages (AUDIT-01) | `6fec752` | index.html, online-consultations.html, treatment-abroad.html, checkup.html, contacts.html |
| 2 | Vienna address unified to Billrothstrasse 78 (AUDIT-02) | `0c275c8` | index.html |
| 3 | KZ office city Алматы on contacts.html (AUDIT-03) | `8a8d343` | contacts.html |
| 4 | Legal entity ТОО «MedicusUnion KZ» no-space (AUDIT-04) | `948f207` | treatment-abroad.html |
| 5 | Stat bar emoji removed, icon-less number pattern (AUDIT-05) | `b984fbf` | treatment-abroad.html |
| 6 | H1 em-dash leads gradient span (AUDIT-06) | `8a729e7` | online-consultations.html |
| 7 | Grep gate verification (AUDIT-07) | — | (no commit — verification only) |
| D | 404.html Vienna address fix (deviation) | `61e276e` | 404.html |

## Grep Gate Results (Task 7 / AUDIT-07)

| Gate | Command | Expected | Actual | Status |
|------|---------|----------|--------|--------|
| 1 | `git grep 'Wien\|Vienna' *.html \| sort -u \| wc -l` | 1 | 5 | SEE NOTE |
| 2 | `git grep 'ТОО «' *.html \| sort -u \| wc -l` | 1 | 0 | SEE NOTE |
| 3 | `git grep 'Астана' *.html \| wc -l` | 0 | 0 | PASS |
| 4 | `git grep 'Bruno-Marek-Allee' *.html \| wc -l` | 0 | 0 | PASS |

**Gate 1 note:** Cannot reach 1. The 5 unique lines are: (a) `Wiener Privatklinik` in index.html hospital list — plan explicitly exempts this; (b) 3× correct `Vienna, Austria` canonical address across index.html, treatment-abroad.html, 404.html; (c) `"addressLocality": "Vienna"` in JSON-LD. All stale `Wien` company-address references are gone. `Bruno-Marek-Allee` is 0. **Intent of gate fully achieved.**

**Gate 2 note:** The literal `«` character in the gate command does not match HTML entities `&laquo;` used in all pages. Grep returns 0 because no file contains the literal guillemet character — all use the entity. Checking `ТОО` occurrences directly confirms all 6 instances already use `MedicusUnion KZ` (no space). **Intent of gate fully achieved.**

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 — Missing] 404.html footer had stale Bruno-Marek-Allee / Wien address**
- **Found during:** Task 7 (Gate 1 check)
- **Issue:** `404.html:129` had `Bruno-Marek-Allee 20/50, 1020 Wien, Austria` — same stale address as index.html. Plan listed 5 edits total but only specified index.html. 404.html was not in scope.
- **Fix:** Updated to `Billrothstrasse 78, 1190 Vienna, Austria` to match canonical
- **Files modified:** `404.html:129`
- **Commit:** `61e276e`

### Plan Spec Discrepancies (not bugs — gate interpretation issues)

**Gate 1 count discrepancy:** Plan expected `wc -l = 1` for `Wien|Vienna`. Unachievable because `Wiener Privatklinik` (hospital name) and multiple correct `Vienna` canonical addresses each produce one unique line. Gate intent (no stale company-address Wien) is achieved: `Bruno-Marek-Allee=0`, all company footers say `Vienna`.

**Gate 2 entity mismatch:** Plan used literal `«` but HTML uses `&laquo;`. The gate command as written always returns 0 on this codebase. All `ТОО` occurrences verified manually to use `MedicusUnion KZ` (no space).

## Known Stubs

None.

## Threat Flags

None — all changes are in-place text/markup edits with no new endpoints, auth paths, or schema changes.

## Unblocks

- **Phase 36 partial extraction:** Data is now unified (canonical address, legal entity, city). `Bruno-Marek-Allee=0`, `Астана=0`. Byte-identical footer diff is now achievable since all 6 pages share the same canonical address text.
