---
phase: 90
slug: foundation-tokens-a11y-wiring-dom-skeleton
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-30
---

# Phase 90 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Phase 90 ships zero runtime JS code; verification is **static-grep + build-success + manual visual smoke**. Full architecture in `90-RESEARCH.md` `## Validation Architecture`.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Phase 90 ships zero runtime JS code; project has no Vitest/Playwright configured for components. Verification is static-grep + build-success + manual visual smoke. |
| **Config file** | None — see "Wave 0 Requirements" below; no framework introduction in Phase 90 (deferred to v9.1+ tooling phase per CONTEXT.md `<deferred>`). |
| **Quick run command** | `cd next && pnpm build` |
| **Full suite command** | Composite — see `scripts/verify-phase-90.sh` (created in Wave 1) which chains all 17 grep checks + `pnpm build` + reports manual-route-smoke checklist. |
| **Estimated runtime** | ~30-90s warm cache; ~120s cold |

---

## Sampling Rate

- **After every task commit:** Run `cd next && pnpm build` (catches TS/CSS regressions immediately)
- **After every plan wave:** Run all 17 grep validations from `90-RESEARCH.md` + `pnpm build` + manual route smoke (5 routes)
- **Before `/gsd-verify-work`:** All 17 checks green AND `90-VERIFICATION.md` records user attestation that `/test-glass` was viewed and `KD-v9-001` either updated to `approved` or alternate hex proposed
- **Max feedback latency:** ~90 seconds for build; grep checks are O(ms)

---

## Per-Task Verification Map

> Source: `90-RESEARCH.md` `## Validation Architecture` → `### Phase Requirements → Test Map`. Task IDs assigned during planner pass.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 90-01-01 | 01 | 1 | FND-01 | — | All 5 `--blob-*` palette tokens present in DESIGN.md YAML AND `globals.css :root` | static-grep | `diff <(grep -oE '\-\-blob-[a-z]+' next/src/app/globals.css \| sort -u) <(awk '/^colors:/,/^[a-z]+:/' DESIGN.md \| grep -oE 'blob-[a-z]+' \| sed 's/^/--/' \| sort -u)` exit 0 | ✅ | ⬜ pending |
| 90-01-02 | 01 | 1 | FND-02 | — | 4 glass tiers × {fill,blur} × {desktop,mobile}; mobile blur ≤12px | static-grep + arithmetic | `grep -E '\-\-glass-(section\|card\|form\|button)-(fill\|blur):' next/src/app/globals.css \| wc -l` → 8 ; `grep -E '\-\-glass-[a-z]+-blur:' next/src/app/globals.css \| grep -vE 'clamp\(12px,'` empty | ✅ | ⬜ pending |
| 90-02-01 | 02 | 2 | FND-03 | T-90-01 (a11y bypass) | A11y `@layer` block covers every glass class via `@a11y-layer-coverage` markers | static-grep coverage check (3-step) | See `90-RESEARCH.md` §FND-03 row | ✅ | ⬜ pending |
| 90-03-01 | 03 | 1 | FND-04 | — | Z-index contract present in DESIGN.md (z-0/z-1..10/z-50+/z-100+) | static-grep | `grep -A 5 'v9.0 Custom Rules' DESIGN.md \| grep -E 'z-?(0\|10\|50\|100)'` ≥4 | ✅ | ⬜ pending |
| 90-03-02 | 03 | 1 | FND-05 (body) | — | DESIGN.md `## v9.0 Anti-Patterns` body, 15 numbered entries | static-grep | `awk '/^## v9.0 Anti-Patterns/,/^## /' DESIGN.md \| grep -cE '^[0-9]+\.'` ≥15 | ✅ | ⬜ pending |
| 90-03-03 | 03 | 1 | FND-05 (yaml) | — | `antiPatterns:` YAML field, 15 entries | static-grep | `awk '/^antiPatterns:/,/^[a-z]+:/' DESIGN.md \| grep -c '^\s*- name:'` =15 | ✅ | ⬜ pending |
| 90-03-04 | 03 | 1 | FND-05 (cta-list) | T-90-02 (CTA invisibility) | DESIGN.md "v9.0 Custom Rules" enumerates 7 CTA opaque-forever components | static-grep | `awk '/CTA opaque-forever/,/^### /' DESIGN.md \| grep -cE '^[0-9]+\.\s'` ≥7 | ✅ | ⬜ pending |
| 90-03-05 | 03 | 2 | FND-05 (cta-comment) | T-90-02 | `liquid-glass.css` carries CTA-opaque comment block within `@a11y-layer-coverage` markers | static-grep | `awk '/@a11y-layer-coverage:start/,/@a11y-layer-coverage:end/' next/src/styles/liquid-glass.css \| grep -F 'CTA opaque-forever rule'` =1 | ✅ | ⬜ pending |
| 90-04-01 | 04 | 2 | FND-06 (skeleton) | — | `<div class="living-blob-field" aria-hidden="true" data-engine-active="false">` with 4 children | static-grep | `grep -c 'className="living-blob-field"' next/src/app/layout.tsx` =1 ; `grep -c 'blob-sublayer' next/src/app/layout.tsx` =4 | ✅ | ⬜ pending |
| 90-04-02 | 04 | 2 | FND-06 (seed) | — | Inline `<style>` seed first child of `<body>` with all 8 vars | static-grep | `grep -E '<style>.*--blob-x.*--blob-y.*--blob-heat' next/src/app/layout.tsx` =1 | ✅ | ⬜ pending |
| 90-04-03 | 04 | 2 | FND-06 (cleanup) | — | `MeshBackground.tsx` deleted; no import refs | filesystem + grep | `test ! -f next/src/components/layout/MeshBackground.tsx && ! grep -q 'MeshBackground' next/src/app/layout.tsx` exit 0 | ✅ | ⬜ pending |
| 90-04-04 | 04 | 3 | FND-06 (smoke) | — | Page renders without runtime errors on `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts` | manual visual smoke | DevTools console clean on all 5 routes in `pnpm dev` | ✅ | ⬜ pending |
| 90-04-05 | 04 | 3 | FND-06 (build) | — | `pnpm build` passes with zero new warnings vs v8.1 baseline | build-success | `cd next && rm -rf .next && pnpm build 2>&1 \| tee /tmp/build.log; grep -E '(warn\|Error)' /tmp/build.log` (manual diff vs baseline) | ✅ | ⬜ pending |
| 90-05-01 | 05 | 1 | FND-07 (kd-log) | — | KD-v9-001 row in PROJECT.md Key Decisions table, status `pending` | static-grep | `grep -E 'KD-v9-001.*--blob-hot.*#4FE098.*pending' .planning/PROJECT.md` =1 | ✅ | ⬜ pending |
| 90-05-02 | 05 | 1 | FND-07 (swatch) | — | `/test-glass` route renders blob-hot comparison swatch | static-grep + manual visual | `grep -F '#4FE098' next/src/app/test-glass/page.tsx` ≥1 ; manual: 3-color swatch row labeled | ✅ | ⬜ pending |
| 90-cross-01 | (any) | 3 | Cross-cutting | — | No new dependencies | filesystem diff | `cd next && git diff --stat package.json pnpm-lock.yaml` empty | ✅ | ⬜ pending |
| 90-cross-02 | (any) | 3 | Cross-cutting | — | Visual diff vs v8.1 acceptable on `/` | manual visual smoke | Side-by-side; header/hero/stats/services unchanged; blob ambient softer than MeshBackground | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] No framework install needed — phase ships zero runtime JS, all checks are grep + build-success
- [x] No new fixtures — all references resolve against existing repo files (DESIGN.md, globals.css, liquid-glass.css, layout.tsx, PROJECT.md, test-glass/page.tsx)
- [ ] `scripts/verify-phase-90.sh` — Wave 1 helper script that chains all 17 grep checks; emits exit 0/1 summary. **NOT BLOCKING — can be authored in Wave 1 plan task as a dev-experience aid.**

