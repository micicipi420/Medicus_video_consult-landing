---
phase: quick-260407-lho
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .netlify/netlify.toml
  - .netlify/state.json
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
autonomous: true
requirements:
  - QUICK-NETLIFY-PURGE
must_haves:
  truths:
    - "Deploy target across all active planning docs is nginx (matches CLAUDE.md canonical stack line)"
    - "The on-disk .netlify/ directory no longer exists"
    - ".gitignore has no Netlify-specific ignore lines"
    - "LAYOUT-04 reflects the new trigger language (Makefile / pre-commit / CI — to be decided in Phase 36b), NOT netlify.toml [build] command"
    - "LAYOUT-12 reflects the new smoke-test language (local ./build.sh byte-identity check), NOT Netlify deploy verification with 76 MB binary"
    - "Research artifacts (SUMMARY.md, ARCHITECTURE.md) carry a clearly-dated supersession banner pointing to REQUIREMENTS.md / ROADMAP.md as the new source of truth — their body is preserved for audit trail"
    - "Active docs (REQUIREMENTS, ROADMAP, STATE, MILESTONES, MILESTONE-AUDIT, Phase 36 artifacts, .continue-here.md) contain ZERO literal 'netlify' / 'Netlify' mentions"
    - "CLAUDE.md is byte-unchanged (it was already correct)"
    - "No production HTML/CSS/JS source files are touched"
  artifacts:
    - path: ".planning/REQUIREMENTS.md"
      provides: "v3.1 requirements with nginx-aligned LAYOUT-04 + LAYOUT-12"
    - path: ".planning/ROADMAP.md"
      provides: "v3.1 roadmap with nginx-aligned Phase 36 architectural goal + success criteria"
    - path: ".planning/STATE.md"
      provides: "State file with nginx-aligned deferred-item language"
    - path: ".planning/MILESTONES.md"
      provides: "Shipped-milestone log with nginx-aligned deferred-item summary"
    - path: ".planning/milestones/v3.1-MILESTONE-AUDIT.md"
      provides: "Audit with nginx-aligned deviation notes + v3.2 deferred list"
    - path: ".planning/phases/36-shared-layout-primitives/36-CONTEXT.md"
      provides: "Phase 36 context with nginx-aligned deferred-item list"
    - path: ".planning/phases/36-shared-layout-primitives/36-SUMMARY.md"
      provides: "Phase 36a summary with nginx-aligned deferred-item list"
    - path: ".planning/research/SUMMARY.md"
      provides: "Research synthesis with top-of-file supersession banner (body preserved)"
    - path: ".planning/research/ARCHITECTURE.md"
      provides: "Architecture research with top-of-file supersession banner (body preserved)"
    - path: ".planning/.continue-here.md"
      provides: "Session handoff doc with stale .netlify reference removed"
    - path: ".gitignore"
      provides: "Gitignore with Netlify lines removed"
  key_links:
    - from: ".planning/REQUIREMENTS.md"
      to: "CLAUDE.md"
      via: "nginx deploy target reconciliation"
      pattern: "nginx"
    - from: ".planning/ROADMAP.md"
      to: ".planning/REQUIREMENTS.md"
      via: "Phase 36 success criteria reference LAYOUT-04 + LAYOUT-12 new language"
      pattern: "LAYOUT-04|LAYOUT-12"
    - from: ".planning/research/SUMMARY.md"
      to: ".planning/REQUIREMENTS.md"
      via: "Supersession banner points to active docs as new source of truth"
      pattern: "Superseded"
    - from: ".planning/research/ARCHITECTURE.md"
      to: ".planning/REQUIREMENTS.md"
      via: "Supersession banner points to active docs as new source of truth"
      pattern: "Superseded"
---

<objective>
Remove Netlify from the project. Deploy target reverts to nginx (the original spec in CLAUDE.md, which was never changed). Phase 36b's build-time shell splice approach stays — it does NOT depend on Netlify — but loses its `[build] command` wiring. The trigger for `./build.sh` becomes "manual / pre-commit hook / CI step — to be decided when Phase 36b is planned in v3.2".

**Why now:** v3.1 is shipped. The milestone audit was completed. A final pass through planning artifacts is needed before opening v3.2 so Phase 36b planning starts from a clean, nginx-aligned baseline. Research artifacts that referenced Netlify are kept as historical records with a supersession banner (they reflect what was known at the time), but all active planning docs must align with CLAUDE.md.

Purpose: Align planning artifacts back to CLAUDE.md (which is canonical and unchanged). Remove the on-disk `.netlify/` directory and gitignore lines. Rewrite LAYOUT-04 and LAYOUT-12 per the locked user decisions so future Phase 36b planning isn't anchored to a dead deploy target.

Output:
- `.netlify/` directory deleted from disk
- `.gitignore` cleaned (2 lines removed)
- 7 active planning docs with zero Netlify references
- 2 research docs with a supersession banner at the top (body preserved)
- `.continue-here.md` with the stale `.netlify/` bullet removed
- CLAUDE.md byte-unchanged
- Production HTML/CSS/JS unchanged
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@.planning/STATE.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/MILESTONES.md
@.planning/milestones/v3.1-MILESTONE-AUDIT.md
@.planning/research/SUMMARY.md
@.planning/research/ARCHITECTURE.md
@.planning/phases/36-shared-layout-primitives/36-CONTEXT.md
@.planning/phases/36-shared-layout-primitives/36-SUMMARY.md
@.planning/.continue-here.md
@.gitignore

<user_decisions>
Locked decisions from the quick-task prompt (NON-NEGOTIABLE):

1. **Deploy target: nginx** — self-hosted, aligns with original CLAUDE.md stack line: "Nginx | Latest | Reverse proxy, static file serving | Serves the landing page HTML/CSS/JS and proxies `/api` to Directus. SSL termination | HIGH". Also consistent with KZ data sovereignty requirement.

2. **Phase 36b partials approach: UNCHANGED** — still build-time shell splice (`partials/` + `scripts/build-pages.sh` + `build.sh`). Originally chosen because "Netlify doesn't support SSI". With nginx back, SSI is technically valid BUT we keep build-time splice because (a) it works for `file://` preview, (b) it's deploy-target-agnostic, (c) Phase 36b is already designed around it. The only thing that changes: NO `[build] command` in any toml file. Trigger becomes manual / pre-commit / CI (exact mechanism is a v3.2 Phase 36b decision, NOT this quick task).

