---
phase: 39-partials-extraction-build-pipeline
verified: 2026-04-08T15:55:00Z
status: passed
score: 8/8 must-haves verified
---

# Phase 39: Partials Extraction & Build Pipeline Verification Report

**Phase Goal:** Shared chrome (header, footer, sticky-bar, mobile-menu) lives in a single source of truth, and any contributor can regenerate the 6 production HTML pages byte-for-byte via one canonical command (`make build`). Chrome drift becomes structurally impossible — fixing a link in the footer touches one file, not six.

**Verified:** 2026-04-08T15:55:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria + PLAN must_haves)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | **Byte-identity gate (hard):** Running `make build` on clean checkout produces all 6 HTML pages byte-for-byte identical to committed versions | VERIFIED | Ran `./scripts/build-pages.sh` and `git diff --quiet -- '*.html'` → exit 0. Also verified via direct splicer, idempotent second run, `./build.sh`, and `make check` — all 4 paths exit 0 |
| 2 | **Single source of truth:** `partials/{header,footer,sticky-bar,mobile-menu}.html` exist at repo root with canonical chrome content | VERIFIED | All 4 files exist: header.html (26 lines), footer.html (61 lines), sticky-bar.html (6 lines), mobile-menu.html (18 lines). Header contains `header__inner`, footer contains `footer__wrapper`/`footer__grid`/`footer__bottom`, sticky-bar contains `sticky-bar__container`, mobile-menu contains `mobile-menu__nav`. Token placeholders present: `{{CTA_HREF}}`, `{{CTA_LABEL}}`, `{{LOGO_ARIA_CURRENT}}`, 4 `{{NAV_HEADER_*}}`, 4 `{{NAV_MOBILE_*}}` |
| 3 | **Canonical entry point:** `make build` runs tailwindcss then splicer; `./build.sh` is thin delegator | VERIFIED | `make build` compiled Tailwind (`Done in 87ms`), ran splicer (`6 pages processed`), exit 0, clean HTML diff. `./build.sh` (8 lines, `exec make build "$@"`) produced identical behaviour. Makefile target `build: install-tailwind` ensures fresh-clone bootstrap |
| 4 | **POSIX-sh + awk splicer with token substitution:** `scripts/build-pages.sh` is POSIX (not bash), implements marker state machine, supports 11-token vocabulary | VERIFIED | `#!/bin/sh` shebang, `set -eu`, `sh -n` passes, 247 lines. Contains all 11 token references (`{{CTA_HREF}}`, `{{CTA_LABEL}}`, `{{LOGO_ARIA_CURRENT}}`, 4 `NAV_HEADER_*`, 4 `NAV_MOBILE_*`). W3 metacharacter pre-filter present (`FATAL: BUILD:vars metadata ... contains shell metacharacter`), W4 pipe guard present (`assert_no_pipe`). Error mode test: moving `partials/footer.html` away triggers `[build-pages] FATAL: missing partials/footer.html` |
| 5 | **BUILD markers on all 6 HTML pages:** Each page has exactly one `BUILD:vars` block + 4 `BUILD:{partial}`/`/BUILD:{partial}` marker pairs at column 0 | VERIFIED | All 6 pages (index, online-consultations, treatment-abroad, checkup, contacts, 404) have: 1 `BUILD:vars` line with correct CTA_HREF/CTA_LABEL/CURRENT_PAGE values, 1 open+1 close of each partial marker (header, footer, sticky-bar, mobile-menu). Grep-verified via anchored `^<!-- BUILD:` patterns |
| 6 | **7th-page 0-edit invariant (LAYOUT-11):** A new page can be created with only body + markers; splicer produces full chrome | VERIFIED | Fresh dry-run test: created `test-page-39-verify.html` with `BUILD:vars CTA_HREF=#test CTA_LABEL="Тест" CURRENT_PAGE=404` + 4 empty BUILD marker pairs. Ran `./scripts/build-pages.sh test-page-39-verify.html` → all 4 chrome regions present (`header__inner`, `footer__wrapper`, `sticky-bar__container`, `mobile-menu__nav`), both tokens substituted (`href="#test"`, `>Тест<`). Grew from 14 lines → 126 lines. Test file cleaned up |
| 7 | **Makefile with required targets:** `build`, `check`, `install-hooks`, `install-tailwind`, `clean` targets present with `.PHONY` | VERIFIED | 108 lines, all 5 targets + `help` present, `.PHONY: build check install-hooks install-tailwind clean help` declared. `TAILWIND_VERSION := v4.2.2` pinned, GitHub releases URL constructed from platform/arch detection via `uname`. `$(PAGES)` is single source of truth passed to splicer as positional args. `install-hooks` is dual-mode (regular clone + worktree via `git rev-parse --git-common-dir`) |
| 8 | **Pre-commit hook enforces byte-identity at commit time (LAYOUT-13):** `scripts/hooks/pre-commit` tracked, executable, POSIX-sh, runs `make build`, checks `git diff --quiet -- '*.html'`, does NOT auto-stage | VERIFIED | `scripts/hooks/pre-commit` (62 lines, `0755`, `#!/bin/sh`, `set -eu`, `sh -n` passes). Runs `cd "$(git rev-parse --show-toplevel)"`, then `make build`, then `git diff --quiet -- '*.html'`. On drift prints `[pre-commit] BLOCKED` HEREDOC with re-staging instructions and exits 1. No `git add` statements (grep confirmed). Plan 03 SUMMARY documents synthetic drift test: hook ran, detected 6 page drift, blocked commit, HEAD unchanged |

