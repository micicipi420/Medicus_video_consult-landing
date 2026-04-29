---
quick_id: 260429-uus
title: "Design system docs alignment"
status: complete
date: 2026-04-29
commit: 2fa86b5
---

# Summary: Design system docs alignment

## Outcome

Alignment of project documentation with actual scope of `medicusunion.kz` and adoption of Google Labs' open-source DESIGN.md format.

## Commits (atomic)

| Hash | Subject |
|------|---------|
| `633d3b6` | docs(design): add root DESIGN.md per Google Labs spec |
| `5dcc9c5` | docs(project): expand to 3-service hub — treatment abroad primary |
| `2fa86b5` | docs(claude): sync project section + reference DESIGN.md |

## Changes per file

### `DESIGN.md` (new, repo root) — 589 lines
- YAML front matter: 30+ colors, 8 typography tokens, 6 rounded steps, 9 spacing steps, 12 components.
- Custom `shapes` block defining squircle contract (sm/md/lg/xl/full with status, mask refs, native corner radii, 3-tier rendering strategy).
- Markdown body in canonical Google spec order (Overview → Colors → Typography → Layout → Elevation → Shapes → Components → Do's and Don'ts).
- Custom sections: Brand Parity Rule, Apple Liquid Glass HIG Compliance, Audit Baseline & Known Gaps.
- Squircles mandatory for all visible rounded UI; plain border-radius forbidden in components.
- 6 anti-patterns documented (border on squircle, box-shadow + mask, filter drop-shadow, rotation, plain rounded-* Tailwind, mixed siblings).

### `.planning/PROJECT.md` — substantial rewrite
- *What This Is* expanded from "video consultations" to "3-service hub" with treatment abroad as primary offer.
- *Core Value* broadened beyond consultations.
- Removed "Out of Scope: Медтуризм" (direct contradiction with shipped pages).
- Added *Audience* (primary KZ 45+, secondary B2B for checkup).
- *Stack history*: vanilla v1.0–v5.0 → Next.js + React + TS + Tailwind from v6.0+.
- *Known TODOs* about page-level number inconsistency (43/11 vs 100+/6 vs 7).

### `CLAUDE.md` — sync + design contract
- GSD-marker Project block synced from PROJECT.md.
- New Design Contract section (between Architecture and GSD Workflow Enforcement) referencing root DESIGN.md and Google Labs spec.

## Out of scope (untouched)

- `.planning/research/*.md` (4 modified files) — phase 79 WIP
- 12 modified files under `next/src/**` — phase 79 WIP
- 36 untracked screenshots and other non-markdown files
- Page-level number inconsistencies — flagged as TODO in PROJECT.md, addressed in a future copy task

## Branch

All commits on `feat/v3.1` (single source of truth).