3. **LAYOUT-04 rewrite:** "Phase 36b ships a build-script invocation mechanism (Makefile target, pre-commit hook, or CI step — to be decided when Phase 36b is planned). MUST be reproducible and idempotent."

4. **LAYOUT-12 rewrite:** "Phase 36b smoke-test runs `./build.sh` locally and verifies the resulting HTML matches checked-in pages byte-for-byte (no drift). The 76 MB checked-in tailwindcss binary is no longer a build-image concern — nginx serves the already-compiled `css/styles.css`, the binary only runs locally during dev."

5. **Filesystem deletions:** `.netlify/netlify.toml`, `.netlify/state.json`, the entire `.netlify/` directory.

6. **`.gitignore` cleanup:** Remove lines 17–18 (`# Deploy tools (Netlify CLI linked-site state)` + `.netlify/`).

7. **CLAUDE.md: NO CHANGES** — it already correctly specifies nginx. The whole point is to align planning docs back with CLAUDE.md, not the other way around.

8. **Research artifacts:** Option (a) — supersession banner at top, body preserved. Research docs are historical records of what was researched at the time; the banner makes the supersession explicit without rewriting history.
</user_decisions>

<interfaces>
<!-- Exact current-state anchors the executor MUST match against. -->
<!-- DO NOT trust line numbers; use these string anchors as old_string inputs. -->

### .gitignore lines 17-18 (exact bytes):
```
# Deploy tools (Netlify CLI linked-site state)
.netlify/
```

### REQUIREMENTS.md key anchors:
- Line 9 mentions: "Key findings: `js/router.js` SPA router already ships; Netlify deploy target (not nginx); hero must use `svh`; dark mode claim is stale."
- Line 45: "**Scope decision 2026-04-07 (user):** Phase 36a ships drift normalization + JS wiring; Phase 36b (partials extraction + build pipeline + Netlify deploy) deferred to v3.2."
- Line 50: "- [ ] **LAYOUT-04** _(DEFERRED to v3.2 Phase 36b)_: `.netlify/netlify.toml` `[build] command`"
- Line 58: "- [ ] **LAYOUT-12** _(DEFERRED to v3.2 Phase 36b)_: Netlify test deploy smoke-test with checked-in 76 MB `tailwindcss` binary"
- Line 113 (Out of Scope list): "- **Server-Side Includes (nginx SSI)** — deploy target is Netlify; SSI not supported"

### ROADMAP.md key anchors:
- Line 156: "- [ ] **Phase 36: Shared Layout Primitives** -- ARCHITECTURAL CENTERPIECE. Build-time shell splice (`partials/` + `scripts/build-pages.sh` + `build.sh` + `netlify.toml`); preserves existing `js/router.js` swap contract"
- Line 200 (Phase 36 Goal): "**Goal**: Eliminate 5-way header/footer/sticky-bar/mobile-menu drift by extracting to `partials/` via build-time shell-script splice — wired into Netlify deploy via `[build] command = \"./build.sh\"`. NOT runtime fetch (would fight existing `js/router.js`). NOT nginx SSI (Netlify doesn't support it). Adding a hypothetical 7th page must require 0 edits to existing pages' chrome."
- Line 205 (success criterion 2): "`.netlify/netlify.toml` has `[build] command = \"./build.sh\"` AND a Netlify test deploy succeeds with the checked-in 76 MB `tailwindcss` binary executing under build image permissions (LAYOUT-12 / Open Verification Item #2)"

### STATE.md key anchors:
- Line 6: `stopped_at: All 6 phases complete. 44/52 requirements delivered; 7 deferred to v3.2 Phase 36b (partials extraction + build pipeline + Netlify deploy); 1 (RHYTHM-10 manual viewport verification) pending user sign-off. 44 commits across 6 phases. Milestone audit at .planning/milestones/v3.1-MILESTONE-AUDIT.md.`
- Line 79: `- [v3.1 roadmap]: Phase 36 partials approach is build-time shell splice (NOT runtime fetch, NOT nginx SSI) — preserves existing js/router.js swap contract, works with Netlify deploy target`
- Line 99: `- Phase 36 prerequisite spike: Netlify test deploy with checked-in 76 MB tailwindcss binary (Open Verification Item #2)`

### MILESTONES.md key anchor:
- Line 17: "- Deferred to v3.2 Phase 36b: `partials/` extraction, `scripts/build-pages.sh`, `build.sh`, `netlify.toml [build] command`, Netlify deploy smoke-test (prerequisite: user triggers test deploy with checked-in 76 MB `tailwindcss` binary)"

### v3.1-MILESTONE-AUDIT.md key anchors:
- Line 21: "**Overall:** 44/52 requirements delivered in this milestone. 7 requirements deferred to v3.2 Phase 36b (partials extraction + build pipeline + Netlify deploy). 1 requirement..."
- Line 33: "2. **Netlify deploy target (not nginx).** STACK.md's nginx SSI recommendation was invalidated mid-milestone. SUMMARY.md reconciled: build-time shell splice is the canonical approach, but required Netlify smoke-test (LAYOUT-12) pushed Phase 36b to v3.2."
- Line 75: "- LAYOUT-04: `.netlify/netlify.toml` `[build] command`"
- Line 78: "- LAYOUT-12: Netlify deploy smoke-test (prerequisite: user must trigger a test deploy and verify the 76 MB `tailwindcss` binary executes)"
- Line 82: "**Approach:** Build-time shell splice via `scripts/build-pages.sh` + `build.sh` + `netlify.toml [build] command` integration. See `.planning/research/ARCHITECTURE.md` for full pattern."

### 36-CONTEXT.md key anchors:
- Line 10: "Normalize header + footer + sticky-bar + mobile menu drift across all 5 production HTML pages into a canonical form. Bake `aria-current=\"page\"` consistently. Add router.js first-load nav sync, mobile menu event delegation, and bfcache pageshow listener. **Do NOT extract to partials/, do NOT create build scripts, do NOT modify netlify.toml.**"
- Line 12: "Phase 36b (extraction + build pipeline + Netlify deploy verification) is deferred to v3.2 or a focused follow-up session where user can verify the 76MB `tailwindcss` binary executes under Netlify build image."
- Line 35: "- LAYOUT-04: `netlify.toml` `[build] command`"
- Line 38: "- LAYOUT-12: Netlify deploy smoke-test with checked-in tailwindcss"
- Line 172: "- Build script + netlify.toml (v3.2 Phase 36b)"

