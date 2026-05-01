---
phase: 93-per-page-propagation-sub-routes
plan: 00
subsystem: test-infrastructure
wave: 0
tags: [playwright, visual-regression, baseline, dev-dependency, infrastructure]
status: complete
completed: 2026-04-30
duration_minutes: 8
requirements: [ROUTE-07]
dependency_graph:
  requires:
    - "next/src/lib/blob-engine/debug.ts (Phase 91 dev surface — inspected for setMode availability)"
    - "next/src/styles/blob.css (.living-blob-field shape — informed exclusion strategy)"
  provides:
    - "Pre-Phase-93 visual baseline (8 PNGs, 4 routes × 2 viewports)"
    - "next/playwright.config.ts (desktop + mobile-375 projects, webServer block)"
    - "next/tests/visual/baseline.spec.ts (per-route diff harness)"
    - "next/tests/e2e/submission.spec.ts (skipped skeleton for Plan 07 Wave 3)"
    - "next/test-results/ + next/playwright-report/ entries in .gitignore"
  affects:
    - "Wave 1 (Plan 01) service-primitives sweep — must run baseline diff after class-swap"
    - "Wave 2 (Plans 02-05) per-route sweeps — same"
    - "Wave 3 (Plan 06-07) shadcn audit + submission E2E activation"
tech-stack:
  added:
    - "@playwright/test 1.59.1 (devDependency, next/package.json)"
    - "Chromium 1217 (browser binary, ~/Library/Caches/ms-playwright/)"
  patterns:
    - "addStyleTag for non-deterministic surface exclusion (replaces broken Playwright mask)"
    - "document.fonts.ready await before snapshot for web-font determinism"
    - "test.describe.configure({ mode: 'serial' }) within describe to avoid single-dev-server flake"
key-files:
  created:
    - "next/playwright.config.ts"
    - "next/tests/visual/baseline.spec.ts"
    - "next/tests/e2e/submission.spec.ts"
    - "next/tests/visual/__snapshots__/baseline.spec.ts/{checkup,consultations,treatment-abroad,contacts}-{desktop,mobile-375}.png (8 PNGs)"
  modified:
    - "next/package.json (devDependencies +@playwright/test)"
    - "next/pnpm-lock.yaml"
    - ".gitignore (next/test-results/, next/playwright-report/)"
decisions:
  - "STRATEGY=reducedMotion locked — Phase 91 __blobDebug.setMode() not implemented (surface is read-only snapshot getter); reducedMotion fallback chosen per plan-00 fallback path"
  - "Blob exclusion via addStyleTag, not Playwright mask — mask painted magenta over entire viewport because .living-blob-field is position:fixed inset:0"
  - "Snapshot path anchored on {testDir}/{testFileDir} — plan-00 spec template caused ENOTDIR on first run"
metrics:
  duration: "8 minutes"
  completed: "2026-04-30"
  tasks: 3
  files: 11
  commits: 3
---

# Phase 93 Plan 00: Test Infrastructure (Wave 0) Summary

## One-liner

Playwright 1.59.1 + Chromium installed as dev-only test infrastructure; `next/playwright.config.ts` with desktop (1280×800) and mobile-375 (375×667 @2x) projects; 8 pre-Phase-93 baseline PNGs captured (4 routes × 2 viewports) and re-run twice deterministically green; submission E2E skeleton ready for Plan 07.

## What Shipped

### Task 1 — Playwright dev dependency + Chromium binary

- `pnpm --dir next add -D @playwright/test` → `@playwright/test ^1.59.1` in `next/package.json` `devDependencies` block (verified NOT in production `dependencies`)
- `pnpm --dir next exec playwright install chromium` → both `chromium-1217` and `chromium_headless_shell-1217` cached in `~/Library/Caches/ms-playwright/`
- `pnpm --dir next exec playwright --version` → `Version 1.59.1`
- `__blobDebug.setMode()` availability inspected via static analysis of `next/src/lib/blob-engine/debug.ts`: surface is a **read-only snapshot getter** (rafCount, listenerCount, mode, pointer, heat, velocity, startedAt, frameCount). The `setMode()` method was NOT implemented in Phase 91, so the planned primary determinism path is unavailable. Fallback path **STRATEGY=reducedMotion** is locked.
- Commit: `999cdb3` — `chore(93-00): add @playwright/test devDependency + chromium binary`

### Task 2 — `next/playwright.config.ts`

