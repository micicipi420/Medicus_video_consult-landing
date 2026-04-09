---
phase: 40-ux-cosmetic-cleanup
plan: 01
subsystem: ui
tags: [tailwind-v4, responsive-typography, mobile-overflow, russian-typography, nbsp-binding]

# Dependency graph
requires:
  - phase: 38.1-mobile-viewport-overflow-checkup-h1-fix
    provides: "html { overflow-x: clip } mobile safety net (the symptom this plan removes the underlying cause of)"
  - phase: 39-partials-extraction-build-pipeline
    provides: "make build byte-identity gate via scripts/build-pages.sh splicer + pre-commit hook"
provides:
  - "404.html H1 that fits within a 320px viewport at the source — no longer relying on overflow-x: clip to mask a sizing bug"
  - "Tailwind step-function evidence that text-3xl is the correct mobile floor for the 'Страница не найдена' phrase"
affects: [40-ux-cosmetic-cleanup, future-mobile-typography-decisions, milestone-v3.2-completion]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single-mobile-step-down idiom for Cyrillic phrases that overflow at 320px: bump the base text-{n} class down by one Tailwind step (e.g., text-4xl→text-3xl) without touching sm:/md:/lg: variants and without introducing fluid clamp()"

key-files:
  created:
    - .planning/phases/40-ux-cosmetic-cleanup/40-01-SUMMARY.md
  modified:
    - 404.html (line 110: H1 mobile class text-4xl → text-3xl)

key-decisions:
  - "D-01 (locked in 40-CONTEXT.md): step-function text-3xl mobile, NOT clamp() — matches the existing Tailwind v4 breakpoint cadence used across all 6 pages"
  - "Preserved Страница&nbsp;не&nbsp;найдена subject+verb nbsp binding byte-for-byte — neither &nbsp; entity replaced with literal U+00A0 or ASCII space (per user memory rule feedback_nbsp-subject-verb.md)"

patterns-established:
  - "Mobile-overflow-at-source pattern: when html { overflow-x: clip } is masking a sizing bug, the fix is to step the offending utility class down by one Tailwind breakpoint at the lowest variant only — leave higher breakpoints untouched so desktop visual rhythm is unchanged"

requirements-completed: [COSMETIC-01]

# Metrics
duration: 1m25s
completed: 2026-04-08
---

# Phase 40 Plan 01: 404 H1 Mobile Sizing Summary

**404.html H1 mobile class stepped from text-4xl (36px) to text-3xl (30px) so 'Страница не найдена' fits within 320px viewport without relying on the overflow-x: clip safety net introduced in Phase 38.1**

## Performance

- **Duration:** 1m25s
- **Started:** 2026-04-08T12:45:04Z
- **Completed:** 2026-04-08T12:46:29Z
- **Tasks:** 1 of 2 (Task 2 is a human-verify checkpoint owned by the orchestrator/verifier)
- **Files modified:** 1

## Accomplishments

- Closed COSMETIC-01 at the source — 404.html H1 sizing no longer depends on the mobile overflow safety net
- Preserved subject+verb nbsp binding `Страница&nbsp;не&nbsp;найдена` byte-for-byte (mandatory per user memory rules)
- Verified `make build` exits 0 — Phase 39-03 byte-identity gate still passes (the splicer is a no-op on the modified region because it sits inside `<main id="page-content">`, outside the 4 chrome partial regions)
- Single-line atomic commit: 1 insertion, 1 deletion, exactly the `text-4xl` → `text-3xl` substitution

## Task Commits

Each task was committed atomically:

1. **Task 1: Step 404 H1 mobile class from text-4xl to text-3xl** — `cdcc9bf` (fix)
2. **Task 2: Playwright MCP verification — 404 H1 fits at 320px (D-06)** — *pending human-verify checkpoint, owned by orchestrator/verifier (not executed in this worktree)*

## Files Created/Modified

- `404.html` — line 110 H1 class string: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl …` → `text-3xl sm:text-5xl md:text-6xl lg:text-7xl …`. Nothing else changed in the file. Edit is in body content outside the 4 chrome partial regions, so the build splicer is a no-op on the modified content and no chrome drift was introduced.

## Diff Applied

```diff
diff --git a/404.html b/404.html
@@ -107,7 +107,7 @@
       <div class="text-8xl font-extrabold bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent mb-6">
         404
       </div>
-      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-mu-text-900 mb-4">Страница&nbsp;не&nbsp;найдена</h1>
+      <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-mu-text-900 mb-4">Страница&nbsp;не&nbsp;найдена</h1>
       <p class="text-mu-text-700 font-medium mb-8">
         Эту страницу либо перенесли, либо&nbsp;она&nbsp;ещё не&nbsp;появилась. Откройте главную или&nbsp;напишите координатору.
