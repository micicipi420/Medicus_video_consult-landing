---
quick_id: 260429-uus
title: "Design system docs alignment"
status: in-progress
date: 2026-04-29
---

# Design system docs alignment

## Goal

Закоммитить накопленные за сессию правки документации проекта тремя атомарными коммитами + сохранить артефакты quick-task.

## Tasks

### Task 1: DESIGN.md (root) — Google Labs spec compliant
- **Files:** `DESIGN.md` (new at repo root)
- **Action:** stage + commit untracked DESIGN.md.
- **Content:** YAML front matter (colors / typography / rounded / spacing / components + custom shapes block), markdown body in canonical section order (Overview → Colors → Typography → Layout → Elevation → Shapes → Components → Do's and Don'ts), custom sections (Brand Parity Rule / Apple Liquid Glass HIG / Audit Baseline). Squircles as mandatory shape system.
- **Commit:** `docs(design): add root DESIGN.md per Google Labs spec — squircles mandate, brand parity, Apple HIG`

### Task 2: PROJECT.md — expand to 3-service hub
- **Files:** `.planning/PROJECT.md`
- **Changes:** rewrite "What This Is" (treatment abroad primary, checkup, consultations), expand "Core Value", remove "Out of Scope: Медтуризм" contradiction, add Audience section with B2B secondary, restructure Context with Stack history (vanilla → Next.js v6.0+), add Known TODOs about page numbers inconsistency, update Constraints to reflect Next.js + Tailwind stack.
- **Commit:** `docs(project): expand to 3-service hub — treatment abroad primary, B2B secondary, Next.js stack history`

### Task 3: CLAUDE.md — sync project section + design contract reference
- **Files:** `CLAUDE.md`
- **Changes:** sync GSD-marker Project block from PROJECT.md (3 services + B2B + Next.js stack); insert Design Contract section between Architecture and GSD Workflow Enforcement, referencing root `DESIGN.md` and Google Labs spec.
- **Commit:** `docs(claude): sync project section + reference DESIGN.md as design contract`

### Task 4: Quick-task artifacts + STATE.md
- **Files:** `.planning/quick/260429-uus-…/{PLAN,SUMMARY,CONTEXT}.md`, `.planning/STATE.md`
- **Commit:** `docs(quick-260429-uus): design system docs alignment`

## Out of scope

- `.planning/research/*.md` modifications (4 files) — phase 79 WIP
- 12 modified files under `next/src/**` — phase 79 WIP
- 36 untracked screenshots and other non-markdown files
- Page-level number inconsistencies (43/11 vs 100+/6 vs 7) — addressed via TODO in PROJECT.md, separate copy-полировочный таск

## must_haves

- Truths:
  - DESIGN.md must comply with Google Labs spec (YAML front matter + canonical section order)
  - Treatment abroad is the primary offer (not consultations)
  - Squircles are the mandatory shape system
- Artifacts: 4 atomic commits, PLAN.md, SUMMARY.md, CONTEXT.md, updated STATE.md
- Key links: `DESIGN.md`, `.planning/PROJECT.md`, `CLAUDE.md`
