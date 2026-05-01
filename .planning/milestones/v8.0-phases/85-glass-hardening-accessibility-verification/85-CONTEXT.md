# Phase 85: Glass Hardening & Accessibility Verification - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Mode:** Auto-generated (verification phase)

<domain>
## Phase Boundary

Final hardening pass for v8.0. Confirm static evidence (and add CSS where missing) for all 5 success criteria — glass intensity, prefers-contrast, prefers-reduced-transparency, prefers-reduced-motion, focus-visible/tap targets. Live browser verification deferred to user.
</domain>

<decisions>
## Implementation Decisions

### prefers-reduced-transparency (ACC-02)
- v7.0 already declared a block in `liquid-glass.css:768` covering named classes (`.liquid-card`, `.liquid-regular`, etc.)
- v8.0 components (Phases 80–84) use Tailwind utility classes (`backdrop-blur-md`, `bg-white/60`) which were NOT covered by the v7.0 block
- **Phase 85 adds a global block in `globals.css`** that disables `backdrop-filter` (and `-webkit-backdrop-filter`) on every element under `prefers-reduced-transparency: reduce` — covers all utility-class glass surfaces

### prefers-contrast (ACC-01)
- **No prior block existed** for prefers-contrast — REQUIREMENTS.md flagged it as "Partial — code done, needs verification" but it was actually missing
- Phase 85 adds a global block in `globals.css`:
  - Disables `backdrop-filter` (high-contrast mode prefers solid surfaces over blur)
  - Forces `[class*="bg-white/"]` to opaque white
  - Forces `[class*="border-white/"]` to dark, fully opaque borders
- Uses `!important` — necessary because Tailwind utilities ship at the same specificity

### prefers-reduced-motion (Phase 79 baseline)
- Phase 79 already shipped a comprehensive block in `globals.css:452`
- Collapses `--motion-*` tokens to 0ms, strips animation/transition durations to 0.01ms (the standard MDN-recommended pattern), and zeroes transforms on `[data-scroll-reveal]` hooks
- v8.0 components don't introduce any `data-scroll-reveal` consumers — Phase 79 coverage is sufficient

### Glass Budget (mobile)
- Header (Phase 80) = 1 layer
- Each section card stacks 1-per-viewport on mobile = max 1 additional layer visible
- Total: 2 layers — at the Phase 79 cap
- StatsBar uses the responsive-glass-nesting pattern (one wrapper on mobile, four cards on desktop) to avoid 4-layer composition

### Tap Targets (ACC-05)
- Phase 80 introduced `h-11`/`min-h-12`/`min-h-14` across MobileMenu + StickyBar
- Static audit confirms 5 + 2 = 7 tap-target floors in v8.0 layout components
- Form fields and buttons inside ContactForm.tsx (untouched in v8.0) inherit prior sizing — verify in live audit

### focus-visible (ACC-04)
- `globals.css:366-386` defines `:focus-visible` rules for `a`, `button`, `input`, `select`, `textarea`, `[role="button"]`, `[tabindex]` — 7 selectors covered
- `liquid-glass.css:934-944` defines `:focus-visible` rules for named glass classes — 7 selectors
- v8.0 components rely on the global rules in `globals.css` since they use utility classes — coverage adequate

### What this phase does NOT verify
- Actual browser rendering of glass intensity vs mockup (success criterion 1) — requires live screenshot comparison
- Actual contrast ratio measurements against composite backgrounds (success criterion 2 detail) — requires DevTools color picker
- Actual tab order traversal — requires interactive browser session
- Form submission round-trip to Directus (Phase 84 FORM-03) — requires running backend
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- liquid-glass.css already has prefers-reduced-motion + prefers-reduced-transparency + focus-visible blocks
- globals.css already has @theme inline tokens, base typography, focus-visible rules

### Established Patterns
- Media-query blocks live at the bottom of the layered CSS, before @layer components

### Integration Points
- globals.css is loaded once via app/layout.tsx
- Tailwind utilities resolve at build time; attribute selectors `[class*="bg-white/"]` work at runtime
</code_context>

<specifics>
## Specific Ideas

The hardening block uses attribute selectors (`[class*="bg-white/"]`) rather than enumerating every Tailwind alpha-stop. This sacrifices some specificity but gives broad coverage for any future v8.0+ component that uses translucent white tints.
</specifics>

<deferred>
## Deferred Ideas

- Per-class enumeration of every Tailwind alpha utility (`bg-white/10` through `bg-white/95`) — would be more deterministic but verbose
- Black/dark translucent backgrounds (`[class*="bg-mu-text-900/"]`) — not yet rewritten; only the gradient CTA section uses these and contrast is already strong
- Per-component contrast audit screenshots — depends on browser
</deferred>
