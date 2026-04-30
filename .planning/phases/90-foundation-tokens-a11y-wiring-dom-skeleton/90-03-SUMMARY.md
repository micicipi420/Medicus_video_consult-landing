---
phase: 90-foundation-tokens-a11y-wiring-dom-skeleton
plan: 03
subsystem: design-system
tags: [design-doc, anti-patterns, z-index-contract, cta-opaque, foundation, v9.0, FND-04, FND-05]
requirements: [FND-04, FND-05]
dependency-graph:
  requires:
    - "Plan 90-01 (DESIGN.md YAML colors:/glass: keys, globals.css :root token append)"
  provides:
    - "DESIGN.md YAML antiPatterns: top-level key (15 entries, machine-readable)"
    - "DESIGN.md ## v9.0 Custom Rules section (z-index 4-band contract + CTA opaque-forever 7-component master list)"
    - "DESIGN.md ## v9.0 Anti-Patterns section (15 numbered entries, expanded with name/why/manifests/do-instead)"
  affects:
    - "Plan 90-02 (liquid-glass.css @a11y-layer-coverage block) — comment block cross-references DESIGN.md > v9.0 Custom Rules"
    - "Phase 91-94 planners — MUST grep ## v9.0 Anti-Patterns before generating tasks"
    - "Phase 92 (glass sweep) — uses CTA opaque-forever 7-component list as physical-verification checklist"
tech-stack:
  added: []
  patterns:
    - "Token mirror: machine-readable YAML antiPatterns: ↔ human-readable markdown body (DESIGN.md spec compliance)"
    - "Documentation cross-reference: liquid-glass.css comment block points back to DESIGN.md v9.0 Custom Rules"
key-files:
  created: []
  modified:
    - "DESIGN.md"
decisions:
  - "Both formats shipped (Decision D) — YAML antiPatterns: for grep/programmatic checks, markdown body for human rationale; both contain exactly 15 entries, body expands each YAML entry with where-it-manifests + do-instead"
  - "CTA master list (Decision C) shipped verbatim with 7 components — HeroHub, FinalCTA, ContactForm, StickyBar, Header phone CTA, LeadFormSection, .btn-primary catch-all"
  - "Z-index contract (FND-04) shipped as 4-band table: z-0 / z-1..10 / z-50+ / z-100+; numbers outside bands require Key Decision in PROJECT.md"
metrics:
  duration: ~4 minutes
  completed: 2026-04-30T06:47:30Z
  tasks-completed: 3
  files-modified: 1
  files-created: 0
  files-deleted: 0
  commits: 3
---

# Phase 90 Plan 03: v9.0 DESIGN.md Custom Rules + Anti-Pattern Appendix Summary

**One-liner:** Locked v9.0 design contract additions into DESIGN.md — z-index 4-band contract, CTA opaque-forever rule with 7-component master list, and the 15-entry anti-pattern register in both machine-readable YAML (`antiPatterns:` key) and human-readable markdown body (`## v9.0 Anti-Patterns`).

## Outcome

Plan 90-03 closes FND-04 (z-index contract) and FND-05 (anti-pattern appendix + CTA opaque-forever rule) by appending exactly three additions to `DESIGN.md` — strictly additive, zero existing-content modifications. The `antiPatterns:` YAML key gives Phase 91-94 planners a `grep`-friendly artifact; the `## v9.0 Custom Rules` and `## v9.0 Anti-Patterns` body sections give human reviewers (and the same downstream planners) the rationale, manifestation surface, and prescribed alternative for each pattern. The 7-component CTA master list is the documentation half of T-90-02 mitigation; Plan 90-02 carries the CSS-comment half.

## Tasks Executed

| Task | Name | Commit |
|------|------|--------|
| 1 | Append `antiPatterns:` YAML key to DESIGN.md front matter (15 entries) | `9e0be25` |
| 2 | Append `## v9.0 Custom Rules` body section (z-index contract + CTA 7-component list) | `a0d040e` |
| 3 | Append `## v9.0 Anti-Patterns` body section (15 numbered entries, expanded) | `4f6f2be` |

## Files Modified

### `DESIGN.md`

**File grew 612 → 740 lines (+128 insertions, 0 deletions). Strictly additive — `git diff --stat HEAD~3 HEAD -- DESIGN.md` shows `1 file changed, 128 insertions(+)`.**

Three insertions, in order of file position:

| Section | Line range (after all 3 commits) | What it contains |
|---------|----------------------------------|------------------|
| `antiPatterns:` YAML key | lines 279–325 (47 lines) | Top-level YAML key inserted between `components:` block end and the closing `---` of front matter. 15 entries; each has `name`, `why`, `addedIn: "v9.0 Phase 90"`. |
| `## v9.0 Custom Rules` body section | lines 662–705 (44 lines) | Appended after `## References`. Three subsections: `### Z-index contract (FND-04)` with 4-band table, `### CTA opaque-forever rule (FND-05)` with 7-numbered master list + enforcement notes, `### Source artifacts` with cross-refs. |
| `## v9.0 Anti-Patterns` body section | lines 706–740 (35 lines) | Appended after `## v9.0 Custom Rules`. 15 numbered entries formatted `N. **Name.** Why: ... Where it manifests: ... Do instead: ...`. |

