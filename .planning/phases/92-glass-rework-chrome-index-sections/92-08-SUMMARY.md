---
phase: 92-glass-rework-chrome-index-sections
plan: 08
subsystem: ui-glass-tokens
tags: [glass, anti-pattern-8, final-cta, header-legacy, sweep-audit, wave-4, archetype-i]
requires:
  - 92-01-SUMMARY.md (token contract — globals.css `--glass-{section,card,form,button}-{fill,blur}`)
  - 92-02-AUDIT.md (CTA invariant baseline + Header.tsx RENDERED conclusion + FinalCTA:14 anti-pattern flag)
  - 92-03-SUMMARY.md (chrome sweep precedent including HeaderClient/MobileMenu/StickyBar/Footer)
  - 92-04-SUMMARY.md (above-fold sweep precedent — HeroHub Archetype H sub-elements left as sanctioned exceptions)
  - 92-05-SUMMARY.md (mid-section sweep precedent — six section components)
  - 92-06-SUMMARY.md (FAQSection + FinalCTA frame/phone-CTA sweep — left mix-blend-multiply for 92-08)
provides:
  - "FinalCTA.tsx:14 mix-blend-multiply decorative blob retired (Archetype I, anti-pattern #8 cleared with no residual)"
  - "92-08-SWEEP-AUDIT.md (Sections 1-6) — per-file grep matrix, CTA invariant negative-grep, GLASS-NN coverage matrix, anti-pattern enforcement gate, PHASE 92 sign-off"
  - "Header.tsx (legacy) verify-only confirmation — file is RENDERED but contains zero glass surfaces; Archetype A sweep is no-op; CTA gradients at lines 14/53 preserved"
affects:
  - "Phase 92 closeout — orchestrator can merge this worktree alongside 92-07 worktree to complete Wave 4"
  - "Phase 93 (sub-route propagation) consumes 92-08-SWEEP-AUDIT.md as the locked Phase 92 contract"
  - "/gsd-verify-work post-merge: 9/10 GLASS-NN ✅ inside this worktree; GLASS-07 worktree-pending pending 92-07 merge"
tech-stack:
  added: []
  patterns:
    - "Archetype I retirement (anti-pattern #8): remove decorative <div>; rely on heat-leak gradient + section-fill token frame for ambient blue glow"
    - "Verify-only no-op pattern (Header.tsx legacy): RENDERED file passes the Archetype A sweep grep gate without any modification because it contains no glass surfaces — chrome delegated to HeaderClient + MobileMenu (already swept in 92-03)"
    - "Worktree-pending audit annotation: parallel worktree owns sibling deliverable; current audit reflects worktree-local state with explicit pending-merge flags"
key-files:
  created:
    - ".planning/phases/92-glass-rework-chrome-index-sections/92-08-SWEEP-AUDIT.md"
  modified:
    - "next/src/components/sections/FinalCTA.tsx (mix-blend-multiply blob removed; line 14 deleted)"
decisions:
  - "Task 1 retirement path = option-a (remove entire decorative `<div>`). Rationale: (a) UI-SPEC explicit recommendation; (b) plan must_haves.truths[0] requires anti-pattern #8 cleared with no residual; (c) option-b proposed Key Decision ID `KD-v9-003`, but that ID was already taken on 2026-04-30 for the ContactSection Path A decision (CONTEXT.md:201) — option-b would create an ID conflict; (d) option-a is autonomous (no Key Decision needed); (e) heat-leak on .liquid-regular (commit 9c93b9f) provides ambient glow elsewhere and FinalCTA's blue tone now comes from the section-fill token frame applied in 92-06."
  - "Task 3 Header.tsx handling = verify-only no-op (RENDERED branch). 92-02-AUDIT.md Section 3 confirmed Header.tsx is imported by next/src/app/layout.tsx:5. The file delegates the actual chrome (sticky bar + blur backdrop) to HeaderClient and MobileMenu (both already swept in 92-03) and contains zero glass surfaces — no `bg-white/{N}`, no `backdrop-blur-*`, no `mix-blend-*`. Only two surfaces remain: the wordmark gradient at line 14 (Archetype J) and the desktop CTA at line 53 (Archetype J). Both are opaque-forever and preserved verbatim. The Archetype A grep gate (`bg-white/` count = 0) passes without any modification."
  - "STATE.md and ROADMAP.md NOT modified — orchestrator owns those writes after all worktree agents complete (parallel-execution policy)."
metrics:
  duration: "~7 minutes (worktree base reset + read context + 1 surgical edit + 1 build + grep matrix + 1 audit doc + 2 commits)"
  completed: "2026-04-30"
  tasks_completed: 4
  files_modified: 1
  files_created: 2
  commits: 2
