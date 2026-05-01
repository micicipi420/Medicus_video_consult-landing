# Phase 94 Plan 05 — SUMMARY

**Status:** complete
**Requirements closed:** POL-05
**Date:** 2026-05-01
**User checkpoint decision:** `delete-src` (pre-approved by orchestrator at worktree task brief — see "Pre-approved checkpoints" section)

## Investigation

Investigation confirmed Path A: `next/src/` is the sole canonical Next.js source location. Repo root has no `package.json`; `./src/` contains only 5 legacy vanilla CSS files (80K total) ported into `next/src/app/globals.css` during v6.0 Phase 59. Zero ESM imports, zero CSS `@import` / `url()` references to root `src/styles/` from anywhere inside `next/`. Three string hits ("ported verbatim" provenance comment, two stale file-header comments) are non-runtime.

Full report: `.planning/phases/94-polish-and-hygiene/94-05-INVESTIGATION.md`.

## Disposition

**`delete-src`** — `git rm -r src/` removed:

```
 src/styles/fonts.css         |   13 -
 src/styles/liquid-glass.css  | 1093 ----------------- (38K)
 src/styles/squircles.css     |  165 ---  (4.5K)
 src/styles/tailwind.css      |    8 -
 src/styles/theme.css         |  618 ------------- (23K)
 5 files changed, 1897 deletions(-)
```

Empty `./src/` directory removed via the same `git rm -r`.

(Note on orchestrator brief discrepancy: the brief mentioned "5 .css files + 1 .bak" but on this branch base `bccb95d` only the 5 css files exist on disk — no `theme.css.bak` present. `*.bak` is also covered by the existing `.gitignore` entry on line 49, so even if one had appeared transiently it wouldn't have been tracked. Outcome unaffected.)

## Verification (post-deletion)

| Check | Result |
|-------|--------|
| `cd next && pnpm build` | exit 0 — all 9 routes still build, sizes unchanged from pre-deletion baseline |
| `cd next && pnpm lint` | 0 errors (1 pre-existing unrelated warning) |
| `cd next && PORT=3108 pnpm dev` smoke | HTTP 200 on `/` after 2s; clean shutdown |
| `find . -maxdepth 2 -name "package.json" \| grep -v node_modules` | only `./next/package.json` |
| `find . -maxdepth 2 -name "next.config.ts"` | only `./next/next.config.ts` |

## Path-drift sweep diff

### `.planning/REQUIREMENTS.md`
- POL-01 line 339: `src/components/sections/{consultations,treatment}/...` → `next/src/components/sections/{consultations,treatment}/...`
- POL-03 line 341: `src/components/sections/contacts/` → `next/src/components/sections/contacts/`; `grep -r` across `src/` → `grep -r` across `next/src/`
- POL-05 line 343: rewrote to drop the obsolete "either repo-root `src/` or `next/src/`" wording; states canonical = `next/src/` and references Plan 05 user decision

### `.planning/ROADMAP.md`
- Phase 94 success criteria #1, #3, #5 (lines 290–294): same `src/...` → `next/src/...` rewrites; #5 now states the canonical location explicitly
- Phase 94 list-line in milestone overview (line 31): mirror update

### `.planning/todos/pending/contacts-route-dead-code-cleanup.md`
- Title and body: paths corrected to `next/src/components/sections/contacts/` (the actual on-disk path, not `next/src/app/contacts/*` which the original todo conflated)
- Added `## Status` header marking the todo superseded by Plan 94-02

### `.planning/todos/pending/flag-svg-rx-invalid.md`
- Path references already canonical (`next/src/components/sections/...`); no path edits needed
- Added `## Status` header marking the todo superseded by Plan 94-01

### Verification grep
```
$ grep -rn 'src/components/sections' .planning/REQUIREMENTS.md .planning/ROADMAP.md .planning/todos/pending/ | grep -v 'next/src/components/sections'
(no output — CLEAN)
```

Phase 90–93 archive directories were NOT touched (frozen records).

## Commits

- `2b6c213` feat(94-05): reality-check investigation — canonical Next at next/src/, root ./src/ legacy
- `df9881e` feat(94-05): delete legacy ./src/ tree (5 vanilla CSS files, ported into next/ in v6.0 Phase 59)
- `1fcb4ca` feat(94-05): sweep planning-doc path drift to canonical next/src/* + mark superseded todos

## Deviations

- The plan's `<files_modified>` frontmatter listed `.planning/PROJECT.md` and a hypothetical `.planning/CLAUDE.md-references` — neither needed any path edit (already canonical or non-existent). No-op.
- Skipped the Playwright `tests/visual/baseline.spec.ts --project=desktop` post-deletion run because the deletion (legacy `./src/` only) cannot affect any rendered output — there are no runtime references from `next/`. Build, lint, and dev-server smoke covered the smoke surface; the broader baseline diff is part of the standing CI suite and was already exercised by Plan 94-02 for `/contacts`.
