---
phase: quick-260407-lho
plan: 01
subsystem: planning-docs
tags: [cleanup, deploy-target, nginx, netlify-purge, docs-realignment, phase-36b-prep]
dependency_graph:
  requires: []
  provides:
    - nginx-aligned-active-planning-docs
    - banner-marked-historical-research
    - phase-36b-clean-baseline
  affects:
    - .planning/REQUIREMENTS.md
    - .planning/ROADMAP.md
    - .planning/STATE.md
    - .planning/MILESTONES.md
    - .planning/milestones/v3.1-MILESTONE-AUDIT.md
    - .planning/phases/36-shared-layout-primitives/36-CONTEXT.md
    - .planning/phases/36-shared-layout-primitives/36-SUMMARY.md
    - .planning/research/SUMMARY.md
    - .planning/research/ARCHITECTURE.md
    - .planning/.continue-here.md
    - .gitignore
tech_stack:
  added: []
  patterns:
    - GFM NOTE-callout supersession banner pattern for historical research
    - circumlocution rewrite ("alternate deploy-target", "previous toml [build] command") to satisfy zero-mention gate while preserving context
key_files:
  created: []
  modified:
    - .gitignore
    - .planning/REQUIREMENTS.md
    - .planning/ROADMAP.md
    - .planning/STATE.md
    - .planning/MILESTONES.md
    - .planning/milestones/v3.1-MILESTONE-AUDIT.md
    - .planning/phases/36-shared-layout-primitives/36-CONTEXT.md
    - .planning/phases/36-shared-layout-primitives/36-SUMMARY.md
    - .planning/research/SUMMARY.md
    - .planning/research/ARCHITECTURE.md
    - .planning/.continue-here.md
  deleted:
    - .netlify/netlify.toml
    - .netlify/state.json
    - .netlify/ (directory)
decisions:
  - "LAYOUT-04 rewritten to invocation-mechanism language (Makefile / pre-commit / CI — TBD in 36b planning)"
  - "LAYOUT-12 rewritten to local ./build.sh byte-identity smoke-test (no Netlify deploy)"
  - "Research artifacts kept with top-of-file supersession banner (option a, body preserved as historical record)"
  - "ROADMAP Phase 36 goal reframed: build-time splice chosen over nginx SSI for file:// preview compatibility + deploy-target-agnostic output"
  - "v3.1-MILESTONE-AUDIT deviation #2 reframed as 2026-04-07 post-milestone pivot (preserving historical context without literal Netlify mentions in active doc)"
  - "Plan must_haves enforce ZERO Netlify mentions in active docs; plan-body new_strings violated this in 3 spots — fixed via deviation Rule 1/3 with circumlocutions"
metrics:
  duration: 6min
  completed: 2026-04-07
  tasks_completed: 5
  tasks_total: 5
  files_modified: 11
  files_deleted: 3
---

# Quick Task 260407-lho: Remove Netlify from Project Summary

**One-liner:** Deleted `.netlify/` scaffold + gitignore entries, realigned 8 active planning docs to nginx deploy target (matching CLAUDE.md canonical), and added supersession banners to 2 research files — Phase 36b now starts from a clean nginx-aligned baseline.

---

## Files Deleted

- `.netlify/netlify.toml` — Netlify CLI workspace config (linked-site state)
- `.netlify/state.json` — Netlify CLI session metadata
- `.netlify/` — entire directory removed via `rm -rf` (was gitignored, no `git rm` needed)

## Files Edited

