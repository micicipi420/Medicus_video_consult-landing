# Phase 79: Visual Foundation (Typography & Mobile Budget) - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning
**Mode:** Autonomous smart-discuss (token/foundation phase — minimal grey areas)

<domain>
## Phase Boundary

Ship the v8.0 modern type scale and responsive glass/motion budget tokens in `next/src/app/globals.css`. No component-level rework and no new section markup — this phase is **token-level only**. Every downstream v8.0 phase (header, hero, stats, services/process, CTA form, glass hardening) consumes these tokens; nothing else ships without them.

**In scope:**
- New/updated CSS custom properties in `:root` and `[data-theme="dark"]` for type scale (display, h1–h4, body, small) with weights and letter-spacing
- Mobile viewport variants (via `@media (max-width: 767px)` and/or `clamp()`) for glass blur, glass element budget hint, and motion tokens
- Body minimum ≥17px, line-height ≥1.5 at mobile (ЦА 45+)
- Token-only regression: v7.0 `prefers-reduced-motion`, `prefers-contrast`, `light-dark()` guarantees continue to pass

**Out of scope (deferred to later v8.0 phases):**
- Rewriting any section markup (header, hero, etc.) — token consumption happens in Phases 80–85
- Replacing doctor hero photo or adding video-call frame — Phase 81
- Any new icons, illustrations, images

</domain>

<decisions>
## Implementation Decisions

### Type Scale
- Source of truth: modern editorial scale used in the v8.0 mockup references (bold display, tight letter-spacing on large sizes, comfortable body).
- Implement as CSS custom properties (`--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-h4`, `--fs-body`, `--fs-small`) with `clamp(mobile-min, fluid-mid, desktop-max)` for fluid scaling.
- Mobile minimum body `1.0625rem` (17px) per success criterion. Desktop body remains `1rem` equivalent only if ≥17px — otherwise bump.
- Letter-spacing tokens (`--ls-display`, `--ls-heading`, `--ls-body`) tighten display/H1 (e.g., `-0.02em`) and keep body at `0`.
- Font-weight tokens reused from existing `--font-weight-medium` / `--font-weight-normal`; add `--font-weight-bold: 700` and `--font-weight-display: 800` if not already present.
- Keep existing Manrope (heading) / Inter (body) family stack — **do not** swap fonts in this phase.

### Mobile Glass/Motion Budget
- Add a responsive variant to existing glass blur tokens (e.g., `--glass-blur`, `--glass-blur-strong`) using `clamp()` so mobile never exceeds **12px blur** (per existing PROJECT.md constraint, reinforced by VIS-03).
- Expose a documentation-level token `--glass-budget-viewport` that is purely informational (CSS comment + optional custom property) naming the "≤2 glass elements/viewport" mobile rule so downstream phases can reference it in code review.
- Motion budget tokens (`--motion-fast`, `--motion-standard`, `--motion-slow`) — keep existing values; add a `@media (prefers-reduced-motion: reduce)` override at token level so every consumer gets 0ms by default.

### Claude's Discretion
- Exact numeric values for the type scale (display/H1/…/body pixel breakpoints) — pick values that match the mockup references and the "bold, modern" direction from PROJECT.md. Aim for ~1.25 modular ratio, display ~56–72px desktop / ~40–48px mobile, body 17px mobile / 18px desktop.
- Naming of new tokens (keep consistent with existing `--mu-*` / `--font-*` / `--fs-*` conventions already in globals.css).
- Whether to introduce a `--type-scale-ratio` variable or hard-code each size — pick whichever reads cleaner when you see the final file.
- Whether mobile body uses `clamp(17px, 4.2vw, 18px)` or a discrete `@media` query — pick whichever respects existing patterns in globals.css.

</decisions>

<code_context>
## Existing Code Insights

### Token file
- `next/src/app/globals.css` (581 lines) is the single source of design tokens. Contains `:root { --font-size: 16px; --font-family-body: …; --font-family-heading: …; }`, `--mu-*` color palette, `--section-h-*` layout, `light-dark()` dark mode tokens, and `[data-theme="dark"]` overrides.
- Existing font-weight tokens: `--font-weight-medium: 500`, `--font-weight-normal: 400`. No `--fs-*` type scale yet — this phase introduces it.
- `next/src/styles/liquid-glass.css` and `next/src/styles/squircles.css` contain glass/shape utilities that reference tokens — downstream phases tweak those, not this one.

### Established patterns
- Tailwind utility approach layered on top of CSS custom properties (per v6.0 Next.js migration).
- `light-dark()` + `[data-theme="dark"]` attribute selector for theming (v1.4 decision).
- Mobile budget: ≤2 glass elements/viewport, blur ≤12px (v1.4 decision, baked into PROJECT.md).
- `prefers-reduced-motion` / `prefers-contrast` / `prefers-reduced-transparency` already handled at component level from v7.0 — this phase centralizes motion duration tokens to strengthen that.

### Integration points
- Consumers in next phases: `next/src/components/layout/*` (header Phase 80), `next/src/components/sections/*` (hero Phase 81, stats Phase 82, services/process Phase 83, CTA form Phase 84), Tailwind/inline styles in `app/page.tsx` and service pages.
- **Do not** edit component files in this phase — token layer only.

</code_context>

<specifics>
## Specific Ideas

- Mockup direction cue: "новая структура секций, усиленный glassmorphism, современная типографика". Interpret "современная типографика" as bold display weight, tight letter-spacing on large sizes, comfortable reading body.
- Keep the visible change on the existing index page small in this phase — typography will *look* slightly different but no section is broken. The dramatic visual change lands in Phases 80–85 as sections consume the new tokens and switch markup.

</specifics>

<deferred>
## Deferred Ideas

- Per-section typography overrides (hero oversized display, stats large numerals) — belong to the section's own v8.0 phase (81, 82).
- Variable-font usage (`font-variation-settings`) — evaluate in Phase 85 if the mockup calls for it; not table-stakes.
- Custom fluid spacing scale beyond existing `--section-pt*` — defer unless a consumer phase surfaces a need.

</deferred>
