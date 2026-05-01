---
phase: 91-blob-engine-renderer-physics-a11y-branches
plan: 01
subsystem: ui
tags: [react, canvas-2d, nextjs, app-router, blob-engine, liquid-glass]

# Dependency graph
requires:
  - phase: 90-foundation-tokens-a11y-wiring-dom-skeleton
    provides: ".living-blob-field skeleton + 4 .blob-sublayer divs + data-engine-active=\"false\" default + inline <style> seed for runtime CSS vars"
provides:
  - "next/src/lib/blob-engine/index.ts STUB exporting startBlobEngine({canvas,parent}) → cleanup"
  - "next/src/components/effects/LivingBlobField.tsx Client Component shell mounting <canvas class=\"blob-canvas\"> as 5th child of .living-blob-field"
  - "Canvas-visibility CSS contract appended to next/src/styles/blob.css (display:none default; display:block when data-engine-active=\"true\")"
  - "<LivingBlobField /> wired into next/src/app/layout.tsx after the 4 sublayer divs"
  - "Decision M graceful degradation path: console.warn + data-blob-mode=\"static\" on getContext('2d') === null"
affects: [phase-91-02, phase-91-03, phase-91-04, phase-91-05, phase-92, phase-94]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Module-level engine entrypoint imported by Client Component shell (Decision A — locks Plan 02 singleton refactor)"
    - "useRef + useEffect lifecycle hookup with empty dep array; engine module owns rAF/listeners (deferred to Plan 02)"
    - "data-engine-active and data-blob-mode handshake via dataset/setAttribute (no React state)"

key-files:
  created:
    - "next/src/lib/blob-engine/index.ts (30 lines, STUB)"
    - "next/src/components/effects/LivingBlobField.tsx (43 lines)"
  modified:
    - "next/src/styles/blob.css (+15 lines appended after frozen line 79)"
    - "next/src/app/layout.tsx (+2 lines: import + 5th child mount)"

key-decisions:
  - "Stubbed startBlobEngine returns inert cleanup; Plan 02 will replace with singleton refcount + rAF + AbortController"
  - "useEffect (not useLayoutEffect) chosen for engine init — side-effect, not layout measurement (PITFALLS 8.1)"
  - "Touch-action: none applied via inline style on canvas to prevent gesture interception (mobile branch — Plan 04)"
  - "eslint-disable-next-line no-console removed after build flagged it as unused; project ESLint config does not enable no-console"

patterns-established:
  - "Engine API: startBlobEngine({canvas, parent}) returns cleanup — Plan 02 will preserve this signature"
  - "Mount order contract: canvas must remain 5th and last child of .living-blob-field"
  - "blob.css append-only after Phase 90 line 79 — frozen lines preserved byte-equivalent"

requirements-completed: [BLOB-01]

# Metrics
duration: 3min
completed: 2026-04-30
---

# Phase 91 Plan 01: Skeleton + Canvas Mount Summary

**Canvas 2D shell mounted as 5th sibling inside .living-blob-field with stub engine that flips data-engine-active="true" on success and degrades gracefully (console.warn + data-blob-mode="static") when getContext('2d') returns null.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-30T09:01:03Z
- **Completed:** 2026-04-30T09:04:19Z
- **Tasks:** 2 auto + 1 checkpoint (delegated to orchestrator)
- **Files modified:** 4 (2 created, 2 edited)

## Accomplishments
- Engine entrypoint scaffolded — Plan 02 has a stable import surface (`import { startBlobEngine } from '@/lib/blob-engine'`) and signature (`{canvas, parent}` → cleanup) to slot the singleton + rAF + listeners into.
- `<canvas class="blob-canvas">` reliably mounts as the 5th child of `.living-blob-field` on every route via shared `app/layout.tsx`; Phase 90 fallback (4 sublayer divs visible when `data-engine-active="false"`) preserved.
- Decision M graceful degradation actually wired (not deferred): canvas-init failure path is exercised by the same return statement that handles the success path, so it cannot rot in unused code.
- `pnpm build` exits 0 with zero new warnings vs the Phase 90 baseline (after removing an unused `eslint-disable-next-line` directive that the project config did not need).

