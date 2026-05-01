---
phase: 91-blob-engine-renderer-physics-a11y-branches
plan: 05
subsystem: engine-debug
tags: [debug, dev-only, tree-shake, blob-engine, v9.0, living-blob]

requires:
  - phase: 91-blob-engine-renderer-physics-a11y-branches
    provides: "Plan 04 — 5 mode branches live; EngineState fully populated"
provides:
  - "debug.ts module: attachDebug + detachDebug, NODE_ENV-guarded, tree-shaken from prod"
  - "window.__blobDebug live getter exposing rafCount, listenerCount, mode, pointer, heat, velocity, startedAt, frameCount"
  - "Phase 94 Playwright leak assertion target ready: window.__blobDebug.rafCount === 1 after 5-route nav"
affects: [phase-94-verification]

requirements-completed: [BLOB-12]
duration: ~5min
completed: 2026-04-30
---

# Phase 91 Plan 05 Summary — Dev-Only Debug Surface

debug.ts ships attachDebug/detachDebug, both NODE_ENV-guarded so prod webpack DefinePlugin tree-shakes the module entirely. Object.defineProperty getter on window.__blobDebug reads engine state via injected getSnapshot callback — Playwright reads any time without staleness.

## Tree-Shake Verification

`grep -r "__blobDebug" .next/static/chunks/*.js` → **0** (production bundle does not contain the literal string). Confirmed.

## Phase 91 Final Status

- 12/12 BLOB requirements code-complete
- 5/5 plans shipped, 5/5 waves
- Programmatic verification via Playwright + DOM-evaluate: PASS
- Manual real-device + live-OS-toggle attestation: deferred to Phase 94 HARD GATE per project policy

## Files Touched

- next/src/lib/blob-engine/debug.ts (NEW, 73 lines)
- next/src/lib/blob-engine/index.ts (+~30 lines for attachDebug/detachDebug call sites)
- .planning/REQUIREMENTS.md (BLOB-12 → Complete)
