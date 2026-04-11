---
phase: 63-scroll-entrance-animations
plan: 01
subsystem: animation
tags: [framer-motion, scroll-reveal, hero-entrance, lazy-motion, reduced-motion]
dependency_graph:
  requires: []
  provides: [LazyMotionProvider, ScrollReveal, HeroEntrance, HeroEntranceItem]
  affects: [next/src/app/layout.tsx, next/src/app/page.tsx, next/src/app/contacts/page.tsx, next/src/components/sections/HeroHub.tsx]
tech_stack:
  added: [framer-motion@12.38.0]
  patterns: [LazyMotion+domAnimation, m.div (not motion.div), useReducedMotion guard, whileInView scroll trigger, staggerChildren hero entrance]
key_files:
  created:
    - next/src/components/motion/LazyMotionProvider.tsx
    - next/src/components/motion/ScrollReveal.tsx
    - next/src/components/motion/HeroEntrance.tsx
  modified:
    - next/package.json
    - next/pnpm-lock.yaml
    - next/src/app/layout.tsx
    - next/src/app/page.tsx
    - next/src/app/contacts/page.tsx
    - next/src/components/sections/HeroHub.tsx
decisions:
  - "LazyMotion with domAnimation features for tree-shakeable bundle (strict mode enforces m components)"
  - "ScrollReveal renders plain div when prefers-reduced-motion detected (not duration-zero animation)"
  - "HeroEntrance uses animate on mount (not whileInView) for immediate page-load stagger"
  - "LazyMotionProvider wraps only main content, not Header/Footer/StickyBar layout chrome"
  - "Page components remain Server Components; animation boundaries are client wrapper components only"
metrics:
  duration: 255s
  completed: 2026-04-11T05:49:15Z
  tasks_completed: 3
  tasks_total: 3
  files_created: 3
  files_modified: 6
---

# Phase 63 Plan 01: Scroll Entrance Animations Summary

Framer Motion LazyMotion + domAnimation with three reusable animation components: ScrollReveal (scroll-triggered fade-up), HeroEntrance (staggered mount entrance at 120ms intervals), and LazyMotionProvider (strict m-component tree-shaking wrapper). All sections animate on scroll, hero staggers on load, prefers-reduced-motion renders static divs.

## What Was Done

### Task 1: Install Framer Motion + LazyMotionProvider + ScrollReveal
- Installed `framer-motion@12.38.0` via pnpm
- Created `LazyMotionProvider.tsx` -- "use client" wrapper with `<LazyMotion features={domAnimation} strict>` enforcing m components only
- Created `ScrollReveal.tsx` -- "use client" component using `m.div` with `whileInView` fade-up (opacity 0->1, y 20->0), `viewport.once: true`, `amount: 0.15`, configurable delay
- Full `useReducedMotion` guard: renders plain `<div>` when reduced motion preferred (no transform, no opacity change)
- Wired `LazyMotionProvider` into `layout.tsx` wrapping `<main>{children}</main>` only (Header/Footer/StickyBar outside)
- **Commit:** 883ff04

### Task 2: HeroEntrance Component + HeroHub Refactor
- Created `HeroEntrance.tsx` with stagger orchestration: `staggerChildren: 0.12` (120ms), `delayChildren: 0.1` (100ms initial delay)
- Exported `HeroEntrance` (container with `animate="visible"`) and `HeroEntranceItem` (child with y:20 fade-up variants)
- Refactored `HeroHub.tsx` to "use client" with three staggered items: h1 -> p subtitle -> CTA buttons div
- Full `useReducedMotion` guard on HeroEntrance: renders plain `<div>` container
- **Commit:** c718479

### Task 3: Wire ScrollReveal into Pages + Build Verification
- Index page (`page.tsx`): wrapped 6 non-hero sections in `<ScrollReveal>` (StatsBar no delay, others `delay={0.05}`)
- Contacts page (`contacts/page.tsx`): wrapped contact section in `<ScrollReveal>`
- Both page files remain Server Components (no "use client") -- animation boundaries are in wrapper components only
- Build passes: all 4 pages generate as static, TypeScript clean
- **Commit:** 2d158d9

## Build Output

```
Route (app)                              Size  First Load JS
- /                                    2.96 kB         124 kB
- /contacts                            8.04 kB         126 kB
- /test-glass                            120 B         102 kB
All pages static (prerendered)
```

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| LazyMotion + domAnimation (strict) | Tree-shakeable bundle, strict mode errors on accidental motion.div usage |
| Plain div for reduced-motion (not duration:0) | Duration-zero still causes snap from offset; plain div prevents any motion entirely |
| HeroEntrance uses animate (not whileInView) | Hero is visible on page load; mount-based trigger is correct, scroll-based would miss above-fold content |
| LazyMotionProvider wraps only main | Header/Footer/StickyBar are layout chrome, not animation targets |
| Pages remain Server Components | ScrollReveal/HeroEntrance are the client boundaries; section components render on server |

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

None -- all animation components are fully wired with real data and behavior.

## Self-Check: PASSED

All 3 created files verified on disk. All 3 task commits verified in git log.