## Task Commits

Each task was committed atomically:

1. **Task 1: Stub engine entrypoint at lib/blob-engine/index.ts** — `65b6ac3` (feat)
2. **Task 2: LivingBlobField shell + .blob-canvas CSS + layout wiring** — `f406ce9` (feat, includes Rule 1 auto-fix)
3. **Task 3: Manual smoke** — DELEGATED to orchestrator (see "Pending Orchestrator Attestation" below)

## Files Created/Modified

- `next/src/lib/blob-engine/index.ts` (NEW, 30 lines) — exports `startBlobEngine({canvas, parent}): () => void`. Calls `canvas.getContext('2d')`. On null: `console.warn`, sets `<html data-blob-mode="static">`, returns inert cleanup. On success: flips `parent.dataset.engineActive = 'true'`, sets `<html data-blob-mode="cursor">`, returns cleanup that reverts both. **No React imports. No `'use client'` directive.** Plan 02 rewrites this entirely with module-level state object, refcount, AbortController, rAF loop, pointermove listener, and matchMedia branches.
- `next/src/components/effects/LivingBlobField.tsx` (NEW, 43 lines) — `'use client'` Client Component. Renders `<canvas ref={canvasRef} className="blob-canvas" aria-hidden="true" style={{ touchAction: 'none' }} />`. `useEffect` with empty deps reads `canvas.parentElement` and calls `startBlobEngine({canvas, parent})`, returning the engine's stop function as the effect cleanup. **Zero React state.**
- `next/src/styles/blob.css` (EDIT, lines 1–79 byte-equivalent to Phase 90; +15 lines appended) — added `.blob-canvas { position:absolute; inset:0; width:100%; height:100%; display:none; pointer-events:none; }` and `.living-blob-field[data-engine-active="true"] .blob-canvas { display:block; }`. Dark-mode rule (`opacity: 0.30; filter: saturate(0.65)`) deferred to Plan 04.
- `next/src/app/layout.tsx` (EDIT, +2 lines) — import `LivingBlobField` from `@/components/effects/LivingBlobField` and render `<LivingBlobField />` as 5th child of `.living-blob-field`, after the 4 `.blob-sublayer` divs. All other lines byte-equivalent (metadata, viewport, font declarations, `<SvgRefractionDefs />`, header/main/footer/sticky bar).

## Stub Engine Contract (replaced in Plan 02)

```ts
export interface StartBlobEngineOpts {
  canvas: HTMLCanvasElement;
  parent: HTMLElement;
}
export function startBlobEngine(opts: StartBlobEngineOpts): () => void;
```

Plan 02 keeps the signature. Implementation grows to:
- Module-level `state` object (rafId, refcount, abort, mode, etc.)
- Refcount-guarded start/stop (Strict Mode + App Router safe per Decision C)
- Single `pointermove` listener via `AbortController`
- Single `requestAnimationFrame` loop
- matchMedia listeners + MutationObserver on `<html data-theme>` (Decision G)
- CSS-var writes via `document.documentElement.style.setProperty(...)` each frame

Today's stub mutates only `parent.dataset.engineActive` and `<html data-blob-mode>` — no listeners attached, no rAF scheduled, no CSS vars written. Page is visually identical to Phase 90 baseline because canvas is empty.

## Decisions Made

