---
phase: 91
slug: blob-engine-renderer-physics-a11y-branches
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-30
---

# Phase 91 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Phase 91 ships canvas + JS engine code; verification is **static-grep + build-success + dev-server runtime spot-check + manual a11y attestation**. Full architecture in `91-RESEARCH.md` `## Validation Architecture` (50+ row map).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Phase 91 introduces no test runner; Phase 94 is the Playwright gate per CONTEXT.md `<deferred>`. Verification is static-grep + build-success + dev-server runtime spot-check + manual a11y OS-toggle attestation. |
| **Config file** | None |
| **Quick run command** | `cd next && pnpm build` |
| **Full suite command** | `cd next && pnpm build && pnpm dev` (manual `__blobDebug.rafCount === 1` check after navigation cycle) |
| **Estimated runtime** | ~30-90s build (warm cache); manual smoke ~5min for 5 routes + a11y toggles |

---

## Sampling Rate

- **After every task commit:** `cd next && pnpm build` (catches TS/lint regressions immediately); inline static-grep gates per task `<acceptance_criteria>`
- **After every plan wave:** full validation map row execution + manual route smoke
- **Before `/gsd-verify-work`:** all 50+ rows green; manual a11y attestation logged in `91-VERIFICATION.md`; Playwright runtime assertions deferred to Phase 94 but pre-flighted via DevTools console here
- **Max feedback latency:** ~90s for build; grep checks O(ms); runtime spot-checks ~30s per route

---

## Per-Task Verification Map