- Two projects only: `desktop` (1280×800) and `mobile-375` (375×667, deviceScaleFactor 2). No Firefox / WebKit (Phase 94 territory).
- `testDir: './tests'`, `outputDir: './test-results'`, `fullyParallel: true`, `reporter: [['list']]`, `use.trace: 'retain-on-failure'`.
- `webServer.command: 'pnpm dev'` with `reuseExistingServer: !CI` and 120s timeout.
- `.gitignore` updated: `next/test-results/` + `next/playwright-report/` (local outputs, never committed; only `__snapshots__/*.png` are tracked).
- `pnpm --dir next exec playwright test --list` exits 0 (config parses cleanly).
- Commit: `a3cc8f4` — `chore(93-00): add playwright.config.ts (desktop + mobile-375 projects)`

### Task 3 — Visual-regression spec + submission E2E skeleton + baseline capture

- `next/tests/visual/baseline.spec.ts` — iterates 4 routes (`/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`); applies `page.emulateMedia({ reducedMotion: 'reduce' })` in `beforeEach`; injects CSS to hide `.living-blob-field` (and its canvas / sublayers) plus Next.js dev indicators; awaits `document.fonts.ready` then 500ms settle; calls `expect(page).toHaveScreenshot(\`${slug}.png\`, { maxDiffPixelRatio: 0.01 })`. Marked `test.describe.configure({ mode: 'serial' })` to avoid baseline flake from parallel hammering of a single dev server.
- `next/tests/e2e/submission.spec.ts` — `test.describe.skip(...)` skeleton iterating same 4 routes with `test.fail()` placeholder bodies. Plan 07 Wave 3 will swap `.skip` → unskipped and implement Directus arrival check + cleanup.
- 8 PNGs captured at `next/tests/visual/__snapshots__/baseline.spec.ts/<slug>-<project>.png` (sizes 51KB–130KB; all 8 unique MD5s).
- Two consecutive determinism re-runs (no `--update-snapshots`) → 8/8 green.
- Commit: `f1d5797` — `test(93-00): pre-Phase-93 visual baseline + submission E2E skeleton`

## Playwright version pinned

**1.59.1** — latest stable as of 2026-04-30. Plan-00 required `>= 1.49.0`; this exceeds.

## Determinism strategy chosen

**STRATEGY=reducedMotion** (the documented fallback).

Reason: `next/src/lib/blob-engine/debug.ts` exposes `window.__blobDebug` as a `Object.defineProperty` getter that returns a snapshot object containing `rafCount`, `listenerCount`, `mode`, `pointer`, `heat`, `velocity`, `startedAt`, `frameCount`. There is no `setMode()` method on the surface — Phase 91 deferred that knob. Per plan-00's fallback contract, the spec uses `page.emulateMedia({ reducedMotion: 'reduce' })` before `goto`, plus an `addStyleTag` injection that hides `.living-blob-field` entirely (more on that below).

## Baseline snapshot count

**8 PNGs** committed (matches plan target):

| Route | desktop (1280×800) | mobile-375 (375×667 @2x) |
|-------|--------------------|--------------------------|
| `/checkup` | `checkup-desktop.png` (104.9 KB) | `checkup-mobile-375.png` (64.8 KB) |
| `/consultations` | `consultations-desktop.png` (124.7 KB) | `consultations-mobile-375.png` (74.1 KB) |
| `/treatment-abroad` | `treatment-abroad-desktop.png` (130.0 KB) | `treatment-abroad-mobile-375.png` (67.7 KB) |
| `/contacts` | `contacts-desktop.png` (65.7 KB) | `contacts-mobile-375.png` (51.0 KB) |

Visual spot-check on `checkup-desktop.png`: header chrome, eyebrow pill (ЧЕК-АП ЗА РУБЕЖОМ), 6-line hero heading ("Проверьте здоровье в Samsung Medical Center и Severance Hospital — за 1–2 дня"), body copy, hero illustration. Page renders fully and sharply with blob hidden.

## Flake encountered + resolution

### Flake 1 — Playwright `mask` over-coverage (Rule 1 — bug fix)

**Symptom:** First baseline-capture run produced 8 PNGs that were **flat magenta rectangles** — all 4 desktop snapshots had identical MD5s (`b858fe9a0c93703f77b3536ebd23ded1`); same for the 4 mobile snapshots.

