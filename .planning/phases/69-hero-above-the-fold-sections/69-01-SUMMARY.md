---
phase: 69-hero-above-the-fold-sections
plan: 01
subsystem: hero-section
tags: [hero, photo-composition, gradient-headline, cta, glass-badges, server-component]
dependency_graph:
  requires: [68-01]
  provides: [hero-section, hero-images]
  affects: [page.tsx]
tech_stack:
  added: []
  patterns: [server-component, next-image-priority, glass-morphism-badges, gradient-text]
key_files:
  created:
    - next/public/hero-doctor.webp
    - next/public/hero-consultation.webp
  modified:
    - next/src/components/sections/HeroHub.tsx
decisions:
  - "WebP at quality 80 via cwebp -- both images under 50KB (18KB + 41KB)"
  - "Server component (no 'use client') -- animations deferred to later phase"
  - "lucide-react icons for pill badge and floating badges (Sparkles, ArrowRight, Globe, ShieldCheck)"
metrics:
  duration_seconds: 190
  completed: "2026-04-12T17:31:23Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 1
---

# Phase 69 Plan 01: Hero Section with Photo Composition Summary

Server component HeroHub.tsx rewritten with two-image photo composition, gradient headline, glass pill badge, two CTA buttons, floating glass badges, and trust indicator line -- matching feat/new-design reference.

## What Was Done

### Task 1: Download and optimize hero images
**Commit:** `01e6825`

Downloaded two Unsplash images and converted to optimized WebP using cwebp at quality 80:
- `hero-doctor.webp` (18KB, 1080x720) -- main doctor portrait
- `hero-consultation.webp` (41KB, 1080x720) -- secondary consultation photo

Both well under the 200KB target. Stored in `next/public/` for next/image consumption.

### Task 2: Rewrite HeroHub.tsx as server component
**Commit:** `f56353e`

Complete rewrite of HeroHub.tsx from a `'use client'` component with HeroEntrance motion wrapper to a React Server Component. New structure:

- **Glass pill badge**: "Австрийская медицинская компания с офисом в Казахстане" with Sparkles icon
- **Gradient headline**: "Европейские врачи, мировые клиники -- доступны из Казахстана" with `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent`
- **Subtitle paragraph**: Full MedicusUnion platform description with proper nbsp binding
- **Primary CTA**: "Обсудить мой случай" -- gradient button scrolling to #contact
- **Secondary CTA**: "Узнать больше" -- glass button scrolling to #services
- **Trust indicator**: MedicusUnion GmbH credentials line
- **Photo composition**: Main image (85% w/h, rounded-3rem) with secondary overlapping image (3/5 w, 45% h)
- **Floating badges**: 43 clinics (green gradient icon) and 15+ years (blue gradient icon)

All design tokens from Phase 68 globals.css used: mu-blue, mu-accent-blue, mu-green-600, shadow-glass, border-glass-border, etc.

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **WebP via cwebp at q80**: Both images converted to highly optimized WebP (18KB + 41KB) -- chosen over JPEG for smaller file size with equivalent quality
2. **No animation wrappers**: Component is pure server component as specified; motion to be added in a later phase
3. **lucide-react icons**: Used Sparkles, ArrowRight, Globe, ShieldCheck per plan specification

## Verification Results

- Build: `npx next build` passed cleanly with no errors
- All 11 acceptance criteria verified:
  - No 'use client' directive
  - No HeroEntrance/motion imports
  - id="hero" on section
  - Gradient text classes present
  - href="#contact" with "Обсудить мой случай"
  - href="#services" with "Узнать больше"
  - MedicusUnion GmbH trust indicator
  - next/image with hero-doctor.webp and hero-consultation.webp
  - Floating badges with "43" and "15+ лет"
  - Glass pill badge with "Австрийская медицинская компания"

## Known Stubs

None -- all content is real, all images are real Unsplash photos, all links point to actual section anchors.

## Self-Check: PASSED

All 3 files verified on disk. Both commit hashes (01e6825, f56353e) found in git log.
