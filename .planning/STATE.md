---
gsd_state_version: 1.0
milestone: v3.1
milestone_name: Site Foundation & Audit Fixes
status: active
stopped_at: Defining requirements for v3.1 (6 phases locked: 33 Audit Quick Wins, 34 Treatment Abroad Overhaul, 35 Checkup + Form UX, 36 Shared Layout Primitives, 37 Site Metadata & Hygiene, 38 Vertical Rhythm & Section Sizing).
last_updated: "2026-04-07T00:00:00.000Z"
last_activity: 2026-04-07
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-07 at v3.1 milestone kickoff — project renamed "MedicusUnion KZ Landing" → "MedicusUnion KZ")

**Core value:** Человек за 3 секунды понимает: здесь можно получить мнение европейского врача не выходя из дома -- и оставляет заявку.
**Current focus:** v3.1 Site Foundation & Audit Fixes — ship 14 audit fixes + shared layout primitives + researched vertical-rhythm system. Bridge from "polished landing" to "scalable multi-page site".

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-07 — Milestone v3.1 started

Progress: [░░░░░░░░░░] 0% (v3.1, 0/6 phases)

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: --
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

## Accumulated Context

| Phase 29-01 P01 | 2min | 1 tasks | 1 files |
| Phase 29 P02 | 3min | 2 tasks | 4 files |
| Phase 30 P01 | 2min | 2 tasks | 5 files |
| Phase 31 P01 | 5min | 2 tasks | 14 files |
| Phase 31 P02 | 2min | 2 tasks | 7 files |
| Phase 32 P01 | 1min | 2 tasks | 2 files |
| Phase 32 P02 | 6min | 2 tasks | 7 files |

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Phase 28]: Removed all old design patterns from checkup.html (glass, orbs, dividers, dark mode) to match new clean medtech design
- [Phase 28]: Checkup page copywriting: verbatim text from copywriting doc, card titles expanded to full form
- [Phase 29]: Nav anchor links prefixed with index.html on 404 page; noindex/nofollow meta added to prevent indexing
- [Phase 29]: Normalized FAQ CSS to single .faq__item.is-open .faq__answer selector across all pages
- [Phase 29]: Fixed footer service links to use direct page file references instead of index.html#services anchors
- [Phase 30]: Removed iso6523Code from JSON-LD (incorrect semantic usage); used shared og-cover.jpg for all pages pending Phase 31 image pipeline
- [Phase 31]: Used cwebp (brew webp) instead of sips for WebP conversion -- sips on macOS does not support WebP output
- [Phase 31]: All images stored as local WebP in img/ with lazy loading on below-fold images and explicit dimensions for CLS prevention
- [Phase 31]: Applied preload/defer optimizations to all 6 HTML pages including 404.html; checkup.html had Motion CDN contrary to plan
- [Phase 32]: Used box-shadow for focus-visible ring (global CSS, zero HTML changes across all pages)
- [Phase 32]: Accessible text tokens use -text suffix (mu-blue-text vs mu-blue) to separate WCAG-safe text colors from bright icon/bg colors
- [Phase 32]: Icon containers and SVGs keep bright original colors; only text elements get *-text accessible variants for WCAG AA compliance

### Roadmap Evolution

- Phase 32 added: Design system compliance: accessible tokens, focus-visible, CTA gradient fix across all pages

### Blockers/Concerns

- Real content needed from client: doctor credentials, hospital logos, statistics, legal entity details
- Kazakhstan Personal Data Law (No. 94-V) may affect form field -- legal review before go-live

## Session Continuity

Last session: 2026-04-07
Stopped at: v3.1 milestone opened. Rename applied (PROJECT.md + ROADMAP.md H1 + STATE.md). Phase structure expanded from 5 → 6 phases after user flagged section sizing as out-of-place across all 5 pages — new Phase 38 "Vertical Rhythm & Section Sizing" added with research-first approach. REQUIREMENTS.md + ROADMAP.md v3.1 block written by roadmapper. Ready to start Phase 33.
Next command: `/clear` then `/gsd-discuss-phase 33` (or `/gsd-plan-phase 33` to skip discussion)