**Score:** 8/8 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|---------|--------|---------|
| `partials/header.html` | Canonical header chrome with 7 tokens | VERIFIED | 26 lines, contains `header__inner`, `{{CTA_HREF}}`, `{{CTA_LABEL}}`, `{{LOGO_ARIA_CURRENT}}`, 4 `{{NAV_HEADER_*}}` tokens. О нас link hardcoded to `index.html#why-us` |
| `partials/footer.html` | Canonical footer chrome (byte-identical across all 6 pages, no tokens) | VERIFIED | 61 lines, no `{{` placeholders (fully static), contains `footer__wrapper`, `footer__grid`, `footer__bottom`, `footer__contact-icon` |
| `partials/sticky-bar.html` | Canonical sticky-bar with CTA tokens | VERIFIED | 6 lines, contains `sticky-bar__container`, `sticky-bar__phone`, `btn-primary sticky-bar__cta`, `{{CTA_HREF}}`, `{{CTA_LABEL}}` |
| `partials/mobile-menu.html` | Canonical mobile-menu with 6 tokens | VERIFIED | 18 lines, contains `mobile-menu-overlay`, `mobile-menu__nav`, 4 `{{NAV_MOBILE_*}}` + `{{CTA_HREF}}` + `{{CTA_LABEL}}` |
| `scripts/build-pages.sh` | POSIX-sh + awk marker splicer with token substitution | VERIFIED | 247 lines, `#!/bin/sh`, `set -eu`, executable, `sh -n` passes, contains all 11 token references, W3 metacharacter guard, W4 pipe guard, `DEFAULT_PAGES` fallback |
| `Makefile` | Build + check + install-hooks + install-tailwind + clean + help targets | VERIFIED | 108 lines, `.PHONY` declared, 6 targets, `$(PAGES)` canonical page list, pinned `TAILWIND_VERSION := v4.2.2`, dual-mode `install-hooks` (regular + worktree) |
| `build.sh` | Thin delegator to `make build` | VERIFIED | 8 lines, executable, `#!/bin/sh`, `set -eu`, `exec make build "$@"`, `sh -n` passes, `./build.sh` produced identical behaviour to `make build` in test |
| `scripts/hooks/pre-commit` | Pre-commit hook running `make build` + byte-identity gate | VERIFIED | 62 lines, `#!/bin/sh`, `set -eu`, executable, `sh -n` passes, contains `make build` + `git diff --quiet -- '*.html'` + `BLOCKED` message HEREDOC, zero `git add` statements |
| `docs/BUILD.md` | Contributor docs covering install + pipeline + 7th-page + hook | VERIFIED | 207 lines, sections: Quick start, `make build`, Chrome partials, BUILD:vars, Adding a 7th page, Page-list fallback hierarchy, Pre-commit hook behavior, Troubleshooting. References `make install-hooks`, `make install-tailwind`, `make build`, all 4 partial paths, `BUILD:vars`, `CTA_HREF`, `CTA_LABEL`, `CURRENT_PAGE`, `DEFAULT_PAGES`, `pre-commit` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `scripts/build-pages.sh` | `partials/*.html` | awk state machine reads marker blocks | WIRED | All 4 partial names referenced (`BUILD:header`, `BUILD:footer`, `BUILD:sticky-bar`, `BUILD:mobile-menu`); splicer runs end-to-end on all 6 pages, produces correct content |
| 6 HTML pages | `partials/header.html` | `<!-- BUILD:header -->` / `<!-- /BUILD:header -->` marker pair | WIRED | All 6 pages have matching open/close header markers; splicer replaces block contents; byte-identity gate confirms correct substitution |
| Makefile `build` target | `tailwindcss` + `scripts/build-pages.sh` | Shell command sequence (`./tailwindcss -i ... -o ...; ./scripts/build-pages.sh $(PAGES)`) | WIRED | `make build` observed running both steps with correct output; `$(PAGES)` passed as positional args |
| Makefile `check` target | `build` + `git diff --quiet -- '*.html'` | Target dependency + shell guard | WIRED | `check: build` dependency; `make check` runs build then byte-identity assertion; observed `[check] OK: no chrome drift` on clean tree |
| `.git/hooks/pre-commit` symlink | `scripts/hooks/pre-commit` | `make install-hooks` creates symlink | WIRED (contract) | `make install-hooks` re-created correct relative symlink `../../scripts/hooks/pre-commit` when invoked in main repo; install target is dual-mode for regular clones and worktrees. See Anti-Pattern section for current local-state issue |
| `scripts/hooks/pre-commit` | `make build` + `git diff --quiet -- '*.html'` | Hook runs build, then byte-identity check, prints BLOCKED on drift | WIRED | Hook source contains both commands; Plan 03 synthetic drift test verified hook fires and blocks commits |

