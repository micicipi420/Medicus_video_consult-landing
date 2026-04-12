---
phase: 72-service-pages
plan: 01
subsystem: service-components
tags: [glass-design, restyle, service-pages]
dependency_graph:
  requires: []
  provides: [ServiceHero-glass, SocialProof-glass, FAQ-glass, LeadFormSection-glass]
  affects: [consultations-page, treatment-abroad-page, checkup-page]
tech_stack:
  added: []
  patterns: [glass-card, backdrop-blur-2xl, gradient-heading, glass-checkmark]
key_files:
  created: []
  modified:
    - next/src/components/sections/service/ServiceHero.tsx
    - next/src/components/sections/service/SocialProof.tsx
    - next/src/components/sections/service/FAQ.tsx
    - next/src/components/sections/service/LeadFormSection.tsx
decisions:
  - Kept all component interfaces unchanged -- callers require zero changes
  - Used GlassCheckmark component to replace GreenCheckmark in LeadFormSection
  - Dynamic grid cols in SocialProof based on items.length (3 or 4 columns)
metrics:
  duration: 2m18s
  completed: 2026-04-12T18:34:22Z
  tasks: 2/2
  files_modified: 4
---

# Phase 72 Plan 01: Shared Service Components Glass Restyle Summary

Glass restyle of 4 shared service components (ServiceHero, SocialProof, FAQ, LeadFormSection) from old production design to new glass design language with backdrop-blur, translucent cards, and mu- color tokens.

## Completed Tasks

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Restyle ServiceHero and SocialProof to glass design | e4ee66b | Glass pill eyebrow badge, gradient CTA buttons with arrow icon, glass stat cards replacing dark navy bar |
| 2 | Restyle FAQ and LeadFormSection to glass design | 779d921 | Glass accordion items with gradient heading, outer glass card with inner translucent form wrapper |

## Changes Made

### ServiceHero.tsx
- Replaced `bg-gradient-to-b from-[#F0F7FF] to-white` with `pt-32 pb-16` clean section
- Removed decorative orbs (3 absolute-positioned divs)
- Eyebrow badge: glass pill with `bg-white/40 backdrop-blur-xl border border-white/60 rounded-full`
- Title: `text-5xl md:text-6xl lg:text-7xl font-extrabold` (was clamp-based)
- CTA primary: gradient button with arrow SVG and shadow animation
- CTA secondary: `bg-white/50 backdrop-blur-xl` glass button
- Illustration: changed breakpoint from `md:flex` to `lg:block`

### SocialProof.tsx
- Replaced `bg-[#1A365D] py-8` dark navy bar with glass stat card grid
- Each stat: `bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-glass`
- Dynamic grid: `lg:grid-cols-4` when 4+ items, `lg:grid-cols-3` otherwise
- Number text: `text-mu-accent-blue` (was white on dark)

### FAQ.tsx
- Section: `container mx-auto px-4 lg:px-6 mb-16` (was `py-12 bg-white`)
- Heading: gradient text via `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent`
- Items: `bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-glass`
- Button hover: `hover:bg-white/80` (was `hover:bg-black/[0.02]`)
- Answer text: `text-mu-text-700 font-medium` (was rgba)

### LeadFormSection.tsx
- Section: `container mx-auto` (was `bg-[#F5F7F9]`)
- Outer glass card: `bg-white/60 backdrop-blur-3xl rounded-[3.5rem] shadow-glass-lg`
- Form card: `bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-glass`
- GreenCheckmark replaced with GlassCheckmark (backdrop-blur circle)
- Trust items: `text-mu-text-900 font-medium` (was `text-[#4A4E5C]`)

## Verification

- TypeScript: `npx tsc --noEmit` -- zero errors
- Old classes scan: grep for `#18212C`, `rgba(24,33,44`, `#F5F7F9`, `border-black`, `font-heading`, `bg-[#1A365D]` -- zero matches
- All interfaces unchanged -- no caller modifications needed

## Deviations from Plan

None -- plan executed exactly as written.

## Self-Check: PASSED

- [x] ServiceHero.tsx exists (90 lines >= 60 min)
- [x] SocialProof.tsx exists (32 lines >= 20 min)
- [x] FAQ.tsx exists (85 lines >= 60 min)
- [x] LeadFormSection.tsx exists (85 lines >= 60 min)
- [x] Commit e4ee66b verified
- [x] Commit 779d921 verified
- [x] No old production classes remain
- [x] TypeScript compiles clean
