# Phase 24: Liquid Glass Enhancement — Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Expand glassmorphism from Phase 22 (2 elements) to a full iOS 26–style liquid glass treatment across the page. Three new glass surfaces added (sticky bar, form wrapper, social proof stats), glass intensity upgraded site-wide (blur + opacity + specular highlight + color tint), dark mode glass enabled everywhere. Richer gradient mesh backgrounds added to benefits and lead-form sections to give glass surfaces visual depth. Performance testing not required.

</domain>

<decisions>
## Implementation Decisions

### Glass intensity upgrade (site-wide, including Phase 22 elements)

- **D-01:** `--glass-blur` token updated from `blur(12px)` → `blur(20px)` — unified, applies to all glass elements including existing header and pricing card from Phase 22
- **D-02:** `--glass-bg` opacity lowered from `0.75` → `0.60` — more transparent, more "liquid" feel
- **D-03:** Green color tint added to glass surface — `rgba(26, 198, 126, 0.05)` mixed into background, giving a barely-perceptible brand-green frosted quality
- **D-04:** Specular highlight on all glass elements — thin bright line along the top edge, implemented via `::before` pseudo-element or `border-top: 1px solid rgba(255, 255, 255, 0.75)` to simulate light refraction
- **D-05:** Enter animation on glass surfaces — `opacity: 0` + `transform: scale(0.98)` → `opacity: 1` + `transform: scale(1)` over `200ms ease-out`. Applies to form wrapper and social proof glass panels on scroll-reveal. Sticky bar uses existing show/hide animation.

### New glass elements

- **D-06:** `.sticky-bar` — gets glass treatment on both desktop and mobile. Currently `position: fixed` bottom bar; add `backdrop-filter: blur(20px)`, green-tinted `--glass-bg`, specular border-top. No opacity override — bar remains fully visible.
- **D-07:** `.lead-form__wrapper` — the right-column form card gets `.card--glass` class (same modifier as pricing card). Sits over the gradient blob already present in `.lead-form-section::before`.
- **D-08:** `.social-proof` stat items — individual stat panels (number + label pairs) get glass treatment over the dark teal `#0E7490` section background. Dark teal is ideal for glass — rich visual content behind the blur. Each stat item gets `backdrop-filter`, semi-transparent dark-tinted glass surface.

### Gradient mesh expansion

- **D-09:** `.benefits` section — currently flat `var(--color-light)`. Add subtle radial gradient mesh (matching hero style: cyan/green at ~6–8% opacity) to give visual depth. Benefits cards sit on this mesh but do NOT get glass — only the mesh background is added.
- **D-10:** `.lead-form-section` — enhance existing `::before` gradient blob with a second radial gradient layer for more depth behind the form wrapper glass card.
- **D-11:** Hero gradient mesh from Phase 22 — unchanged, already in place.

### Dark mode glass (full reversal of Phase 22 glass-off policy)

- **D-12:** `[data-theme="dark"] --glass-bg` updated from `rgba(255,255,255,0.06)` → `rgba(255, 255, 255, 0.10)` — visible frosted surface in dark mode
- **D-13:** All `[data-theme="dark"] { backdrop-filter: none }` overrides removed — from `.site-header.is-scrolled`, `.card--glass`, and new Phase 24 elements. Dark mode now uses blur like light mode.
- **D-14:** Dark tint on dark-mode glass: `rgba(15, 25, 35, 0.55)` base (navy) + `backdrop-filter: blur(20px) saturate(150%)` — gives the correct iOS dark glass look without the "murky smear" issue Phase 22 feared (which was caused by low blur, now fixed with 20px)
- **D-15:** Specular highlight in dark mode: `border-top: 1px solid rgba(255, 255, 255, 0.15)` — subtler than light mode (0.75 → 0.15)

### Viewport budget

- **D-16:** ≤2 glass per viewport constraint from Phase 22 is **removed**. No performance testing required.
- **D-17:** Sticky bar glass applies on both desktop and mobile.

### Claude's Discretion

- Exact specular highlight implementation (pseudo-element vs border-top vs box-shadow inset) — choose whichever produces cleanest result without adding DOM nodes to index.html
- Exact opacity values for social proof stat glass panels (they sit on dark teal — may need different opacity than white-background glass elements)
- Whether `.social-proof` stat items need a new BEM modifier class or can reuse `.card--glass`
- Exact gradient mesh values for `.benefits` — match hero style but may need tuning for light gray base color

</decisions>

<specifics>
## Specific Ideas

- "iOS 26 liquid glass" — the Apple design language where frosted glass panels feel like physical glass: slightly tinted, specular edge highlight, stronger blur than typical glassmorphism
- Social proof section: dark teal background is perfect canvas for glass — richer than white backgrounds
- Form wrapper becoming a glass card mirrors iOS sheet/panel patterns
- Sticky bar frosted glass mirrors iOS tab bar frosting

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

### Phase 22 implementation (glass foundation)

- `.planning/phases/22-glassmorphism/22-CONTEXT.md` — Original glass decisions: token structure, ≤2 rule (now overridden by D-16), dark mode glass-off (now overridden by D-12–D-15), @supports fallback patterns to preserve
- `.planning/phases/22-glassmorphism/22-VERIFICATION.md` — Verified state of existing glass elements before modification

### Codebase

- `css/styles.css` — All glass tokens (:root lines 130–133), dark mode tokens (lines 179–181), `.card--glass` modifier, `.site-header.is-scrolled` glass, `.sticky-bar` base rules
- `index.html` — `.pricing__card.card--glass` (1 occurrence), `.sticky-bar`, `.lead-form__wrapper`, `.social-proof` stat structure

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `.card--glass` modifier: already defined with `backdrop-filter`, `-webkit-backdrop-filter`, `border: 1px solid var(--glass-border)`. Reuse on `.lead-form__wrapper` by adding class in HTML.
- `--glass-*` tokens: `--glass-bg`, `--glass-border`, `--glass-blur` in `:root` — update these 3 tokens and all existing glass elements automatically upgrade (D-01, D-02, D-03).
- `@supports not (backdrop-filter: blur(1px))` fallback blocks: already present for header and `.card--glass` — must preserve, add for new elements.
- `.animate-on-scroll` + IntersectionObserver: enter animation (D-05) can hook into existing scroll-reveal system — add `.card--glass` elements to the animated elements list rather than building a separate observer.

### Established Patterns

- Token cascade: always update `:root` tokens, never hardcode rgba values in component rules
- `-webkit-backdrop-filter` prefix first, then unprefixed — required for Safari
- `[data-theme="dark"]` block overrides tokens, not component rules directly
- BEM modifier pattern: `.card--glass` is the established glass modifier

### Integration Points

- `css/styles.css` Section 1 (tokens): update `--glass-blur`, `--glass-bg`, `--glass-border`
- `css/styles.css` `[data-theme="dark"]` block: update dark glass tokens, remove `backdrop-filter: none` overrides
- `css/styles.css` Section 6 (Components): update `.card--glass`, add social proof stat glass
- `css/styles.css` Section 7 (Sections): update `.site-header.is-scrolled`, `.sticky-bar`, `.benefits`, `.lead-form-section`
- `index.html`: add `.card--glass` to `.lead-form__wrapper`; social proof stat items may need a modifier class

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 24-liquid-glass-enhancement*
*Context gathered: 2026-03-24*
