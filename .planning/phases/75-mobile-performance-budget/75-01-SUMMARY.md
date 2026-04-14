---
phase: 75-mobile-performance-budget
plan: 01
subsystem: performance
tags: [blur-budget, gpu-layers, mobile, perf]
key_files:
  created: []
  modified:
    - src/styles/theme.css
    - src/styles/liquid-glass.css
decisions:
  - "Capped blur-md=16px, blur-lg=18px, blur-xl=20px, clear-blur=16px on mobile (<768px)"
  - "Suppressed will-change on .liquid-card::before at mobile, slowed glint to 12s"
  - "Left -webkit-backdrop-filter hardcoded Safari fallbacks unchanged (Metal handles large blur)"
metrics:
  duration: 2m
  completed: 2026-04-14
  tasks_completed: 2
  tasks_total: 2
requirements_completed:
  - PERF-01
  - PERF-02
---

# Phase 75 Plan 01: Mobile Blur Budget & Layer Suppression

## What Was Done

### Task 1: Mobile blur budget tokens (57f50c1)
Appended @media (max-width: 767px) block to theme.css overriding both :root and .dark blur tokens to 14-20px range.

### Task 2: Will-change suppression (57f50c1)
Appended @media (max-width: 767px) block to liquid-glass.css setting will-change: auto on .liquid-card::before and slowing glint animation to 12s.

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1-2 | 57f50c1 | feat(75-01): mobile blur budget tokens and compositing layer suppression |

## Self-Check: PASSED
