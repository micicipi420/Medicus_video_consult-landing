---
phase: 90-foundation-tokens-a11y-wiring-dom-skeleton
plan: 04
subsystem: ui
tags: [layout, dom-skeleton, mesh-background-removal, inline-style-seed, foundation, v9.0, living-blob]

# Dependency graph
requires:
  - phase: 90-foundation-tokens-a11y-wiring-dom-skeleton
    provides: "--blob-* runtime CSS vars + tier tokens (90-01); blob.css static sublayer rules + a11y @layer block (90-02)"
provides:
  - "<div class=\"living-blob-field\" aria-hidden=\"true\" data-engine-active=\"false\"> mounted in app/layout.tsx with 4 static blob-sublayer children"
  - "Inline <style> seed as first child of <body> declaring all 8 --blob-* runtime vars at default values (50vw / 50vh / 0)"
  - "MeshBackground.tsx removed from repository — clean handoff for Phase 91 canvas mount"
  - "data-engine-active=\"false\" attribute contract — Phase 91 flips to \"true\" when canvas mounts"
affects: [phase-91-engine-renderer, phase-92-glass-opacity-sweep, phase-94-verification]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline <style> seed as first child of <body> for first-paint CSS var resolution (Pattern S4)"
    - "Flat-sibling DOM skeleton with data-engine-active boolean handoff for canvas-driven engines"

key-files:
  created: []
  modified:
    - "next/src/app/layout.tsx (mounted .living-blob-field skeleton + style seed; removed MeshBackground import + render)"
  deleted:
    - "next/src/components/layout/MeshBackground.tsx (17 lines, replaced by static skeleton)"

key-decisions:
  - "Inline <style> seed placed as first child of <body> (NOT <head>) per CONTEXT.md folded scope clarification"
  - "Hard delete of MeshBackground.tsx (no archive — git history is sufficient)"
  - "data-engine-active=\"false\" default — Phase 91 flips to \"true\" when canvas mounts (clean attribute handoff contract)"

patterns-established:
  - "Pattern S4 (Inline <style> seed): pure CSS string in JSX, first child of body, defense-in-depth with globals.css :root defaults"
  - "Pattern S5 (Mount order preservation): style → SvgRefractionDefs → .living-blob-field → Header → main z-10 → Footer → StickyBar"

requirements-completed: [FND-06]

# Metrics
duration: 2min
completed: 2026-04-30
---

# Phase 90 Plan 04: DOM Skeleton + MeshBackground Removal Summary

**v9.0 .living-blob-field static skeleton mounted in layout.tsx with 8-var inline <style> seed; MeshBackground.tsx hard-deleted; clean rebuild green across 11 routes.**

## ⚠ MANUAL CHECKPOINT — User Attestation Required

**Task 3 (`checkpoint:human-verify`) cannot be automated — it requires the user to manually walk 5 routes with DevTools open.** Production build (`pnpm build`, Task 2 verification) already passed cleanly with all 11 pages generated. The runtime/visual smoke is the user's gate.

### Manual verification steps (run before `/gsd-verify-work`):

1. **Start dev server:**
   ```bash
   cd /Users/mikhail/Projects/Medicus_video_consult-landing/next && pnpm dev
   ```
   Wait for `ready` line (port 3000 typically).

2. **Open DevTools Console (F12 → Console). Visit each route:**
   - http://localhost:3000/
   - http://localhost:3000/checkup
   - http://localhost:3000/consultations
   - http://localhost:3000/treatment-abroad
   - http://localhost:3000/contacts

   For EACH route, confirm:
   - Page renders without runtime exceptions
   - DevTools Console: ZERO new errors / warnings vs v8.1 baseline (React Strict Mode double-invoke warnings acceptable if also present in v8.1)
   - Header / hero / stats / services / forms in normal positions (no layout shift)

