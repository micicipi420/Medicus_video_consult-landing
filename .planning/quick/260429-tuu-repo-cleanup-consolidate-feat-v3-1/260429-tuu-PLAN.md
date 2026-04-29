---
quick_id: 260429-tuu
title: "Repo cleanup: consolidate в feat/v3.1"
status: in-progress
date: 2026-04-29
---

# Repo cleanup: consolidate в feat/v3.1

## Goal

Навести порядок в репо:
1. Закоммитить массовое удаление `.planning/phases/*.md` (cleanup-коммит).
2. Консолидировать ветки в `feat/v3.1` (single source of truth).
3. Удалить устаревшие `worktree-agent-*` ветки.

## Initial state (snapshot)

- **Current branch:** `feat/v3.1` (HEAD `5feee97`)
- **Branches:**
  - `feat/new-design`, `feat/v3.0` — ✅ already merged into feat/v3.1 (no merge needed)
  - `main` — untouched (per scope)
  - 25 × `worktree-agent-*` — merged → safe to delete
  - 3 × `worktree-agent-*` UNMERGED → need user decision:
    - `worktree-agent-a323f575` (3 commits — phase 01-01 CSS design system, abandoned)
    - `worktree-agent-a6e88c15` (6 commits — phase 68 glass header/footer, superseded by v7.0)
    - `worktree-agent-a8b1454e` (2 commits — phase 27/28 plans, outdated)
- **Working tree:**
  - 140 deleted (`.planning/phases/*.md`)
  - 16 modified (`.planning/research/*` + `next/src/**`) — **OUT OF SCOPE, do not touch**
  - 37 untracked (screenshots, new code, configs) — **OUT OF SCOPE, do not touch**
- **Worktrees:** only main (no orphan worktree directories — branches are leftovers only)

## Tasks

### Task 1: Commit `.planning/phases/*.md` deletions
- **Files:** `.planning/phases/**/*.md` (deletions only — `git add -u .planning/phases/`)
- **Action:** Stage only the deletions under `.planning/phases/`, leave `.planning/research/*` modifications and all `next/src/**` work alone.
- **Verify:** `git status --short | grep -E '^D' | wc -l` returns 0 for paths under `.planning/phases/`.
- **Commit message:** `chore: remove archived phase artifacts (v1.x–v6.x phase docs)`

### Task 2: Confirm feat/v3.0 + feat/new-design are merged
- **Files:** none (read-only check)
- **Action:** Re-verify `git branch --merged feat/v3.1` includes both. No merge action — they're already integrated.
- **Verify:** Both names appear in `git branch --merged feat/v3.1` output.
- **Commit:** none.

### Task 3: Delete 25 merged worktree-agent-* branches
- **Action:** `git branch -d <name>` for each merged branch (safe deletion — `-d` not `-D`).
- **Verify:** `git branch | grep -c worktree-agent-` decreases by 25.
- **Commit:** none.

### Task 4: Decide on 3 unmerged worktree-agent-* branches
- **Checkpoint with user:** show summary of each, ask: delete (`-D`) or keep.
- **Action:** apply user's decision per-branch.
- **Commit:** none.

### Task 5: Prune remote tracking refs
- **Action:** `git remote prune origin`.
- **Verify:** `git status` clean of stale remote refs.
- **Commit:** none.

### Task 6: Final state report
- **Files:** SUMMARY.md.
- **Action:** Write `260429-tuu-SUMMARY.md` with before/after branch counts, link to cleanup commit.

## Out of scope

- ❌ `.planning/research/*` modifications (4 files) — leave as-is.
- ❌ `next/src/**` modifications (12 files) — phase 79 work in progress.
- ❌ Untracked files (screenshots, AGENTS.md, .mcp.json, new components) — separate decisions.
- ❌ `main` branch — untouched.
- ❌ Remote pushes — purely local cleanup.

## Risks

- **Unmerged branch deletion:** uses `-d` first (safe), `-D` only after explicit user confirmation per-branch.
- **Mixed working tree:** must use targeted staging (`git add -u .planning/phases/`) — not `git add -A`.
- **No force operations:** zero force-push, zero `--no-verify`, zero hard resets.
