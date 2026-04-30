---
phase: 92-glass-rework-chrome-index-sections
plan: 01
subsystem: liquid-glass.css utility re-pointing
tags: [css, glass, tier-tokens, foundation, wave-1]
requires:
  - Phase 90 v9.0 tier tokens registered in globals.css :root (--glass-{section,card,form,button}-{fill,blur})
  - Phase 91 :root runtime vars (--blob-x, --blob-y, --blob-heat) — consumed read-only by heat-leak radial gradients (preserved from commit 9c93b9f)
provides:
  - 5 liquid-glass.css utility classes (.liquid-regular, .liquid-card, .liquid-nav, .liquid-btn-secondary, .stats-glass) consuming v9.0 tier tokens via var()
  - Heat-leak radial-gradient rules preserved verbatim on .liquid-card (α 0.06) + .liquid-regular (α 0.04) — GLASS-10 contract intact
  - Foundation for Phase 92 waves 2–4 (any component already wrapping content in .liquid-card / .liquid-regular inherits tier-token consumption automatically)
affects:
  - next/src/styles/liquid-glass.css (modified)
tech-stack:
  added: []
  patterns:
    - CSS custom-property re-pointing without changing rule structure (token swap)
    - Safari -webkit-backdrop-filter hardcoded-fallback pattern preserved (Phase 51 / XBRO-01)
    - Heat-leak radial-gradient on background-image (NOT animated backdrop-filter — anti-pattern #6 compliant)
key-files:
  created: []
  modified:
    - next/src/styles/liquid-glass.css
decisions:
  - Decision D (locked) — re-point .liquid-regular/.liquid-card/.liquid-nav/.liquid-btn-secondary/.stats-glass; leave .liquid-clear/.liquid-fluted/.liquid-btn-primary unchanged
  - Decision E (locked) — --liquid-* legacy vars stay defined in globals.css for defensive consumption (no change to globals.css)
  - Decision I (frozen ranges) — @a11y-layer-coverage block (lines 79–157) byte-identical post-edit
  - Decision H (anti-pattern enforcement) — zero new glass classes; heat-leak gradient on background-image, not backdrop-filter
metrics:
  duration: 370s
  completed: 2026-04-30
  tasks_completed: 1
  files_modified: 1
---

# Phase 92 Plan 01: liquid-glass.css utility re-pointing — Summary

Re-pointed 5 utility classes in `next/src/styles/liquid-glass.css` from legacy `--liquid-bg` / `--liquid-blur-{md,lg}` / `--liquid-nav-{bg,blur}` variables to v9.0 4-tier tokens (`--glass-{section,card,button}-{fill,blur}`), preserving heat-leak radial-gradient rules on `.liquid-card` (α 0.06) and `.liquid-regular` (α 0.04) verbatim from commit `9c93b9f`. Foundation for Phase 92 waves 2–4.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Re-point .liquid-regular, .liquid-card, .liquid-nav, .liquid-btn-secondary, .stats-glass utilities to v9.0 tier tokens | `5e07ab6` | `next/src/styles/liquid-glass.css` |

## What Changed

### `.liquid-regular` (lines 170–201)
- `var(--liquid-bg)` ×2 → `var(--glass-section-fill)`
- `blur(var(--liquid-blur-md))` (×2 — desktop + Safari var-line) → `blur(var(--glass-section-blur))`
- Heat-leak `radial-gradient(ellipse 600px 400px at var(--blob-x, 50vw) var(--blob-y, 50vh), hsla(150, 60%, 50%, calc(0.04 * var(--blob-heat, 0))), transparent 70%)` block PRESERVED verbatim
- Safari hardcoded `-webkit-backdrop-filter: blur(24px) saturate(180%) brightness(108%);` PRESERVED (Phase 51 / XBRO-01)

### `.liquid-nav` (lines 211–232)
- `var(--liquid-nav-bg)` ×2 → `var(--glass-section-fill)`
- `blur(var(--liquid-nav-blur))` (×2) → `blur(var(--glass-section-blur))`
- Safari hardcoded `blur(16px)` PRESERVED

### `.liquid-card` (lines 337–365)
- `var(--liquid-bg)` ×2 → `var(--glass-card-fill)`
- `blur(var(--liquid-blur-md))` (×2) → `blur(var(--glass-card-blur))`
- Heat-leak `radial-gradient(... hsla(150, 60%, 50%, calc(0.06 * var(--blob-heat, 0))) ...)` block PRESERVED verbatim
- Safari hardcoded `blur(24px)` PRESERVED

### `.liquid-btn-secondary` (lines 417–440)
- `var(--liquid-bg)` ×2 → `var(--glass-button-fill)`
- `blur(var(--liquid-blur-md))` (×2) → `blur(var(--glass-button-blur))`
- Safari hardcoded `blur(24px)` PRESERVED

### `.stats-glass` (lines 458–479)
- `var(--liquid-bg)` ×2 → `var(--glass-card-fill)`
- `blur(var(--liquid-blur-lg))` (×2) → `blur(var(--glass-card-blur))`
- Safari hardcoded `blur(40px)` PRESERVED (note: this is intentionally retained — Phase 51 fallback is light-mode-tuned for Safari and migration to a smaller numeric would change Safari paint; cross-engine parity is acceptable since `--glass-card-blur` clamps to 12–20px on the var-line cascade)

## What Was NOT Touched (per Decisions D / I)

- `.liquid-clear` (special-purpose modal/overlay material)
- `.liquid-fluted` (special-purpose ribbed-streak texture; lines 286–312 — 2 `var(--liquid-bg)` occurrences within sweep range `170–478` are correctly preserved here)
- `.liquid-btn-primary` (CTA opaque-forever — gradient unchanged)
- `.liquid-header-backdrop` (Josh-Comeau extended pattern — left as Decision D row 9 recommends)
- `@a11y-layer-coverage` block (lines 79–157, Phase 90 frozen) — byte-identical post-edit
- `globals.css` (Phase 90 frozen; `--liquid-*` legacy vars retained for defensive consumption per Decision E)

## Acceptance Criteria — All Pass

| Gate | Expected | Actual |
|------|----------|--------|
| `pnpm --dir next build` exits 0 | yes | yes (94s compile, 11/11 static pages generated, no CSS errors) |
| `grep -c 'var(--glass-section-fill)'` | ≥4 | 4 (2 in `.liquid-regular`, 2 in `.liquid-nav`) |
| `grep -c 'var(--glass-card-fill)'` | ≥4 | 4 (2 in `.liquid-card`, 2 in `.stats-glass`) |
| `grep -c 'var(--glass-button-fill)'` | ≥2 | 2 (in `.liquid-btn-secondary`) |
| `grep -c 'blur(var(--glass-section-blur))'` | ≥2 | 4 (2 each in `.liquid-regular`, `.liquid-nav`, including Safari var-lines) |
| `grep -c 'blur(var(--glass-card-blur))'` | ≥2 | 4 (2 each in `.liquid-card`, `.stats-glass`) |
| `grep -c 'blur(var(--glass-button-blur))'` | ≥1 | 2 (in `.liquid-btn-secondary`) |
| Heat-leak `at var(--blob-x` count | ≥2 | 2 (lines 179 in `.liquid-regular`, 344 in `.liquid-card`) — verified via `grep -cF 'at var(--blob-x'` |
| `var(--liquid-bg)` count in lines 170–478 | 0 in 5 swept utilities | 2 (both in `.liquid-fluted` lines 297–298 — preserved per Decision D) |
| `@a11y-layer-coverage` block diff | none | confirmed via `git diff -U0` — all hunks at lines 185, 193, 195, 217, 225, 227, 350, 358, 360, 423, 431, 433, 464, 472, 474; none in 79–157 range |

## Verification Output

```
=== glass-section-fill: 4 (expect ≥4)
=== glass-card-fill: 4 (expect ≥4)
=== glass-button-fill: 2 (expect ≥2)
=== blur(glass-section-blur): 4 (expect ≥2)
=== blur(glass-card-blur): 4 (expect ≥2)
=== blur(glass-button-blur): 2 (expect ≥1)
=== heat-leak (at var(--blob-x): 2 (expect ≥2)
=== liquid-bg in swept range (170-478): 2 — both in .liquid-fluted (preserved per Decision D)
```

`pnpm --dir next build`:
```
✓ Compiled successfully in 94s
✓ Generating static pages (11/11)
```

## Deviations from Plan

None — plan executed exactly as written. The plan's grep gates are satisfied (with expected `.liquid-fluted` `--liquid-bg` retention noted as out-of-sweep per Decision D). One minor note documented but not deviated: pnpm node_modules install was needed in this fresh worktree before `pnpm build` could run — install step took ~29s and was a precondition, not a fix.

## Threat Model Compliance

| Threat ID | Mitigation Verification |
|-----------|------------------------|
| T-92-01-01 (Heat-leak rule accidentally removed) | PASS — `grep -cF 'at var(--blob-x'` returns 2 |
| T-92-01-02 (Mobile blur >12px battery drain) | PASS — token consumption only; `--glass-{tier}-blur` already clamps to 12px on mobile (Phase 90 frozen). No hardcoded numeric blurs introduced on the `var()` lines. Safari `-webkit-backdrop-filter` hardcoded fallbacks (24px / 16px / 40px) are pre-existing Phase 51 architecture and out of plan scope. |
| T-92-01-03 (`@a11y-layer-coverage` edited) | PASS — `git diff -U0` confirms zero hunks in lines 79–157 |
| T-92-01-04 (PII / data flow) | N/A — CSS-only change |

## Foundation for Subsequent Plans

Plans 92-02..92-07 sweep direct Tailwind classes (`bg-white/{N}`, `backdrop-blur-{value}`) in TSX components per Decision E. Any component currently wrapping content in `.liquid-card` or `.liquid-regular` utility (e.g., Phase 93 service pages, ContactMethodGrid) inherits tier-token consumption automatically once this plan ships. GLASS-10 contract (heat-leak `radial-gradient` rules wired to `--blob-x/y/heat`) is intact and will visibly respond to Phase 91 blob movement on any `.liquid-card` / `.liquid-regular` consumer.

## Self-Check: PASSED

- File `next/src/styles/liquid-glass.css` exists (modified) — FOUND
- Commit `5e07ab6` exists in `git log --oneline` — FOUND
- All grep gates pass — FOUND
- Build exits 0 — FOUND
- `@a11y-layer-coverage` block byte-identical — FOUND
