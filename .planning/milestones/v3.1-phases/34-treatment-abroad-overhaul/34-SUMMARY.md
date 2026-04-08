---
phase: 34
plan: 34-01
title: Treatment Abroad — Hardcoded Hex + Typography Polish
subsystem: treatment-abroad
tags: [svg, tokens, typography, currentColor]
one_liner: "SVG icon strokes tokenized via currentColor + var(--mu-*); en-dashes replace typewriter double-hyphens"
key_decisions:
  - "meta[theme-color]=#38C6F4 intentionally left as literal hex (not an SVG attribute; currentColor is semantically invalid in meta tags)"
  - "stroke/#35B678 dual-color paths use var(--mu-green-600) inline rather than currentColor (parent context is text-mu-blue)"
  - "fill/rgba(56,198,244,0.1) replaced with color-mix(in oklch, var(--mu-blue) 10%, transparent) matching v3.0 pattern"
  - "stroke/#047857 checkmarks: class=text-mu-green-600 added to each bare SVG element"
completed_date: "2026-04-07"
---

# Phase 34 Plan 01: Treatment Abroad — Hardcoded Hex + Typography Polish Summary

## Tasks Completed This Plan

### Task A — Hardcoded hex → currentColor tokens (TRTOVR-01, TRTOVR-02)

All 19 SVG stroke/fill occurrences of brand hex replaced with token-based values:

- 4 feature-card SVG icons (lines ~211-253): `text-mu-blue` already on parent div — changed `stroke="#38C6F4"` → `stroke="currentColor"` on all child elements
- `fill="rgba(56,198,244,0.1)"` → `fill="color-mix(in oklch, var(--mu-blue) 10%, transparent)"` (5 occurrences across 4 cards)
- `stroke="#35B678"` → `stroke="var(--mu-green-600)"` (2 dual-color paths: polyline in Card 1, circle in Card 3)
- 3 checkmark SVGs (form section): added `class="text-mu-green-600"` to each bare `<svg>` element, changed `stroke="#047857"` → `stroke="currentColor"`

**Commit:** `d465677` — `refactor(34): treatment-abroad hardcoded hex → currentColor tokens (TRTOVR-01, TRTOVR-02)`

### Task B — Typewriter dashes → en-dash (TRTOVR-03)

Three `--` between digits replaced with `&ndash;` + non-breaking space before unit:

| Line | Before | After |
|------|--------|-------|
| 443 | `2--3 клиник` | `2&ndash;3&nbsp;клиник` |
| 494 | `2--4 дня` | `2&ndash;4&nbsp;дня` |
| 520 | `7--10 дней` | `7&ndash;10&nbsp;дней` |

**Commit:** `97d0829` — `fix(34): treatment-abroad typewriter dash → en-dash between digits (TRTOVR-03)`

---

## Previously Completed (not in this plan)

| Item | Status | Where handled |
|------|--------|---------------|
| TRTOVR-04 (stat bar hierarchy) | DONE | Phase 33 AUDIT-05 — absorbed into the global stat bar rework |
| TRTOVR-05 (hero photo swap) | DONE | Orchestrator — Unsplash photo sourced and swapped before this plan ran |

---

## Deferred

None. All 6 TRTOVR items addressed.

---

## Commits

| Hash | Type | Description |
|------|------|-------------|
| `d465677` | refactor | Hex → currentColor tokens (TRTOVR-01, TRTOVR-02) — this plan |
| `97d0829` | fix | Typewriter dash → en-dash (TRTOVR-03) — this plan |
| (Phase 33) | refactor | Stat bar rework (TRTOVR-04) — absorbed into Phase 33 AUDIT-05 |
| (orchestrator) | fix | Hero photo swap + alt text (TRTOVR-05) — pre-plan |

---

## Grep Verification Results

**Task A acceptance:**
```
grep -cE '#(38C6F4|35B678|047857)|rgba\(56,198,244' treatment-abroad.html
→ 1
```
The 1 remaining match is `<meta name="theme-color" content="#38C6F4">` — a browser chrome color hint in `<head>`, not an SVG attribute. Literal hex is required there; `currentColor` is semantically invalid in meta tags. All 19 SVG stroke/fill occurrences are tokenized.

**Task B acceptance:**
```
grep -nE '[0-9]--[0-9]' treatment-abroad.html
→ (no output)
```
Zero typewriter dashes between digits remain.

---

## Preliminary Audit Score Estimate

| Item | Before | After | Delta |
|------|--------|-------|-------|
| Hardcoded hex (TRTOVR-01/02) | fail | pass | +1–2 pts |
| Typewriter dashes (TRTOVR-03) | fail | pass | +1 pt |
| Stat bar (TRTOVR-04, Phase 33) | fail | pass | +1 pt |
| Hero photo (TRTOVR-05) | fail | pass | +1–2 pts |
| **Estimated total** | 14/24 | ~18/24 | +4 pts |

Full re-audit deferred to milestone audit step after all phases ship.

---

## Deviations from Plan

### Deviation 1 — meta[theme-color] excluded from acceptance grep

**Found during:** Task A verification
**Issue:** `grep -cE '#(38C6F4|...)' treatment-abroad.html` returns 1, not 0. The remaining match is `<meta name="theme-color" content="#38C6F4">` in `<head>` — present before this plan and not in the original 20 SVG-attribute count.
**Resolution:** Left as-is. Changing to a token or `currentColor` would be semantically incorrect for a meta tag. The acceptance criterion intent (SVG strokes/fills) is fully met.
**Impact:** None — visual rendering unaffected.

### Deviation 2 — Card 3 green fill also tokenized

**Found during:** Task A, Card 3 SVG
**Issue:** `fill="rgba(53,182,120,0.15)"` on the calendar circle was a hardcoded green rgba not in the original 20-count (the count only targeted the `#35B678` stroke on that element).
**Resolution:** [Rule 2] Replaced with `fill="color-mix(in oklch, var(--mu-green-600) 15%, transparent)"` — same pattern, consistent tokenization.
**Impact:** Positive — eliminates one additional orphaned rgba value.

---

## Self-Check

- [x] `d465677` exists: `git log --oneline | grep d465677` — confirmed
- [x] `97d0829` exists: `git log --oneline | grep 97d0829` — confirmed
- [x] treatment-abroad.html modified: confirmed (2 commits, 25 insertions / 25 deletions total)
- [x] No other files touched

## Self-Check: PASSED