---

# Phase 92 Plan 08: Anti-pattern #8 Retirement + Phase-Gate Sweep Audit Summary

Wave 4 closeout — FinalCTA's `mix-blend-multiply` decorative blob retired by removing the entire `<div>` (option-a, autonomous) and a six-section sweep audit produced as the Phase 92 phase-gate contract. Header.tsx (legacy) verified RENDERED but glass-surface-free; sweep is verify-only. SWEEP-AUDIT records 9/10 GLASS-NN ✅ inside this worktree with GLASS-07 worktree-pending pending parallel 92-07 merge.

## Outcome

Anti-pattern #8 violation cleared at `next/src/components/sections/FinalCTA.tsx:14`: the decorative `<div className="absolute top-0 left-0 w-96 h-96 bg-mu-blue/30 rounded-full blur-[100px] -z-10 mix-blend-multiply" aria-hidden="true" />` is gone. FinalCTA's blue ambient cue now comes from the section-fill token frame (applied in 92-06) and the heat-leak `radial-gradient` rule on `.liquid-regular` (commit 9c93b9f). The CTA invariant holds across all five canonical CTA call-sites (HeroHub, MobileMenu, StickyBar, ContactForm, FinalCTA) — `grep` for `backdrop-*` paired with `from-mu-blue` returns zero. `pnpm --dir next build` exits clean.

## What Was Built

### Task 1 — Retirement-path decision (resolved in-worktree)

Selected **option-a** (remove entire decorative `<div>`) per UI-SPEC recommendation. Decision rationale recorded above in `decisions[0]`. Option-b's proposed Key Decision ID (`KD-v9-003`) was already taken on 2026-04-30 for the ContactSection Path A decision (CONTEXT.md:201), so option-b would have required either a new Key-Decision ID or a renumber — option-a sidesteps that overhead and is autonomous. No Key Decision logged.

### Task 2 — `next/src/components/sections/FinalCTA.tsx` (commit `73d05a8`)

Single deletion at line 14 (between the parent `<div className="p-12 lg:p-20 ...">` and the `<h2>` heading):

**BEFORE:**
```tsx
            {/* Left Content */}
            <div className="p-12 lg:p-20 flex flex-col justify-center relative z-10">
              {/* Decorative blur blob */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-mu-blue/30 rounded-full blur-[100px] -z-10 mix-blend-multiply" aria-hidden="true" />

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-mu-text-900 mb-6 leading-tight drop-shadow-sm">
```

**AFTER:**
```tsx
            {/* Left Content */}
            <div className="p-12 lg:p-20 flex flex-col justify-center relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-mu-text-900 mb-6 leading-tight drop-shadow-sm">
```

Diff: `1 file changed, 3 deletions(-)` (the comment line, the `<div>` element, and the trailing blank line collapsed into one).

**Preserved verbatim:**
- Section-fill token frame at line 8 (`bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] ...`) from 92-06.
- Primary CTA gradient at line 26 (`bg-gradient-to-r from-mu-blue to-mu-accent-blue ...`) — Archetype J, opaque-forever.
- Phone CTA glass at line 33 (`bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] ... hover:bg-[var(--glass-form-fill)] ...`) from 92-06.
- Image gradient overlay at line 59 (`bg-gradient-to-r from-white/60 to-transparent w-1/3`) — image overlay, not glass surface.
- All Russian copy with `'\u00A0'` non-breaking-space binding (subject+verb pairs + orphan prevention per project memory).

### Task 3 — `next/src/components/layout/Header.tsx` (no commit — verify-only)

Header.tsx is RENDERED per 92-02-AUDIT.md Section 3 (imported by `next/src/app/layout.tsx:5`). Per the plan, the RENDERED branch requires Archetype A sweep. However, the file contains zero glass surfaces:

```bash
$ grep -c 'bg-white/' next/src/components/layout/Header.tsx     # → 0
$ grep -c 'backdrop-blur' next/src/components/layout/Header.tsx # → 0
$ grep -c 'mix-blend-' next/src/components/layout/Header.tsx    # → 0
$ grep -c 'from-mu-blue to-mu-accent-blue' next/src/components/layout/Header.tsx # → 2 (Archetype J — preserve)
$ git status --porcelain next/src/components/layout/Header.tsx  # → empty
```