### 36-SUMMARY.md key anchors:
- Line 47: "This plan covers the drift-normalization subset of Phase 36. Build-pipeline extraction (partials/, build-pages.sh, netlify.toml) is deferred to Phase 36b (v3.2)."
- Line 63: "- LAYOUT-04: netlify.toml build command"
- Line 66: "- LAYOUT-12: Netlify deploy smoke-test"

### .continue-here.md key anchors:
- Line 58: "- **Did NOT batch-commit untracked files** (`.netlify/`, `debug/`, `quick/`, `DESIGN-SYSTEM.md`, etc.). Milestone commit must be focused on milestone artifacts only."
- Line 89: "  - `.netlify/` — Netlify CLI workspace, probably gitignored intent"

### research/SUMMARY.md — SUPERSESSION BANNER ONLY (body preserved):
Banner goes between the `# Research Synthesis — v3.1 Site Foundation & Audit Fixes` H1 and the `**Project:**` metadata block.

### research/ARCHITECTURE.md — SUPERSESSION BANNER ONLY (body preserved):
Banner goes between the `# Architecture Research — v3.1 Site Foundation & Audit Fixes` H1 and the `**Researched:**` metadata block.

### Supersession banner template (use exactly this, with today's date 2026-04-07):
```
> [!NOTE]
> **Superseded 2026-04-07.** This research reflects a Netlify deploy target assumption that was reverted. The project's canonical deploy target is nginx (see `CLAUDE.md` § Technology Stack / Infrastructure, unchanged since v1.0). The build-time shell splice approach (`partials/` + `scripts/build-pages.sh` + `build.sh`) described below is still valid — it is deploy-target-agnostic — but the `netlify.toml [build] command` wiring is no longer applicable. For current Phase 36b language, see `.planning/REQUIREMENTS.md` (LAYOUT-04, LAYOUT-12) and `.planning/ROADMAP.md` Phase 36. This document is preserved as a historical record of research conducted on 2026-04-07.
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Filesystem cleanup — delete .netlify/ directory and clean .gitignore</name>
  <files>.netlify/netlify.toml, .netlify/state.json, .netlify/ (directory), .gitignore</files>
  <action>
Two sub-steps:

**1a. Delete `.netlify/` directory entirely.**

```bash
rm -rf /Users/mikhail/Projects/Medicus_video_consult-landing/.netlify
```

Verify the directory is gone:
```bash
ls -la /Users/mikhail/Projects/Medicus_video_consult-landing/.netlify 2>&1
# Should print: ls: .../.netlify: No such file or directory
```

**1b. Edit `.gitignore` to remove lines 17-18.**

Use the Edit tool with this exact replacement:

old_string (includes leading/trailing blank lines to anchor the block uniquely — matches the block between "Editor" section and "Tailwind CSS standalone CLI binary" section):
```
*.swo

# Deploy tools (Netlify CLI linked-site state)
.netlify/

# Tailwind CSS standalone CLI binary (~73MB, download with curl)
```

new_string:
```
*.swo

# Tailwind CSS standalone CLI binary (~73MB, download with curl)
```

Rationale: Anchored on the blank-line-separated adjacent sections so the match is unambiguous. After this edit, line count drops by 3 (two content lines + one blank separator that becomes redundant).
  </action>
  <verify>
    <automated>
# Directory is gone
test ! -e /Users/mikhail/Projects/Medicus_video_consult-landing/.netlify && echo "OK: .netlify removed"

# .gitignore no longer mentions netlify (case-insensitive, whole file)
! grep -i netlify /Users/mikhail/Projects/Medicus_video_consult-landing/.gitignore && echo "OK: .gitignore clean"

# .gitignore still has the Tailwind binary ignore (sanity — we didn't over-delete)
grep -q '^tailwindcss$' /Users/mikhail/Projects/Medicus_video_consult-landing/.gitignore && echo "OK: tailwindcss ignore preserved"
    </automated>
  </verify>
  <done>
- `.netlify/` directory does not exist on disk
- `.gitignore` contains zero Netlify references (case-insensitive grep returns nothing)
- `.gitignore` still ignores the `tailwindcss` binary (untouched)
- `git status` shows `.netlify/netlify.toml` and `.netlify/state.json` as deleted (if they were tracked) OR shows `.netlify/` no longer present in untracked list
  </done>
</task>

<task type="auto">
  <name>Task 2: Rewrite active planning docs — REQUIREMENTS, ROADMAP, STATE, MILESTONES, MILESTONE-AUDIT</name>
  <files>.planning/REQUIREMENTS.md, .planning/ROADMAP.md, .planning/STATE.md, .planning/MILESTONES.md, .planning/milestones/v3.1-MILESTONE-AUDIT.md</files>
  <action>
Surgical Edit tool replacements across 5 files. For each, verify the `old_string` matches character-for-character before writing. Line numbers are best-effort — match on string content.

**2a. `.planning/REQUIREMENTS.md` — 5 edits**

**Edit 1** (research context line — reframe the "Netlify not nginx" finding as now-superseded):

old_string:
```
**Research context:** `.planning/research/SUMMARY.md` — 6 critical corrections to PROJECT.md assumptions. Key findings: `js/router.js` SPA router already ships; Netlify deploy target (not nginx); hero must use `svh`; dark mode claim is stale.
```

new_string:
```
**Research context:** `.planning/research/SUMMARY.md` — 6 critical corrections to PROJECT.md assumptions. Key findings: `js/router.js` SPA router already ships; hero must use `svh`; dark mode claim is stale. (Note: the research doc also flagged a "Netlify deploy target" finding, which was reverted 2026-04-07 — canonical deploy target is nginx per CLAUDE.md; see supersession banner at the top of the research SUMMARY.)
```

**Edit 2** (Phase 36a scope decision line):

old_string:
```
**Scope decision 2026-04-07 (user):** Phase 36a ships drift normalization + JS wiring; Phase 36b (partials extraction + build pipeline + Netlify deploy) deferred to v3.2.
```

new_string:
```
**Scope decision 2026-04-07 (user):** Phase 36a ships drift normalization + JS wiring; Phase 36b (partials extraction + build pipeline + build-script invocation mechanism) deferred to v3.2.
```

**Edit 3** (LAYOUT-04 — full rewrite per locked decision 3):

old_string:
```
- [ ] **LAYOUT-04** _(DEFERRED to v3.2 Phase 36b)_: `.netlify/netlify.toml` `[build] command`
```

new_string:
```
- [ ] **LAYOUT-04** _(DEFERRED to v3.2 Phase 36b)_: Build-script invocation mechanism (Makefile target, pre-commit hook, or CI step — exact mechanism to be decided when Phase 36b is planned). MUST be reproducible and idempotent.
```

**Edit 4** (LAYOUT-12 — full rewrite per locked decision 4):

old_string:
```
- [ ] **LAYOUT-12** _(DEFERRED to v3.2 Phase 36b)_: Netlify test deploy smoke-test with checked-in 76 MB `tailwindcss` binary
```

new_string:
```
- [ ] **LAYOUT-12** _(DEFERRED to v3.2 Phase 36b)_: Smoke-test `./build.sh` locally and verify resulting HTML matches checked-in pages byte-for-byte (no drift). The 76 MB checked-in `tailwindcss` binary runs only locally during dev — nginx serves the already-compiled `css/styles.css`.
```

**Edit 5** (Out of Scope line 113 — the nginx SSI exclusion is now incorrect; SSI is technically available under nginx but we're keeping build-time splice for `file://` preview + deploy-target-agnostic reasons):