> Source: `91-RESEARCH.md` `## Validation Architecture` → `### Phase Requirements → Validation Map`. Task IDs assigned during planner pass.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 91-01-* | 01 | 1 | BLOB-01 | T-91-01 | Canvas 2D shell present, mounted as 5th sibling | static-grep | `grep -c "^'use client'" next/src/components/effects/LivingBlobField.tsx` =1 ; `grep -A6 'data-engine-active="false"' next/src/app/layout.tsx \| grep -c 'LivingBlobField'` =1 ; `grep -c '\.blob-canvas' next/src/styles/blob.css` ≥3 | NEW | ⬜ pending |
| 91-02-* | 02 | 2 | BLOB-02 | — | Single rAF + single pointermove listener, lerp factors locked | static-grep + build | `grep -rE "addEventListener\(['\"]pointermove" next/src/lib/blob-engine \| wc -l` =1 ; `grep -rE "requestAnimationFrame\(" next/src/lib/blob-engine/index.ts \| wc -l` ≥1 ; `grep -E 'LERP_CORE\s*=\s*0\.18' next/src/lib/blob-engine/physics.ts` match ; `grep -B2 -A2 "pointermove" next/src/lib/blob-engine/index.ts \| grep -c 'passive: true'` ≥1 ; `grep -E 'useState\|useReducer' next/src/components/effects/LivingBlobField.tsx` empty ; `grep -c "documentElement.style.setProperty" next/src/lib/blob-engine/index.ts` ≥5 | NEW | ⬜ pending |
| 91-03-* | 02 | 2 | BLOB-03 | T-91-02 | Singleton refcount + AbortController teardown survives Strict Mode + App Router | static-grep + runtime | `grep -c "refcount" next/src/lib/blob-engine/index.ts` ≥3 ; `grep -c "AbortController" next/src/lib/blob-engine/index.ts` ≥1 ; runtime: `__blobDebug.rafCount === 1` after `/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/` | NEW | ⬜ pending |
| 91-04-* | 03 | 3 | BLOB-04 | — | Heat constants + dwell threshold lock; reduced-motion bail | static-grep + runtime | `HEAT_RAMP_MS=2000`, `HEAT_DECAY_MS=800`, `DWELL_THRESHOLD=30`, `DWELL_WINDOW=250` ; runtime: dwell 2s → `__blobDebug.heat ≥0.8`; resume 1s → `<0.1` | NEW | ⬜ pending |
| 91-05-* | 03 | 3 | BLOB-05 | — | Velocity tracker + low-pass filter + shape stretch | static-grep | `grep -c 'updateVelocity' physics.ts` ≥1 ; `VELOCITY_ALPHA=0.15` match ; `grep -E 'velocity' canvas-renderer.ts` ≥1 | NEW | ⬜ pending |
| 91-06-* | 04 | 4 | BLOB-06 | T-91-03 | Mobile Lissajous + tap-pulse + scroll-pause | static-grep + mobile-mode runtime | `LISSAJOUS_PERIOD_X=17000`, `LISSAJOUS_PERIOD_Y=23000`, `TAP_PULSE_RATE_LIMIT_MS=600`, `TAP_PULSE_DECAY_MS=380` ; interactive selector grep ; `scrollPaused` ref ≥2 ; runtime: DevTools iPhone mode → `__blobDebug.mode === 'ambient'` | NEW | ⬜ pending |
| 91-07-* | 04 | 4 | BLOB-07 | T-91-04 | Reduced-motion = no listener / no rAF / static fallback | static-grep + manual a11y | `grep -B2 -A6 "prefers-reduced-motion" modes.ts \| grep -c "static"` ≥1 ; **manual:** macOS Reduce Motion ON → reload `/` → `<html data-blob-mode="static">`, no canvas paints | NEW | ⬜ pending |
| 91-08-* | 04 | 4 | BLOB-08 | T-91-04 | Reduced-transparency = blob hidden | static-grep + manual a11y | `grep -c "prefers-reduced-transparency" modes.ts` ≥1 ; **manual:** macOS Reduce Transparency ON → reload → `.living-blob-field` not visible, `data-blob-mode="hidden"` | NEW | ⬜ pending |
| 91-09-* | 04 | 4 | BLOB-09 | T-91-04 | Dark theme dimming (opacity 0.30, saturate 0.65, follow disabled) | static-grep + runtime | `\[data-theme="dark"\].*\.blob-canvas` rule in blob.css ; `opacity: 0.30` + `saturate(0.65)` match ; runtime: set `data-theme="dark"`, cursor move does NOT change `--blob-x` | EDIT (blob.css) | ⬜ pending |
| 91-10-* | 03 | 3 | BLOB-10 | — | Pointer-leave 800ms decay + `data-blob-mode` attribute writes | static-grep + runtime | `LEAVE_DECAY_MS=800` ; `data-blob-mode` writes ≥1 ; runtime: cursor outside window → mode flips `cursor → ambient` after 800ms | NEW | ⬜ pending |
| 91-11-* | 02 | 2 | BLOB-11 | — | Page Visibility integration — pause/resume rAF | static-grep + runtime | `grep -c "visibilitychange" index.ts` ≥1 ; `cancelAnimationFrame` in handler ≥1 ; runtime: tab switch → resume increments `__blobDebug.frameCount` | NEW | ⬜ pending |
| 91-12-* | 05 | 5 | BLOB-12 | — | Dev-only `__blobDebug` (NOT in prod bundle) | static-grep + build | DevTools dev: `typeof window.__blobDebug === 'object'` ; **build:** `grep -r "__blobDebug" .next/static/chunks/*.js \| wc -l` =0 ; `grep -c "process.env.NODE_ENV" debug.ts` ≥1 | NEW | ⬜ pending |
| 91-frozen-01 | * | 5 | FROZEN | — | `liquid-glass.css` byte-equivalent | git diff | `git diff HEAD -- next/src/styles/liquid-glass.css` empty | EXISTS | ⬜ pending |
| 91-frozen-02 | * | 5 | FROZEN | — | `globals.css` token blocks unchanged | git diff | `git diff HEAD -- next/src/app/globals.css` empty | EXISTS | ⬜ pending |
| 91-frozen-03 | * | 5 | FROZEN | — | `useSpecularHighlight.ts` byte-equivalent | git diff | `git diff HEAD -- next/src/hooks/use-specular-highlight.ts` empty | EXISTS | ⬜ pending |
| 91-frozen-04 | * | 5 | FROZEN | — | `blob.css` lines 1-79 byte-equivalent (Phase 90 static-state) | git diff | `head -79 next/src/styles/blob.css \| diff - <(git show HEAD~N:next/src/styles/blob.css \| head -79)` empty | EXISTS | ⬜ pending |
| 91-build-01 | * | 5 | BUILD | — | `pnpm build` zero new warnings vs Phase 90 baseline | build-success | `cd next && rm -rf .next && pnpm build 2>&1 \| tee /tmp/build-91.log; echo $?` =0 | — | ⬜ pending |
| 91-build-02 | * | 5 | BUILD | — | All 11 routes generate | build-success | route count in build log matches Phase 90 baseline (11) | — | ⬜ pending |
| 91-build-03 | * | 5 | BUILD | — | Zero new dependencies | git diff | `git diff HEAD -- next/package.json next/pnpm-lock.yaml` empty | — | ⬜ pending |
| 91-runtime-01 | 05 | 5 | RUNTIME | T-91-05 | All 5 routes render without console errors | runtime spot-check | Playwright walks `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts` ; DevTools console errors = baseline (3 pre-existing SVG bugs from Phase 67.1/72 acceptable; no new errors) | — | ⬜ pending |
| 91-runtime-02 | 05 | 5 | RUNTIME | — | App Router leak guard verified | runtime spot-check | After 5-route navigation cycle: `__blobDebug.rafCount === 1` AND `__blobDebug.listenerCount === 1` | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] No framework install needed — Phase 91 ships zero-new-dep per Decision M / success criterion 8 / CONTEXT.md frozen-range contract
- [x] No new fixtures — references resolve against Phase 90 artifacts (`<div class="living-blob-field">` skeleton, `--blob-*` tokens, `blob.css` static state, `data-engine-active` toggle)
- [x] No watch-mode flags introduced — all gates run on demand
- [ ] Playwright UAT scaffolding deferred to Phase 94 per CONTEXT.md `<deferred>` — Phase 91 verification is dev-server runtime spot-check via DevTools console + Playwright DOM-evaluate calls (not a full UAT suite)