3. **Inspect blob field on `/`:**
   - Elements panel: `<div class="living-blob-field" aria-hidden="true" data-engine-active="false">` present immediately after `<style>` and `<SvgRefractionDefs>` inside `<body>`
   - 4 child divs with classes `blob-sublayer blob-core`, `blob-sublayer blob-body`, `blob-sublayer blob-halo`, `blob-sublayer blob-glint`
   - Computed styles: `.living-blob-field` has `position: fixed`, `inset: 0`, `z-index: 0`, `pointer-events: none`
   - NO `backdrop-filter` on `.living-blob-field` (anti-pattern #11)

4. **Visual diff vs v8.1:** Header/hero/stats/services/forms pixel-identical. Ambient background WILL look softer than v8.1's MeshBackground (which had 3 colored blobs + 40% white frosted overlay at blur(40px)). This is acceptable per FND-06 visual parity note.

5. **Mobile smoke (375px viewport):** No horizontal scrollbar; mobile menu opens; sticky bar renders; `.blob-core/body/halo` filter ≤ blur(12px) (Phase 79 hard cap).

6. **Record findings in `90-VERIFICATION.md`** — append a "Manual smoke" section with date, browser, viewport, route count, console-error counts, visual diff verdict.

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-30T07:04:22Z
- **Completed:** 2026-04-30T07:06:43Z
- **Tasks:** 2 auto + 1 manual checkpoint (deferred to user)
- **Files modified:** 1 (layout.tsx)
- **Files deleted:** 1 (MeshBackground.tsx)

## Accomplishments

- `.living-blob-field` skeleton mounted in `app/layout.tsx` exactly per CONTEXT.md Decision A (verbatim flat-sibling JSX, `aria-hidden="true"`, `data-engine-active="false"`)
- 8-variable inline `<style>` seed placed as first child of `<body>` — `--blob-x/y/body-x/y/halo-x/y/heat/velocity` defined on first paint, before `.living-blob-field` renders
- `MeshBackground.tsx` hard-deleted; zero residual references in `next/src` (verified by grep); clean rebuild (`rm -rf .next && pnpm build`) green
- All 8 grep gates from PLAN.md `<acceptance_criteria>` passed
- Frozen surfaces preserved: `<html lang="ru">`, `<body>` className, `<main>` z-10 className (z-index contract anchor), metadata, viewport, font declarations

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace MeshBackground render with .living-blob-field skeleton + inline `<style>` seed** — `bd56e89` (feat)
2. **Task 2: Hard-delete MeshBackground.tsx + clean rebuild verification** — `4271b1f` (chore)
3. **Task 3: Manual 5-route DevTools smoke** — `pending user attestation` (checkpoint:human-verify; production build green from Task 2 — runtime smoke is user's gate)

## Files Created/Modified

- `next/src/app/layout.tsx` — Removed MeshBackground import (was line 9). Replaced `<MeshBackground />` render at line 52 with `<style>{seed}</style>` + `<div className="living-blob-field" …>` skeleton + 4 sublayer children. Mount order preserved.
- `next/src/components/layout/MeshBackground.tsx` — **DELETED** (17 lines). No archive copy; git history is sufficient (CONTEXT.md folded scope).

## Acceptance Criteria — All Green

| Gate | Command | Expected | Actual |
|------|---------|----------|--------|
| FND-06a | `grep -c 'className="living-blob-field"' next/src/app/layout.tsx` | 1 | 1 ✓ |
| FND-06a | `grep -c 'data-engine-active="false"' next/src/app/layout.tsx` | 1 | 1 ✓ |
| FND-06a | `grep -c 'blob-sublayer' next/src/app/layout.tsx` | 4 | 4 ✓ |
| FND-06b | inline `<style>` regex with all 8 --blob-* vars | ≥1 match | 1 ✓ |
| FND-06c | `grep -c 'MeshBackground' next/src/app/layout.tsx` | 0 | 0 ✓ |
| FND-06c | `test ! -f next/src/components/layout/MeshBackground.tsx` | exit 0 | exit 0 ✓ |
| FND-06c | `grep -r 'MeshBackground' next/src` | 0 lines | 0 ✓ |
| FND-06d | `<main>` z-10 className preserved | exact match | ✓ |
| FND-06d | `<html lang="ru">` preserved | exact match | ✓ |
| FND-06e | `cd next && rm -rf .next && pnpm build` | exit 0 | exit 0 ✓ (11 pages) |
| FND-06e | `grep -i 'meshbackground' /tmp/build-90-04-task2.log` | 0 matches | 0 ✓ |
| FND-06e | `git diff HEAD~2 HEAD -- next/package.json next/pnpm-lock.yaml` | empty | empty ✓ |

## Build Logs

- `/tmp/build-90-04-task1.log` — initial Task 1 build, exit 0, 2.6s compile
- `/tmp/build-90-04-task2.log` — clean rebuild after MeshBackground deletion, exit 0, 6.2s compile, 11/11 static pages, NO new warnings vs v8.1, NO `meshbackground` strings

## Decisions Made

None unique to this plan. All decisions were inherited from CONTEXT.md (Decision A flat-sibling skeleton; folded scope: inline `<style>` first child of body, hard delete with no archive).

## Deviations from Plan

None — plan executed exactly as written. All 3 precise diffs in PATTERNS.md `layout.tsx (TSX-layout, modify)` applied verbatim. Frozen surfaces (PATTERNS.md "Executor MUST NOT touch" list) preserved byte-identical.

## Issues Encountered

None.

## Self-Check: PASSED

- Created files: (none — pure modify + delete plan)
- Modified files exist:
  - `next/src/app/layout.tsx` — FOUND
  - `next/src/components/layout/MeshBackground.tsx` — CONFIRMED DELETED (`test ! -f` exit 0)
- Commits exist:
  - `bd56e89` (Task 1) — FOUND in `git log`
  - `4271b1f` (Task 2) — FOUND in `git log`
- Acceptance criteria: 12/12 grep gates green (table above)

## TDD Gate Compliance

N/A — plan type is `execute`, not `tdd`. Phase 90 ships zero runtime JS code; verification is static-grep + build-success + manual visual smoke per `90-VALIDATION.md`.

## Next Phase Readiness

**Phase 90 v9.0 foundation: 5/5 plans code-complete.** What ships to Phase 91:

- `--blob-*` palette + tier tokens registered (90-01)
- `blob.css` static sublayer styles + a11y `@layer` coverage (90-02)
- DESIGN.md updates: z-index contract, CTA opaque-forever rule, anti-patterns appendix (90-03)
- `.living-blob-field` DOM skeleton with `data-engine-active="false"` attribute contract (90-04 — this plan)
- KD-v9-001 swatch on `/test-glass` for brand approval (90-05)

**Phase 91 unlock contract:**
- Mounts `<canvas className="blob-canvas">` as 5th sibling inside `.living-blob-field`
- Flips `data-engine-active="true"` once renderer running → `blob.css` rule hides 4 static sublayers via `display: none`
- Reads/writes `--blob-x/y/body-x/y/halo-x/y/heat/velocity` runtime vars (already seeded by inline `<style>` from this plan)

**Blockers:**
- KD-v9-001 (`--blob-hot: #4FE098`) status `pending` in PROJECT.md — Phase 91 planner halts until user views `/test-glass` and approves (or proposes alternate hex). This is Decision B from CONTEXT.md and does NOT block Phase 90 shipping.
- Manual 5-route DevTools smoke (Task 3 of this plan) is `pending user attestation` — captured in the "MANUAL CHECKPOINT" section above. Phase 94 verification ultimately gates real-device UAT; this plan's smoke is the bridge.

---
*Phase: 90-foundation-tokens-a11y-wiring-dom-skeleton*
*Plan: 04*
*Completed: 2026-04-30 (code-complete; manual UAT checkpoint pending user)*
