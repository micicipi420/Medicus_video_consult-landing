# Phase 90 Discussion Log

**Date:** 2026-04-30
**Phase:** 90 — Foundation: Tokens, A11y Wiring, DOM Skeleton
**Mode:** discuss (claude-decided)
**Duration:** Single turn — user delegated all decisions after gray-area presentation.

## Context Loaded

- `.planning/PROJECT.md` — milestone v9.0 active
- `.planning/REQUIREMENTS.md` — FND-01..07 (locked)
- `.planning/STATE.md` — phase 90, planning ready
- `.planning/ROADMAP.md` — Phase 90 success criteria
- `.planning/research/SUMMARY.md` — research synthesis (HIGH confidence, supersedes v7.0)
- `design/LIQUID_GLASS_BLOB_TZ.md` — primary spec
- `DESIGN.md` (repo root) — hard constraints
- `next/src/app/layout.tsx` — current mount order
- `next/src/components/layout/MeshBackground.tsx` — deletion target

## Domain Boundary Established

Foundation phase. No visible change. Establishes contract for v9.0 phases 91-94. Most of FND-01..07 prescribed exactly by REQUIREMENTS.md and TZ §5/§9/§11/§17.

## Gray Areas Presented

Four areas presented as multi-select with detail-rich preview block:

1. Sublayer DOM shape
2. `--blob-hot` approval flow
3. CTA opaque-forever scope
4. Anti-pattern appendix format

## User Response

**"you decide"** — Claude was empowered to make the call on all four.

## Decisions Made (Claude-decided)

### A. Sublayer DOM shape
**Selected:** Flat siblings — 4 `<div class="blob-sublayer blob-{role}">` children inside `.living-blob-field`, plus `data-engine-active` attribute as Phase 91 handoff. Phase 91 adds `<canvas>` sibling.
**Rationale:** Simple CSS targeting, TZ §5 vocabulary, clean attribute-based handoff to renderer.

### B. `--blob-hot` approval flow
**Selected:** Manual gate before Phase 91 unlocks. Key Decision `KD-v9-001` logged in PROJECT.md, comparison swatch in `/test-glass`, user signs off in writing.
**Rationale:** Doesn't block Phase 90 ship; brand parity verified before Phase 91 invests in renderer; reversible (single-token edit if rejected).

### C. CTA opaque-forever scope
**Selected:** Master list of 7 CTA elements in DESIGN.md. Enforcement = doc + `liquid-glass.css` comment + PR review. Lint rule deferred to v9.1+.
**Rationale:** Phase 90 establishes the rule; Phase 92 will verify physically; lint tooling is a separate phase.

### D. Anti-pattern appendix format
**Selected:** Both — YAML `antiPatterns` field + markdown body section with 15 entries (TZ §16 + project history).
**Rationale:** YAML is machine-readable for future tooling; markdown is human-readable for reviewers; covers TZ-prescribed AND project-discovered patterns (cheat-pass, MQ bypass, mobile blur regression).

## Folded Clarifications

Resolved without separate user prompts:

- Token registration: both DESIGN.md YAML AND `globals.css` (mirror is mandatory).
- Inline `<style>` seed: first child of `<body>` in JSX (not via Next metadata).
- A11y `@layer` discovery: manual + grep-verified with `@a11y-layer-coverage` markers.
- MeshBackground deletion: hard delete, no archive (git history sufficient).
- Z-index contract: codify verbatim from FND-04.

## Deferred Ideas

- Stylelint/ESLint rule enforcing CTA opaque-forever → v9.1+
- `oklch` migration for new tokens → out of v9.0 scope
- `OffscreenCanvas` rendering → v10+
- Per-route blob color theming → v10+ (brand parity)
- Lint rule for `@a11y-layer-coverage` completeness → v9.1+

## Scope Creep — None

User stayed within Phase 90 boundary. No new capabilities surfaced.

## Canonical Refs Captured

13 file paths registered in CONTEXT.md `<canonical_refs>` — every downstream agent (researcher, planner, executor) has the full reading list with rationale.

## Next Step

`/gsd-plan-phase 90` — generates PLAN.md with task breakdown.