### Behavioral Spot-Checks (Step 7b)

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Splicer runs end-to-end on default page list | `./scripts/build-pages.sh` | 6 "updated (4 partials)" lines + "done (6 pages processed)", exit 0 | PASS |
| LAYOUT-12 byte-identity (direct splicer) | `./scripts/build-pages.sh && git diff --quiet -- '*.html'` | exit 0 | PASS |
| LAYOUT-12 idempotency (second run) | Second splicer run + byte-identity check | exit 0 | PASS |
| `make build` end-to-end | `make build && git diff --quiet -- '*.html'` | Tailwind compiled in 87ms + splicer + exit 0 | PASS |
| `./build.sh` delegator equivalence | `./build.sh && git diff --quiet -- '*.html'` | Identical output to `make build`, exit 0 | PASS |
| `make check` byte-identity gate | `make check` | `[check] OK: no chrome drift`, exit 0 | PASS |
| POSIX-sh syntax check (splicer) | `sh -n scripts/build-pages.sh` | Silent, exit 0 | PASS |
| POSIX-sh syntax check (build.sh) | `sh -n build.sh` | Silent, exit 0 | PASS |
| POSIX-sh syntax check (hook) | `sh -n scripts/hooks/pre-commit` | Silent, exit 0 | PASS |
| Splicer error mode (missing partial) | Temporarily remove `partials/footer.html`, run splicer | `[build-pages] FATAL: missing partials/footer.html`, non-zero exit | PASS |
| LAYOUT-11 7th-page dry-run | Create minimal page with only BUILD markers, run splicer, grep for all 4 chrome BEM roots | All 4 regions (`header__inner`, `footer__wrapper`, `sticky-bar__container`, `mobile-menu__nav`) spliced in; `href="#test"` + `>Тест<` substituted; grew from 14 → 126 lines; file cleaned up afterward | PASS |
| `make install-hooks` (re-install) | `make install-hooks` in main repo (temp) | Created correct `.git/hooks/pre-commit -> ../../scripts/hooks/pre-commit` symlink (restored prior state afterward to avoid verification side-effect) | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| LAYOUT-01 | 39-02 | `partials/` directory exists at repo root with header/footer/sticky-bar/mobile-menu as single source of truth | SATISFIED | 4 files present, correct line counts (26/61/6/18), canonical BEM content, token placeholders |
| LAYOUT-02 | 39-02 | `scripts/build-pages.sh` is a shell-based marker splicer | SATISFIED | 247-line POSIX-sh + awk + sed script, marker state machine, 11-token vocabulary, W3+W4 injection guards, error modes exit non-zero with FATAL messages |
| LAYOUT-03 | 39-03 | `build.sh` at repo root is top-level orchestrator | SATISFIED | 8-line thin delegator (`exec make build "$@"`), executable, produces byte-identical result to `make build` |
| LAYOUT-04 | 39-03 | `Makefile` with `make build` as canonical entry point | SATISFIED | 108-line Makefile, 6 targets (build/check/install-hooks/install-tailwind/clean/help), `.PHONY` declared, `$(PAGES)` canonical list |
| LAYOUT-05 | 39-01, 39-02 | BUILD markers present on all 6 HTML pages at every chrome insertion point | SATISFIED | All 6 pages have 1 BUILD:vars + 4 BUILD:{partial}/close marker pairs (24 marker pairs total verified), 404.html chrome normalized to canonical BEM in Plan 01 to make extraction possible |
| LAYOUT-11 | 39-03 | 7th-page 0-edit invariant verified — new page needs only body + markers | SATISFIED | Fresh dry-run during verification: 14-line minimal page with only body + 4 empty marker pairs, splicer produced 126-line page with all 4 chrome regions + token substitution |
| LAYOUT-12 | 39-02 | Byte-identity smoke test — `make build` on clean checkout produces HTML byte-for-byte identical | SATISFIED | Confirmed via 4 independent paths: direct splicer, splicer second run (idempotent), `make build`, `./build.sh`, and `make check`. All exit 0 with `git diff --quiet -- '*.html'` clean |
| LAYOUT-13 | 39-03 | Pre-commit hook calls `make build`, blocks drifted commits; contributor installs via one-liner | SATISFIED | `scripts/hooks/pre-commit` tracked (62 lines, POSIX-sh, executable) with correct contract (make build + git diff gate + BLOCKED message + no auto-stage). `make install-hooks` is the documented one-liner (docs/BUILD.md Quick Start section). Install target verified functional via re-install test |