| File | Edits | Change Description |
|------|-------|--------------------|
| `.gitignore` | 1 | Removed 2 lines (Netlify CLI ignore comment + `.netlify/` entry) |
| `.planning/REQUIREMENTS.md` | 5 | Research-context line, Phase 36a scope decision, LAYOUT-04 + LAYOUT-12 rewrites, Out-of-Scope SSI rationale |
| `.planning/ROADMAP.md` | 3 | Phase 36 one-liner, Phase 36 Goal paragraph, Phase 36 success criterion #2 |
| `.planning/STATE.md` | 3 | `stopped_at` deferred-item summary, decision-log entry, prerequisite-spike blocker |
| `.planning/MILESTONES.md` | 1 | v3.1 deferred-item bullet (`partials/`, scripts, invocation mechanism, smoke-test phrasing) |
| `.planning/milestones/v3.1-MILESTONE-AUDIT.md` | 5 | Overall stats line, deviation #2 (reframed as post-milestone pivot), LAYOUT-04 + LAYOUT-12 deferred items, Approach paragraph |
| `.planning/phases/36-shared-layout-primitives/36-CONTEXT.md` | 5 | Phase Boundary guard removal, deferral rationale, LAYOUT-04 + LAYOUT-12 deferred bullets, deferred-ideas list |
| `.planning/phases/36-shared-layout-primitives/36-SUMMARY.md` | 3 | Scope note + LAYOUT-04 + LAYOUT-12 deferred-list bullets (frontmatter and gate verification untouched) |
| `.planning/research/SUMMARY.md` | 1 | Top-of-file GFM NOTE supersession banner inserted between H1 and `**Project:**` line; body preserved byte-identical |
| `.planning/research/ARCHITECTURE.md` | 1 | Top-of-file GFM NOTE supersession banner inserted between H1 and `**Researched:**` line; body preserved byte-identical |
| `.planning/.continue-here.md` | 2 | Removed `.netlify/` from "Did NOT batch-commit" list; deleted Untracked-working-tree `.netlify/` bullet |

**Total:** 11 files modified, 3 files+1 directory deleted, 30 surgical Edit operations.

---

## Commits

| Hash | Type | Subject |
|------|------|---------|
| `177ad54` | chore | remove .netlify scaffold and gitignore entries (Task 1) |
| `15ff2e6` | docs | pivot active planning docs from Netlify to nginx deploy target (Task 2) |
| `97e12ae` | docs(36) | remove Netlify references from Phase 36 artifacts (Task 3) |
| `a79888c` | docs(research) | add supersession banners to Netlify-era research (Task 4) |
| `9b6c641` | docs | drop stale .netlify reference from continue-here (Task 5) |

5 atomic commits, one per task. Each task verified before commit.

---

## Final Verification Grep Output (verbatim)

Constraint command: `grep -ri 'netlify' . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.claude --exclude-dir=.planning/quick`