*Existing infrastructure covers all Phase 91 requirements; no test framework install required; Phase 91 must remain zero-new-dep.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `prefers-reduced-motion: reduce` honored on engine code paths | BLOB-07 | OS-toggle test cannot be reliably automated in static analysis (Phase 89 cheat-pass lesson) — reduce-motion code path must be exercised live | macOS: System Settings → Accessibility → Display → Reduce motion ON; reload `/`; in DevTools console: `window.__blobDebug.mode === 'static'`; verify NO canvas paint, static-state CSS sublayers visible. Document outcome in `91-VERIFICATION.md`. |
| `prefers-reduced-transparency: reduce` honored | BLOB-08 | Same OS-toggle constraint | macOS: System Settings → Accessibility → Display → Reduce transparency ON; reload `/`; `__blobDebug.mode === 'hidden'`; `.living-blob-field` not visible (Phase 90 CSS already enforces). |
| `prefers-contrast: more` honored | implicit | Same OS-toggle constraint | macOS: System Settings → Accessibility → Display → Increase contrast ON; reload `/`; verify a11y `@layer` block from Phase 90 takes effect across glass surfaces (no Phase 91 specific assertions but verify no regression). |
| Dark theme branch (`[data-theme="dark"]`) | BLOB-09 | Theme toggling must be exercised; saturation/opacity values are visual judgment | In DevTools, set `<html data-theme="dark">`; verify canvas dimmed (opacity ~0.30, saturation ~0.65); cursor movement does NOT change `--blob-x` (follow disabled in dark mode); `__blobDebug.mode === 'dark'`. |
| Mobile Lissajous + tap-pulse | BLOB-06 | Touch-device behavior; Playwright touch emulation deferred to Phase 94 | Open DevTools device-mode iPhone 14 Pro; reload `/`; verify `__blobDebug.mode === 'ambient'`; tap on background → `__blobDebug.heat` jumps briefly then decays; tap on CTA button → no pulse (interactive selector exclusion); rapid taps → max 1 per 600ms. |
| Heat ramp on cursor dwell | BLOB-04 | Visual judgment ("medical, calm, ≤1.4× peak") | Park cursor on `/` for 2s; observe `__blobDebug.heat` rises 0→~0.8; observe blob core color shifts toward `--blob-hot` (mintier green); resume motion → heat decays smoothly within 1s. Verify peak luminance/scale delta ≤1.4× by visual comparison. |
| Page Visibility pause/resume | BLOB-11 | Tab-switch is a manual flow | Switch tab away for 5s; return; observe `__blobDebug.frameCount` increments after return (was paused, now resumed); no jitter on resume. |
| App Router leak guard | BLOB-03 | Multi-navigation flow requires manual orchestration | Walk: `/` → `/checkup` → `/consultations` → `/treatment-abroad` → `/`; in DevTools console after final landing: `window.__blobDebug.rafCount` =1 AND `window.__blobDebug.listenerCount` =1. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (none — phase is zero-new-dep)
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter
- [ ] `91-VERIFICATION.md` includes user attestation for the 8 manual-only checks above

**Approval:** pending