- **Stub eslint-disable removed (Rule 1 auto-fix)** — Plan called for `// eslint-disable-next-line no-console` above the warn call to keep build warning-free. Reality: Next.js project ESLint config does not enable `no-console`, so the disable directive itself triggered a NEW warning ("Unused eslint-disable directive"). Removed the directive; build is clean. The single `console.warn` is acceptable per threat T-91-05 (accepted risk — diagnostic surface for hardware-acceleration-disabled browsers).
- All other choices (file paths, component shape, CSS append point, layout insertion point) followed Decision A / Decision I / `<code_context>` mount order verbatim.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `eslint-disable-next-line no-console` directive**
- **Found during:** Task 2 verification (`pnpm build`)
- **Issue:** Plan instructed to wrap `console.warn` with `// eslint-disable-next-line no-console` to silence a no-console warning. After build, ESLint reported `Unused eslint-disable directive (no problems were reported from 'no-console')` because the project's ESLint config does not enable the `no-console` rule. The directive itself became the warning.
- **Fix:** Removed the eslint-disable comment. Bare `console.warn` compiles and lints clean.
- **Files modified:** `next/src/lib/blob-engine/index.ts`
- **Verification:** Re-ran `cd next && rm -rf .next && pnpm build` — exited 0 with zero warnings (success criterion 4 satisfied).
- **Committed in:** `f406ce9` (folded into Task 2 commit per "never amend prior commit" rule)

---

**Total deviations:** 1 auto-fixed (1 bug — Rule 1)
**Impact on plan:** Auto-fix preserved success criterion 4 (zero new build warnings). No scope creep. Stub semantics unchanged.

## Acceptance Criteria — Static Grep Gates (Self-Check)

Run from repo root:

```
G1  grep -c "^'use client'" next/src/components/effects/LivingBlobField.tsx          → 1   ✅
G2  useState/useReducer (excl comments) in LivingBlobField.tsx                       → 0   ✅
G3  grep -c 'className="blob-canvas"' next/src/components/effects/LivingBlobField.tsx → 1   ✅
G4  grep -c "from '@/lib/blob-engine'" next/src/components/effects/LivingBlobField.tsx → 1  ✅
G5  grep -c '\.blob-canvas' next/src/styles/blob.css                                 → 2   ✅ (≥2 ship; Plan 04 adds dark rule → ≥3)
G6  blur > 12px in blob.css (intent: in .blob-canvas only)                          → 3   ⚠️  Phase 90 frozen sublayer divs (.blob-core/.blob-body/.blob-halo) — NOT .blob-canvas. Verified by `tail -n +80 blob.css | grep blur` → 0 matches in Plan 01 append. Grep gate is overbroad against the intent ("DO NOT add blur to .blob-canvas"); the intent IS satisfied.
G7  head -79 blob.css byte-equivalent to HEAD                                        → empty diff ✅
G8  grep -c "import { LivingBlobField }" layout.tsx                                  → 1   ✅
G9  LivingBlobField appears within 6 lines after `data-engine-active="false"`        → 1   ✅
G10 frozen files diff (liquid-glass.css, globals.css, useSpecularHighlight.ts,
    SvgRefractionDefs.tsx, DESIGN.md)                                                → 0 bytes ✅
G11 deps frozen (package.json, pnpm-lock.yaml)                                       → 0 bytes ✅
G12 cd next && pnpm build                                                            → exit 0, zero new warnings ✅
```

## Pending Orchestrator Attestation (delegates Task 3)

The plan's Task 3 is `checkpoint:human-verify` covering 10 manual smoke gates. Per the executor's checkpoint_handling rules, Wave 1's manual UAT is **delegated to the orchestrator** for batched Playwright + DevTools spot-checks after all 5 wave plans ship. The 10 gates and their executor-runnable subset:

