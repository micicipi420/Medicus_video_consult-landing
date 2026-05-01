---
phase: 92-glass-rework-chrome-index-sections
plan: 04
subsystem: next/src/components/sections
tags: [glass, tokens, v9.0, tailwind, hero, stats, services]
requires:
  - 92-01 (token contract: --glass-section-*, --glass-card-*, --glass-form-*, --glass-button-* in globals.css)
  - 92-02 (Wave 1 audit baseline; HeroHub.tsx:48 CTA invariant catalogued)
provides:
  - HeroHub at Tier 0 frame + Tier 1 credibility badge (Tier-1/-2 hover ramp on secondary CTA)
  - StatsBar Phase 82 responsive nesting on v9.0 tokens (mobile Tier 0 wrapper / desktop Tier 1 → Tier 2 hover)
  - ServicesGrid Tier 1 cards with Tier 2 hover; anti-pattern #13 retired (nested-badge blur dropped)
affects:
  - "/" route — hero + stats + services-grid visual surfaces
tech-stack:
  added: []
  patterns:
    - "Tailwind arbitrary-value class swap: bg-[var(--glass-{tier}-fill)] / backdrop-blur-[var(--glass-{tier}-blur)]"
    - "Hover ramp via form-fill token: hover:bg-[var(--glass-form-fill)] for Tier 1 → Tier 2 transitions"
    - "Anti-pattern #13 mitigation: drop nested backdrop-blur, use cosmetic --glass-button-fill chip"
key-files:
  created: []
  modified:
    - next/src/components/sections/HeroHub.tsx
    - next/src/components/sections/StatsBar.tsx
    - next/src/components/sections/ServicesGrid.tsx
decisions:
  - "Decision A applied to HeroHub credibility badge → Tier 1 (UI-SPEC tier, not Tier 0)"
  - "Hover ramp Tier 1 → Tier 2 implemented via --glass-form-fill (sanctioned per PATTERNS.md Archetype C)"
  - "ServicesGrid nested price badge: drop backdrop-blur-md (Option B from PATTERNS.md); keep --glass-button-fill cosmetic chip; parent card backdrop-filter handles optical glass"
metrics:
  duration: ~25 min
  completed: 2026-04-30T11:38:54Z
  tasks-total: 3
  tasks-completed: 3
  files-modified: 3
  commits: 3
---

# Phase 92 Plan 04: Index Sections Wave 2 — HeroHub + StatsBar + ServicesGrid Glass Sweep Summary

**One-liner:** Three index-page section components migrated from hardcoded `bg-white/N` + `backdrop-blur-{value}` to v9.0 glass tier tokens (`--glass-section-*`, `--glass-card-*`, `--glass-form-*`, `--glass-button-*`), with Phase 82 responsive nesting preserved on StatsBar, HeroHub primary CTA + over-photo controls untouched, and the ServicesGrid nested-blur anti-pattern #13 retired by dropping the inner badge's `backdrop-blur-md`.

## Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | HeroHub.tsx — pill (Tier 0), secondary CTA frame (Tier 0 → Tier 1 hover), credibility badge (Tier 1) | `bcdf9c1` | `next/src/components/sections/HeroHub.tsx` |
| 2 | StatsBar.tsx — Phase 82 responsive nesting on v9.0 tokens (mobile Tier 0 / desktop Tier 1 → Tier 2 hover) | `1703df4` | `next/src/components/sections/StatsBar.tsx` |
| 3 | ServicesGrid.tsx — section pill (Tier 0), 4 cards (Tier 1 → Tier 2 hover), nested price badge nesting collapsed | `e9536f1` | `next/src/components/sections/ServicesGrid.tsx` |

## Acceptance Gate Results

### Task 1 — HeroHub.tsx
- `pnpm --dir next build` → 0 (clean)
- `bg-white/40|50|75` → 0 ✓
- `backdrop-blur-[20px|40px]` → 0 ✓
- `bg-[var(--glass-section-fill)]` → 2 (pill + secondary CTA frame) ✓
- `bg-[var(--glass-card-fill)]` → 2 (credibility badge default + secondary CTA hover; the `hover:bg-…` form matches the regex too) ✓
- `hover:bg-[var(--glass-card-fill)]` → 1 (secondary CTA hover ramp) ✓
- `bg-mu-text-900/55` → 3 (over-photo controls preserved verbatim) ✓
- `from-mu-blue to-mu-accent-blue` → 1 (primary CTA preserved) ✓
- CTA invariant: `from-mu-blue to-mu-accent-blue` line has 0 `backdrop` matches ✓ (T-92-04-01 mitigated)

### Task 2 — StatsBar.tsx
- `pnpm --dir next build` → 0 (clean)
- `bg-white/60` → 0 ✓
- `sm:bg-white/60 | sm:hover:bg-white/70` → 0 ✓
- `backdrop-blur-2xl` → 0 ✓
- `bg-[var(--glass-section-fill)]` → 1 (mobile wrapper) ✓
- `sm:bg-[var(--glass-card-fill)]` → 1 (desktop card per stat) ✓
- `sm:hover:bg-[var(--glass-form-fill)]` → 1 (desktop card hover ramp) ✓
- `sm:bg-transparent` → 1 ✓ (Phase 82 responsive switch — T-92-04-02 mitigated)
- `sm:backdrop-blur-none` → 1 ✓ (Phase 82 responsive switch — T-92-04-02 mitigated)

