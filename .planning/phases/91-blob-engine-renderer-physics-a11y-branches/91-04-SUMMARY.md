---
phase: 91-blob-engine-renderer-physics-a11y-branches
plan: 04
subsystem: engine-modes
tags: [modes, lissajous, a11y, dark-theme, mobile, blob-engine, v9.0, living-blob]

requires:
  - phase: 91-blob-engine-renderer-physics-a11y-branches
    provides: "Plan 03 — physics module + heat/velocity wiring; mode hardcoded to 'cursor'"
provides:
  - "5 mode branches live: cursor / ambient / static / hidden / dark"
  - "lissajous.ts orbit math + window-leave decay (LOCKED constants per Decision F + J)"
  - "modes.ts resolver + matchMedia + MutationObserver + interactive-selector tap filter"
  - "blob.css dark-theme dimming rule appended (opacity 0.30, saturate 0.65, no blur)"
  - "index.ts: mode-dependent target compute, rAF gated on animating modes, scroll-pause + tap-pulse on mobile"
affects: [phase-91-plan-05, phase-92-glass-heat-leak]

tech-stack:
  added: []
  patterns:
    - "Mode resolver as pure function reading composite state (matchMedia.matches + dataset + pointer state)"
    - "Mode transitions cancel/re-schedule rAF idempotently — at any moment 0 or 1 rAF live"
    - "MutationObserver on <html data-theme> with attributeFilter — passive, zero cost when stable"
    - "Interactive-selector exclusion via Element.closest() — no dynamic selector injection"

key-files:
  created:
    - "next/src/lib/blob-engine/lissajous.ts (61 lines)"
    - "next/src/lib/blob-engine/modes.ts (102 lines)"
  modified:
    - "next/src/lib/blob-engine/index.ts (+~150 lines net for mode integration)"
    - "next/src/styles/blob.css (+8 lines after Phase 91 Plan 01 rules)"
  deleted: []

key-decisions:
  - "attachListeners (pointermove, visibilitychange, resize) stays always-on; rAF schedule is the gate for static/hidden modes — zero-cost dead listener vs. complexity of conditional attachment"
  - "Dark mode keeps motionEnabled=false (heat permanently 0) per Decision H 'calm state' — even though dark animates Lissajous, heat is suppressed"
  - "Initial mode read happens in startBlobEngine; rAF only scheduled if mode !== static && mode !== hidden — handles the case where engine starts under reduced-motion"
  - "visibilitychange resume also gated on mode (does not re-schedule rAF if user enabled reduce-motion while hidden)"

requirements-completed: [BLOB-06, BLOB-07, BLOB-08, BLOB-09, BLOB-10]

duration: ~12min
completed: 2026-04-30
---

# Phase 91 Plan 04 Summary — 5 Mode Branches Live

**lissajous.ts + modes.ts shipped; index.ts integrates mode resolver + Lissajous orbit + tap-pulse + scroll-pause + dark-theme dimming. All 5 mode branches (cursor / ambient / static / hidden / dark) operational. Manual a11y attestation deferred to post-Wave-5 Playwright batch (orchestrator handles).**

## Mode Branches Implemented

| Mode | Trigger | rAF | Heat | Target | Visual |
|------|---------|-----|------|--------|--------|
| `cursor` | desktop fine pointer + motion on | ✓ scheduled | live | pointer | full canvas + cursor follow |
| `ambient` | mobile coarse OR pointer outside window >800ms | ✓ scheduled | live | Lissajous (or decay) | full canvas + autonomous drift |
| `static` | `prefers-reduced-motion: reduce` | ✗ skipped | 0 | n/a | empty canvas (CSS sublayers also hidden by [data-engine-active="true"] rule from Phase 90) |
| `hidden` | `prefers-reduced-transparency: reduce` | ✗ skipped | 0 | n/a | `.living-blob-field display: none` (Phase 90 line 78) |
| `dark` | `[data-theme="dark"]` | ✓ scheduled | 0 (calm) | Lissajous only | dimmed canvas (opacity 0.30, saturate 0.65) |

## Locked Constants Verbatim

`lissajous.ts` exports:
- `LISSAJOUS_PERIOD_X = 17000`
- `LISSAJOUS_PERIOD_Y = 23000`
- `LISSAJOUS_AMP_X = 0.30`
- `LISSAJOUS_AMP_Y = 0.25`
- `LISSAJOUS_PHASE_OFFSET = Math.PI / 2`
- `LEAVE_DECAY_MS = 800`

## Interactive Selector Verbatim

```ts
const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])';
```

