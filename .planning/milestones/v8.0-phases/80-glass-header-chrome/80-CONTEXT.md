# Phase 80: Glass Header Chrome - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Mode:** Auto-generated from user's existing draft work (smart discuss skipped — user's stashed Phase 80 implementation is the locked design intent)

<domain>
## Phase Boundary

Update header chrome (`HeaderClient`, `MobileMenu`, `StickyBar`) so every page wears the v8.0 glass design language while preserving every existing nav link, sticky behavior, and accessibility guarantee from v7.0. Token consumption only — no new components, no new pages, no nav structure changes.

</domain>

<decisions>
## Implementation Decisions

### Glass Treatment (HeaderClient)
- Keep the existing two-state glass pattern (default + scrolled) — already aligned with v8.0 mockup
- Switch transition declaration from `transition-all duration-500` to scoped `transition-[padding,background-color,box-shadow,backdrop-filter] duration-300` — reduces unnecessary repaints on every property change, sharper response
- Retain `bg-white/30 backdrop-blur-[40px]` default and `bg-white/50 backdrop-blur-[60px]` scrolled — DESIGN.md token `--liquid-blur-xl` (60px) governs the scrolled cap, mobile clamp from Phase 79 takes effect automatically below 768px
- Keep `rounded-[2.5rem]` and `border-white/50` — visual continuity with v7.0

### Mobile Menu Polish (MobileMenu)
- Adopt Apple HIG 44pt minimum tap target: toggle button moves from `p-2` to `h-11 w-11` (44px square)
- Nav links and phone link: `min-h-12` (48px) — exceeds HIG floor for body navigation
- Primary CTA: `min-h-14` (56px) — emphasizes the conversion target
- Add ESC key dismissal via `keydown` listener on window (cleanup in effect return) — matches modal/dialog dismissal expectations on KZ market 45+ users who often have external keyboards
- Backdrop: `bg-mu-text-900/35 backdrop-blur-sm` instead of plain `bg-black/50` — softer, theme-aware, hints at depth
- Glass nav panel: `bg-white/68` (up from `/60`) — improves contrast for 45+ readability while staying under DESIGN.md `--liquid-blur-xl: 80px` ceiling
- Active-state press feedback: `active:scale-[0.96]` on toggle and CTA — micro-interaction expected on touch devices
- Scoped transitions on hover/active states (avoid `transition-all`)

### Sticky Bar (StickyBar)
- Adopt iOS safe-area awareness: `bottom-[max(1rem,env(safe-area-inset-bottom))]` — handles notched devices and gesture bars
- Adjust hidden translate: `translate-y-[calc(100%+24px)]` (was `+16px`) — accounts for the safe-area extra distance
- Tap targets: `min-h-11` on phone link and CTA — Apple HIG floor
- Active-state press feedback: `active:scale-[0.96]` on CTA
- Glass surface: `bg-white/68` (up from `/60`) — consistency with MobileMenu polish
- Scoped transition on CTA: `transition-[transform,box-shadow,filter] duration-200`

### Accessibility Guarantees (preserve from v7.0)
- `prefers-reduced-transparency`: existing fallback in `liquid-glass.css` continues to apply — header inherits via Tailwind class `backdrop-blur-*` + `@supports` fallbacks already in place
- `prefers-contrast: more`: opaque background fallback already declared globally — no Phase 80 additions needed
- `prefers-reduced-motion`: Phase 79 globally collapses `--motion-*` tokens to 0ms and strips transforms on `[data-scroll-reveal]` — Phase 80 components do not introduce reveal animations, so no additional motion-strip work needed
- ARIA: existing `aria-expanded` and `aria-label` on toggle preserved; backdrop click + ESC key both close the menu

### Navigation Parity
- All `NAV_LINKS` from `@/lib/navigation` continue to render in same order, with same labels, same hrefs
- Phone link continues to use `tel:` protocol with `PHONE_NUMBER` constant
- Primary CTA continues to point to `#contact` anchor

### Claude's Discretion
- Exact opacity values within DESIGN.md tolerance (`/55`, `/68`) — picked from user's draft; not flagged as a Key Decision because they fall within the existing glass scale
- Tap target sizes (`h-11`, `min-h-12`, `min-h-14`) — Apple HIG-derived; not project-novel

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useScrolled` hook (`@/hooks/use-scrolled`) — drives the two-state glass treatment, no changes needed
- `cn` utility (`@/lib/utils`) — already in use across all 3 files
- `NAV_LINKS`, `PHONE_NUMBER`, `PHONE_DISPLAY` constants (`@/lib/navigation`) — single source of truth for nav structure
- `--shadow-glass-sm` token (Phase 79 + prior) — exposed as Tailwind utility `shadow-glass-sm` via `@theme inline` in globals.css:304
- `mu-text-900` color token — exposed via `@theme inline` for backdrop tinting
- Phase 79 mobile blur cap (`--liquid-blur-{md,lg,xl}` clamped at 12px floor below 768px) — consumed automatically by `backdrop-blur-*` Tailwind classes

### Established Patterns
- Server Component (`Header.tsx`) wraps Client Component (`HeaderClient.tsx`) for SSR + interactive scroll state
- `'use client'` directive only on components that need browser APIs (HeaderClient, MobileMenu, StickyBar)
- Body scroll lock via `document.body.style.overflow` in MobileMenu effect
- Conditional `Link` (internal) vs `<a>` (external/anchor) routing per `NAV_LINKS` href pattern

### Integration Points
- `app/layout.tsx` already mounts `<Header />` and `<StickyBar />` — no layout changes needed
- All 4 pages (index, treatment-abroad, checkup, consultations) inherit the header automatically through `RootLayout`

</code_context>

<specifics>
## Specific Ideas

User's stashed draft work is the design contract for this phase — it represents already-validated design intent including:
- Apple HIG 44pt+ tap target compliance
- iOS safe-area-inset-bottom awareness on the sticky bar
- ESC key dismissal on the mobile menu
- Active-state press feedback (`active:scale-[0.96]`) on touch CTAs
- Soft tinted backdrop (`mu-text-900/35`) instead of harsh `black/50`
- Scoped CSS transitions instead of `transition-all` (sharper, less repaint)

</specifics>

<deferred>
## Deferred Ideas

- Header logo treatment changes — not in user's draft, not in Phase 80 scope
- Desktop nav link hover styles beyond color — not in user's draft, deferred until UI review surfaces a need
- StickyBar hide-on-scroll-up behavior — already exists via `isHidden` state, not changed in Phase 80

</deferred>
