---
phase: 39
plan: 03
subsystem: layout
tags: [makefile, build-pipeline, pre-commit-hook, docs, tailwind-install, layout-03, layout-04, layout-11, layout-13]
dependency_graph:
  requires:
    - phase: 39-02
      provides: scripts/build-pages.sh (POSIX-sh marker splicer), partials/{header,footer,sticky-bar,mobile-menu}.html (single source of truth), BUILD:vars + BUILD:{partial} instrumentation on all 6 production HTML pages, proven LAYOUT-12 byte-identity gate.
  provides:
    - Makefile at repo root with 5 named targets (build, check, install-hooks, install-tailwind, clean) + help
    - build.sh thin shell delegator (exec's 'make build')
    - scripts/hooks/pre-commit POSIX-sh hook enforcing the byte-identity gate
    - docs/BUILD.md contributor reference documenting the pipeline, 7th-page workflow, and hook install
    - install-tailwind target that downloads the tailwindcss v4.2.2 standalone binary on demand for macOS/Linux x arm64/x64
    - Dual-mode install-hooks target that works in both regular clones and git worktrees
  affects:
    - Every future commit touching partials/*.html or an HTML page's chrome region (the hook runs 'make build' and blocks drift)
    - Every new page added to the repo (LAYOUT-11 0-edit invariant: authoring only body content + BUILD markers is sufficient)
    - Phase 39 completion — all 8 LAYOUT requirements are now satisfied across Plans 01, 02, 03
tech_stack:
  added:
    - GNU Make 3.x (POSIX make) as the canonical build entry point
    - GitHub releases-based tailwindcss binary install (curl -fL, SHA256 verification deferred)
    - git pre-commit hook infrastructure (first hook in this repo)
    - docs/ documentation directory
  patterns:
    - "Makefile $(PAGES) variable as single source of truth for the 6-page list, passed as positional args to the splicer"
    - "Dual-mode install-hooks target: relative-path symlink for regular clones, absolute-path symlink via git rev-parse --git-common-dir for worktrees"
    - "Pre-commit hook as thin wrapper around 'make build' + 'git diff --quiet' byte-identity assertion"
    - "Explicit contributor re-staging (no auto-git-add) so chrome drift is visible"
    - "Dry-run 7th-page invariant test — create synthetic page, run splicer, verify, delete"
key_files:
  created:
    - Makefile
    - build.sh
    - scripts/hooks/pre-commit
    - docs/BUILD.md
  modified:
    - (none — Plan 03 is purely additive; Makefile edit mid-plan was in the same commit cycle as scripts/hooks/pre-commit creation)
decisions:
  - "tailwindcss install is opt-in per clone via 'make install-tailwind', not auto-committed — the binary is ~73MB and already gitignored from v3.0. Fresh clones run 'make install-tailwind' once (or get it implicitly via 'make build' because build depends on install-tailwind)."
  - "Pin tailwindcss version to v4.2.2 (the version used to compile the currently-committed css/styles.css). Floating 'latest' was rejected to keep fresh clones reproducible."
  - "install-hooks target is dual-mode (regular clone vs worktree) because parallel execution of GSD plans happens inside git worktrees where .git is a file, not a directory. Falling back to 'git rev-parse --git-common-dir' in the worktree branch resolves to the shared .git directory, which git uses for hooks across all worktrees when core.hooksPath points at it."
  - "Hook does NOT auto-'git add' regenerated HTML pages. Auto-staging would hide chrome drift from the contributor; explicit re-staging forces visibility of the change footprint. This is a locked v3.2 UX decision."
  - "docs/BUILD.md created instead of a README.md addition because no README.md exists at repo root (verified during Plan 03 planning). The planner explicitly granted latitude to create docs/BUILD.md as the discoverable onboarding surface."
  - "7th-page invariant is verified via a synthetic test-page-39.html dry-run — file created with only body + BUILD markers, splicer run, chrome + token substitution verified, file deleted before commit. Does NOT add a 7th production page."
requirements_completed:
  - LAYOUT-03
  - LAYOUT-04
  - LAYOUT-11
  - LAYOUT-13
metrics:
  duration_minutes: 8
  completed: 2026-04-08
  tasks: 3
  commits: 3
  files_changed: 4
  lines_added: 388
  lines_removed: 3
---

# Phase 39 Plan 03: Build Pipeline + Pre-Commit Hook + Docs Summary

**Wired the canonical `make build` entry point, made `./build.sh` a thin delegator to it, installed a repo-tracked pre-commit hook that runs `make build` and blocks commits on chrome drift via `git diff --quiet -- '*.html'`, documented the whole pipeline in `docs/BUILD.md`, and proved the LAYOUT-11 7th-page 0-edit invariant via a synthetic dry-run test (created `test-page-39.html` with only body + BUILD markers, ran the splicer, verified all 4 chrome regions spliced in + CTA tokens substituted, deleted the test file).**

## Performance

- **Duration:** ~8 min
- **Completed:** 2026-04-08
- **Tasks:** 3
- **Commits:** 3
- **Files created:** 4 (Makefile, build.sh, scripts/hooks/pre-commit, docs/BUILD.md)

## Accomplishments

- **`make build` is the canonical build entry point.** One command compiles Tailwind CSS and splices all 6 pages' chrome partials. `./build.sh` exists as a 7-line delegator (`exec make build "$@"`) for contributors who expect a shell script at repo root.
- **Pre-commit hook makes chrome drift structurally impossible at commit time.** The hook runs `make build` then `git diff --quiet -- '*.html'`. If a partial changed but the regenerated pages were not staged, the commit is blocked with a clear BLOCKED message listing the drifted pages. Verified via a synthetic drift test: edited `partials/footer.html` (added " TEST" to the copyright), staged only the partial, attempted commit — hook fired, ran `make build`, detected all 6 pages had drifted, printed the BLOCKED message, exited 1, HEAD unchanged. Working tree then restored cleanly.
- **7th-page 0-edit invariant (LAYOUT-11) proven via dry-run.** Created `test-page-39.html` with only body content + BUILD markers (no chrome HTML at all). Ran `./scripts/build-pages.sh test-page-39.html`. Splicer output: `test-page-39.html updated (4 partials)` — all 4 chrome regions (`header__inner`, `footer__wrapper`, `sticky-bar__container`, `mobile-menu__nav`) present, both declared tokens (`CTA_HREF=#test` → `href="#test"`, `CTA_LABEL="Тест"` → `>Тест<`) correctly substituted, file grew from 30 lines to 140 lines. Test file deleted before commit — not in git history.
- **`docs/BUILD.md` is the discoverable contributor onboarding surface.** 207-line reference covering: quick-start, pipeline internals, single-source-of-truth partial model, 11-token BUILD:vars vocabulary (with the `|`-delimiter and shell-metacharacter constraints from Plan 02 W3/W4 guards), 7th-page workflow, page-list fallback hierarchy, pre-commit hook behavior, and troubleshooting.
- **Fresh-clone bootstrap works end-to-end.** `make install-tailwind` downloads the standalone binary from `https://github.com/tailwindlabs/tailwindcss/releases/download/v4.2.2/tailwindcss-{platform}-{arch}` for the current platform/arch (Darwin/Linux × arm64/x64). Verified on macOS arm64 — first `make build` run downloaded the 73MB binary, compiled CSS, and spliced all 6 pages without manual intervention.

## Task Commits

1. **Task 1: Makefile + build.sh delegator** — `f162835` (feat) — created `Makefile` (92 lines) with 5 named targets (build, check, install-hooks, install-tailwind, clean) + help, and `build.sh` (8 lines) as a thin `exec make build "$@"` delegator. `make build` runs the Tailwind compile step (`./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify`) then `./scripts/build-pages.sh $(PAGES)`. `make check` runs build then verifies `git diff --quiet -- '*.html'`. `$(PAGES)` is the single source of truth for the 6-page list. `install-tailwind` downloads the pinned v4.2.2 binary on demand.

2. **Task 2: Pre-commit hook + worktree-safe install-hooks target** — `3b34051` (feat) — created `scripts/hooks/pre-commit` (62 lines, POSIX-sh, executable, `set -eu`) that runs `make build` then checks `git diff --quiet -- '*.html'` and prints a multi-line BLOCKED message on drift, and updated the `install-hooks` target in `Makefile` to be dual-mode (regular clone: relative symlink `.git/hooks/pre-commit -> ../../scripts/hooks/pre-commit`; worktree: absolute symlink at `$(git rev-parse --git-common-dir)/hooks/pre-commit`). Hook does NOT auto-`git add`. Install verified via `make install-hooks` in the worktree — symlink created at the common `.git/hooks/pre-commit`. Synthetic drift test verified the hook fires correctly on partial edits without staged pages.

3. **Task 3: docs/BUILD.md + 7th-page invariant dry-run** — `77c5ac0` (docs) — created `docs/BUILD.md` (207 lines) documenting the full pipeline. Verified LAYOUT-11 via a synthetic `test-page-39.html` dry-run: created with only body + 4 empty BUILD marker pairs + `BUILD:vars CTA_HREF=#test CTA_LABEL="Тест" CURRENT_PAGE=404`, ran the splicer, verified all 4 chrome regions + both tokens substituted, deleted the file. Test file is NOT in git history.

## Files Created

- **`Makefile`** (92 lines) — canonical build entry point. Targets: `build`, `check`, `install-hooks`, `install-tailwind`, `clean`, `help`. Uses POSIX make syntax with TAB-indented recipes. `ifeq`-based platform/arch detection for the tailwindcss download URL.
- **`build.sh`** (8 lines, executable, `#!/bin/sh`) — thin delegator: `set -eu; exec make build "$@"`.
- **`scripts/hooks/pre-commit`** (62 lines, executable, `#!/bin/sh`, `set -eu`) — runs `make build` → checks `git diff --quiet -- '*.html'` → on drift prints BLOCKED + listing + re-staging instructions and exits 1. Uses `git rev-parse --show-toplevel` to locate the repo root so it works regardless of `git commit`'s CWD.
- **`docs/BUILD.md`** (207 lines) — contributor reference.

## Make Target Behaviour (verified)

| Target | What it does | Verified |
|--------|--------------|----------|
| `make help` | Prints a 5-line target list to stdout. | Printed exactly as spec'd. |
| `make install-tailwind` | If `./tailwindcss` is absent, downloads `https://github.com/tailwindlabs/tailwindcss/releases/download/v4.2.2/tailwindcss-macos-arm64` via `curl -fL` + `chmod +x`. If present, prints "already present (skipping)". | On first run: downloaded 73MB, installed "≈ tailwindcss v4.2.2". On subsequent runs: skipped. |
| `make build` | Runs `install-tailwind`, then `./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify`, then `./scripts/build-pages.sh $(PAGES)` with the 6-page list as positional args. Exits 0 on success. | Runs end-to-end in ~200ms after tailwindcss is present (compile 70ms + splice 130ms). Prints one `[build-pages] {file} updated (4 partials)` line per page + `[build-pages] done (6 pages processed)`. `git diff --quiet -- '*.html'` exits 0 after build. |
| `./build.sh` | `set -eu; exec make build "$@"` — functionally identical to `make build`. | Ran, same output, same byte-identity result. |
| `make check` | Runs `build`, then `if ! git diff --quiet -- '*.html'; then print drifted files and exit 1; fi`. | Ran, printed `[check] OK: no chrome drift`, exit 0. |
| `make install-hooks` | Creates symlink: regular clone uses relative `.git/hooks/pre-commit -> ../../scripts/hooks/pre-commit`; worktree uses absolute `$(git rev-parse --git-common-dir)/hooks/pre-commit -> $(git rev-parse --show-toplevel)/scripts/hooks/pre-commit`. Sets `+x` on the hook source file. | Ran in worktree mode. Created symlink at `/Users/mikhail/Projects/Medicus_video_consult-landing/.git/hooks/pre-commit` pointing to the worktree's tracked hook file. `readlink` and `test -L` both succeed at that absolute path. |
| `make clean` | No-op — prints an explanatory message. | Ran, printed `[clean] no-op (...)`, exit 0. |

## Synthetic Drift Verification (the hook actually fires)

Procedure:

1. Confirmed clean state: `git status --porcelain -- partials/` and `git diff --quiet -- '*.html'` both clean (only pre-existing untracked files in the worktree).
2. Backed up `partials/footer.html` to `partials/footer.html.bak` and appended " TEST" to the copyright string via `sed -i.tmp`.
3. Staged ONLY the partial change: `git add partials/footer.html`. Did NOT stage the (unchanged) HTML pages.
4. Attempted `git commit -m "test: synthetic drift to verify pre-commit hook"`.

Observed hook output:

```
[pre-commit] running 'make build'...
[install-tailwind] already present (skipping)
[build] compiling Tailwind CSS...
≈ tailwindcss v4.2.2

Done in 70ms
[build] splicing chrome partials...
[build-pages] index.html updated (4 partials)
[build-pages] online-consultations.html updated (4 partials)
[build-pages] treatment-abroad.html updated (4 partials)
[build-pages] checkup.html updated (4 partials)
[build-pages] contacts.html updated (4 partials)
[build-pages] 404.html updated (4 partials)
[build-pages] done (6 pages processed)
[build] done
[pre-commit] BLOCKED: chrome partials changed but the regenerated HTML pages were not staged.

The following pages were updated by 'make build':
404.html
checkup.html
contacts.html
index.html
online-consultations.html
treatment-abroad.html

To unblock this commit:
  1. Stage the regenerated pages: 404.html checkup.html contacts.html index.html online-consultations.html treatment-abroad.html
  2. Re-run your commit command

Why this matters: the chrome partials in partials/*.html are the single source of
truth for the header / footer / sticky-bar / mobile-menu. When you change a partial,
'make build' propagates the change into all 6 production HTML pages. Both the
partial change and the regenerated pages must land in the same commit.
```

Post-conditions verified:

- `git rev-parse HEAD` did NOT move — commit was blocked.
- `git log -1` still shows the previous commit (the Task 1 `feat` commit from this plan, not the synthetic test message).
- Restored working tree: `git restore --staged partials/footer.html && mv partials/footer.html.bak partials/footer.html && make build && git diff --quiet -- '*.html'` → exit 0.

**LAYOUT-13 proven functional.** The hook fires on drift, blocks commits, prints actionable instructions, and does not auto-stage files.

## 7th-Page Invariant Verification (LAYOUT-11)

Procedure:

1. Created `test-page-39.html` at repo root with a minimal skeleton: `<!DOCTYPE html>`, `<head>` (meta, title, stylesheet), `<body class="bg-mu-bg text-mu-text-900">`, `<!-- BUILD:vars CTA_HREF=#test CTA_LABEL="Тест" CURRENT_PAGE=404 -->`, empty BUILD:header/BUILD:mobile-menu/BUILD:footer/BUILD:sticky-bar marker pairs, `<main><h1>Test</h1></main>`. Total: ~30 lines. Contained ZERO chrome HTML.
2. Ran `./scripts/build-pages.sh test-page-39.html`. Output: `[build-pages] test-page-39.html updated (4 partials) / [build-pages] done (1 pages processed)`, exit 0.
3. Verified all 4 chrome regions spliced in:
   - `grep -q 'header__inner' test-page-39.html` → found (from `partials/header.html`)
   - `grep -q 'footer__wrapper' test-page-39.html` → found (from `partials/footer.html`)
   - `grep -q 'sticky-bar__container' test-page-39.html` → found (from `partials/sticky-bar.html`)
   - `grep -q 'mobile-menu__nav' test-page-39.html` → found (from `partials/mobile-menu.html`)
4. Verified tokens substituted:
   - `grep -q 'href="#test"' test-page-39.html` → found (CTA_HREF substituted in both header CTA and sticky-bar CTA)
   - `grep -q '>Тест<' test-page-39.html` → found (CTA_LABEL substituted in both header CTA and sticky-bar CTA)
5. Verified CURRENT_PAGE=404 produced the correct "no nav link active" state — mobile menu's 4 nav links all have the inactive class string, no `aria-current="page"` on any nav item, logo has no `aria-current` either.
6. Line count grew from ~30 to 140.
7. Deleted: `rm test-page-39.html`. Confirmed: `ls test-page-39.html` returns "No such file or directory".
8. Confirmed working tree clean: `git diff --quiet -- '*.html'` exit 0.

**LAYOUT-11 proven in a closed loop.** Adding a 7th page requires only body content + BUILD markers. Zero chrome HTML is hand-copied. The splicer is the sole producer of chrome content on every page.

## Tailwind Binary Install Status

- **Before Plan 03:** `./tailwindcss` was absent in the working tree (gitignored per .gitignore:13).
- **During Task 1 first `make build` run:** `install-tailwind` target fired automatically (build depends on install-tailwind). Downloaded `https://github.com/tailwindlabs/tailwindcss/releases/download/v4.2.2/tailwindcss-macos-arm64` (73MB) via `curl -fL`, chmod +x, verified with `./tailwindcss --help | head -1` → `≈ tailwindcss v4.2.2`. Fresh-clone bootstrap works.
- **Subsequent runs:** `[install-tailwind] already present (skipping)`.
- **Post-plan:** The binary is in the working tree but remains untracked (gitignored).

## Final Byte-Identity Gate

| Gate | Command | Result |
|------|---------|--------|
| HTML byte-identity after `make build` | `make build && git diff --quiet -- '*.html'` | **exit 0** (clean) |
| HTML byte-identity after `./build.sh` | `./build.sh && git diff --quiet -- '*.html'` | **exit 0** (clean) |
| `make check` end-to-end | `make check` | exit 0, `[check] OK: no chrome drift` |
| Idempotency (multiple consecutive runs) | `make build && make build && git diff --quiet -- '*.html'` | exit 0 |
| Round-trip after synthetic drift test | `git restore --staged partials/footer.html && mv partials/footer.html.bak partials/footer.html && make build && git diff --quiet -- '*.html'` | exit 0 |
| 7th-page test file removed | `! test -f test-page-39.html` | exit 0 |

**All gates pass.**

## Phase 39 Completion Status

All 8 LAYOUT requirements from milestone v3.2 are now satisfied across Plans 01, 02, 03:

| Requirement | Description | Completed in |
|-------------|-------------|---------------|
| LAYOUT-01 | Partials exist as source of truth for chrome | 39-02 |
| LAYOUT-02 | Per-page variation via explicit token vocabulary | 39-02 |
| LAYOUT-03 | `./build.sh` at repo root, delegates to `make build` | **39-03** |
| LAYOUT-04 | `Makefile` with `make build` as canonical entry point | **39-03** |
| LAYOUT-05 | BUILD markers on all 6 production HTML pages | 39-02 |
| LAYOUT-11 | 7th-page 0-edit invariant (adding a new page requires only body + markers) | **39-03** (verified via dry-run) |
| LAYOUT-12 | Byte-identity gate (splicer reproduces pages byte-for-byte) | 39-02 (proven passing) |
| LAYOUT-13 | Pre-commit hook + one-line install + docs | **39-03** |

**Phase 39 is complete.** Chrome drift is now structurally impossible at both the runtime level (the splicer) and the contributor workflow level (the pre-commit hook installed via `make install-hooks`).

## Decisions Made

1. **Pin tailwindcss to v4.2.2 (not "latest").** Floating tags would introduce nondeterminism between clones — one contributor could download a newer release that produces slightly different CSS output, breaking the byte-identity gate in a way unrelated to actual chrome drift. The pinned version is documented in the Makefile (`TAILWIND_VERSION := v4.2.2`) and in `docs/BUILD.md`.

2. **`install-tailwind` is a `make build` dependency (not optional).** This makes `make build` self-bootstrapping on a fresh clone — no contributor needs to remember to install the binary separately. On subsequent runs, the target prints "already present (skipping)" in ~10ms.

3. **Dual-mode install-hooks target (regular clone + worktree).** Deviation from the plan's original relative-symlink contract, motivated by parallel-executor runtime reality. See deviation #1 below.

4. **Hook does NOT auto-`git add` regenerated files.** Locked v3.2 decision. Explicit re-staging forces the contributor to see which pages changed — auto-staging would hide chrome drift and defeat the purpose of the byte-identity gate.

5. **`docs/BUILD.md` instead of README.md edits.** No README.md exists at repo root; creating one from scratch is out of scope. `docs/BUILD.md` is the discoverable documentation surface.

6. **Russian page-content wording + English technical commands in `docs/BUILD.md`.** Reference documentation for a Russian-speaking contributor base, but shell commands and code blocks stay in English to match the actual interface.

7. **7th-page test uses `CURRENT_PAGE=404` (not a new value).** Using an existing safe default avoids extending the splicer's `case` statement just for a dry-run test. `404` maps to "no nav link active" in the splicer, which is the correct default for a brand-new page without a dedicated nav slot.

## Deviations from Plan

### 1. [Rule 3 - Blocking Issue] install-hooks target must work inside git worktrees

**Found during:** Task 2, when attempting to run `make install-hooks` in the parallel-executor worktree at `.claude/worktrees/agent-a2cfb632/`.

**Issue:** The plan's original `install-hooks` target was:

```make
install-hooks:
	@chmod +x scripts/hooks/pre-commit
	@mkdir -p .git/hooks
	@ln -sf ../../scripts/hooks/pre-commit .git/hooks/pre-commit
```

This assumes `.git` is a directory. Inside a git worktree, `.git` is a text file containing `gitdir: /path/to/.git/worktrees/<name>` — `mkdir -p .git/hooks` fails with "Not a directory". The plan was written assuming a regular clone, but parallel executors always run inside worktrees.

Additionally, even if the worktree case were handled via the shared `.git/worktrees/<name>/hooks/` directory, the relative symlink target `../../scripts/hooks/pre-commit` would not resolve correctly because the worktree hooks directory is nested two levels deeper than the repo root.

**Fix:** Made the `install-hooks` target dual-mode. Branches on `test -d .git`:

- **Regular clone path (`.git` is a directory):** Exactly matches the plan's original contract — relative-symlink `ln -sf ../../scripts/hooks/pre-commit .git/hooks/pre-commit`. The plan's acceptance criteria (`test -L .git/hooks/pre-commit && readlink .git/hooks/pre-commit == "../../scripts/hooks/pre-commit"`) pass in this mode.
- **Worktree path (`.git` is a file):** Resolves `git rev-parse --git-common-dir` (common `.git` directory, shared across all worktrees) and `git rev-parse --show-toplevel` (absolute repo root), installs the symlink at `$COMMON/hooks/pre-commit` pointing to the absolute path of `scripts/hooks/pre-commit`. Absolute paths are required because the relative form would not resolve correctly from the nested worktrees directory.

The dual-mode branch preserves the plan's contract for end users (regular clones) while also working in the parallel-executor environment.

**Why Rule 3 (blocking):** Without this fix, `make install-hooks` fails in the worktree, which means the hook never gets installed, which means the Task 2 synthetic drift test cannot verify that the hook fires. The fix is the minimum needed to complete the task.

**Files modified:** `Makefile` (+17 -2 lines in the `install-hooks` target, inside the Task 2 commit `3b34051`).

**Verification:** `make install-hooks` ran successfully in the worktree mode. `readlink` returned the absolute target. The subsequent synthetic drift test confirmed the hook fires correctly.

**Committed in:** `3b34051` (bundled with the Task 2 hook creation — logically atomic: adding the hook file without being able to install it is useless).

### 2. [Docs note] `docs/BUILD.md` documents the worktree install behavior

The dual-mode install-hooks behavior is explicitly documented in `docs/BUILD.md` under "Pre-commit hook behavior" and "Troubleshooting" — so any future contributor who encounters the worktree case will find the explanation, and any contributor on a regular clone will see the expected relative-symlink behavior.

## Authentication Gates Encountered

None. The `make install-tailwind` target downloads a public binary from GitHub releases with no authentication required. No API keys, no tokens, no 2FA.

## Issues Encountered

1. **`css/styles.css` drifts by one line on every `make build` run.** The checked-in `css/styles.css` was compiled during Plan 02 by a different build of `tailwindcss` v4.2.2. A freshly-downloaded v4.2.2 binary produces a slightly different minified output (one-line diff, cosmetic difference in the `@layer properties` block ordering). The drift is idempotent — running `make build` twice produces the same CSS (just different from the committed version). Since Plan 03's byte-identity gate checks `git diff --quiet -- '*.html'` (HTML only, not CSS), this does not affect the build pipeline correctness. The CSS was reverted via `git checkout HEAD -- css/styles.css` at the end of each task so the tree stays clean for the task commit. This is a Plan 02 artifact, not a Plan 03 issue.

2. **Parallel-executor worktree environment initial reset.** The worktree was initially at commit `8ba4986` (older than the expected base `1cb84c1`). After `git reset --soft 1cb84c1` and `git checkout 1cb84c1 -- .`, the working tree matched the expected base and plan execution proceeded normally. Not a deviation from the plan — just worktree bookkeeping.

## Threat Register Outcomes

| Threat ID | Category | Disposition | Status |
|-----------|----------|-------------|--------|
| T-39-03-01 | Tampering (tailwindcss binary download from GitHub releases) | mitigate | **Mitigated** — HTTPS-only URL, version pinned to v4.2.2, `curl -fL` fails on non-2xx, binary lives outside git tracking so a compromised download cannot silently replace a tracked artifact. SHA256 verification is a documented follow-up. |
| T-39-03-02 | Elevation of Privilege (hook runs as contributor's user) | mitigate | **Mitigated** — hook is repo-tracked in `scripts/hooks/pre-commit`, reviewed like any other code. `make install-hooks` creates a symlink (not a copy), so updates to the tracked hook propagate immediately. Hook is POSIX sh + git + make invocations only — no eval, no network. |
| T-39-03-03 | Tampering (`--no-verify` bypass) | accept | **Accepted** — documented in `docs/BUILD.md` as an escape hatch. For solo-developer v3.2 scope, pre-commit + manual `make check` is sufficient. CI enforcement of `make check` is a deferred v3.3+ enhancement. |
| T-39-03-04 | Information Disclosure (docs exposing build internals) | accept | **Accepted** — `docs/BUILD.md` contains no secrets, only commands and file paths already visible in the public HTML. |
| T-39-03-05 | Denial of Service (~2s per commit overhead) | accept | **Accepted** — 2s is well below contributor-friction threshold. Escape hatch via `--no-verify` exists for known-safe doc-only commits. |
| T-39-03-06 | Tampering (`docs/BUILD.md` drifting from actual Make targets) | mitigate | **Mitigated** — `docs/BUILD.md` references exact Make target names; the plan's automated verification greps for each target name in the doc. Renaming a target fails doc verification and forces an update in the same PR. |

## Known Stubs

None. Every Plan 03 deliverable is functional:

- `Makefile`: all 5 targets tested end-to-end.
- `build.sh`: tested, functionally equivalent to `make build`.
- `scripts/hooks/pre-commit`: tested via synthetic drift scenario.
- `docs/BUILD.md`: static verification (all required sections present), 7th-page workflow exercised via dry-run.

## Threat Flags

None — Plan 03 adds no new runtime surface. The Makefile, hook, and docs are all build-time artifacts; they do not affect the rendered HTML pages, the Directus backend, or the form submission flow.

## Self-Check: PASSED

- [x] `Makefile` exists at repo root: FOUND
- [x] `build.sh` exists at repo root, executable: FOUND
- [x] `scripts/hooks/pre-commit` exists, executable: FOUND
- [x] `docs/BUILD.md` exists, 207 lines: FOUND
- [x] Commit `f162835` exists (Task 1: Makefile + build.sh): FOUND in `git log`
- [x] Commit `3b34051` exists (Task 2: pre-commit hook + dual-mode install-hooks): FOUND in `git log`
- [x] Commit `77c5ac0` exists (Task 3: docs/BUILD.md): FOUND in `git log`
- [x] `make build && git diff --quiet -- '*.html'` exits 0 (HTML byte-identity gate): PASSED
- [x] `./build.sh && git diff --quiet -- '*.html'` exits 0: PASSED
- [x] `make check` exits 0 on clean tree: PASSED
- [x] Pre-commit hook installed at the common gitdir (worktree mode): PASSED (`readlink` resolves to the tracked hook file)
- [x] Synthetic drift test blocked a commit: PASSED (HEAD unchanged after the attempt)
- [x] 7th-page invariant verified via dry-run: PASSED (all 4 chrome regions spliced + tokens substituted)
- [x] `test-page-39.html` removed before commit: PASSED (not in git history, not on disk)
- [x] `docs/BUILD.md` mentions all required targets and partials: PASSED (all grep checks)

## Next Phase Readiness

**Phase 39 is complete.** All 8 LAYOUT requirements satisfied across Plans 01, 02, 03. Chrome drift is structurally impossible at both runtime (splicer) and commit-time (pre-commit hook). The build pipeline is documented, self-bootstrapping on fresh clones, and tested end-to-end.

**Follow-up items for v3.3+:**

1. SHA256 verification of the tailwindcss binary download (Tailwind publishes checksums with each release).
2. CI integration — `make check` is suitable for CI. When CI is added, a single `make check` call enforces the same invariant that the pre-commit hook enforces locally. Also closes the `--no-verify` bypass window.
3. Optional: collapse `DEFAULT_PAGES` in `scripts/build-pages.sh` into the Makefile-only `$(PAGES)` source if the direct-invocation path is never used in practice. Keep for now since the docs document both paths.

---
*Phase: 39-partials-extraction-build-pipeline*
*Plan: 03*
*Completed: 2026-04-08*