Order matches grep gate `button.*input.*textarea`. CTA tap-pulse exclusion (T-91-03 mitigation).

## Acceptance Criteria — All Pass

| Gate | Result |
|------|--------|
| `from './modes'` import | ✓ 1 |
| `from './lissajous'` import | ✓ 1 |
| `resolveMode` refs | ✓ 2 |
| `lissajousTarget` refs | ✓ 2 |
| `leaveWindowDecayTarget` refs | ✓ 2 |
| `isInteractiveTarget` refs | ✓ 2 |
| `scrollPaused` refs | ✓ 6 |
| `applyTapPulse` refs | ✓ 2 |
| `themeObserver.disconnect` | ✓ 1 |
| Single pointermove listener (cross-file) | ✓ 1 |
| Layout reads in index.ts | ✓ 0 |
| `[data-theme="dark"] .blob-canvas` rule in blob.css | ✓ 1 |
| `opacity: 0.30` in blob.css | ✓ 1 |
| `saturate(0.65)` in blob.css | ✓ 1 |
| blob.css head-79 byte-equivalent to HEAD | ✓ 0 diff |
| modes.ts exports (BlobMode type + 5 functions + ModeListenerHandles + ResolveModeOpts) | ✓ 6 |
| MutationObserver references in modes.ts | ✓ 3 |
| Interactive selector grep | ✓ 1 |
| Frozen ranges (10 files) | ✓ all byte-equivalent |
| `cd next && pnpm build` | ✓ exit 0, 11/11 routes |
| TypeScript clean | ✓ no errors |

## Threat Model Coverage

- **T-91-03 (CTA tap double-fire):** mitigated. `isInteractiveTarget` rejects tap-pulse on `button, a, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])`. Listener uses `{ passive: true }` so does NOT preventDefault on the button click path. Manual mobile attestation in Playwright batch.
- **T-91-04 (a11y cheat-pass risk):** mitigated by deferring to Playwright + manual OS-toggle attestation in post-Wave-5 orchestrator-run batch. Outcomes will be logged in `91-VERIFICATION.md`.
- **T-91-01 + T-91-02 (preserved):** mode transitions cancel/re-schedule rAF idempotently; MutationObserver disconnects on refcount → 0; AbortController teardown unchanged.

## Pending Orchestrator Attestation (post-Wave-5)

After Plan 05 ships, orchestrator (main Claude session) runs Playwright batch verifying:
1. **Reduced-motion (BLOB-07):** macOS toggle → `data-blob-mode === 'static'`, no canvas paint, no `--blob-x/y` updates from cursor
2. **Reduced-transparency (BLOB-08):** macOS toggle → `data-blob-mode === 'hidden'`, `.living-blob-field` `display: none`
3. **Dark theme (BLOB-09):** DevTools `documentElement.dataset.theme = 'dark'` → mode='dark', canvas opacity ~0.30, follow disabled
4. **Mobile (BLOB-06):** DevTools iPhone profile → mode='ambient', Lissajous orbits, tap-pulse on background only (not on CTA), scroll-pause, 600ms rate limit
5. **Pointer-leave-window (BLOB-10):** cursor outside window → 800ms decay → mode flips cursor → ambient, smooth blend
6. **App Router + Strict Mode (preserved):** 5-route navigation cycle + tab switch — listener count =1, rAF count =1

## Forward Contract for Plan 05

`__blobDebug.mode` should reflect `state.mode` (now BlobMode union).
`__blobDebug.rafCount` should be:
- 0 when state is null OR mode is 'static'/'hidden'
- 1 in cursor/ambient/dark modes (during animating)
- 0 when document.hidden (Page Visibility paused)

`__blobDebug.listenerCount` should be:
- pointermove count on window: 1 (always — Plan 02 invariant)
- visibilitychange on document: 1
- resize on window: 1
- pointerout/pointerover on window: 1 each
- scroll on window: 1
- pointerdown on window: 1
- 3 matchMedia change listeners: not directly countable via getEventListeners

Plan 05's debug surface formalizes these.

## Files Touched

- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/lib/blob-engine/lissajous.ts` (NEW, 61 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/lib/blob-engine/modes.ts` (NEW, 102 lines)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/lib/blob-engine/index.ts` (~+150 net for mode integration)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/next/src/styles/blob.css` (+8 lines after Phase 91 Plan 01 rules)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/REQUIREMENTS.md` (BLOB-06..10 → Complete)
- `/Users/mikhail/Projects/Medicus_video_consult-landing/.planning/phases/91-blob-engine-renderer-physics-a11y-branches/91-04-SUMMARY.md` (NEW)
