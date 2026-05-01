---
phase: 92-glass-rework-chrome-index-sections
plan: 02
subsystem: design-system / glass-rework
tags: [audit, read-only, cta-invariant, baseline, chrome, index]
requires:
  - "Phase 90 v9.0 frozen DESIGN.md (CTA opaque-forever 7-component master list, 15 anti-patterns)"
  - "92-PATTERNS.md (Archetype J definition, cross-cutting CTA-vs-backdrop negative grep)"
  - "92-RESEARCH.md (CTA grep targets file:line table)"
provides:
  - ".planning/phases/92-glass-rework-chrome-index-sections/92-02-AUDIT.md (immutable CTA invariant baseline + Header render status + FinalCTA mix-blend violation flag)"
affects:
  - "Plans 92-03, 92-04, 92-05, 92-06, 92-07 — must preserve every IN-SCOPE CTA className verbatim and re-run negative grep"
  - "Plan 92-08 — must retire FinalCTA.tsx:14 mix-blend-multiply violation"
tech-stack:
  added: []
  patterns:
    - "Read-only audit pattern: produce immutable baseline document; downstream waves grep against it"
    - "Negative-grep gating: CTA gradient ∩ backdrop-* must always be ∅"
key-files:
  created:
    - .planning/phases/92-glass-rework-chrome-index-sections/92-02-AUDIT.md
    - .planning/phases/92-glass-rework-chrome-index-sections/92-02-SUMMARY.md
  modified: []
decisions:
  - "Header.tsx is RENDERED (imported by next/src/app/layout.tsx:5); Plan 92-03 chrome sweep MUST include it — not dead-code skip"
  - "Negative-grep baseline is clean (ZERO MATCHES): no CTA call-site combines brand gradient with backdrop-*; downstream plans gate on this remaining true"
  - "FinalCTA.tsx:14 mix-blend-multiply violation is the single known anti-pattern in audited Phase 92 chrome+index surface; retirement deferred to Plan 92-08"
  - "Legacy `from-mu-cta-from-v6 to-mu-cta-to-v6` token form is unused in current code (zero matches); only `from-mu-blue to-mu-accent-blue` form exists"
metrics:
  duration: "~7 minutes"
  completed: "2026-04-30"
  tasks_completed: 1
  files_created: 2
  files_modified: 0
---

# Phase 92 Plan 02: CTA Invariant + FinalCTA Anti-Pattern Audit — Summary

**One-liner:** Read-only audit lock-in for Phase 92 — captured the verbatim CTA opaque-forever baseline (5 in-scope CTA call-sites + 2 Header surfaces), confirmed `Header.tsx` is rendered (so Plan 92-03 chrome sweep applies), and flagged the lone `mix-blend-multiply` violation at `FinalCTA.tsx:14` for Plan 92-08 retirement.

## What Was Done

| Task | Action | Commit |
|------|--------|--------|
| 1    | Ran two CTA grep audits + negative-grep verification + Header render-status check + FinalCTA mix-blend baseline; wrote `92-02-AUDIT.md` with 5 numbered sections and signed it off | `bb881fe` |

## Key Artifact: `92-02-AUDIT.md`

Five sections, all populated:

1. **CTA invariant grep results** — 21 total grep matches across `sections/` + `layout/`; 7 marked IN-SCOPE (Phase 92), 11 marked OUT-OF-SCOPE (Phase 93 routes), 2 marked decorative-data-literal (not CTA call-sites). The 5 plan-named call-sites + 2 Header surfaces are listed with their full verbatim `className=` strings as the immutable baseline for downstream waves.
2. **Negative-grep baseline** — `grep 'backdrop-*' <5 in-scope files> | grep -E 'gradient-to-r|from-mu-blue|from-mu-cta'` → **ZERO MATCHES**. CTA opaque-forever invariant satisfied at audit time. Adjacent backdrop surfaces (badges, drawers, secondary CTAs, frame chrome) inventoried for reference.
3. **Header.tsx render status** — `RENDERED` (imported at `next/src/app/layout.tsx:5`). Plan 92-03 chrome sweep must include it; both gradient call-sites at lines 14 and 53 are part of the locked baseline.
4. **FinalCTA mix-blend-multiply violation** — verbatim source embedded (line 14: `bg-mu-blue/30 ... mix-blend-multiply` decorative blob). Anti-pattern #8 violation flagged with deferral note to Plan 92-08 (retire entire `<div>` OR drop only `mix-blend-multiply` and sanction with PROJECT.md Key Decision). All other IN-SCOPE files confirmed `mix-blend-*`-free.
5. **Sign-off** — `AUDIT COMPLETE: 2026-04-30`. Downstream consumption map ties each later plan (92-03..92-08) to the section it inherits.

## Verification Results

- `test -f .planning/phases/92-glass-rework-chrome-index-sections/92-02-AUDIT.md` → PASS
- `grep -c 'AUDIT COMPLETE' .../92-02-AUDIT.md` → 1 (sign-off present)
- `git status --porcelain next/src/` → empty (read-only contract upheld)
- `pnpm --dir next build` → exits 0; all 11 routes generated; no source regression

## Deviations from Plan

None — plan executed exactly as written, with one purely environmental Rule 3 fix:

- **[Rule 3 — Blocking issue] Installed Next workspace dependencies before build verify.** The fresh worktree had no `next/node_modules`, so `pnpm --dir next build` failed with `next: command not found`. Ran `pnpm --dir next install --prefer-offline --no-frozen-lockfile` (no source files modified; only worktree-local install), then build succeeded. This is environmental setup, not a deviation from the plan's intent. No source code or package manifest changed.

## Authentication Gates

None.

## Threat Surface Scan

No new security-relevant surface introduced — this plan produces documentation only. The plan's threat register (`T-92-02-01..03`) is fully addressed:
- T-92-02-01 (Repudiation — silent CTA opacity regression downstream): mitigated by AUDIT.md providing the immutable baseline + the negative-grep command for downstream gates.
- T-92-02-02 (Tampering — read-only contract violation): mitigated; `git status --porcelain next/src/` is empty.
- T-92-02-03 (Information disclosure): n/a accepted.

## Known Stubs

None — audit content is final.

## Downstream Plan Hand-off

| Plan | Inherits |
|------|----------|
| 92-03 (chrome sweep) | Section 1 baselines for Header.tsx:14, Header.tsx:53, MobileMenu.tsx:94, StickyBar.tsx:58 + Section 3 (Header is RENDERED — sweep applies) |
| 92-04 / 92-05 / 92-06 (index sections) | Section 1 baselines for HeroHub.tsx:48, ContactForm.tsx:247, FinalCTA.tsx:26 + Section 2 negative-grep gate |
| 92-07 (cross-section verification) | Sections 1 + 2 — re-run on full IN-SCOPE set |
| 92-08 (mix-blend retirement) | Section 4 — offending `<div>` verbatim + retirement options (remove `<div>` OR drop only `mix-blend-multiply`) |

## Self-Check: PASSED

- File `.planning/phases/92-glass-rework-chrome-index-sections/92-02-AUDIT.md`: FOUND
- Commit `bb881fe`: FOUND in `git log`
- Read-only contract: UPHELD (`git status --porcelain next/src/` empty)
- Build: PASSING (`pnpm --dir next build` exits 0)