**All 8 phase 39 requirements SATISFIED.** No orphaned requirements.

### Data-Flow Trace (Level 4)

Not applicable — Phase 39 produces build-time artifacts (static HTML, shell scripts, Makefile). There is no dynamic data rendering. The "data flow" here is build-time: partials → splicer → HTML pages, which is fully exercised by the LAYOUT-12 byte-identity gate.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `.git/hooks/pre-commit` (local state) | — | Broken symlink pointing to deleted worktree path `.claude/worktrees/agent-a2cfb632/scripts/hooks/pre-commit` | Info | The currently-installed hook symlink in the main repo's `.git/hooks/pre-commit` is stale from a prior parallel-executor worktree run (that worktree has been cleaned up). `test -e .git/hooks/pre-commit` returns false. This is **local installation state**, not a repo artifact: the tracked source file `scripts/hooks/pre-commit` is correct and `make install-hooks` re-creates the correct relative symlink in a single command. A contributor in this specific clone should run `make install-hooks` to refresh the link. Does NOT block LAYOUT-13 because the requirement is that the contract exists and the one-liner install works — both verified |
| `css/styles.css` (local state) | 1 | One-line drift after `make build` run (cosmetic Tailwind minify variance) | Info | Documented in Plan 03 SUMMARY as a known Plan 02 artifact: the checked-in `css/styles.css` was minified by a slightly different v4.2.2 binary build. This does NOT affect `make check` (which filters to `*.html` only) and does NOT violate LAYOUT-12 (HTML byte-identity gate is HTML-scoped). Not a phase 39 deliverable issue |

No blocker or warning anti-patterns. No TODO/FIXME/stub comments in phase 39 deliverables. All scripts parse cleanly under POSIX sh.

### Human Verification Required

None. All phase 39 success criteria are either fully automated-verifiable (byte-identity gate, file existence, marker presence, POSIX-sh syntax, grep-based content checks) or were verified in-phase via Plan 03's synthetic drift test (hook firing on real git commit attempt). No visual/UX/external-service concerns.

The hook's real-world "blocks a commit" behavior was verified during Plan 03 execution via the documented synthetic drift test (edit footer partial → stage only partial → attempt commit → hook ran `make build`, detected 6 drifted pages, printed BLOCKED, exit 1, HEAD unchanged). Re-running this test here would require making a dirty working-tree modification and is unnecessary because the hook source is static and was grepped for all required behaviors.

### Gaps Summary

No gaps found. Phase 39 goal achieved:

- **Chrome drift is structurally impossible.** 4 partials are the single source of truth. Editing any partial + running `make build` propagates to all 6 pages. Direct edits to HTML chrome regions are overwritten.
- **Byte-identity gate holds.** 5 independent verification paths all confirm `git diff --quiet -- '*.html'` exits 0 after build.
- **7th-page invariant proven in a fresh closed-loop dry-run.** Minimum-viable new page skeleton + `./scripts/build-pages.sh` = fully-chromed page.
- **Pre-commit hook contract complete.** Tracked source file + documented one-liner install + dual-mode install-hooks target + byte-identity gate + BLOCKED error message + no auto-stage. Synthetic drift test during Plan 03 proved the hook fires on real commits.
- **All 8 LAYOUT requirements satisfied** (LAYOUT-01, 02, 03, 04, 05, 11, 12, 13).

The only noteworthy local-state issue is a stale `.git/hooks/pre-commit` symlink pointing to a deleted worktree path, which is a contributor hygiene issue resolvable by a single `make install-hooks` invocation. It does not reflect a defect in any tracked artifact.

---

*Verified: 2026-04-08T15:55:00Z*
*Verifier: Claude (gsd-verifier)*