*Existing infrastructure covers all phase requirements; no test framework install required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Page renders without runtime errors on 5 main routes | FND-06 | No Playwright in repo (deferred to v9.1+ per CONTEXT.md `<deferred>`); 5-route DevTools smoke is fastest reliable verification | Open `pnpm dev`; navigate `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`; confirm DevTools console has zero new errors/warnings vs v8.1 baseline |
| Visual diff vs v8.1 acceptable | FND-06 visual parity note | No automated visual regression framework; "softer ambient" is judgment call documented in CONTEXT.md | Side-by-side screenshots `/` before+after; header/hero/stats/services pixel-identical; blob area softer than MeshBackground (acceptable) |
| `/test-glass` swatch shows distinguishable greens | FND-07 (swatch) | Color perception is human-judgment | Open `/test-glass`; confirm 3 swatches labeled (`--mu-primary #35B678`, `--blob-hot #4FE098`, medicusunion.com brand reference); confirm `--blob-hot` reads as a slightly-cooler/brighter green |
| `KD-v9-001` approval gate before Phase 91 | FND-07 (KD log) | Color brand approval is product-owner judgment | User views `/test-glass`, decides approve/alternate-hex; updates `KD-v9-001` status in PROJECT.md from `pending` → `approved` (or proposes alternate hex with rationale) |
| `prefers-reduced-motion` / `-transparency` / `prefers-contrast: more` honored on new classes | FND-03 | OS-toggle test cannot be reliably automated in static analysis (Phase 89 cheat-pass lesson) | macOS: System Settings → Accessibility → Display → Reduce motion / Reduce transparency / Increase contrast; reload `/`; confirm `.living-blob-field` invisible (transparency) or static-engine-off (motion); document outcome in `90-VERIFICATION.md` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (none — phase has no MISSING refs)
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter
- [ ] `90-VERIFICATION.md` includes user attestation for the 5 manual-only checks above

**Approval:** pending
