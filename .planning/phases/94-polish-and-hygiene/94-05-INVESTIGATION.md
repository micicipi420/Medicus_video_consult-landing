# Phase 94 Plan 05 — Canonical Next Location Investigation

**Date:** 2026-05-01
**Goal:** Confirm whether `./src/` (repo root) is a duplicate Next.js app or legacy non-build content.

## 1. Top-level package.json (proves no repo-root Next app)

```
$ ls -la package.json next/package.json 2>&1
ls: package.json: No such file or directory
-rw-r--r--  1 mikhail  staff  1099 May  1 09:03 next/package.json
```

There is **no** repo-root `package.json`. `next/package.json` is the only Node project manifest.

## 2. Repo-root `src/` tree (should be ONLY styles/)

```
$ find src -maxdepth 3 -type d
src
src/styles

$ find src -maxdepth 3 -type f | head -20
src/styles/theme.css
src/styles/liquid-glass.css
src/styles/tailwind.css
src/styles/squircles.css
src/styles/fonts.css
```

Only `src/styles/` with 5 vanilla CSS files. **No `app/`, no `components/`, no TSX, no JS.** Not a Next.js app.

## 3. Canonical Next src tree

```
$ find next/src -maxdepth 2 -type d
next/src
next/src/app
next/src/app/checkup
next/src/app/contacts
next/src/app/admin
next/src/app/treatment-abroad
next/src/app/consultations
next/src/app/api
next/src/app/test-glass
next/src/styles
next/src/components
next/src/components/ui
next/src/components/sections
next/src/components/layout
next/src/components/motion
next/src/components/effects
next/src/hooks
next/src/lib
next/src/lib/blob-engine
next/src/lib/db
next/src/fonts
```

The full Next App Router tree lives under `next/src/`.

## 4. Imports of root-level `src/styles` from inside `next/src/` — should be 0

```
$ grep -rnE "from ['\"](\.\./)+src/styles|from ['\"]/src/styles|from ['\"]src/styles" next/src/
(no imports found)
```

**0 ESM imports of root `src/styles` from anywhere in `next/src/`.**

## 5. CSS @import / url() of root-level src/styles inside next/src — should be 0

```
$ grep -rnE "@import.*[\"'](\.\./)*src/styles|url\(.*src/styles" next/src/
(no css refs found)
```

**0 CSS imports.**

## 6. Any reference to `src/styles` in `next/` at all (excluding historical "ported verbatim" comment)

```
$ grep -rn "src/styles" next/ --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json" --include="*.config.*"
next/src/app/globals.css:13:/* 3. Root tokens (ported verbatim from src/styles/theme.css :root) */
next/src/styles/liquid-glass.css:2: * src/styles/liquid-glass.css
next/src/styles/squircles.css:2: * src/styles/squircles.css
```

All 3 hits are **comments**, not imports:
- `globals.css:13` — provenance comment from the v6.0 Phase 59 port
- `liquid-glass.css:2` — stale file-header path comment (file now lives at `next/src/styles/`)
- `squircles.css:2` — stale file-header path comment

None are runtime references.

## 7. Total size of legacy `src/` tree

```
$ du -sh src/
 80K	src/

$ ls -la src/styles/
total 160
-rw-r--r--  1 mikhail  staff    535 May  1 09:03 fonts.css
-rw-r--r--  1 mikhail  staff  38412 May  1 09:03 liquid-glass.css
-rw-r--r--  1 mikhail  staff   4591 May  1 09:03 squircles.css
-rw-r--r--  1 mikhail  staff    242 May  1 09:03 tailwind.css
-rw-r--r--  1 mikhail  staff  23085 May  1 09:03 theme.css
```

5 vanilla CSS files, 80K total.

## 8. Git history — last modification of each src/styles/ file

```
$ git log -1 --format='%ai %h %s' -- src/styles/*.css
2026-05-01 07:29:14 +0700 a67deb6 v9.0 Living Blob Liquid Glass Scene — Phases 90–93 (#3)
```

(Last touched only by mass-merge commits; no semantic edit since v6.0 port.)

## 9. Git log — was src/styles ever in the build path?

```
$ git log --all --oneline --diff-filter=D -- src/styles/ | head -10
a8f02cb feat(62-01): create /contacts page with 4 section components
f8391bd feat(60-02): add Header, HeaderClient, MobileMenu, and useScrolled hook
e13da0a feat(59-02): port liquid-glass.css and squircles.css with backdrop-filter fix
b5b7202 fix(52-01): delete dead index.css and remove unused green ramp tokens
```

Phase 59 commit `e13da0a` is the port-into-Next event. After that, `src/styles/` was a porting reference, not a build input.

## Conclusion

**Path A — canonical = `next/src/`, root `./src/` is unreachable legacy.**

Proofs:
1. No repo-root `package.json` (no top-level Next app exists)
2. `next/package.json` is the only Node manifest
3. Zero ESM imports of `src/styles` from `next/src/`
4. Zero CSS `@import` / `url()` references to `src/styles` inside `next/src/`
5. Only references are 3 historical comments (provenance + stale file headers)
6. Git history shows port was complete in v6.0 Phase 59; `src/styles/` is dead since then

**Recommendation:** delete `./src/styles/` (and `./src/` itself if empty after).

## User Decision Required

**Pre-approved by orchestrator** per the worktree task brief:

> Pre-approved checkpoints (do NOT pause for user)
> 94-05 Task 0 / Task 2 (./src/styles/ deletion checkpoint): APPROVED. Investigation has confirmed `./src/` at repo root is legacy vanilla CSS leftovers (only contains `./src/styles/` with 5 .css files + 1 .bak), NOT a duplicate Next.js app. Canonical Next.js app lives at `./next/src/`. Proceed with `rm -rf ./src/styles/` (and `./src/` itself if it becomes empty after that). Document reasoning in SUMMARY.

Selection: **`delete-src`**. Proceeding to Task 3.

(Note: the working tree contains 5 .css files but no `theme.css.bak` — the orchestrator's brief mentions "+1 .bak" but on this branch base `bccb95d` only the 5 css files exist. No discrepancy for the deletion outcome.)