**Root cause:** Plan-00 prescribed `expect(page).toHaveScreenshot({ mask: [page.locator('.living-blob-field')] })`. But `.living-blob-field` is `position: fixed; inset: 0;` (full viewport) per `next/src/styles/blob.css:12-19`. Playwright's `mask` paints magenta on top of the masked element's bounding box regardless of stacking context, so the entire viewport became a magenta swatch. Page content sits at higher z-index but the mask is rendered into the screenshot AFTER capture.

**Fix:** Replaced the `mask` option with an `addStyleTag` injection that sets `display: none !important` on `.living-blob-field`, `.living-blob-field .blob-canvas`, and `.living-blob-field .blob-sublayer`. This removes the non-deterministic surface from the DOM-paint pipeline entirely while leaving the actual page content (header, hero, sections) intact for diffing. Documented in the spec header comment.

### Flake 2 — Next.js dev-mode indicator badge (Rule 1 — bug fix)

**Symptom:** First determinism re-run (no `--update-snapshots`) failed 1/8 tests on `consultations-mobile-375` with a diff visible in the bottom-left corner — a small red "N" badge (Next.js dev-mode build/error indicator) appeared in the actual capture but not in the baseline.

**Root cause:** The `<nextjs-portal>` web component injected by Next.js dev mode flickers in/out depending on dev-server state (compile state, error overlay state). Not present at first capture; present at re-run.

**Fix:** Extended the `addStyleTag` injection to hide `nextjs-portal`, `#__next-build-watcher`, `[data-nextjs-toast]`, `[data-next-mark]`. Also added `await page.evaluate(() => document.fonts.ready)` before snapshot to eliminate web-font-swap anti-alias jitter (a faint top-left diff was also present, attributable to font load timing).

After both fixes, the baseline was re-captured and re-run twice consecutively — 8/8 green both times.

### Flake 3 — Snapshot path template (Rule 3 — blocking config)

**Symptom:** First baseline run errored before screenshot with `ENOTDIR: not a directory, mkdir '.../baseline.spec.ts/__snapshots__'`.

**Root cause:** Plan-00 specified `snapshotPathTemplate: '{testDir}/{testFilePath}/__snapshots__/{arg}-{projectName}{ext}'`. But `{testFilePath}` resolves to a FILE path (e.g. `tests/visual/baseline.spec.ts`), not a directory — `mkdir` on a path-segment that already exists as a file fails with ENOTDIR.

**Fix:** Switched to `'{testDir}/{testFileDir}/__snapshots__/{testFileName}/{arg}-{projectName}{ext}'`. Final landed path: `next/tests/visual/__snapshots__/baseline.spec.ts/<route>-<project>.png`. The fix also corrected an intermediate run that landed snapshots at `next/visual/__snapshots__/...` (because `{testFileDir}` is relative to `testDir`, dropping the `tests/` prefix); anchoring with both `{testDir}` and `{testFileDir}` re-introduces the prefix.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] `mask: [page.locator('.living-blob-field')]` covered entire viewport**
- **Found during:** Task 3c initial baseline capture
- **Issue:** All 8 snapshots were flat magenta because the masked element is full-viewport `position: fixed; inset: 0`
- **Fix:** Replaced `mask` option with `page.addStyleTag` setting `display: none !important` on `.living-blob-field` and its descendants
- **Files modified:** `next/tests/visual/baseline.spec.ts`
- **Commit:** `f1d5797`

**2. [Rule 1 — Bug] Next.js dev `<nextjs-portal>` badge flicker tripped 1 test**
- **Found during:** Task 3d first determinism re-run
- **Issue:** `consultations-mobile-375` failed with a visible red "N" badge in bottom-left corner present in actual but not baseline
- **Fix:** Extended `addStyleTag` to hide `nextjs-portal`, `#__next-build-watcher`, `[data-nextjs-toast]`, `[data-next-mark]`; added `document.fonts.ready` await for font-swap determinism
- **Files modified:** `next/tests/visual/baseline.spec.ts`
- **Commit:** `f1d5797`

**3. [Rule 3 — Blocking config] Snapshot path template caused ENOTDIR**
- **Found during:** Task 3c first capture attempt
- **Issue:** `'{testDir}/{testFilePath}/__snapshots__/...'` — `{testFilePath}` is a file, mkdir fails
- **Fix:** Switched to `'{testDir}/{testFileDir}/__snapshots__/{testFileName}/{arg}-{projectName}{ext}'`
- **Files modified:** `next/playwright.config.ts`
- **Commit:** `f1d5797` (config tweak rolled into the Task 3 commit since it gates baseline capture)