1. **(executor-runnable)** `cd next && pnpm dev` → wait for "Ready" — DEFERRED (no dev server spun up by sequential executor; orchestrator runs).
2. Open `http://localhost:3000/` in Chrome with DevTools — orchestrator.
3. **Console errors gate** — orchestrator spot-checks vs Phase 90 baseline; expected: zero NEW errors.
4. **Mount gate** — DevTools Elements panel: `.living-blob-field` has exactly 5 children (4 `.blob-sublayer` + 1 `<canvas class="blob-canvas">`). Static asserted by mount-order grep G9.
5. **Engine handshake gate** — `document.querySelector('.living-blob-field').dataset.engineActive === "true"` and `document.documentElement.dataset.blobMode === "cursor"`. Static asserted by source code: stub explicitly writes both on success path.
6. **Canvas visibility gate** — `display: block` for canvas, `display: none` for the 4 sublayers under `data-engine-active="true"`. Statically asserted by appended CSS rule + Phase 90 line 63 rule unchanged.
7. **Route smoke (5 routes)** — `/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/contacts` → `/`. Static: shared `app/layout.tsx` mounts `<LivingBlobField />` once for all routes; App Router does not unmount the layout component on navigation. Orchestrator confirms no console errors per route.
8. **Canvas-init-failure simulation** — `HTMLCanvasElement.prototype.getContext = () => null` then reload. Expected: `console.warn`, `data-blob-mode === 'static'`, `data-engine-active === 'false'`, sublayer divs visible. Static: Decision M code path is the FIRST branch in `startBlobEngine`, exercised on null return.
9. **(executor-runnable)** `git diff HEAD -- next/src/styles/liquid-glass.css next/src/app/globals.css next/src/hooks/use-specular-highlight.ts next/src/components/layout/SvgRefractionDefs.tsx DESIGN.md next/package.json next/pnpm-lock.yaml` — confirmed empty (gate G10 + G11 above).
10. **(executor-runnable)** `head -79 next/src/styles/blob.css | diff - <(git show HEAD:next/src/styles/blob.css | head -79)` — confirmed empty (gate G7 above).

**Orchestrator attestation summary:** gates 1–8 require a running dev server + Chrome DevTools and are out of executor scope this wave. Gates 9–10 are confirmed by this executor in the static checks above. The orchestrator runs the runtime gates in a single Playwright pass after Plans 02–05 ship.

## Issues Encountered

- One ESLint warning surfaced from a `// eslint-disable-next-line` directive that the project config didn't need; auto-fixed under Rule 1. See "Deviations from Plan" above.

## Next Phase Readiness

- **Plan 02 entry contract is stable:** `import { startBlobEngine } from '@/lib/blob-engine'` with signature `({canvas, parent}: StartBlobEngineOpts) => () => void`. Plan 02 replaces the body but keeps the signature, so `LivingBlobField.tsx` does not need re-editing.
- **Canvas DOM is wired:** Plan 02's renderer paints onto `canvasRef.current` provided by the React shell — no DOM scaffolding work remaining at the layout level.
- **Phase 90 fallback path verified intact:** when engine fails or has not yet started, `data-engine-active="false"` keeps the 4 sublayer divs visible (Phase 90 line 63 rule unchanged), so any Plan 02 startup error still leaves a graceful static gradient on screen.
- **No blockers for Plan 02.**

## Self-Check: PASSED

Verified files exist:
- `FOUND: next/src/lib/blob-engine/index.ts`
- `FOUND: next/src/components/effects/LivingBlobField.tsx`
- `FOUND: next/src/styles/blob.css` (modified)
- `FOUND: next/src/app/layout.tsx` (modified)

Verified commits:
- `FOUND: 65b6ac3` (Task 1)
- `FOUND: f406ce9` (Task 2)

Verified build: `pnpm build` exits 0 with zero new warnings vs Phase 90 baseline.

Verified frozen files: `liquid-glass.css`, `globals.css`, `useSpecularHighlight.ts`, `SvgRefractionDefs.tsx`, `DESIGN.md`, `next/package.json`, `pnpm-lock.yaml` — all byte-equivalent to HEAD~2.

Verified `blob.css` lines 1–79 byte-equivalent to Phase 90 baseline (`head -79 blob.css | diff - <(git show HEAD~2:blob.css | head -79)` empty).

---
*Phase: 91-blob-engine-renderer-physics-a11y-branches*
*Completed: 2026-04-30*
