---
phase: 90-foundation-tokens-a11y-wiring-dom-skeleton
plan: 01
subsystem: design-system
tags: [tokens, css-vars, design-contract, foundation, v9.0, FND-01, FND-02]
requirements: [FND-01, FND-02]
dependency-graph:
  requires: []
  provides:
    - "v9.0 --blob-* palette tokens (CSS runtime)"
    - "v9.0 --glass-* tier tokens (CSS runtime, mobile blur ≤12px clamp)"
    - "v9.0 runtime defaults (--blob-x/y, --blob-body-x/y, --blob-halo-x/y, --blob-heat, --blob-velocity)"
    - "DESIGN.md YAML contract for blob palette + glass tiers"
    - "Wired (commented) @import for next/src/styles/blob.css — Plan 90-02 uncomments after creating the file"
  affects:
    - "Phase 91 (engine) — depends on --blob-* palette and runtime defaults"
    - "Phase 92 (glass sweep) — depends on --glass-*-fill / --glass-*-blur tier tokens"
    - "Plan 90-02 (blob.css creation) — must uncomment the @import line"
    - "Plan 90-03 (DESIGN.md body + antiPatterns) — extends YAML further (top-level antiPatterns: key)"
tech-stack:
  added: []
  patterns:
    - "Token mirror: DESIGN.md YAML ↔ globals.css :root (Pattern S1 from PATTERNS.md)"
    - "Mobile blur floor: clamp(12px, fluid-vw, desktop-ceiling) (Pattern S3)"
key-files:
  created: []
  modified:
    - "next/src/app/globals.css"
    - "DESIGN.md"
decisions:
  - "blob.css @import is shipped commented out (per plan Task 1 step 4 fallback) because Plan 90-02 hasn't created the file yet; pnpm build with an unresolvable @import would fail"
  - "Used corrected awk range query for verification — the planner-supplied awk range gate had a YAML-shape bug (collapses to one line) but the underlying assertions all pass when the awk is corrected"
metrics:
  duration: ~9 minutes
  completed: 2026-04-30T06:40:58Z
  tasks-completed: 2
  files-modified: 2
  files-created: 0
  files-deleted: 0
  commits: 2
---

# Phase 90 Plan 01: Foundation — Tokens (DESIGN.md YAML + globals.css :root) Summary

**One-liner:** Registered v9.0 Living Blob token contract in both the design-system spec (DESIGN.md YAML) and the runtime cascade (globals.css :root) — append-only, mobile blur clamp(12px,…) honored.

## Outcome

Plan 90-01 closes FND-01 (blob palette) and FND-02 (glass tier tokens) by mirror-registering all tokens in DESIGN.md YAML and globals.css :root. No existing token, brand color, or design-system YAML key was modified — strictly additive. The blob.css @import line is wired (commented) into globals.css; Plan 90-02 owns blob.css creation and will uncomment.

## Tasks Executed

| Task | Name | Commit |
|------|------|--------|
| 1 | Append v9.0 tokens to globals.css :root + wire blob.css @import (commented) | `0fb03f1` |
| 2 | Append v9.0 token contract (blob colors + glass tiers) to DESIGN.md YAML | `c827fe9` |

## Files Modified

### `next/src/app/globals.css`
- Added 5 `--blob-*` palette tokens inside `:root` (after existing `--section-padding-desktop`):
  - `--blob-core: #35B678` (alias of `--mu-green-600`)
  - `--blob-hot: #4FE098` (KD-v9-001 — pending)
  - `--blob-halo: rgba(98, 221, 177, 0.5)`
  - `--blob-edge: rgba(125, 205, 255, 0.18)`
  - `--blob-glint: rgba(255, 255, 255, 0.65)`
- Added 8 glass tier tokens (4 fills + 4 blurs); every blur uses `clamp(12px, Nvw, ceiling)`:
  - section: `0.06` fill, `clamp(12px, 2vw, 24px)` blur
  - card: `0.10` fill, `clamp(12px, 1.6vw, 20px)` blur
  - form: `0.14` fill, `clamp(12px, 1.4vw, 18px)` blur
  - button: `0.12` fill, `clamp(12px, 1.2vw, 16px)` blur
- Added 8 runtime defaults: `--blob-x/y`, `--blob-body-x/y`, `--blob-halo-x/y`, `--blob-heat`, `--blob-velocity`
- Inserted `/* @import "../styles/blob.css"; — wired in 90-02 */` after `squircles.css` import line