### Plan deviations summary

The intent of plan-00 (capture deterministic pre-Phase-93 baseline; install Playwright as dev dep; create skeleton specs) was fully delivered. The three deviations above are mechanical infrastructure fixes with no impact on the contract that Wave 1+ visual diffs have with Wave 0 — the baseline is still locked to `feat/v3.1` HEAD (post-Phase-92 merge), the blob is still excluded from diffs, and re-runs are still deterministic. Plan-07 Wave 3 will not need to re-derive any of this.

## Authentication Gates

None encountered. Pure dev-tool installation + local-only test capture; no network auth, no secrets.

## Acceptance Gates Status

| Gate | Result |
|------|--------|
| `pnpm --dir next exec playwright --version` ≥ 1.49.0 | ✅ 1.59.1 |
| `next/package.json` `@playwright/test` in `devDependencies` (NOT `dependencies`) | ✅ line 35 of `devDependencies` block |
| Chromium binary in `~/Library/Caches/ms-playwright/` | ✅ `chromium-1217` + `chromium_headless_shell-1217` |
| `next/playwright.config.ts` exists, `desktop` + `mobile-375` projects, `webServer` block, parses cleanly | ✅ `playwright test --list` exit 0 |
| `.gitignore` includes `test-results/` and `playwright-report/` for `next/` | ✅ |
| `next/tests/visual/baseline.spec.ts` covers 4 routes | ✅ |
| `next/tests/e2e/submission.spec.ts` exists with `test.describe.skip(...)` | ✅ |
| 8 baseline snapshots committed | ✅ at `next/tests/visual/__snapshots__/baseline.spec.ts/` |
| Determinism re-run (no `--update-snapshots`) green | ✅ 2 consecutive runs, 8/8 green |
| `pnpm --dir next build` exits 0 | ✅ all 11 routes generated |
| `pnpm --dir next lint` errors=0 | ✅ 0 errors (1 pre-existing unused-eslint-disable warning in `lib/blob-engine/index.ts` — out of plan-00 scope) |
| `git diff next/src/ next/public/` empty | ✅ zero source files touched |

## Threat Register Disposition

| Threat ID | Disposition Result |
|-----------|--------------------|
| T-93-00-01 (Wave 0 baseline captured AFTER Wave 1 commits) | mitigated — Plan 00 ships before Plan 01; Task 3c captured baseline at HEAD `21c0f18` (pre-93-anything) |
| T-93-00-02 (Playwright in production deps) | mitigated — `pnpm add -D` flag honored; `@playwright/test` in `devDependencies` block of `next/package.json` line 35 (verified by `grep` outside `devDependencies` returns empty) |
| T-93-00-03 (`__blobDebug.setMode` unavailable, baselines flake) | mitigated — fallback path `reducedMotion` locked at Task 1 via static analysis of `next/src/lib/blob-engine/debug.ts` (no setMode method exists); plus blob field fully hidden via `addStyleTag`; 2 consecutive re-runs green |
| T-93-00-04 (Wave 0 ships without `submission.spec.ts` skeleton) | mitigated — `next/tests/e2e/submission.spec.ts` shipped as `test.describe.skip(...)` with iteration over 4 routes; Plan 07 swaps `.skip` and fills body |

## Commits

- `999cdb3` — `chore(93-00): add @playwright/test devDependency + chromium binary`
- `a3cc8f4` — `chore(93-00): add playwright.config.ts (desktop + mobile-375 projects)`
- `f1d5797` — `test(93-00): pre-Phase-93 visual baseline + submission E2E skeleton`

## Self-Check: PASSED

Verified after writing:

- `next/playwright.config.ts` — FOUND
- `next/tests/visual/baseline.spec.ts` — FOUND
- `next/tests/e2e/submission.spec.ts` — FOUND
- `next/tests/visual/__snapshots__/baseline.spec.ts/{checkup,consultations,treatment-abroad,contacts}-{desktop,mobile-375}.png` — all 8 FOUND
- Commit `999cdb3` — FOUND in `git log --oneline`
- Commit `a3cc8f4` — FOUND in `git log --oneline`
- Commit `f1d5797` — FOUND in `git log --oneline`

ROUTE-07 prerequisite satisfied. Wave 1 (Plan 01) unblocked.
