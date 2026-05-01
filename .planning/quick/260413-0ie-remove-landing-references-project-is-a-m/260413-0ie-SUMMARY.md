---
phase: quick
plan: 260413-0ie
subsystem: docs
tags: [documentation, terminology, multi-page-site]

dependency_graph:
  requires: []
  provides:
    - "Consistent 'site/website' terminology across all documentation"
  affects:
    - CLAUDE.md
    - .planning/PROJECT.md
    - .planning/ROADMAP.md
    - .planning/MILESTONES.md

tech_stack:
  added: []
  patterns: []

key_files:
  created: []
  modified:
    - CLAUDE.md
    - .planning/PROJECT.md
    - .planning/ROADMAP.md
    - .planning/MILESTONES.md
    - .planning/milestones/v1.0-MILESTONE-AUDIT.md
    - .planning/milestones/v1.0-REQUIREMENTS.md
    - .planning/milestones/v1.0-ROADMAP.md
    - .planning/milestones/v1.2-REQUIREMENTS.md
    - .planning/milestones/v1.2-ROADMAP.md
    - .planning/milestones/v1.3-REQUIREMENTS.md
    - .planning/milestones/v1.3-ROADMAP.md
    - .planning/milestones/v1.4-REQUIREMENTS.md
    - .planning/milestones/v1.4-ROADMAP.md
    - .planning/research/FEATURES.md
    - .planning/research/PITFALLS.md
    - .planning/research/STACK.md
    - .planning/research/SUMMARY.md
    - .planning/milestones/v1.0-phases/01-foundation-design-system/01-RESEARCH.md
    - .planning/milestones/v1.0-phases/02-hero-problem-sections/02-01-SUMMARY.md
    - .planning/milestones/v1.0-phases/02-hero-problem-sections/02-02-SUMMARY.md
    - .planning/milestones/v1.0-phases/02-hero-problem-sections/02-CONTEXT.md
    - .planning/milestones/v1.0-phases/02-hero-problem-sections/02-VERIFICATION.md
    - .planning/milestones/v1.0-phases/04-trust-authority-sections/04-02-SUMMARY.md
    - .planning/milestones/v1.0-phases/04-trust-authority-sections/04-VERIFICATION.md
    - .planning/milestones/v1.0-phases/05-pricing-faq-final-cta-footer/05-01-SUMMARY.md
    - .planning/milestones/v1.0-phases/05-pricing-faq-final-cta-footer/05-02-PLAN.md
    - .planning/milestones/v1.0-phases/05-pricing-faq-final-cta-footer/05-03-PLAN.md
    - .planning/milestones/v1.0-phases/07-lead-capture-form/07-01-PLAN.md
    - .planning/milestones/v1.0-phases/08-directus-backend-integration/08-02-PLAN.md
    - .planning/milestones/v1.0-phases/08-directus-backend-integration/08-CONTEXT.md
    - .planning/milestones/v1.0-phases/08-directus-backend-integration/08-VERIFICATION.md
    - .planning/milestones/v1.0-phases/09-performance-seo/09-02-PLAN.md
    - .planning/milestones/v1.0-phases/09-performance-seo/09-VERIFICATION.md
    - .planning/milestones/v1.0-phases/10-visual-design-enhancement/10-CONTEXT.md
    - .planning/milestones/v1.0-phases/10-visual-design-enhancement/10-VERIFICATION.md
    - .planning/milestones/v1.1-phases/11-hero-first-impression/11-CONTEXT.md
    - .planning/milestones/v1.2-phases/15-design-tokens-buttons-hero/15-01-PLAN.md
    - .planning/milestones/v1.2-phases/15-design-tokens-buttons-hero/15-VERIFICATION.md
    - .planning/phases/17-design-tokens-gradient-buttons-layout/17-01-PLAN.md
    - .planning/phases/18-cards-badges-navigation/18-01-SUMMARY.md

decisions:
  - "Project title: 'MedicusUnion KZ Landing' -> 'MedicusUnion KZ'"
  - "Russian descriptor: 'лендинг' -> 'сайт', 'лендинга' -> 'сайта'"
  - "English descriptor: 'landing page' -> 'site' or 'website' or 'multi-page site'"
  - "Verb usage preserved: 'visitor landing on' -> 'visitor arriving on'"
  - "YAML tags: 'landing-page' -> 'multi-page-site', 'landing' -> 'website'"
  - "External references to Vercel/Stripe/Linear landing pages preserved as-is"

metrics:
  duration: 8min
  completed: "2026-04-12T19:34:30Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 40
---

# Quick Task 260413-0ie: Remove Landing References Summary

**One-liner:** Replaced all "landing/лендинг" project descriptors with "site/сайт/website" across 40 documentation files to reflect multi-page site evolution.

## What Was Done

The project evolved from a single landing page to a multi-page site with service pages (consultations, treatment-abroad, checkup, contacts). All documentation still referred to it as a "landing page" or "лендинг". This task systematically updated 40 files to use consistent "site/website/сайт" terminology.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Update active project docs (CLAUDE.md, PROJECT.md, ROADMAP.md, MILESTONES.md) | e889efa | 4 files |
| 2 | Update archived milestones, research docs, and phase documents | 92c3388 | 36 files |

## Replacement Rules Applied

| Pattern | Replacement | Context |
|---------|-------------|---------|
| MedicusUnion KZ Landing | MedicusUnion KZ | Project title |
| Лендинг для medicusunion.kz | Сайт medicusunion.kz | Russian description |
| лендинг (standalone noun) | сайт | Russian descriptive text |
| лендинга (genitive) | сайта | Russian descriptive text |
| двуязычный лендинг | двуязычный сайт | Deferred requirements |
| Медтуризм-лендинг | Медтуризм | Out of scope items |
| на лендинге | на сайте | Location references |
| Static Landing Page | Static Multi-Page Site | Section header |
| landing page (this project) | site / website | English descriptive text |
| YAML tag: landing-page | multi-page-site | Frontmatter tags |
| YAML tag: landing | website | Frontmatter tags |

## Preserved (Not Changed)

- File paths containing `Medicus_video_consult-landing` (repo directory name)
- "A visitor landing on the page" changed to "visitor arriving on" (verb -> verb, not noun removal)
- External references: "Vercel, Stripe, Linear landing pages" (describing other sites)
- No code files were modified (documentation-only changes)

## Files Not Found in Worktree

The plan listed 46 files. Six files from the plan did not exist in this worktree (deleted in prior commits or on different branches):
- .planning/milestones/v6.1-ROADMAP.md
- .planning/v6.0-MILESTONE-AUDIT.md
- .planning/phases/68-design-tokens-layout-chrome/68-02-PLAN.md
- .planning/phases/69-hero-above-the-fold-sections/69-CONTEXT.md
- .planning/phases/69-hero-above-the-fold-sections/69-VERIFICATION.md
- .planning/phases/70-index-content-sections/70-03-SUMMARY.md

## Deviations from Plan

None -- plan executed exactly as written.

## Verification

Final comprehensive check: `rg -i '(landing|лендинг)' CLAUDE.md .planning/ --glob '*.md'` filtered for non-path, non-verb, non-external references returned **zero results**.

## Self-Check: PASSED

- [x] e889efa commit exists
- [x] 92c3388 commit exists
- [x] Zero remaining "landing/лендинг" project references in documentation
- [x] Project title consistently reads "MedicusUnion KZ"
- [x] CLAUDE.md project description says "Сайт" not "Лендинг"