### Task 3 — ServicesGrid.tsx
- `pnpm --dir next build` → 0 (clean)
- `bg-white/40|50|60|70` → 0 ✓
- `backdrop-blur-xl | 2xl | md` → 0 ✓ (nested badge `backdrop-blur-md` DROPPED — T-92-04-03 mitigated)
- `bg-[var(--glass-section-fill)]` → 1 (section pill) ✓
- `bg-[var(--glass-card-fill)]` → 1 (card default) ✓
- `hover:bg-[var(--glass-form-fill)]` → 1 (card hover ramp) ✓
- `bg-[var(--glass-button-fill)]` → 1 (nested price badge cosmetic fill) ✓
- `backdrop-blur-[var(--glass-section-blur|--glass-card-blur)]` → 2 (pill + card) ✓
- Russian copy + `&nbsp;` baselines preserved verbatim:
  - HeroHub.tsx: 13 (unchanged)
  - StatsBar.tsx: 0 (unchanged)
  - ServicesGrid.tsx: 3 (unchanged)

## Threat Mitigations Applied

| Threat | Mitigation | Verified by |
|--------|------------|-------------|
| T-92-04-01 (Hero CTA disappears into blob) | Primary CTA gradient class line untouched; CTA-invariant grep passes | Task 1 acceptance — `from-mu-blue to-mu-accent-blue` line has 0 `backdrop-*` matches |
| T-92-04-02 (StatsBar responsive switch broken) | `sm:bg-transparent sm:backdrop-blur-none` preserved verbatim | Task 2 acceptance — both grep counts ≥1 |
| T-92-04-03 (≤2 glass per viewport on cards) | Nested price badge `backdrop-blur-md` dropped; only parent card backdrop-filter remains | Task 3 acceptance — `backdrop-blur-md` count = 0 |
| T-92-04-04 (Mobile blur >12px) | Token resolution clamps mobile to 12px (Phase 90 frozen contract) | Inherited from 92-01 token contract; no per-file override introduced |
| T-92-04-05 (Over-photo controls accidentally swept) | Lines 94/103/115 left verbatim, Archetype H preserved | Task 1 acceptance — `bg-mu-text-900/55` count = 3 |

## Deviations from Plan

### 1. [Plan-spec mismatch — informational, not Rule N] ServicesGrid `<Link` count gate

- **Found during:** Task 3 acceptance grep
- **Issue:** Plan acceptance criterion: "`grep -c '<Link' next/src/components/sections/ServicesGrid.tsx` returns ≥4 (one per service card; SVC-03 invariant)". Actual count is 1 because the 4 service cards are produced by `SERVICES.map(card => <Link …>)` — a single `<Link` literal in source iterates 4 times at runtime.
- **Fix:** None needed. The runtime semantic — 4 navigable card links — is intact. The plan's grep gate was authored against a hypothetical un-rolled JSX shape; the actual implementation uses array iteration, which is the correct React pattern.
- **Files modified:** None beyond planned changes.
- **Commit:** N/A (no extra commit — gate is informational)

### 2. [Rule 3 — Blocking issue] Worktree `node_modules` missing

- **Found during:** Task 1 build verification
- **Issue:** `pnpm --dir next build` errored with `sh: next: command not found` and `node_modules missing` warning — the parallel-executor worktree did not inherit dependencies.
- **Fix:** Ran `pnpm --dir next install` once (4.6s, no lockfile changes); subsequent builds passed cleanly for all three tasks.
- **Files modified:** None (install only restored existing tracked deps; lockfile unchanged, no commit needed).
- **Commit:** N/A (env restoration, not a code change)

No other deviations. The three class swaps applied per PATTERNS.md per-line tables verbatim.

## Authentication Gates

None encountered. Plan was fully autonomous — no checkpoints, no auth-protected resources.

## Known Stubs

None introduced. All edits are pure class-string substitutions that preserve every existing data binding (Russian copy, `&nbsp;` literals, `iconBg`/`iconText` brand-color tokens, `<Link href>` semantics).

## Threat Flags

None. The class-only sweep introduces no new network endpoints, auth paths, file access patterns, or schema changes. All trust boundaries untouched.

## Self-Check: PASSED

- [x] Created files exist: N/A (no new files)
- [x] Modified files exist:
  - `next/src/components/sections/HeroHub.tsx` (FOUND)
  - `next/src/components/sections/StatsBar.tsx` (FOUND)
  - `next/src/components/sections/ServicesGrid.tsx` (FOUND)
- [x] Commits exist on current branch:
  - `bcdf9c1` (Task 1) — FOUND
  - `1703df4` (Task 2) — FOUND
  - `e9536f1` (Task 3) — FOUND
- [x] `pnpm --dir next build` passes (verified after each task; only pre-existing unrelated ESLint warning in `src/lib/blob-engine/index.ts` — out of scope, logged as out-of-scope per executor scope-boundary rule)
- [x] All Wave 2 token-contract truths from `must_haves.truths` honored