old_string:
```
- **Server-Side Includes (nginx SSI)** — deploy target is Netlify; SSI not supported
```

new_string:
```
- **Server-Side Includes (nginx SSI)** — deploy target is nginx (SSI technically valid), but Phase 36b keeps build-time shell splice for `file://` preview compatibility and deploy-target-agnostic output
```

---

**2b. `.planning/ROADMAP.md` — 3 edits**

**Edit 1** (line ~156, Phase 36 one-liner in the active list):

old_string:
```
- [ ] **Phase 36: Shared Layout Primitives** -- ARCHITECTURAL CENTERPIECE. Build-time shell splice (`partials/` + `scripts/build-pages.sh` + `build.sh` + `netlify.toml`); preserves existing `js/router.js` swap contract
```

new_string:
```
- [ ] **Phase 36: Shared Layout Primitives** -- ARCHITECTURAL CENTERPIECE. Build-time shell splice (`partials/` + `scripts/build-pages.sh` + `build.sh`); preserves existing `js/router.js` swap contract. Invocation mechanism (Makefile / pre-commit / CI) to be decided in v3.2 Phase 36b planning.
```

**Edit 2** (line ~200, Phase 36 Goal paragraph):

old_string:
```
**Goal**: Eliminate 5-way header/footer/sticky-bar/mobile-menu drift by extracting to `partials/` via build-time shell-script splice — wired into Netlify deploy via `[build] command = "./build.sh"`. NOT runtime fetch (would fight existing `js/router.js`). NOT nginx SSI (Netlify doesn't support it). Adding a hypothetical 7th page must require 0 edits to existing pages' chrome.
```

new_string:
```
**Goal**: Eliminate 5-way header/footer/sticky-bar/mobile-menu drift by extracting to `partials/` via build-time shell-script splice — invocation mechanism (Makefile target / pre-commit hook / CI step) to be decided in v3.2 Phase 36b planning. NOT runtime fetch (would fight existing `js/router.js`). Build-time splice chosen over nginx SSI for `file://` preview compatibility and deploy-target-agnostic output. Adding a hypothetical 7th page must require 0 edits to existing pages' chrome.
```

**Edit 3** (line ~205, success criterion 2):

old_string:
```
  2. `.netlify/netlify.toml` has `[build] command = "./build.sh"` AND a Netlify test deploy succeeds with the checked-in 76 MB `tailwindcss` binary executing under build image permissions (LAYOUT-12 / Open Verification Item #2)
```

new_string:
```
  2. `./build.sh` runs locally and produces HTML output byte-identical to checked-in pages (no drift) — verified via `diff` (LAYOUT-12). Invocation mechanism (Makefile / pre-commit / CI) shipped per LAYOUT-04 decision. nginx serves compiled `css/styles.css` directly; the 76 MB `tailwindcss` binary runs only locally during dev.
```

---

**2c. `.planning/STATE.md` — 3 edits**

**Edit 1** (line 6, stopped_at):

old_string:
```
stopped_at: All 6 phases complete. 44/52 requirements delivered; 7 deferred to v3.2 Phase 36b (partials extraction + build pipeline + Netlify deploy); 1 (RHYTHM-10 manual viewport verification) pending user sign-off. 44 commits across 6 phases. Milestone audit at .planning/milestones/v3.1-MILESTONE-AUDIT.md.
```

new_string:
```
stopped_at: All 6 phases complete. 44/52 requirements delivered; 7 deferred to v3.2 Phase 36b (partials extraction + build pipeline + build-script invocation mechanism); 1 (RHYTHM-10 manual viewport verification) pending user sign-off. 44 commits across 6 phases. Milestone audit at .planning/milestones/v3.1-MILESTONE-AUDIT.md.
```

**Edit 2** (line 79, decision log entry):

old_string:
```
- [v3.1 roadmap]: Phase 36 partials approach is build-time shell splice (NOT runtime fetch, NOT nginx SSI) — preserves existing js/router.js swap contract, works with Netlify deploy target
```

new_string:
```
- [v3.1 roadmap]: Phase 36 partials approach is build-time shell splice (NOT runtime fetch) — preserves existing js/router.js swap contract, deploy-target-agnostic, works with `file://` preview. Chosen over nginx SSI for preview compatibility.
```

**Edit 3** (line 99, prerequisite-spike blocker):

old_string:
```
- Phase 36 prerequisite spike: Netlify test deploy with checked-in 76 MB tailwindcss binary (Open Verification Item #2)
```

new_string:
```
- Phase 36 prerequisite spike: local `./build.sh` byte-identity verification — run build, `diff` against checked-in pages, confirm zero drift (Open Verification Item #2, rewritten 2026-04-07 after nginx pivot)
```

---

**2d. `.planning/MILESTONES.md` — 1 edit**

**Edit 1** (line 17, deferred item bullet):

old_string:
```
- Deferred to v3.2 Phase 36b: `partials/` extraction, `scripts/build-pages.sh`, `build.sh`, `netlify.toml [build] command`, Netlify deploy smoke-test (prerequisite: user triggers test deploy with checked-in 76 MB `tailwindcss` binary)
```

new_string:
```
- Deferred to v3.2 Phase 36b: `partials/` extraction, `scripts/build-pages.sh`, `build.sh`, build-script invocation mechanism (Makefile / pre-commit / CI — exact mechanism TBD in 36b planning), local `./build.sh` byte-identity smoke-test. Deploy target reverted to nginx 2026-04-07; `tailwindcss` binary runs only locally during dev.
```

---

**2e. `.planning/milestones/v3.1-MILESTONE-AUDIT.md` — 5 edits**

**Edit 1** (line 21, overall stats line):

old_string:
```
**Overall:** 44/52 requirements delivered in this milestone. 7 requirements deferred to v3.2 Phase 36b (partials extraction + build pipeline + Netlify deploy). 1 requirement (RHYTHM-10 manual viewport verification) needs user sign-off before truly closed.
```

new_string:
```
**Overall:** 44/52 requirements delivered in this milestone. 7 requirements deferred to v3.2 Phase 36b (partials extraction + build pipeline + build-script invocation mechanism). 1 requirement (RHYTHM-10 manual viewport verification) needs user sign-off before truly closed.
```

**Edit 2** (line 33, deviation finding #2 — this one's significant; it's rewriting a historical deviation note, so prefix the rewrite with a 2026-04-07 marker):

old_string:
```
2. **Netlify deploy target (not nginx).** STACK.md's nginx SSI recommendation was invalidated mid-milestone. SUMMARY.md reconciled: build-time shell splice is the canonical approach, but required Netlify smoke-test (LAYOUT-12) pushed Phase 36b to v3.2.
```

new_string:
```
2. **Netlify deploy target reverted to nginx 2026-04-07 (post-milestone).** During v3.1 planning, `.netlify/netlify.toml` was present on disk and research assumed Netlify was the deploy target. STACK.md's nginx SSI recommendation was flagged as invalidated, and build-time shell splice became the canonical approach. After v3.1 shipped, the user reverted deploy target to nginx (CLAUDE.md canonical, unchanged since v1.0) — `.netlify/` deleted, planning docs realigned. Phase 36b's build-time shell splice approach stays (deploy-target-agnostic), but the `netlify.toml [build] command` wiring is replaced with a Makefile / pre-commit / CI invocation mechanism to be decided in 36b planning.
```

**Edit 3** (line 75, v3.2 Phase 36b deferred list item for LAYOUT-04):

old_string:
```
- LAYOUT-04: `.netlify/netlify.toml` `[build] command`
```

new_string:
```
- LAYOUT-04: Build-script invocation mechanism (Makefile / pre-commit / CI — TBD in 36b planning)
```

**Edit 4** (line 78, v3.2 Phase 36b deferred list item for LAYOUT-12):

old_string:
```
- LAYOUT-12: Netlify deploy smoke-test (prerequisite: user must trigger a test deploy and verify the 76 MB `tailwindcss` binary executes)
```

new_string:
```
- LAYOUT-12: Local `./build.sh` byte-identity smoke-test (run build, diff against checked-in pages, verify zero drift). The 76 MB `tailwindcss` binary runs only locally during dev; nginx serves compiled `css/styles.css` directly.
```

**Edit 5** (line 82, Approach paragraph under Phase 36b section):

old_string:
```
**Approach:** Build-time shell splice via `scripts/build-pages.sh` + `build.sh` + `netlify.toml [build] command` integration. See `.planning/research/ARCHITECTURE.md` for full pattern.
```

new_string:
```
**Approach:** Build-time shell splice via `scripts/build-pages.sh` + `build.sh`, triggered by Makefile target / pre-commit hook / CI step (exact mechanism TBD in Phase 36b planning). See `.planning/research/ARCHITECTURE.md` for the original pattern (note the top-of-file supersession banner — research assumed Netlify, deploy target was reverted to nginx 2026-04-07).
```
  </action>
  <verify>
    <automated>
# Zero Netlify references in any of the 5 active docs (case-insensitive)
for f in \
  .planning/REQUIREMENTS.md \
  .planning/ROADMAP.md \
  .planning/STATE.md \
  .planning/MILESTONES.md \
  .planning/milestones/v3.1-MILESTONE-AUDIT.md; do
  cd /Users/mikhail/Projects/Medicus_video_consult-landing
  if grep -iq netlify "$f"; then
    echo "FAIL: $f still contains Netlify references"
    grep -in netlify "$f"
    exit 1
  else
    echo "OK: $f is clean"
  fi
done

# REQUIREMENTS.md has the new LAYOUT-04 language
grep -q 'Makefile target, pre-commit hook, or CI step' /Users/mikhail/Projects/Medicus_video_consult-landing/.planning/REQUIREMENTS.md && echo "OK: LAYOUT-04 rewritten"

# REQUIREMENTS.md has the new LAYOUT-12 language
grep -q 'byte-for-byte' /Users/mikhail/Projects/Medicus_video_consult-landing/.planning/REQUIREMENTS.md && echo "OK: LAYOUT-12 rewritten"

# ROADMAP.md Phase 36 goal no longer references Netlify
grep -q 'deploy-target-agnostic' /Users/mikhail/Projects/Medicus_video_consult-landing/.planning/ROADMAP.md && echo "OK: ROADMAP Phase 36 goal rewritten"
    </automated>
  </verify>
  <done>
- REQUIREMENTS.md, ROADMAP.md, STATE.md, MILESTONES.md, v3.1-MILESTONE-AUDIT.md all return 0 matches on `grep -i netlify`
- LAYOUT-04 and LAYOUT-12 in REQUIREMENTS.md carry the new locked-decision language
- ROADMAP.md Phase 36 goal describes build-time splice as deploy-target-agnostic, no Netlify mention
- v3.1-MILESTONE-AUDIT.md deviation #2 explains the 2026-04-07 revert as a post-milestone correction (preserving history)
  </done>
</task>

<task type="auto">
  <name>Task 3: Rewrite Phase 36 artifacts — 36-CONTEXT.md and 36-SUMMARY.md</name>
  <files>.planning/phases/36-shared-layout-primitives/36-CONTEXT.md, .planning/phases/36-shared-layout-primitives/36-SUMMARY.md</files>
  <action>
Surgical edits across 2 Phase 36 artifacts.

**3a. `.planning/phases/36-shared-layout-primitives/36-CONTEXT.md` — 5 edits**

**Edit 1** (line 10, Phase Boundary paragraph — removes the "do not modify netlify.toml" guard since netlify.toml no longer exists):

old_string:
```
Normalize header + footer + sticky-bar + mobile menu drift across all 5 production HTML pages into a canonical form. Bake `aria-current="page"` consistently. Add router.js first-load nav sync, mobile menu event delegation, and bfcache pageshow listener. **Do NOT extract to partials/, do NOT create build scripts, do NOT modify netlify.toml.**
```

new_string:
```
Normalize header + footer + sticky-bar + mobile menu drift across all 5 production HTML pages into a canonical form. Bake `aria-current="page"` consistently. Add router.js first-load nav sync, mobile menu event delegation, and bfcache pageshow listener. **Do NOT extract to partials/, do NOT create build scripts.**
```

**Edit 2** (line 12, Phase 36b deferral rationale):

old_string:
```
Phase 36b (extraction + build pipeline + Netlify deploy verification) is deferred to v3.2 or a focused follow-up session where user can verify the 76MB `tailwindcss` binary executes under Netlify build image.
```

new_string:
```
Phase 36b (extraction + build pipeline + build-script invocation mechanism) is deferred to v3.2 or a focused follow-up session. Deploy target is nginx (CLAUDE.md canonical); the 76 MB `tailwindcss` binary runs only locally during dev, so no build-image compatibility spike is needed. Invocation mechanism (Makefile / pre-commit / CI) is a 36b planning decision.
```

**Edit 3** (line 35, deferred scope list item for LAYOUT-04):

old_string:
```
- LAYOUT-04: `netlify.toml` `[build] command`
```

new_string:
```
- LAYOUT-04: Build-script invocation mechanism (Makefile / pre-commit / CI)
```

**Edit 4** (line 38, deferred scope list item for LAYOUT-12):

old_string:
```
- LAYOUT-12: Netlify deploy smoke-test with checked-in tailwindcss
```

new_string:
```
- LAYOUT-12: Local `./build.sh` byte-identity smoke-test
```

**Edit 5** (line 172, deferred ideas bullet):

old_string:
```
- Build script + netlify.toml (v3.2 Phase 36b)
```

new_string:
```
- Build script + invocation mechanism (Makefile / pre-commit / CI) (v3.2 Phase 36b)
```

---

**3b. `.planning/phases/36-shared-layout-primitives/36-SUMMARY.md` — 3 edits**

**Edit 1** (line 47, scope note):

old_string:
```
This plan covers the drift-normalization subset of Phase 36. Build-pipeline extraction (partials/, build-pages.sh, netlify.toml) is deferred to Phase 36b (v3.2).
```

new_string:
```
This plan covers the drift-normalization subset of Phase 36. Build-pipeline extraction (partials/, build-pages.sh, build-script invocation mechanism) is deferred to Phase 36b (v3.2).
```

**Edit 2** (line 63, deferred list for LAYOUT-04):

old_string:
```
- LAYOUT-04: netlify.toml build command
```

new_string:
```
- LAYOUT-04: Build-script invocation mechanism (Makefile / pre-commit / CI)
```

**Edit 3** (line 66, deferred list for LAYOUT-12):

old_string:
```
- LAYOUT-12: Netlify deploy smoke-test
```

new_string:
```
- LAYOUT-12: Local `./build.sh` byte-identity smoke-test
```

Note: Do NOT touch the 36-SUMMARY.md frontmatter or gate verification section — those are historical records of what actually shipped.
  </action>
  <verify>
    <automated>
cd /Users/mikhail/Projects/Medicus_video_consult-landing
for f in \
  .planning/phases/36-shared-layout-primitives/36-CONTEXT.md \
  .planning/phases/36-shared-layout-primitives/36-SUMMARY.md; do
  if grep -iq netlify "$f"; then
    echo "FAIL: $f still contains Netlify references"
    grep -in netlify "$f"
    exit 1
  else
    echo "OK: $f is clean"
  fi
done

# CONTEXT.md has the new invocation-mechanism language
grep -q 'Makefile / pre-commit / CI' /Users/mikhail/Projects/Medicus_video_consult-landing/.planning/phases/36-shared-layout-primitives/36-CONTEXT.md && echo "OK: CONTEXT.md rewritten"
    </automated>
  </verify>
  <done>
- 36-CONTEXT.md and 36-SUMMARY.md return 0 matches on `grep -i netlify`
- 36-CONTEXT.md Phase Boundary paragraph no longer mentions netlify.toml
- 36-CONTEXT.md deferral rationale explains nginx pivot and removes the "76MB binary under Netlify build image" concern
- 36-SUMMARY.md deferred list shows the new LAYOUT-04 and LAYOUT-12 language
  </done>
</task>

<task type="auto">
  <name>Task 4: Add supersession banner to research/SUMMARY.md and research/ARCHITECTURE.md (body preserved)</name>
  <files>.planning/research/SUMMARY.md, .planning/research/ARCHITECTURE.md</files>
  <action>
**Approach (a) — per locked decision 8:** Add a supersession banner at the top of each research file. Body is untouched. This preserves the audit trail of what was researched on 2026-04-07 while marking it clearly as superseded.

**4a. `.planning/research/SUMMARY.md` — 1 Edit (insert banner)**

Use Edit tool to insert the banner between the H1 line and the `**Project:**` metadata line.

old_string:
```
# Research Synthesis — v3.1 Site Foundation & Audit Fixes

**Project:** MedicusUnion KZ
```

new_string:
```
# Research Synthesis — v3.1 Site Foundation & Audit Fixes

> [!NOTE]
> **Superseded 2026-04-07.** This research reflects a Netlify deploy target assumption that was reverted. The project's canonical deploy target is nginx (see `CLAUDE.md` § Technology Stack / Infrastructure, unchanged since v1.0). The build-time shell splice approach (`partials/` + `scripts/build-pages.sh` + `build.sh`) described below is still valid — it is deploy-target-agnostic — but the `netlify.toml [build] command` wiring is no longer applicable. For current Phase 36b language, see `.planning/REQUIREMENTS.md` (LAYOUT-04, LAYOUT-12) and `.planning/ROADMAP.md` Phase 36. This document is preserved as a historical record of research conducted on 2026-04-07.

**Project:** MedicusUnion KZ
```

**4b. `.planning/research/ARCHITECTURE.md` — 1 Edit (insert banner)**

old_string:
```
# Architecture Research — v3.1 Site Foundation & Audit Fixes

**Researched:** 2026-04-07
```

new_string:
```
# Architecture Research — v3.1 Site Foundation & Audit Fixes

> [!NOTE]
> **Superseded 2026-04-07.** This research reflects a Netlify deploy target assumption that was reverted. The project's canonical deploy target is nginx (see `CLAUDE.md` § Technology Stack / Infrastructure, unchanged since v1.0). The build-time shell splice approach (`partials/` + `scripts/build-pages.sh` + `build.sh`) described below is still valid — it is deploy-target-agnostic — but the `netlify.toml [build] command` wiring is no longer applicable. For current Phase 36b language, see `.planning/REQUIREMENTS.md` (LAYOUT-04, LAYOUT-12) and `.planning/ROADMAP.md` Phase 36. This document is preserved as a historical record of research conducted on 2026-04-07.

**Researched:** 2026-04-07
```

**Explicit non-goals for this task:**
- Do NOT modify the body of either file beyond inserting the banner
- Do NOT rewrite the "CRITICAL CORRECTIONS" sections, the tables, the recommendation sections, or any other body content
- Do NOT touch the pitfalls, confidence assessments, or open questions sections
- The banner is the only change
  </action>
  <verify>
    <automated>
cd /Users/mikhail/Projects/Medicus_video_consult-landing

# Banner is present in both files
grep -q 'Superseded 2026-04-07' .planning/research/SUMMARY.md && echo "OK: SUMMARY.md has banner"
grep -q 'Superseded 2026-04-07' .planning/research/ARCHITECTURE.md && echo "OK: ARCHITECTURE.md has banner"

# Banner is near the top of each file (within first 10 lines)
head -10 .planning/research/SUMMARY.md | grep -q 'Superseded' && echo "OK: SUMMARY.md banner is at top"
head -10 .planning/research/ARCHITECTURE.md | grep -q 'Superseded' && echo "OK: ARCHITECTURE.md banner is at top"

# Body is preserved — these body-only strings must still exist
grep -q 'The most critical finding' .planning/research/SUMMARY.md && echo "OK: SUMMARY.md body preserved"
grep -q 'CRITICAL CORRECTIONS TO MILESTONE BRIEF' .planning/research/ARCHITECTURE.md && echo "OK: ARCHITECTURE.md body preserved"
    </automated>
  </verify>
  <done>
- Both research files have the supersession banner within their first 10 lines
- Both banners reference CLAUDE.md as the canonical deploy target source and point to REQUIREMENTS.md / ROADMAP.md for current Phase 36b language
- Body content of both files is byte-identical to pre-edit state (spot-check: "The most critical finding" and "CRITICAL CORRECTIONS TO MILESTONE BRIEF" still present)
- Research files are the ONLY place in the repo where `Netlify` may still appear as a historical reference, and they're clearly marked as superseded
  </done>
</task>

<task type="auto">
  <name>Task 5: Clean .continue-here.md and run full-repo verification grep</name>
  <files>.planning/.continue-here.md</files>
  <action>
**5a. `.planning/.continue-here.md` — 2 edits**

**Edit 1** (line ~58, the "Did NOT batch-commit" decision log entry — remove `.netlify/` from the list since the directory no longer exists):

old_string:
```
- **Did NOT batch-commit untracked files** (`.netlify/`, `debug/`, `quick/`, `DESIGN-SYSTEM.md`, etc.). Milestone commit must be focused on milestone artifacts only.
```

new_string:
```
- **Did NOT batch-commit untracked files** (`debug/`, `quick/`, `DESIGN-SYSTEM.md`, etc.). Milestone commit must be focused on milestone artifacts only.
```

**Edit 2** (line ~89, the working tree bullet that describes `.netlify/`):

old_string:
```
  - `.netlify/` — Netlify CLI workspace, probably gitignored intent
```

new_string:
```
```

Note: Edit 2 deletes the entire line (replace with empty string). This is a session-handoff doc describing a past state; removing a now-irrelevant bullet is cleaner than leaving a dangling "— deleted 2026-04-07" marker.

---

**5b. Full-repo verification grep (the final gate):**

Run this bash command and capture output:

```bash
cd /Users/mikhail/Projects/Medicus_video_consult-landing
grep -rn -i 'netlify' . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir='.planning/milestones/v1.0-research' \
  --include='*.md' \
  --include='*.toml' \
  --include='*.json' \
  --include='.gitignore' \
  2>&1 | grep -v '^Binary file' || echo "CLEAN: zero netlify references repo-wide"
```

**Expected matches after full cleanup:**
- `.planning/research/SUMMARY.md` — multiple matches in the body (preserved historical content) + 1 banner line
- `.planning/research/ARCHITECTURE.md` — multiple matches in the body (preserved historical content) + 1 banner line
- ZERO matches in every other file

**If any non-research file returns a match, the task is incomplete.** Go back and fix it.

Also run this narrower check that asserts the active docs are clean:

```bash
cd /Users/mikhail/Projects/Medicus_video_consult-landing
FAILED=0
for f in \
  .planning/REQUIREMENTS.md \
  .planning/ROADMAP.md \
  .planning/STATE.md \
  .planning/MILESTONES.md \
  .planning/milestones/v3.1-MILESTONE-AUDIT.md \
  .planning/phases/36-shared-layout-primitives/36-CONTEXT.md \
  .planning/phases/36-shared-layout-primitives/36-SUMMARY.md \
  .planning/.continue-here.md \
  .gitignore \
  CLAUDE.md; do
  if grep -iq netlify "$f" 2>/dev/null; then
    echo "FAIL: $f contains Netlify"
    FAILED=1
  fi
done
test "$FAILED" = "0" && echo "ALL CLEAN" || exit 1

# CLAUDE.md is byte-unchanged — spot-check a known nginx line
grep -q 'Nginx | Latest | Reverse proxy' CLAUDE.md && echo "OK: CLAUDE.md nginx line intact"

# .netlify directory does not exist
test ! -e .netlify && echo "OK: .netlify directory removed"
```
  </action>
  <verify>
    <automated>
cd /Users/mikhail/Projects/Medicus_video_consult-landing

# .continue-here.md is clean
! grep -iq netlify .planning/.continue-here.md && echo "OK: .continue-here.md clean"

# Final active-docs gate
FAILED=0
for f in \
  .planning/REQUIREMENTS.md \
  .planning/ROADMAP.md \
  .planning/STATE.md \
  .planning/MILESTONES.md \
  .planning/milestones/v3.1-MILESTONE-AUDIT.md \
  .planning/phases/36-shared-layout-primitives/36-CONTEXT.md \
  .planning/phases/36-shared-layout-primitives/36-SUMMARY.md \
  .planning/.continue-here.md \
  .gitignore \
  CLAUDE.md; do
  if grep -iq netlify "$f" 2>/dev/null; then
    echo "FAIL: $f"
    FAILED=1
  fi
done
test "$FAILED" = "0" && echo "ACTIVE DOCS ALL CLEAN"

# CLAUDE.md byte-unchanged spot-check
grep -q 'Nginx | Latest | Reverse proxy' CLAUDE.md && echo "OK: CLAUDE.md nginx line intact"

# .netlify directory gone
test ! -e .netlify && echo "OK: .netlify removed"

# Research docs still have the banner AND still have their body content
grep -q 'Superseded 2026-04-07' .planning/research/SUMMARY.md && echo "OK: SUMMARY banner present"
grep -q 'Superseded 2026-04-07' .planning/research/ARCHITECTURE.md && echo "OK: ARCHITECTURE banner present"
grep -q 'The most critical finding' .planning/research/SUMMARY.md && echo "OK: SUMMARY body preserved"
grep -q 'CRITICAL CORRECTIONS TO MILESTONE BRIEF' .planning/research/ARCHITECTURE.md && echo "OK: ARCHITECTURE body preserved"
    </automated>
  </verify>
  <done>
- `.continue-here.md` returns 0 matches on `grep -i netlify`
- All 10 listed active files (REQUIREMENTS, ROADMAP, STATE, MILESTONES, MILESTONE-AUDIT, 36-CONTEXT, 36-SUMMARY, .continue-here, .gitignore, CLAUDE.md) return 0 matches on `grep -i netlify`
- CLAUDE.md spot-check confirms the nginx stack line is byte-unchanged
- `.netlify/` directory is gone
- Research docs (SUMMARY.md, ARCHITECTURE.md) retain both the supersession banner AND the original body content
- Final full-repo `grep -ri 'netlify'` returns matches ONLY from the two research files (historical record) — zero hits anywhere else
  </done>
</task>

</tasks>

<verification>

## Plan-level verification (after all 5 tasks complete)

```bash
cd /Users/mikhail/Projects/Medicus_video_consult-landing

# 1. Filesystem — .netlify gone
test ! -e .netlify && echo "✓ .netlify removed"

# 2. .gitignore clean
! grep -iq netlify .gitignore && echo "✓ .gitignore clean"

# 3. All active docs clean
for f in \
  .planning/REQUIREMENTS.md \
  .planning/ROADMAP.md \
  .planning/STATE.md \
  .planning/MILESTONES.md \
  .planning/milestones/v3.1-MILESTONE-AUDIT.md \
  .planning/phases/36-shared-layout-primitives/36-CONTEXT.md \
  .planning/phases/36-shared-layout-primitives/36-SUMMARY.md \
  .planning/.continue-here.md; do
  ! grep -iq netlify "$f" && echo "✓ $f clean"
done

# 4. CLAUDE.md byte-unchanged (git diff should be empty)
git diff --exit-code CLAUDE.md && echo "✓ CLAUDE.md unchanged"

# 5. Research docs have banner + preserved body
grep -q 'Superseded 2026-04-07' .planning/research/SUMMARY.md && echo "✓ SUMMARY banner"
grep -q 'Superseded 2026-04-07' .planning/research/ARCHITECTURE.md && echo "✓ ARCHITECTURE banner"

# 6. LAYOUT-04 + LAYOUT-12 have new language in REQUIREMENTS.md
grep -q 'Makefile target, pre-commit hook, or CI step' .planning/REQUIREMENTS.md && echo "✓ LAYOUT-04 new language"
grep -q 'byte-for-byte' .planning/REQUIREMENTS.md && echo "✓ LAYOUT-12 new language"

# 7. No production source file touched
git diff --name-only | grep -E '\.(html|css|js)$' && echo "FAIL: source files touched" || echo "✓ no source files touched"
```

</verification>

<success_criteria>

1. `.netlify/` directory deleted from disk; `.gitignore` has zero Netlify lines
2. `grep -ri 'netlify'` across the repo returns matches ONLY from `.planning/research/SUMMARY.md` and `.planning/research/ARCHITECTURE.md` (historical, banner-marked)
3. LAYOUT-04 in REQUIREMENTS.md reads: "Build-script invocation mechanism (Makefile target, pre-commit hook, or CI step — exact mechanism to be decided when Phase 36b is planned). MUST be reproducible and idempotent."
4. LAYOUT-12 in REQUIREMENTS.md reads: "Smoke-test `./build.sh` locally and verify resulting HTML matches checked-in pages byte-for-byte (no drift). The 76 MB checked-in `tailwindcss` binary runs only locally during dev — nginx serves the already-compiled `css/styles.css`."
5. ROADMAP.md Phase 36 goal describes build-time splice as deploy-target-agnostic, chosen over nginx SSI for `file://` preview compatibility
6. Both research docs (`research/SUMMARY.md`, `research/ARCHITECTURE.md`) carry a clearly-dated supersession banner in their first 10 lines, with bodies byte-preserved
7. `git diff CLAUDE.md` is empty (CLAUDE.md byte-unchanged)
8. `git diff` shows zero production source file changes (no `.html`, `.css`, `.js` modifications)
9. v3.1-MILESTONE-AUDIT.md deviation #2 is rewritten to explain the 2026-04-07 revert as a post-milestone correction (preserving historical context)

</success_criteria>

<output>
After completion, create `.planning/quick/260407-lho-remove-netlify-from-project-deploy-targe/260407-lho-SUMMARY.md` documenting:
- Files deleted (`.netlify/` directory)
- Files edited (list with brief change description per file)
- Final verification grep output (showing only the 2 research files + banner references)
- Commit hash(es) — expect 1 or 2 atomic commits: either all-in-one "chore: remove Netlify, revert deploy target to nginx" OR split into "chore: delete .netlify/ + .gitignore cleanup" and "docs: revert deploy target to nginx across planning artifacts"
- Confirmation that CLAUDE.md and production source files are byte-unchanged
</output>