```

## Acceptance Criteria — Task 1

| # | Criterion | Result |
|---|-----------|--------|
| 1 | `grep -c 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-mu-text-900 mb-4">Страница&nbsp;не&nbsp;найдена</h1>' 404.html` returns `1` | PASS (1) |
| 2 | `grep -c 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-mu-text-900 mb-4"' 404.html` returns `0` (old class string fully removed) | PASS (0) |
| 3 | `grep -c 'Страница&nbsp;не&nbsp;найдена' 404.html` returns `1` (subject+verb nbsp binding preserved verbatim) | PASS (1) |
| 4 | `grep -c '<h1 ' 404.html` returns `1` (still exactly one H1 on the page) | PASS (1) |
| 5 | `git diff --stat 404.html` shows exactly 1 line changed (1 insertion, 1 deletion) | PASS (`1 file changed, 1 insertion(+), 1 deletion(-)`) |
| 6 | `make build` exits 0 (Phase 39-03 byte-identity gate passes — splicer is a no-op because the edit is outside chrome partial regions) | PASS (exit 0) |
| 7 | `git diff --quiet -- '*.html'` shows no chrome drift introduced by the build (only the intentional 404.html edit remains) | PASS (only `404.html` modified, the deliberate Task 1 edit; no other HTML pages drifted) |

## Verification Results — Task 2 (Playwright MCP)

**Status: PASSED** — all 4 viewports verified by orchestrator on 2026-04-08 after wave 1 merge (commit `2255867`). Local static server `python3 -m http.server 8765` served `404.html`; measurements taken via `mcp__playwright__browser_resize` + `mcp__playwright__browser_evaluate`.

| Viewport | scrollWidth | clientWidth | overflowX | H1 fontSize | H1 left | H1 right | H1 clipped | H1 height / lineHeight | Result |
|---------:|------------:|------------:|:---------:|------------:|--------:|---------:|:----------:|:-----------------------|:------:|
| 320  | 305  | 305  | false | 30px | 8.70 | 296.30 | no | 36 / 36 (1 line) | PASS |
| 375  | 360  | 360  | false | 30px | 16.00 | 344.00 | no | 36 / 36 (1 line) | PASS |
| 768  | 753  | 753  | false | 60px | —    | —      | no | 60 / 60 (1 line) | PASS |
| 1024 | 1009 | 1009 | false | 72px | —    | —      | no | 72 / 72 (1 line) | PASS |

**Key findings:**
- At every viewport, `documentElement.scrollWidth === clientWidth` — no horizontal overflow anywhere. The mobile safety net (`html { overflow-x: clip }`) is no longer compensating.
- At every viewport, `h1.getBoundingClientRect().left >= 0 && right <= window.innerWidth` — no edge clipping.
- `h1.textContent.trim() === 'Страница не найдена'` at every viewport — entity-decoded text intact, subject+verb nbsp binding preserved.
- H1 is a single line at every viewport (H1 height equals computed lineHeight).
- At 320px, `text-3xl` (30px font, 36px lineHeight) fits the phrase comfortably within the 305px content-area (viewport minus scrollbar); at 375+ the higher breakpoints kick in as expected from the Tailwind step-function (`sm:text-5xl md:text-6xl lg:text-7xl`).

**Note:** The 1 console error observed at load-time on 404.html is the `/favicon.ico` 404 — this is the subject of COSMETIC-02 (plan 40-02, wave 2) and is NOT a regression introduced by this plan.

## Decisions Made

- **Followed locked decision D-01 from 40-CONTEXT.md** — single mobile step-down `text-4xl` → `text-3xl`, no clamp(), no other class changes. No new decisions made during execution.

## Deviations from Plan

None — plan executed exactly as written. The Edit operation was a single-line substitution matching the OLD/NEW fragments specified verbatim in the plan's `<action>` block.

## Issues Encountered

- **Worktree branch base mismatch (resolved at start):** The agent worktree branch was pointing at commit `8ba4986` (a stale `main`-line PR merge) instead of the expected base `1134feac` (the v3.2 Phase 40 kickoff commit). Resolved per the orchestrator's `<worktree_branch_check>` protocol via `git reset --hard 1134feac18911b1e71c241d2f3c50bcc3f7b8c34` before any other work. Working tree was clean at the time of reset, no work lost.

## User Setup Required

None — no external service configuration required. This plan modifies a single static HTML class string.

## Next Phase Readiness

- 404.html H1 source fix is complete; the Phase 38.1 `overflow-x: clip` safety net is no longer compensating for an underlying sizing bug on this page (will be confirmed empirically by the Task 2 Playwright MCP verification step in the orchestrator's wave-merge step)
- Wave 1 of Phase 40 includes this plan (40-01) and 40-03 in parallel; 40-02 (favicon) follows in wave 2
- After both wave-1 plans commit and the verifier confirms the 4-viewport measurement table, the wave is closeable and 40-02 can be dispatched

## Self-Check: PASSED

All claimed artifacts verified before returning checkpoint to the orchestrator:

| Claim | Result |
|-------|--------|
| `404.html` exists at repo root | FOUND |
| `.planning/phases/40-ux-cosmetic-cleanup/40-01-SUMMARY.md` exists | FOUND |
| Task 1 commit `cdcc9bf` reachable in `git log --all` | FOUND |
| `grep -q 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl' 404.html` | PASS |
| `grep -q 'Страница&nbsp;не&nbsp;найдена' 404.html` | PASS |

---
*Phase: 40-ux-cosmetic-cleanup*
*Plan: 01*
*Completed: 2026-04-08*