### `DESIGN.md` (YAML front matter only)
- Inside existing `colors:` block, after semantic aliases, appended a `# ── v9.0 Living Blob palette ──` subsection with 5 `blob-*` keys.
- Added new top-level `glass:` key (between `colors:` and `typography:`) with 4 sub-keys (section, card, form, button), each with `fill: { desktop, mobile }` and `blur: { desktop, mobile }`. All `blur.mobile` values are `"12px"` (Phase 79 cap).
- No existing YAML keys modified. `antiPatterns:` key intentionally NOT added (Plan 90-03 owns that).

## Acceptance Criteria

All gates from `<acceptance_criteria>` pass:

| Gate | Result |
|------|--------|
| `grep -c -- '--blob-core' next/src/app/globals.css` | 1 ✓ |
| `grep -c -- '--blob-hot' next/src/app/globals.css` | 1 ✓ |
| `grep -c -- '--blob-halo' next/src/app/globals.css` | 3 (1 palette + 2 runtime defaults `--blob-halo-x/y` — matches plan's own action block) |
| `grep -c -- '--blob-edge' next/src/app/globals.css` | 1 ✓ |
| `grep -c -- '--blob-glint' next/src/app/globals.css` | 1 ✓ |
| `grep -cE -- '--glass-(section\|card\|form\|button)-(fill\|blur):' next/src/app/globals.css` | 8 ✓ |
| `grep -E -- '--glass-[a-z]+-blur:' next/src/app/globals.css \| grep -v 'clamp(12px,'` | empty ✓ (mobile floor honored) |
| `grep -E '@import "\.\./styles/blob\.css"' next/src/app/globals.css` | 1 ✓ (commented) |
| `grep -E '^glass:' DESIGN.md` | 1 ✓ |
| Corrected awk: blob-* keys in colors: | 5 ✓ |
| Corrected awk: glass: tier sub-keys | 4 ✓ |
| Corrected awk: `mobile: "12px"` count under glass: | 4 ✓ |
| Corrected awk: `desktop:` count under glass: | 8 ✓ (4 fill + 4 blur) |
| `cd next && pnpm build` | exit 0, zero new warnings ✓ |

**Note on grep-gate ambiguity:** The plan's `<acceptance_criteria>` for `--blob-halo` specifies `→ 1`, but the plan's own `<action>` block adds `--blob-halo-x: 50vw;` and `--blob-halo-y: 50vh;` runtime defaults — so substring `--blob-halo` actually matches 3 times. The plan's `<done>` criteria (semantic — "5 palette tokens appear once each with the exact values above") is satisfied, and the literal palette token `--blob-halo:` (with the trailing colon) appears exactly once. Treated as a planner gate-vs-action inconsistency, not a deviation in execution.

**Note on awk gate:** The plan's `awk '/^colors:/,/^[a-z]+:/'` range pattern collapses to a single line because `colors:` matches both the start AND the end pattern simultaneously. Used corrected awk (`/^colors:/{f=1;next} /^[a-z]+:$/ && f {f=0} f`) which validates 5 blob-* keys are correctly nested inside `colors:`. Underlying assertion satisfied.

## Deviations from Plan

None. Plan executed exactly as written. The two notes above are gate-syntax oddities, not execution deviations — the underlying assertions all pass.

The blob.css @import was shipped commented out per the plan's own Task 1 step 4 fallback ("If `pnpm build` actually fails because the @import target doesn't exist yet at build time, COMMENT OUT the `@import "../styles/blob.css";` line with `/* @import "../styles/blob.css"; — wired in 90-02 */` and Plan 02 will uncomment it"). Verified live `pnpm build` would fail without commenting (Tailwind v4 `@import` resolution at build time), so the fallback is the correct path.

## Auth Gates

None encountered.

## Threat Flags

None. Phase 90 ships zero runtime JS for this plan; pure CSS contract additions. No new network, auth, or trust boundaries introduced.

## Known Stubs

None. All tokens are concrete values (no TODO/placeholder/empty hex). The KD-v9-001 `pending` marker on `--blob-hot` is intentional and tracked: it gates Phase 91 planner per Decision B in `90-CONTEXT.md`. Plan 90-05 owns the PROJECT.md Key Decisions row.

## Self-Check: PASSED

Verified via:
- `git log --oneline -5` shows commits `c827fe9` and `0fb03f1` on branch `feat/v3.1`.
- `grep` gates above all return expected values.
- `cd next && pnpm build` exits 0 (final run after Task 2).
- No files deleted (`git diff --diff-filter=D --name-only HEAD~2 HEAD` empty).

## Next

Plan 90-02 — Create `next/src/styles/blob.css` (the static sublayer baseline) and uncomment the `@import "../styles/blob.css";` line in `globals.css`.