**Other DESIGN.md content (lines 1–278 of front matter excluding the new `antiPatterns:` block, and body lines 282–612 of original content) is byte-identical to its post-Plan 90-01 state.**

## Acceptance Criteria

All gates from `<acceptance_criteria>` across all three tasks pass:

| Gate | Result |
|------|--------|
| Task 1 — `grep -E '^antiPatterns:' DESIGN.md` | 1 ✓ |
| Task 1 — `awk` range count of `^  - name:` under `antiPatterns:` | 15 ✓ |
| Task 1 — `awk` range count of `^    why:` under `antiPatterns:` | 15 ✓ |
| Task 1 — `awk` range count of `^    addedIn: "v9.0 Phase 90"` under `antiPatterns:` | 15 ✓ |
| Task 2 — `grep -E '^## v9\.0 Custom Rules' DESIGN.md` | 1 ✓ |
| Task 2 — three `### ` subsections (Z-index contract / CTA opaque-forever rule / Source artifacts) | 3 ✓ |
| Task 2 — distinct z-index values present (z-0, z-10, z-50, z-100) | 4 ✓ |
| Task 2 — numbered CTA list count | 7 ✓ |
| Task 2 — CTA component-name matches | 9 (≥7 required) ✓ |
| Task 3 — `grep -E '^## v9\.0 Anti-Patterns' DESIGN.md` | 1 ✓ |
| Task 3 — body numbered-entry count `^[0-9]+\. \*\*` | 15 ✓ |
| Task 3 — entry 11 (backdrop-filter on `.living-blob-field`) — lenient match | 1 ✓ (see note below on planner regex) |
| Task 3 — entry 12 (`Mobile blur >12px`) | 1 ✓ |
| Task 3 — entry 14 (`Adding a new glass class`) | 1 ✓ |
| Cross-task — YAML count == body count | 15 == 15 ✓ |
| Build sanity — `cd next && pnpm build` | exit 0, all 11 pages built, no warnings ✓ |

**Note on entry 11 grep:** The planner-supplied regex was `^11\. \*\*.*backdrop-filter on .*\.living-blob-field` (literal text "backdrop-filter on `.living-blob-field`" with backticks NOT in the regex). The actual entry shipped per the planner's own `<action>` block uses backticks around code identifiers: `` 11. **`backdrop-filter` on `.living-blob-field` itself.** ``. The strict regex returns 0 matches because of the backtick characters; the lenient regex `.*backdrop-filter.*living-blob-field` returns 1. Same gate-vs-action inconsistency class as Plan 90-01 logged. Content is verbatim from the plan — not a deviation.

## Deviations from Plan

None. Plan executed exactly as written. The acceptance-criteria note above is a regex-vs-content syntax inconsistency in the planner's gate, not an execution deviation — the body entry text is verbatim from the plan's `<action>` block.

## Auth Gates

None encountered.

## Threat Flags

None. Documentation-only change to DESIGN.md. No runtime code, no network, no auth, no trust-boundary changes. The plan's threat register correctly classified T-90-02 (CTA invisibility regression) and T-90-01 (a11y bypass) as `mitigate (documentation)` — both threats now have their documentation half landed (CTA opaque-forever rule + anti-pattern entry #14). The CSS-enforcement halves are owned by Plan 90-02 (`liquid-glass.css` `@a11y-layer-coverage` block).

## Known Stubs

None. All 15 anti-pattern entries are concrete (with TZ section refs and project-history phase citations). Z-index contract bands are concrete integers. CTA master list names 7 concrete components plus a catch-all clause for future `.btn-primary` consumers. No TODO / placeholder / "coming soon" content. The KD-v9-001 `pending` marker on `--blob-hot` is unchanged from Plan 90-01 (Plan 90-05 owns the PROJECT.md Key Decisions row, not this plan).

## Self-Check: PASSED

Verified via:
- `git log --oneline -4` shows commits `4f6f2be`, `a0d040e`, `9e0be25` on branch `feat/v3.1`, plus the prior `21c9ae0` STATE record commit.
- `grep -nE '^(antiPatterns:|## v9\.0 (Custom Rules|Anti-Patterns))' DESIGN.md` returns 3 expected matches at lines 279, 662, 706.
- `awk` range checks for YAML field shape and body numbered-entry count both yield 15.
- `git diff --stat HEAD~3 HEAD -- DESIGN.md` shows `1 file changed, 128 insertions(+)` — zero deletions, no other files touched (scope boundary respected: nothing modified in `next/src/app/globals.css`, `next/src/styles/`, `next/src/components/`, or DESIGN.md YAML `colors:`/`glass:` keys).
- `git diff --diff-filter=D --name-only HEAD~3 HEAD` empty.
- `cd next && pnpm build` exits 0 with all 11 routes building, no new warnings.

## Next

Plan 90-04 — `layout.tsx` DOM skeleton (`<div class="living-blob-field">` with 4 sublayer children, inline `<style>` seed, MeshBackground deletion + import removal).
