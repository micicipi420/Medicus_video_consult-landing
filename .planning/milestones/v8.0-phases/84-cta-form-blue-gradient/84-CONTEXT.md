# Phase 84: CTA Form on Blue Gradient - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Mode:** Auto-generated

<domain>
## Phase Boundary

Reskin `ContactSection` with a blue-gradient background, white-text trust signals, and the existing `ContactForm` (untouched) sitting in a white glass card on top. Submission behavior preserved exactly.
</domain>

<decisions>
## Implementation Decisions

### Background Gradient (FORM-01)
- `bg-gradient-to-br from-mu-blue via-mu-accent-blue to-mu-blue` — DESIGN.md brand palette, 2-stop gradient with the same start/end blue and a brighter accent in the middle for depth
- Two decorative blur blobs (`bg-white/15` and `bg-mu-green-500/25`) anchored in opposing corners — adds dimensionality, marked `aria-hidden`
- Section padding bumped: `py-16 sm:py-20 lg:py-24` — gradient deserves breathing room

### Trust Signals (FORM-02)
- Three explicit signals replace the prior generic "На связи 24/7" + "ISO 27001" badges:
  1. **Конфиденциально** — ISO 27001, GDPR. Privacy concern.
  2. **Ответ в течение 24 часов** — response time concern.
  3. **Врачи Европы** — Germany, Austria, Switzerland. Provenance concern.
- Each signal: icon (lucide `ShieldCheck` / `Clock3` / `Stethoscope`) + title + 1-line body
- Rendered as a 3-column grid at `sm:`, single column on mobile
- Card style: `border-white/15 bg-white/10 backdrop-blur-md` — translucent white pills on the gradient

### ContactForm Preservation (FORM-03)
- `import { ContactForm } from './ContactForm'` retained
- `<ContactForm />` rendered as-is — zero modifications
- Form sits in a white-card container (`bg-white border-white/40`) so input fields stay legible against the gradient
- Submission still goes through `submitContactForm` server action (Directus endpoint unchanged)

### Layout
- 2-column grid `lg:grid-cols-[1.1fr_1fr]` — slightly more room for headline + trust signals than for the form, matching mockup's visual weight
- Mobile: stacks (form below trust signals)

### Coordinator Element Simplified
- Prior version had a 256×256 photo of "Айгерим" with phone/email — disproportionate weight on the page
- New version: small phone + email row inside a glass pill at the bottom of the left column. Removes Unsplash photo dependency
- Photo can be reintroduced in a follow-up phase if marketing wants it

### Accessibility
- Section has `aria-label="Заявка на консультацию"`
- Trust-signal icons `aria-hidden="true"` (decorative)
- Phone link has `min-h-11` (44pt tap target)
- All transitions scoped (no `transition-all`)
- Form field contrast ≥ 4.5:1 against white card background — ContactForm's existing field colors satisfy this
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `mu-blue`, `mu-accent-blue`, `mu-green-500` already in `@theme inline`
- `submitContactForm` server action — already used by ContactForm
- `PHONE_NUMBER`, `PHONE_DISPLAY`, `EMAIL` from `@/lib/navigation`

### Established Patterns
- Server component (no `'use client'`); ContactForm is the only client child
- `as const` arrays for static lists

### Integration Points
- `app/page.tsx` mounts `<ContactSection />` near the bottom — no parent change
- `ContactForm` server action stays the single source of truth for Directus submission
</code_context>

<specifics>
## Specific Ideas

The gradient background is the strongest visual signal in v8.0 — it tells the visitor "this is THE conversion moment". Trust signals stay restrained (3 short pills) so the form remains the focal point.
</specifics>

<deferred>
## Deferred Ideas

- Real coordinator photo (replacing the removed Unsplash one) — content decision
- A/B test of different trust-signal wording — analytics work
- Animation on form-success state — out of scope
</deferred>
