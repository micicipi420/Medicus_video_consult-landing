# Phase 81: Hero Video-Call Frame - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Mode:** Auto-generated (smart discuss skipped per user mandate "execute the milestone")

<domain>
## Phase Boundary

Replace the dual-photo hero composition with a single doctor portrait framed as a video-call window so the 3-second value comprehension becomes "this is a real video consultation with a European doctor." Phase 79 typography tokens consumed; Phase 80 header chrome remains untouched.

</domain>

<decisions>
## Implementation Decisions

### Visual Metaphor
- **Single doctor photo** in a dark video-call frame replaces the prior two-photo composition (`hero-doctor.webp` + `hero-consultation.webp`) — clutter reduced, metaphor sharpened
- The `hero-consultation.webp` asset is no longer rendered in the hero; it stays in `/public/` for potential reuse elsewhere
- **Frame:** 6–8px dark border (`border-mu-text-900/85`) + `bg-mu-text-900` backdrop — reads as a video-call window chrome, not a photo frame
- **Aspect ratio:** mobile 4:5 portrait, sm 3:4, desktop 4:5 — keeps the doctor's face centered and prominent on every viewport

### Video-Call Chrome
- **Top-left "name pill":** `Dr. Ferdinand K. · Vienna` with a small green presence dot — establishes "real European doctor" credibility in the first second of attention
- **Top-right "В эфире" indicator:** red dot with `animate-ping` halo (motion-reduce respected via `motion-reduce:hidden`) plus uppercase wordmark — universal "live broadcast" affordance
- **Bottom-center control row:** mic + camera icons + HD badge inside a glass pill — recognizable as a video-call UI without being interactive (no real call happens; the chrome is metaphor only)
- All chrome elements use `bg-mu-text-900/55 backdrop-blur-md` + `border-white/15` — matches Apple HIG dark-glass overlay; legible against any photo content underneath

### Credibility Strip Reduction
- **One floating badge** ("43 клиники в 11 странах") repositioned to top-right of the frame — preserved trust signal
- Second badge ("15+ лет опыта") removed — its content is already in the trust line below CTAs (`MedicusUnion GmbH ... 15+ лет опыта`); having both was duplicate
- Remaining badge uses `bg-white/75 backdrop-blur-[40px]` — within DESIGN.md `--liquid-blur-xl: 60px` mobile cap (see Phase 79 clamp)

### Responsive Tightening
- Section min-height swapped from `min-h-screen` → `min-h-[calc(100svh-1rem)]` (mobile) / `lg:min-h-[calc(100svh-5rem)]` — `svh` accounts for mobile browser chrome; the `-1rem` reserves space for the floating header from Phase 80
- Mobile padding tightened: `pt-20 pb-10` (was `pt-32 pb-16`) — header chrome floats on top, no double-spacing needed
- `max-w-[calc(100vw-2rem)]` on left content prevents overflow on tiny viewports
- Headline scale capped at `xl:text-6xl` (was `xl:text-8xl`) — 8xl was overflowing the column on common 1366px laptops

### Accessibility
- Frame has `role="img"` and `aria-label="Видеоконсультация с европейским врачом MedicusUnion"` — screen readers announce the metaphor, not three decorative pieces
- Mic/camera/HD chrome marked `aria-hidden="true"` — purely visual
- `animate-ping` halo on live indicator hidden under `prefers-reduced-motion` via `motion-reduce:hidden`
- The single `<Image>` retains `alt="Врач на платформе MedicusUnion"` for SEO and screen-reader fallback if the role override is bypassed
- `priority` flag preserved (above-the-fold)

### Claude's Discretion
- Doctor name "Dr. Ferdinand K. · Vienna" is a placeholder evoking the brand's Austrian provenance — to be replaced with a real on-team name once provided. Treated as illustrative content, not a Key Decision.
- Exact glass opacity values within DESIGN.md tolerance (`/55`, `/75`)
- HD/mic/camera icon set chosen from existing `lucide-react` dependency

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lucide-react`: `Sparkles`, `ArrowRight` already imported; new imports `Mic`, `Video`, `Globe` are zero-cost (tree-shakable from same package)
- `next/image` with `priority` flag — pattern preserved
- Phase 79 mobile blur clamp applies automatically via `backdrop-blur-md` Tailwind utility
- `mu-text-900`, `mu-green-500`, `mu-green-600`, `glass-border-strong` tokens already exposed in `@theme inline`

### Established Patterns
- Server-rendered hero (no `'use client'`) — pattern preserved
- Tailwind utility ordering: layout → spacing → sizing → typography → color → effects (per stash convention)
- Photo composition with `<Image fill>` inside a positioned wrapper — pattern preserved

### Integration Points
- `/hero-doctor.webp` consumed (continues to exist in `/public/`)
- `/hero-consultation.webp` no longer consumed by hero (still on disk)
- HeroHub mounted in `app/page.tsx` — no parent changes needed
- Phase 80 header floats above hero — `min-h-[calc(100svh-5rem)]` reserves space

</code_context>

<specifics>
## Specific Ideas

The "video-call window" metaphor is the load-bearing visual choice for v8.0. Every chrome element reinforces it:
- Dark frame = device bezel
- Name pill = participant label
- Live indicator = active broadcast
- Mic/camera/HD row = call controls

A user landing on the page sees "Doctor Ferdinand from Vienna is on a live video call" within ~1 second.

</specifics>

<deferred>
## Deferred Ideas

- Real doctor name + photo from on-team staff (placeholder used now)
- Video-call shimmer / signal-quality indicator animation — out of scope, motion budget already taut
- Picture-in-picture overlay (small patient photo) — explicitly removed in this phase
- Localizing "Dr." prefix or "В эфире" wordmark for languages other than Russian — out of scope (project is RU-only per CLAUDE.md)

</deferred>
