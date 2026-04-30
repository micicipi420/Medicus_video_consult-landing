# Phase 83: Services & Process Sections - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Mode:** Auto-generated

<domain>
## Phase Boundary

Replace mid-page content sections "Мы помогаем на каждом этапе" (ServicesGrid) and "Как это работает" (ProcessSection) with v8.0 glass treatments: 4 service cards with icons, and 4 numbered steps with icons + desktop dotted connector.
</domain>

<decisions>
## Implementation Decisions

### ServicesGrid (4-card model)
- **4 cards** to satisfy SVC-01: Online consultation, Чек-ап, Treatment abroad, Corporate B2B чек-апы
- 4th card (B2B) links to `/checkup#b2b` — `CheckupB2B` section already exists in `/checkup` page; CLAUDE.md confirms B2B is a real revenue line for KZ companies
- Section title: "Мы помогаем на каждом этапе" (per spec) — replaces prior "Выберите, что вам нужно"
- Drop card images — Phase 83 must-have asks for "icon, title, short scannable description" only. Smaller card surface, faster scan, better fit on 4-up grid
- Whole card is the link (`<Link>` wraps the entire card body) — simpler interaction than separate CTA button + larger tap target
- One glass surface per card. Mobile renders 1 column (1 layer + 1 floating header = 2 ≤ Phase 79 cap); desktop renders 4 cards (`lg:grid-cols-4`)

### ProcessSection (4-step model with connector)
- 4 steps already present — only add icons + connector chrome
- **Icons:** FileSearch (case review), Plane (preparation/travel), HeartPulse (consultation/treatment), ClipboardList (post-care)
- **Connector:** Single absolute-positioned `border-t-2 border-dotted border-mu-text-700/25` line spanning `left-[12%] right-[12%]` at `top-[64px]` (aligned with the center of the number badges). `hidden md:block` — invisible below 768px, visible at md+. CSS-only, zero new DOM elements per card
- Mobile gets no connector (collapsing to vertical would clutter the 1-column stack and add a glass element)
- Step badge stays gradient-filled with the number; Icon goes in a sibling glass-tinted square — visual rhythm without competing with the number

### Mobile Glass Budget
- Header (Phase 80) = 1 layer
- Stats Bar (Phase 82) wrapper on mobile = 1 layer (already capped)
- ServicesGrid: cards stack at <sm; only 1 visible at a time = 1 layer
- ProcessSection: cards stack at <md; only 1 visible at a time = 1 layer

When scrolling between sections, only header (1) + currently-visible card (1) = 2 layers. Cap respected.

### Accessibility
- Icons `aria-hidden="true"` (decorative)
- Connector div `aria-hidden="true"` (decorative)
- Step number kept in DOM as visible text (not just background image) so screen readers read order
- All transitions scoped (no `transition-all`)
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- All gradient + shadow utilities for step badges already in `@theme inline`
- `mu-text-700/25` for dotted connector tint already exposed
- Phase 82 established the "responsive glass strategy" pattern (single wrapper on mobile, multi-card on desktop) — applied here implicitly via single-column mobile stacking

### Established Patterns
- Server components, no `'use client'`
- `as const` arrays of section data
- `<section id="...">` for in-page anchors

### Integration Points
- Both sections already mounted in `app/page.tsx`
- `/checkup#b2b` anchor target lives in CheckupB2B section
</code_context>

<specifics>
## Specific Ideas

CSS-only dotted connector beats per-card pseudo-elements: zero extra DOM, single absolute element handles all 3 gaps between 4 cards, and `border-dotted` honors `prefers-contrast` automatically (browsers thicken in high-contrast mode).
</specifics>

<deferred>
## Deferred Ideas

- Per-step illustrations / Lottie animations — out of scope, motion budget taut
- Mobile vertical connector (rejected as low-value clutter)
- Card-level hover scaling beyond shadow swap — kept restrained
</deferred>