The file is a thin server component that delegates the actual chrome (sticky scroll, glass backdrop, blur token consumption) to `HeaderClient` (swept in 92-03) and `MobileMenu` (swept in 92-03). Only two TSX surfaces are present in the file:
- Line 14 — wordmark gradient text (`bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent`) — Archetype J.
- Line 53 — desktop header CTA button (`bg-gradient-to-r from-mu-blue to-mu-accent-blue ...`) — Archetype J.

Both are opaque-forever and preserved verbatim. Archetype A sweep is therefore a verify-only no-op.

The plan acceptance criterion "IF RENDERED: `grep -c 'bg-white/' Header.tsx` returns 0 (or returns only sanctioned exceptions documented inline)" is satisfied — the count is 0 with no exceptions needed. The "IF NOT RENDERED: file untouched" alternative is **also** satisfied (the file is genuinely untouched in this worktree). Both branches converge.

### Task 4 — `92-08-SWEEP-AUDIT.md` (commit `bba3b6d`)

181-line audit document with all six required sections:

- **§1 Per-file `bg-white/{N}` grep across 17 IN-SCOPE files.** All 92-08-owned files clean (FinalCTA, Header). 13 of 17 files at 0 unsanctioned matches. 4 files surface known sanctioned residue: MobileMenu (4 hits — hovers + divider per PATTERNS), HeroHub (2 hits — Archetype H sub-elements at lines 117/123), ContactSection (4 hits — worktree-pending owned by 92-07), ContactForm (3 hits — worktree-pending plus 2 sanctioned success-overlay hits at 111/112).

- **§2 Hardcoded `backdrop-blur-*` grep.** 8 hits documented; all sanctioned (over-photo Archetype H ×3, MobileMenu scrim ×1, ContactForm success overlay ×1) or worktree-pending owned by 92-07 (3 hits — ContactSection trust signals + ContactForm inputBase).

- **§3 CTA invariant negative-grep.** Ran the canonical PATTERNS.md cross-cutting grep across HeroHub/MobileMenu/StickyBar/ContactForm/FinalCTA. **Zero matches** — embedded verbatim in the audit. Opaque-forever invariant holds end-to-end through Wave 4.