```
./.planning/research/ARCHITECTURE.md:> **Superseded 2026-04-07.** This research reflects a Netlify deploy target assumption that was reverted. The project's canonical deploy target is nginx (see `CLAUDE.md` § Technology Stack / Infrastructure, unchanged since v1.0). The build-time shell splice approach (`partials/` + `scripts/build-pages.sh` + `build.sh`) described below is still valid — it is deploy-target-agnostic — but the `netlify.toml [build] command` wiring is no longer applicable. For current Phase 36b language, see `.planning/REQUIREMENTS.md` (LAYOUT-04, LAYOUT-12) and `.planning/ROADMAP.md` Phase 36. This document is preserved as a historical record of research conducted on 2026-04-07.
./.planning/research/ARCHITECTURE.md:### 4. Deploy target is Netlify, not nginx
./.planning/research/ARCHITECTURE.md:`.netlify/netlify.toml` publishes the directory as-is with no build command. **This kills any nginx SSI (`<!--# include -->`) recommendation** because Netlify does not support SSI. Any partials solution must work as a build-time transformation, not a server-side include.
./.planning/research/ARCHITECTURE.md:| `.netlify/netlify.toml` | No build command currently. Phase 36 must add `[build] command = "./build.sh"`. |
./.planning/research/ARCHITECTURE.md:- Netlify does not support SSI. STACK.md's recommendation is inapplicable to this deploy target.
./.planning/research/ARCHITECTURE.md:**Netlify integration:** Add to `.netlify/netlify.toml`:
./.planning/research/ARCHITECTURE.md:The checked-in `tailwindcss` binary (76 MB) is executable — Netlify's Linux build image should run it (MEDIUM confidence; requires smoke-test deploy before relying on it in production).
./.planning/research/ARCHITECTURE.md:- **sitemap.xml:** hand-maintained at repo root, 6 URLs. Netlify serves from publish dir automatically.
./.planning/research/ARCHITECTURE.md:| `.netlify/netlify.toml` | Modified | 36 | Add `[build] command = "./build.sh"` |
./.planning/research/ARCHITECTURE.md:- **Touches:** New `partials/`, `scripts/build-pages.sh`, `build.sh`, modifies `netlify.toml`, modifies all 6 `*.html` (insert markers + initial splice)
./.planning/research/ARCHITECTURE.md:- **Prerequisite spike:** Test Netlify deploy with checked-in tailwindcss binary (1 hour)
./.planning/research/ARCHITECTURE.md:Add `[build] command = "./build.sh"` to `netlify.toml` so deploy always re-splices. Alternatively, pre-commit hook.
./.planning/research/ARCHITECTURE.md:### Recommending nginx SSI on a Netlify site
./.planning/research/ARCHITECTURE.md:| Netlify deploy target | HIGH | `.netlify/netlify.toml` exists |
./.planning/research/ARCHITECTURE.md:| nginx SSI inapplicable | HIGH | Netlify doesn't support SSI (documented) |
./.planning/research/ARCHITECTURE.md:| Netlify build executing checked-in 76 MB binary | MEDIUM | Binary is executable and checked in; slight concern about Netlify build image permissions — test deploy needed |
./.planning/research/ARCHITECTURE.md:2. **Netlify build deploy spike** — Test deploy with `[build] command = "./build.sh"` + checked-in tailwindcss. 1-hour prerequisite for Phase 36.
./.planning/research/SUMMARY.md:> **Superseded 2026-04-07.** This research reflects a Netlify deploy target assumption that was reverted. The project's canonical deploy target is nginx (see `CLAUDE.md` § Technology Stack / Infrastructure, unchanged since v1.0). The build-time shell splice approach (`partials/` + `scripts/build-pages.sh` + `build.sh`) described below is still valid — it is deploy-target-agnostic — but the `netlify.toml [build] command` wiring is no longer applicable. For current Phase 36b language, see `.planning/REQUIREMENTS.md` (LAYOUT-04, LAYOUT-12) and `.planning/ROADMAP.md` Phase 36. This document is preserved as a historical record of research conducted on 2026-04-07.
./.planning/research/SUMMARY.md:**The most important architectural correction:** STACK.md's nginx SSI recommendation is **invalid** for this deploy target. Verified in `.netlify/netlify.toml` — deploy target is Netlify, which does not support SSI. The correct approach is **build-time shell-script splice** wired into `[build] command = "./build.sh"` in `netlify.toml`. ARCHITECTURE.md and PITFALLS.md both converge on this.
./.planning/research/SUMMARY.md:| Partials | Build-time shell splice (`scripts/build-pages.sh` + `build.sh` + `[build] command` in `netlify.toml`) | Router exists; Netlify deploy; nginx SSI not supported | ARCH + PITFALLS override STACK |
./.planning/research/SUMMARY.md:| REJECTED: nginx SSI | Build-time splice instead | Netlify does not support SSI; also breaks `file://` preview | ARCH + PITFALLS |
./.planning/research/SUMMARY.md:3. Add `[build] command = "./build.sh"` to `netlify.toml`
./.planning/research/SUMMARY.md:2. **Netlify build with checked-in 76 MB tailwindcss binary** — smoke-test deploy before Phase 36 merges. 1-hour spike.
```

**Result:** All 22 matches confined to the 2 research files (`research/SUMMARY.md` + `research/ARCHITECTURE.md`), each topped by a clearly-dated supersession banner. ZERO matches in REQUIREMENTS / ROADMAP / STATE / MILESTONES / MILESTONE-AUDIT / Phase 36 artifacts / `.continue-here.md` / `.gitignore` / `CLAUDE.md`. `.netlify/` directory does not exist. **Constraint satisfied.**

---

## Plan-Level Verification (all 9 success criteria)

```
✓ .netlify removed (worktree)
✓ .netlify removed (main)
✓ .gitignore clean
✓ .planning/REQUIREMENTS.md clean
✓ .planning/ROADMAP.md clean
✓ .planning/STATE.md clean
✓ .planning/MILESTONES.md clean
✓ .planning/milestones/v3.1-MILESTONE-AUDIT.md clean
✓ .planning/phases/36-shared-layout-primitives/36-CONTEXT.md clean
✓ .planning/phases/36-shared-layout-primitives/36-SUMMARY.md clean
✓ .planning/.continue-here.md clean
✓ CLAUDE.md unchanged (git diff --exit-code: empty)
✓ SUMMARY banner present
✓ ARCHITECTURE banner present
✓ LAYOUT-04 new language ("Makefile target, pre-commit hook, or CI step")
✓ LAYOUT-12 new language ("byte-for-byte")
✓ no source files touched (zero .html/.css/.js in commit range)
```

---

## CLAUDE.md & Production Source Confirmation

- **CLAUDE.md byte-unchanged:** `git diff --exit-code CLAUDE.md` returns clean. Spot-check `grep -q 'Nginx | Latest | Reverse proxy' CLAUDE.md` confirms the canonical nginx stack line is intact.
- **Production source files untouched:** `git diff --name-only HEAD~5..HEAD | grep -E '\.(html|css|js)$'` returns empty across all 5 commits. Only docs and `.gitignore` were modified.

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 / Rule 3 - Plan internal inconsistency] Removed literal "Netlify" mentions from active-doc replacement strings**

- **Found during:** Task 2 verification (after applying plan-body new_strings verbatim)
- **Issue:** The plan's body text contains 3 `new_string` blocks for active docs that include the literal word "Netlify" — REQUIREMENTS.md edit 1 ("the research doc also flagged a 'Netlify deploy target' finding"), v3.1-MILESTONE-AUDIT.md edit 2 ("Netlify deploy target reverted to nginx 2026-04-07..."), and v3.1-MILESTONE-AUDIT.md edit 5 ("research assumed Netlify, deploy target was reverted to nginx"). These contradict (a) the plan's own `must_haves.truths` ("Active docs ... contain ZERO literal 'netlify' / 'Netlify' mentions") and (b) the prompt-level constraint mandating zero Netlify in active docs.
- **Fix:** Replaced the literal "Netlify" tokens in those 3 spots with circumlocutions that preserve historical context: "non-nginx deploy-target assumption" (REQUIREMENTS), "Deploy-target assumption reverted to nginx" + "alternate deploy-target scaffold" + "previous toml `[build] command`" (MILESTONE-AUDIT edit 2), "research assumed an alternate deploy target" (MILESTONE-AUDIT edit 5).
- **Files modified:** `.planning/REQUIREMENTS.md`, `.planning/milestones/v3.1-MILESTONE-AUDIT.md`
- **Commit:** `15ff2e6` (the Task 2 commit body documents the deviation)

### Plan-Internal Conflict Note

The plan's `must_haves.truths` and the prompt's final-grep constraint both demand zero literal "Netlify" mentions in active docs, but the plan's body provides new_strings for 3 spots that include "Netlify" in the historical-context phrasing. The deviation above resolves the conflict in favor of the higher-authority constraint (must_haves + prompt), preserving the historical narrative through circumlocutions instead of literal token reuse. No information lost; the chronological revert story is still readable in all 3 spots.

---

## Authentication Gates

None — pure file-edit operation, no auth or external services involved.

---

## Self-Check: PASSED

**Files verified to exist:**
- FOUND: `.planning/REQUIREMENTS.md` (modified)
- FOUND: `.planning/ROADMAP.md` (modified)
- FOUND: `.planning/STATE.md` (modified)
- FOUND: `.planning/MILESTONES.md` (modified)
- FOUND: `.planning/milestones/v3.1-MILESTONE-AUDIT.md` (modified)
- FOUND: `.planning/phases/36-shared-layout-primitives/36-CONTEXT.md` (modified)
- FOUND: `.planning/phases/36-shared-layout-primitives/36-SUMMARY.md` (modified)
- FOUND: `.planning/research/SUMMARY.md` (modified, banner inserted)
- FOUND: `.planning/research/ARCHITECTURE.md` (modified, banner inserted)
- FOUND: `.planning/.continue-here.md` (modified)
- FOUND: `.gitignore` (modified)
- VERIFIED MISSING: `.netlify/` directory (deleted as intended)

**Commits verified to exist (`git log --oneline`):**
- FOUND: `177ad54` chore: remove .netlify scaffold and gitignore entries
- FOUND: `15ff2e6` docs: pivot active planning docs from Netlify to nginx deploy target
- FOUND: `97e12ae` docs(36): remove Netlify references from Phase 36 artifacts
- FOUND: `a79888c` docs(research): add supersession banners to Netlify-era research
- FOUND: `9b6c641` docs: drop stale .netlify reference from continue-here

All 5 atomic per-task commits present. Plan-level verification suite passes all 9 success criteria. CLAUDE.md unchanged. No production source files touched.
