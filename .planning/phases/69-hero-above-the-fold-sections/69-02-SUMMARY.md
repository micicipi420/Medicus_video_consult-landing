---
phase: 69-hero-above-the-fold-sections
plan: 02
subsystem: sections
tags: [glass-ui, stats, services, images, server-components]
dependency_graph:
  requires: [68-01]
  provides: [StatsBar-glass, ServicesGrid-glass, service-images]
  affects: [page.tsx]
tech_stack:
  added: [lucide-react-icons-in-services]
  patterns: [glass-card, next-image, server-component]
key_files:
  created:
    - next/public/service-consultation.webp
    - next/public/service-treatment.webp
    - next/public/service-checkup.webp
  modified:
    - next/src/components/sections/StatsBar.tsx
    - next/src/components/sections/ServicesGrid.tsx
    - next/src/app/page.tsx
decisions:
  - Used cwebp for WebP conversion (sips lacks WebP output on macOS)
  - Kept Unsplash images at q=80 WebP (65KB, 27KB, 27KB -- all under 200KB target)
metrics:
  duration: 239s
  completed: 2026-04-12T17:32:45Z
  tasks: 2/2
  files: 6
---

# Phase 69 Plan 02: Stats Bar + Services Grid Summary

Glass metric cards (4 stats with per-card accent colors) and glass service cards (3 cards with photos, badges, feature lists, CTA links) using Phase 68 design tokens, with WebP images downloaded from Unsplash.

## What Was Done

### Task 1: Rewrite StatsBar.tsx + download service images + rewrite ServicesGrid.tsx
**Commit:** `183e43b`

**StatsBar.tsx** -- Complete rewrite from dark bg-[#1A365D] horizontal bar to 4 glass metric cards:
- Grid: grid-cols-2 lg:grid-cols-4 gap-6
- Glass cards: bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-glass-border shadow-glass
- Hover: shadow-glass-lg, bg-white/70, border-glass-border-strong
- Per-card accent colors: accent-blue (43), accent-teal (11), accent-orange (500+), green-600 (15+)
- Numbers: text-5xl md:text-6xl font-extrabold with drop-shadow-sm
- Labels: uppercase tracking-wider text-mu-text-700

**Service images** -- 3 Unsplash photos downloaded and converted to WebP via cwebp:
- service-consultation.webp: 65KB (1080x1920 doctor video call)
- service-treatment.webp: 27KB (1080x810 modern hospital)
- service-checkup.webp: 27KB (1080x608 checkup)

**ServicesGrid.tsx** -- Complete rewrite from card-prod/squircle-lg to glass cards with photos:
- Glass cards: bg-white/60 backdrop-blur-2xl rounded-[3rem] with hover:-translate-y-2
- Section title: gradient text "Выберите, что вам нужно" with glass pill badge "Наши Услуги"
- Each card: photo with rounded-[2rem] inner frame, floating icon, price badge, title, description, feature checklist, CTA link
- 3 cards: consultations (Video icon, blue), treatment-abroad (Globe icon, teal), checkup (ClipboardCheck icon, green)
- Uses next/image with proper sizes attribute for responsive loading
- Uses next/link for navigation to service pages
- lucide-react icons: Video, Globe, ClipboardCheck, ArrowRight

### Task 2: Update page.tsx to render new sections without animation wrappers
**Commit:** `c33b463`

- Removed ScrollReveal wrapper from StatsBar (was `<ScrollReveal>`)
- Removed ScrollReveal wrapper from ServicesGrid (was `<ScrollReveal delay={0.05}>`)
- Preserved ScrollReveal on GuideGrid, AdvantagesGrid, ContactSection, FinalCTA (not yet redesigned)
- ScrollReveal import retained for remaining sections
- All metadata unchanged

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

All acceptance criteria verified:
- StatsBar: no 'use client', no dark bg, glass card pattern, 4 accent colors, uppercase labels, all 4 stats
- ServicesGrid: no 'use client', no old classes, glass cards, id=services, 3 links, next/image, gradient title
- page.tsx: StatsBar/ServicesGrid without ScrollReveal, remaining sections with ScrollReveal
- Build passes cleanly (/ route 8.48KB, 130KB first load)

## Self-Check: PASSED

All 6 files verified present. Both commits (183e43b, c33b463) confirmed in git log.
