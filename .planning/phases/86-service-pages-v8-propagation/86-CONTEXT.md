# Phase 86: Service Pages v8.0 Propagation - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Mode:** Auto-generated (executing milestone autonomously)

<domain>
## Phase Boundary

Apply v8.0 design language to the three service pages (`/checkup`, `/consultations`, `/treatment-abroad`) — specifically to `ServiceHero` and `LeadFormSection` (used by all three) and `ContactForm` (used by ContactSection on index AND by LeadFormSection on service pages). Page wrappers receive minor reorder/cleanup. No new components, no nav changes.
</domain>

<decisions>
## Implementation Decisions

### ServiceHero
- Switch `transition-all` → scoped lists (`transition-[transform,box-shadow,filter]` for primary CTA; `transition-[background-color,border-color,box-shadow,transform]` for secondary)
- Mobile-first sizing: `pt-28 pb-12 lg:pt-32 lg:pb-16` (was `pt-32 pb-16`)
- Headline scale capped at `lg:text-6xl` (was `lg:text-7xl`) — same overflow guard as Phase 81 hero
- Eyebrow text scales `text-xs sm:text-sm` instead of `text-sm` only — readability on small screens
- CTAs full-width on mobile with `w-full` + scoped transitions + active-press feedback patterns
- Adds `data-hero-variant={variant}` attribute — also resolves the prior "variant prop unused" lint warning

### LeadFormSection
- Outer wrapper padding: `p-6 md:p-12` (was `p-8 md:p-12`) — tighter mobile padding
- Inner form card padding scales: `p-5 sm:p-7 md:p-9` (was static `p-8 md:p-10`)
- Inner card tint: `bg-white/42` (was `bg-white/40`) — better contrast on glass
- Tailwind class ordering canonicalized

### ContactForm (used by both index ContactSection and service-page LeadFormSection)
- Internal layout adjustments to handle the form being rendered inside two different glass contexts (white card on gradient vs. translucent inner card on plain background)
- Tailwind class ordering canonicalized
- No API surface changes — `submitContactForm` server action unchanged → preserves PROP-03

### Page wrappers (`/checkup`, `/consultations`, `/treatment-abroad`)
- Minor section-ordering / spacing tweaks per the stash draft
- One unused `PHONE_NUMBER` import removed from `/treatment-abroad/page.tsx` — auto-resolves HYG-01 first warning

### Verification
- `pnpm build` confirmed clean compile + zero lint warnings + all 11 pages still generate

### Claude's Discretion
- Stash represents the user's design intent for these files — extracted verbatim via `git checkout stash@{0} -- <files>` rather than reinterpreting
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- ServiceHero is the shared hero used by all 3 service pages with different `eyebrow`/`title`/`subtitle`/`primaryCta`/`secondaryCta`/`variant` props
- LeadFormSection is the shared form footer used by all 3 service pages — wraps ContactForm
- ContactForm now plays well in both contexts (index gradient + service-page glass)

### Established Patterns
- Server-rendered service pages composing client `ContactForm` via `LeadFormSection`
- Variant-aware ServiceHero (`variant?: 'default' | 'consultation' | ...`)

### Integration Points
- All 3 service pages import ServiceHero and LeadFormSection — single source of truth for hero/form chrome
- ContactForm submission still routes through `submitContactForm` from `@/lib/db/actions` — Directus path preserved
</code_context>

<specifics>
## Specific Ideas

The user's stash content was already aligned with the v8.0 visual direction (scoped transitions, mobile-tightened sizing, canonical Tailwind ordering). Surgical extraction was the right move — no second-guessing required.
</specifics>

<deferred>
## Deferred Ideas

- Service-page section-internal glass surfaces (TreatmentClinics, CheckupAdvantages, etc.) — those were not in the stash and are out of v8.1 scope; can be a v8.2 follow-up
- Further LeadFormSection content updates (privacy text variants, trust signals like Phase 84 added to ContactSection) — content decision, not v8.1
</deferred>