- **§4 GLASS-NN coverage matrix.** 10 rows (GLASS-01..GLASS-10). 9 ✅, 1 🟡 (GLASS-07, worktree-pending pending 92-07 sibling worktree merge). GLASS-08 (this plan's primary owned requirement) ✅ — both 92-06 frame sweep and 92-08 mix-blend retirement landed.

- **§5 Anti-pattern enforcement gate (Decision H).** 9 anti-patterns from DESIGN.md `## v9.0 Anti-Patterns` checked. All PASS. Anti-pattern #8 cleared by commit `73d05a8` (this plan). Wide grep across 17 IN-SCOPE files surfaces only one residual `mix-blend-*` token: `liquid-glass.css:691`, which is a comment line documenting that `liquid-tint-*` is implemented via gradient composite **instead of** mix-blend-mode (per VFEX-01) — anti-pattern compliance documentation, not a violation.

- **§6 Sign-off.** `PHASE 92 SWEEP AUDIT COMPLETE: 2026-04-30` line present with detailed status per requirement and per worktree-merge follow-up.

## Verification

**Per-task acceptance grep results:**

| Check | File | Expected | Got |
|-------|------|----------|-----|
| `mix-blend-multiply` removed (anti-pattern #8) | FinalCTA | 0 | 0 |
| Decorative blob `<div>` fully removed (option-a) | FinalCTA | 0 | 0 |
| Section-fill token frame preserved (92-06) | FinalCTA | ≥1 | 1 |
| Primary CTA gradient preserved (Archetype J) | FinalCTA | ≥1 | 1 |
| CTA invariant — gradient line has no `backdrop-*` | FinalCTA | 0 | 0 |
| `bg-white/` count post-sweep | Header.tsx | 0 | 0 |
| `backdrop-blur` count post-sweep | Header.tsx | 0 | 0 |
| Header.tsx untouched (NOT RENDERED branch alternative) | Header.tsx | empty git status | empty |
| `&nbsp;` baseline preserved | FinalCTA | 0 (unchanged) | 0 |
| SWEEP-AUDIT file exists | 92-08-SWEEP-AUDIT.md | yes | yes |
| `PHASE 92 SWEEP AUDIT COMPLETE` line present | 92-08-SWEEP-AUDIT.md | ≥1 | 1 |
| `pnpm --dir next build` | next | exit 0 | exit 0 |

**Cross-component CTA opaque-forever invariant** (PATTERNS.md §Shared Patterns):

```bash
grep -rn 'backdrop-filter\|backdrop-blur' \
  next/src/components/sections/HeroHub.tsx \
  next/src/components/layout/MobileMenu.tsx \
  next/src/components/layout/StickyBar.tsx \
  next/src/components/sections/ContactForm.tsx \
  next/src/components/sections/FinalCTA.tsx \
  | grep -E 'gradient-to-r|from-mu-blue|from-mu-cta'
```

Result: **zero matches** (exit 1). Invariant holds across Wave 4.

**Build:** `pnpm --dir next build` exits 0; static export of all 11 routes succeeds; no new lint warnings.

## Decisions Made

1. **Task 1 retirement path = option-a (remove entire decorative `<div>`).** Anti-pattern #8 cleanly cleared with no residual. UI-SPEC explicit recommendation; plan `must_haves.truths[0]` mandate; KD-v9-003 already taken so option-b would require a new ID; option-a is autonomous (no Key Decision logging needed). The visual cost (loss of the soft top-left blue glow) is acceptable per UI-SPEC and offset by the section-fill token frame + heat-leak gradient that already responds to blob heat on `.liquid-regular`-using surfaces.

2. **Task 3 Header.tsx handling = verify-only no-op.** RENDERED branch acceptance criterion satisfied without any modification because the file contains zero glass surfaces. Documented as RENDERED → swept-clean (the "sweep" is a verify-only grep gate that already passes). Both plan branches (RENDERED and NOT-RENDERED) converge to "no edit, audit-documented".

3. **STATE.md / ROADMAP.md not modified.** Parallel-execution policy: orchestrator owns those writes after all worktree agents complete. This summary is the contract this worktree contributes; the orchestrator's post-merge sweep produces the final tracking update.

## Deviations from Plan

None — plan executed exactly as written. Both task branches resolved cleanly:
- Task 1 had 2+1 options; option-a chosen with rationale (no escalate-to-user needed).
- Task 3 had 2 branches (RENDERED → sweep / NOT-RENDERED → skip); RENDERED branch chosen per AUDIT, but the sweep is a no-op because the file contains no glass surfaces — both branches' acceptance criteria are simultaneously satisfied.
- The plan's option-b path was self-blocked by the prior-plan KD-v9-003 ID assignment; option-a is the documented preferred recommendation, so this is not a deviation but the intended primary path.

## Threat Flags

None. The retirement is a single TSX deletion (3 lines); no new network endpoints, auth paths, file access patterns, or schema changes. Form submission flow (`/api/leads`, `directus-fetch`) is not touched. Section-fill token frame and CTA gradients preserved verbatim.

## Known Stubs

None. No empty arrays, placeholder text, or unwired components introduced. All Russian copy in FinalCTA preserved verbatim including `'\u00A0'` non-breaking-space binding (subject+verb pairs + orphan prevention per project memory).

## Worktree-Pending Items (passed to orchestrator)

1. **GLASS-07 (ContactSection.tsx + ContactForm.tsx form-safety migration)** — owned by sibling worktree (Plan 92-07). Post-merge audit should re-run §1/§2 grep matrix and confirm `ContactForm.tsx:128` inputBase migrated to `bg-white` opaque per Archetype F template, plus document final disposition for `ContactSection.tsx:60/63/83` trust-signal cards and the `KD-v9-002` form-fill escalation trigger status. Tracked as 🟡 in the SWEEP-AUDIT GLASS-NN matrix.

2. **STATE.md / ROADMAP.md / REQUIREMENTS.md updates** — owned by orchestrator post-merge. This worktree intentionally does not modify these shared artifacts.

## Self-Check: PASSED

**Files verified to exist:**
- FOUND: `next/src/components/sections/FinalCTA.tsx` (modified)
- FOUND: `next/src/components/layout/Header.tsx` (untouched, verify-only)
- FOUND: `.planning/phases/92-glass-rework-chrome-index-sections/92-08-SWEEP-AUDIT.md` (created)
- FOUND: `.planning/phases/92-glass-rework-chrome-index-sections/92-08-SUMMARY.md` (this file)

**Commits verified to exist:**
- FOUND: `73d05a8` — fix(92-08): retire FinalCTA mix-blend-multiply blob (anti-pattern #8)
- FOUND: `bba3b6d` — docs(92-08): phase-gate sweep audit (Sections 1-6)

**Acceptance criteria:** Anti-pattern #8 grep gate passes (`grep -c mix-blend-multiply FinalCTA.tsx` = 0); Section-fill token frame preserved; CTA invariant negative-grep zero-matches; SWEEP-AUDIT exists with all six sections + sign-off line; `pnpm --dir next build` exits 0; `&nbsp;` literal count baseline (0) preserved.
