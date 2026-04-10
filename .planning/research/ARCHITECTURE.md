# Architecture Patterns: v5.0 Full Liquid Glass Rework

**Domain:** Liquid Glass design system extension for existing 7-page static site
**Researched:** 2026-04-10
**Milestone:** v5.0 -- SVG refraction tuning, adaptive tinting, specular highlights, fluted/clear glass, GPU perf, cross-browser hardening
**Overall Confidence:** HIGH (working with established codebase, well-understood CSS patterns)

---

## Existing Architecture Snapshot

Before recommending where new features integrate, here is the complete current file map:

```
src/styles/
  tailwind.css          # Entry point: @import chain
  fonts.css             # SF Pro Display + Rounded (local only)
  theme.css             # :root tokens (~50 --liquid-*), .dark cascade, @theme inline, @layer base/utilities/components
  squircles.css          # 3-tier squircle masks (mask-image SVG, corner-shape progressive enhancement)
  liquid-glass.css       # 15 sections: materials, buttons, shimmer, scroll-fade, rim-lights, glint, header backdrop, refraction, print, section tints, reduced-motion/transparency, fallbacks

js/
  main.js               # IIFE, ~600 LOC. Form, accordion, header scroll, mobile menu, phone mask, refraction probe, mouse specular
  animations.js          # Motion CDN entrance animations. Exposes MU.initAnimations()
  router.js              # SPA-like client router. Swaps <main>, re-inits JS

partials/
  header.html            # Shared header chrome
  footer.html            # Shared footer chrome
  mobile-menu.html       # Mobile menu overlay
  sticky-bar.html        # Mobile sticky CTA bar
  svg-defs.html          # SVG filter definitions (liquid-refract feTurbulence + feDisplacementMap)

Makefile                 # `make build`: tailwindcss CLI -> splice partials
scripts/build-pages.sh   # POSIX-sh marker-based splicer
```

**CSS import order (critical for cascade):**
```
tailwind.css
  -> fonts.css
  -> tailwindcss (source: *.html)
  -> theme.css         (:root tokens, .dark overrides, @theme inline, @layer base/utilities/components)
  -> squircles.css     (mask primitives)
  -> liquid-glass.css  (material classes consuming --liquid-* tokens)
```

**JS load order in HTML:**
```html
<script src="js/main.js" defer></script>
<script src="https://cdn.motionone.org/motion@12/dist/motion.js" defer></script>
<script src="js/animations.js" defer></script>
<script src="js/router.js" defer></script>
```

---

## Integration Plan: Where Each New Feature Goes

### 1. Adaptive Tinting CSS

**What it is:** Glass surfaces that shift color based on the content behind them, simulating how Apple's Liquid Glass adapts tint from background content.

**Where it goes:** Extend `liquid-glass.css` -- new Section 16.

**Why not a new file:** Adaptive tinting is a modifier of existing glass materials, not a standalone concept. It needs to reference the same `--liquid-*` tokens and layer alongside `.liquid-regular`, `.liquid-card`, etc. A separate file would break the conceptual unity of "all glass material definitions live in one place."

**Implementation approach:** Use `mix-blend-mode` on a `::before` pseudo-element overlaid on the glass surface. Critical constraint: `mix-blend-mode` combined with `backdrop-filter` on the **same element** causes the blur to disappear in Safari. The solution is a layered architecture:

```
.liquid-card (backdrop-filter: blur)
  ::before (specular glint border -- already exists)
  ::after  (radial-gradient specular highlight -- already exists)
```

The tint layer needs a **third pseudo-element**, which CSS does not allow. Two options:

**Option A (recommended): CSS-only via background blend.**
Apply the tint color directly to the `background` property using a gradient overlay:

```css
/* Section 16 -- Adaptive tinting */
.liquid-tint-cool {
  --liquid-tint: rgba(56, 198, 244, 0.08);
  background:
    linear-gradient(var(--liquid-tint), var(--liquid-tint)),
    var(--liquid-bg);
}

.liquid-tint-warm {
  --liquid-tint: rgba(255, 162, 92, 0.06);
  background:
    linear-gradient(var(--liquid-tint), var(--liquid-tint)),
    var(--liquid-bg);
}

.liquid-tint-mint {
  --liquid-tint: rgba(111, 222, 169, 0.07);
  background:
    linear-gradient(var(--liquid-tint), var(--liquid-tint)),
    var(--liquid-bg);
}
```

**Why this works:** The tint is baked into the background composite, preserving both `::before` (glint) and `::after` (specular) pseudo-elements for their existing roles. No extra DOM wrapper needed.

**Option B (fallback): HTML wrapper element.**
If more complex blend modes (soft-light, overlay) are needed, add a wrapper `<div class="liquid-tint-layer">` inside the card with `mix-blend-mode: soft-light` and `pointer-events: none`. This requires HTML changes but allows true blend-mode tinting.

**Recommendation:** Start with Option A. The background-gradient approach is pure CSS, requires no HTML changes, and produces a believable tint effect. Escalate to Option B only if the visual result is insufficient after testing.

**Token additions to theme.css :root:**
```css
--liquid-tint-cool: rgba(56, 198, 244, 0.08);
--liquid-tint-warm: rgba(255, 162, 92, 0.06);
--liquid-tint-mint: rgba(111, 222, 169, 0.07);
```

**Dark mode overrides in .dark:**
```css
--liquid-tint-cool: rgba(56, 198, 244, 0.12);
--liquid-tint-warm: rgba(255, 162, 92, 0.10);
--liquid-tint-mint: rgba(111, 222, 169, 0.10);
```

---

### 2. Fluted Glass Variant

**What it is:** Glass with vertical ridged/streak pattern overlaid, simulating fluted or ribbed glass panels.

**Where it goes:** Extend `liquid-glass.css` -- new Section 17.

**Implementation:** The fluted pattern is a repeating vertical stripe overlaid via `background-image` on the glass element itself (composited with the glass background). No extra pseudo-element needed because the stripe pattern is part of the `background` stack:

```css
/* Section 17 -- Fluted glass variant */
.liquid-fluted {
  isolation: isolate;
  position: relative;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 3px,
      rgba(255, 255, 255, 0.06) 3px,
      rgba(255, 255, 255, 0.06) 6px
    ),
    var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  box-shadow:
    var(--liquid-shadow-inset-top),
    var(--liquid-shadow-inset-bottom),
    var(--liquid-shadow-outer);
}
```

**Token additions to theme.css :root:**
```css
--liquid-flute-width: 3px;
--liquid-flute-gap: 3px;
--liquid-flute-opacity: 0.06;
```

**Why a separate class and not a modifier of .liquid-regular:** Fluted glass has a fundamentally different visual character. Composing it as `.liquid-regular.liquid-fluted` would require the fluted class to override the `background` shorthand entirely (it cannot append to an existing `background` declaration). A standalone class that includes its own backdrop-filter declaration is cleaner and more predictable.

**Combine with tinting:** `.liquid-fluted.liquid-tint-cool` -- the tint classes use `background:` shorthand which would conflict. For combined use, create a specific compound:

```css
.liquid-fluted.liquid-tint-cool {
  background:
    repeating-linear-gradient(90deg, transparent 0px, transparent var(--liquid-flute-width), rgba(255,255,255, var(--liquid-flute-opacity)) var(--liquid-flute-width), rgba(255,255,255, var(--liquid-flute-opacity)) calc(var(--liquid-flute-width) + var(--liquid-flute-gap))),
    linear-gradient(var(--liquid-tint-cool), var(--liquid-tint-cool)),
    var(--liquid-bg);
}
```

**Usage constraint:** Fluted glass is decorative. Limit to 1-2 instances per page (large decorative panels, hero accent). Not for cards containing text -- the vertical stripes reduce readability for the 45+ audience.

---

### 3. Clear Glass Variant

**Context check:** The existing `liquid-glass.css` header comment explicitly states: *"Clear glass is an anti-feature for medical CA 45+ audience -- contrast and legibility take priority over visual novelty."*

**Reassessment for v5.0:** The milestone scope includes `.liquid-clear` as a target feature. The original anti-feature designation was made during v4.0 when the glass system was new and untested. For v5.0, clear glass can be introduced with constraints:

**Where it goes:** Extend `liquid-glass.css` -- new Section 18.

**Implementation:** Clear glass = higher transparency, no blur (or very light blur), with a dimming layer behind it to maintain contrast:

```css
/* Section 18 -- Clear glass variant */
.liquid-clear {
  isolation: isolate;
  position: relative;
  background: var(--liquid-clear-bg);
  backdrop-filter: blur(var(--liquid-blur-sm)) saturate(120%);
  -webkit-backdrop-filter: blur(var(--liquid-blur-sm)) saturate(120%);
  box-shadow:
    var(--liquid-shadow-inset-top),
    var(--liquid-shadow-inset-bottom);
}
```

**Token additions to theme.css :root:**
```css
--liquid-clear-bg: rgba(255, 255, 255, 0.15);
```

**Dark mode:**
```css
--liquid-clear-bg: rgba(30, 40, 60, 0.20);
```

**Usage constraints:**
- Clear glass MUST have a dimming scrim behind it (dark overlay on the section background) to maintain WCAG AA contrast for text
- Never use for elements containing body text or form fields
- Appropriate for: hero accent panels, image overlays, decorative separators
- The dimming layer is applied to the parent section, not to the glass element itself

**Dimming companion class:**
```css
.liquid-clear-dim {
  position: relative;
}
.liquid-clear-dim::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 0;
}
```

---

### 4. Device Orientation JS (Specular Highlight Physics)

**What it is:** On mobile, the specular highlight on glass cards shifts based on device tilt (gyroscope). On desktop, it follows mouse position (already implemented as `initMouseSpecular()` in main.js).

**Where it goes:** Extend `main.js` -- add `initGyroSpecular()` inside the existing IIFE.

**Why not a new file:** The existing `initMouseSpecular()` already sets `--mouse-x` / `--mouse-y` CSS custom properties on `.liquid-card` elements. The gyroscope handler does the same thing but reads from `DeviceOrientationEvent` instead of `mousemove`. They share the same output interface (CSS custom properties). Keeping them in the same file maintains the conceptual link.

**Implementation architecture:**

```
initMouseSpecular()     -- desktop (pointer: fine) -- EXISTING
initGyroSpecular()      -- mobile (pointer: coarse) -- NEW
  |
  v
--mouse-x / --mouse-y CSS custom properties on .liquid-card
  |
  v
.liquid-card::after { radial-gradient at var(--mouse-x) var(--mouse-y) }  -- EXISTING CSS
```

**Key constraints:**
1. **iOS requires permission:** `DeviceOrientationEvent.requestPermission()` must be called from a user gesture (tap). Cannot be called on page load.
2. **HTTPS required:** Both iOS and Android require secure origin for gyroscope access.
3. **ES5 syntax:** The codebase uses ES5 throughout. Use `typeof DeviceOrientationEvent !== 'undefined'` guard, not optional chaining.
4. **Fail silently:** If permission denied or API unavailable, the CSS custom properties keep their default values (`--mouse-x: 30%`, `--mouse-y: 0%`). No degradation in visual quality -- just static highlight position.

**Permission UX pattern:** Do NOT prompt for gyroscope permission proactively. Add the permission request to an existing user interaction:
- When user first taps any `.liquid-card` on mobile, request permission
- On permission grant, start the orientation listener
- Cache permission state in `sessionStorage` to avoid re-prompting

**Registration in initAll():**
```javascript
function initAll() {
  initRefractionProbe();
  initMouseSpecular();
  initGyroSpecular();    // NEW -- no-ops on desktop
  // ... rest
}
```

**SPA router consideration:** `initGyroSpecular()` attaches a single `window` event listener. It does NOT need re-initialization on page navigation because:
- The listener targets `window`, not page-content elements
- `.liquid-card` elements are queried on each event tick (same pattern as `initMouseSpecular()`)

Therefore, it should NOT be added to `reinitPageContent()`. Add it to `initAll()` only.

---

### 5. SVG Refraction Tuning

**What it is:** Fine-tuning the existing SVG displacement filter (`#liquid-refract` in `partials/svg-defs.html`) for per-element calibration.

**Where it goes:** Two locations:
1. **SVG filter definitions** -- modify `partials/svg-defs.html` to add additional filter variants
2. **CSS selectors** -- extend Section 10 of `liquid-glass.css` (existing refraction section)

**Current state:** Single filter `#liquid-refract` with `baseFrequency="0.008"`, `scale="30"`. Applied uniformly to all glass elements via `html[data-refract="true"]` selector.

**Per-element calibration approach:** Add 2-3 filter variants in `svg-defs.html`:

```xml
<!-- Subtle refraction for cards (lower displacement) -->
<filter id="liquid-refract-subtle" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="92" result="noise"/>
  <feGaussianBlur in="noise" stdDeviation="3" result="blurred"/>
  <feDisplacementMap in="SourceGraphic" in2="blurred" scale="15" xChannelSelector="R" yChannelSelector="G"/>
</filter>

<!-- Strong refraction for hero/stats (higher displacement) -->
<filter id="liquid-refract-strong" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="92" result="noise"/>
  <feGaussianBlur in="noise" stdDeviation="2" result="blurred"/>
  <feDisplacementMap in="SourceGraphic" in2="blurred" scale="40" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

**CSS selector update in liquid-glass.css Section 10:**
```css
html[data-refract="true"] .liquid-card {
  backdrop-filter: url(#liquid-refract-subtle) blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
}

html[data-refract="true"] .stats-glass {
  backdrop-filter: url(#liquid-refract-strong) blur(var(--liquid-blur-lg)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
}
```

**Build system impact:** `svg-defs.html` is a partial processed by `build-pages.sh`. Adding filter elements there automatically propagates to all 7 pages via the splicer. No Makefile changes needed.

---

### 6. Performance Monitoring

**What it is:** Tracking GPU composite layers, paint time, and backdrop-filter rendering cost.

**Where it goes:** This is a development-time concern, NOT a runtime feature.

**Approach: Build-time / dev-tools only.**

Do NOT add runtime performance monitoring JS to production code. The reasons:
- `PerformanceObserver` for paint timing adds ~50 LOC of JS for data that is only useful during development
- `will-change` audits are done visually via Chrome DevTools Layers panel
- The 45+ audience gains nothing from performance telemetry in the bundle

**Dev workflow instead:**
1. Chrome DevTools > Layers panel: verify composite layer count per page (target: max 6 glass layers simultaneously)
2. Chrome DevTools > Performance tab: record scroll interaction, check for frames >16ms
3. `will-change` budget: only elements that animate get `will-change`. Static glass cards (`.liquid-card` without hover/scroll animation) must NOT have `will-change: backdrop-filter`
4. Lighthouse performance audit per page after each phase

**will-change guidelines (add as code comment in liquid-glass.css):**
```css
/* PERFORMANCE NOTE:
   will-change: backdrop-filter is ONLY appropriate on:
   - .header (transitions blur on scroll state change)
   - .shimmer-sweep (animation plays on hover)
   - Elements with CSS transitions on backdrop-filter
   
   NEVER add will-change to:
   - Static .liquid-card elements (wastes GPU memory)
   - .stats-glass (static backdrop, no animation)
   - .liquid-regular on non-animated surfaces
   
   Max simultaneous composite layers target: 6 per viewport.
   Budget Android devices in KZ market: ~2GB RAM typical.
*/
```

---

### 7. Cross-Browser Test Strategy

**What tools:** Playwright (already in use -- `.playwright-mcp/` directory has 80+ captured page snapshots).

**Test matrix:**

| Browser Engine | Playwright Project | Key Concerns |
|---------------|-------------------|--------------|
| Chromium | `chromium` | Refraction filter (url(#svg-filter) in backdrop-filter), corner-shape: squircle |
| WebKit | `webkit` | `-webkit-backdrop-filter` prefix required, CSS variables in backdrop-filter broken in older Safari, box-shadow + backdrop-filter conflict |
| Firefox | `firefox` | SVG filter in backdrop-filter not supported (graceful degradation expected), older versions lack backdrop-filter entirely |

**Visual regression approach:**
1. Capture baseline screenshots for all 7 pages at 3 breakpoints (375px, 768px, 1440px)
2. Capture in both light and dark mode (14 screenshots x 3 browsers = 42 baseline images per breakpoint set)
3. Run screenshot comparison after each CSS change with `maxDiffPixelRatio: 0.01` threshold
4. Flaky test prevention: use `mask` option on animated elements (shimmer, glint) to exclude from pixel diff

**Safari-specific hardening (from research):**
- Always include `-webkit-backdrop-filter` alongside `backdrop-filter` (already done in existing code)
- box-shadow and backdrop-filter on the same element: Safari renders artifacts. The codebase already uses the shadow-wrap pattern -- verify this remains intact for new variants
- `transform: translateZ(0)` force-GPU workaround: only add if Safari regression detected, not preemptively
- Nested backdrop-filter elements: Safari 18 has a bug with `background-color` on inner elements. The existing anti-pattern rule "NEVER nest glass inside glass" prevents this

**Firefox-specific hardening:**
- SVG filter in `backdrop-filter: url(#filter)` is not supported in Firefox. The existing `html[data-refract="true"]` gating mechanism handles this -- Firefox fails the `CSS.supports('backdrop-filter', 'url(#test) blur(1px)')` probe and gets blur-only glass. No change needed.

**Android Chrome specific:**
- Test on budget device viewport (360x640, 2x DPR) with CPU throttle in Playwright
- `--liquid-blur-lg` (40px) may cause jank on budget Snapdragon SoCs. Monitor for >16ms frame times during scroll
- Reduced motion preference should be tested (verify Section 13 of liquid-glass.css disables properly)

---

## Token Naming Strategy

### Existing Convention Analysis

Current `--liquid-*` tokens in theme.css follow this pattern:

```
--liquid-{property}                     # base value (e.g., --liquid-bg)
--liquid-{property}-{scale}             # scaled variants (e.g., --liquid-blur-sm, --liquid-blur-md, --liquid-blur-lg)
--liquid-{component}-{property}         # component-scoped (e.g., --liquid-shadow-outer, --liquid-shadow-inset-top)
--liquid-{property}-{qualifier}         # qualified (e.g., --liquid-border-top, --liquid-border-bottom)
```

### Naming Rules for New Tokens

**Rule 1: Prefix all glass tokens with `--liquid-`.**
This is already established. No exceptions for new variants.

**Rule 2: Variant names go after `--liquid-` as a namespace segment.**
```
--liquid-clear-bg          # clear variant background
--liquid-flute-width       # fluted variant parameter
--liquid-tint-cool         # tint modifier color
```

**Rule 3: Do NOT create `--liquid-v5-*` or version-prefixed tokens.**
Tokens are semantic, not versioned. `--liquid-clear-bg` is meaningful; `--liquid-v5-clear-bg` is noise.

**Rule 4: Scale modifiers use t-shirt sizes (sm/md/lg/xl), matching existing convention.**
```
--liquid-blur-sm: 16px;    # existing
--liquid-blur-md: 24px;    # existing
--liquid-blur-lg: 40px;    # existing
--liquid-blur-xl: 60px;    # existing
# No new blur tiers needed -- 4 is sufficient
```

**Rule 5: Opacity/alpha values go into the token, not as separate `--liquid-*-opacity` tokens.**
```
# Good: opacity baked into rgba()
--liquid-tint-cool: rgba(56, 198, 244, 0.08);

# Bad: separate opacity token
--liquid-tint-cool-color: rgb(56, 198, 244);
--liquid-tint-cool-opacity: 0.08;
```
Exception: `--liquid-flute-opacity` is acceptable because it needs to be independently adjustable (dark mode may need different stripe visibility without changing stripe color).

### Complete New Token Inventory

| Token | Light Value | Dark Value | Used By |
|-------|------------|------------|---------|
| `--liquid-tint-cool` | `rgba(56, 198, 244, 0.08)` | `rgba(56, 198, 244, 0.12)` | `.liquid-tint-cool` |
| `--liquid-tint-warm` | `rgba(255, 162, 92, 0.06)` | `rgba(255, 162, 92, 0.10)` | `.liquid-tint-warm` |
| `--liquid-tint-mint` | `rgba(111, 222, 169, 0.07)` | `rgba(111, 222, 169, 0.10)` | `.liquid-tint-mint` |
| `--liquid-clear-bg` | `rgba(255, 255, 255, 0.15)` | `rgba(30, 40, 60, 0.20)` | `.liquid-clear` |
| `--liquid-flute-width` | `3px` | `3px` | `.liquid-fluted` |
| `--liquid-flute-gap` | `3px` | `3px` | `.liquid-fluted` |
| `--liquid-flute-opacity` | `0.06` | `0.10` | `.liquid-fluted` |

---

## File Organization: Final State After v5.0

### CSS Files (src/styles/)

```
tailwind.css               # UNCHANGED -- import chain
fonts.css                  # UNCHANGED
theme.css                  # MODIFIED -- add ~7 new --liquid-* tokens to :root, add dark overrides to .dark
squircles.css              # UNCHANGED
liquid-glass.css           # MODIFIED -- add Sections 16-18 (tinting, fluted, clear)
```

**No new CSS files.** All glass material logic stays in `liquid-glass.css`. The file grows from ~490 lines to ~620 lines. Still well within single-file maintainability.

### JS Files (js/)

```
main.js                    # MODIFIED -- add initGyroSpecular() (~60 LOC)
animations.js              # UNCHANGED
router.js                  # UNCHANGED
```

**No new JS files.** The gyroscope handler is functionally a sibling of `initMouseSpecular()` and belongs in the same IIFE.

### Partials

```
partials/svg-defs.html     # MODIFIED -- add #liquid-refract-subtle, #liquid-refract-strong filters
partials/header.html       # UNCHANGED
partials/footer.html       # UNCHANGED
partials/mobile-menu.html  # UNCHANGED
partials/sticky-bar.html   # UNCHANGED
```

### HTML Pages

```
*.html                     # MODIFIED ONLY for:
                           #   - Adding .liquid-tint-*, .liquid-fluted, .liquid-clear classes
                           #   - Adding .liquid-clear-dim to sections hosting clear glass
                           #   - SVG defs auto-updated by splicer from svg-defs.html partial
```

---

## Build Order: Dependency-Respecting Phase Sequence

Each phase is independently deployable. Later phases depend on earlier ones.

### Phase 1: Token Foundation + Dead Code Cleanup
**Deps:** None
**Files:** theme.css
**What:** Add all 7 new `--liquid-*` tokens to `:root` and `.dark`. Remove unused tokens identified in CSS audit. Clean `.liquid-card-wrap` wrappers from HTML (currently no-op, deprecated in v4.0).

**Rationale:** Tokens must exist before any class can reference them. Dead code cleanup is lowest-risk and should happen first to reduce noise in subsequent phases.

### Phase 2: SVG Refraction Tuning
**Deps:** Phase 1 (tokens exist)
**Files:** partials/svg-defs.html, liquid-glass.css (Section 10)
**What:** Add `#liquid-refract-subtle` and `#liquid-refract-strong` filter variants. Update CSS selectors for per-element filter assignment. Run `make build` to propagate svg-defs to all pages.

**Rationale:** Refraction is the deepest visual layer. Tune it before adding surface effects (tints, flutes) that will be evaluated visually on top of it.

### Phase 3: Adaptive Tinting
**Deps:** Phase 1 (tint tokens exist)
**Files:** liquid-glass.css (new Section 16), HTML pages (add tint classes)
**What:** Implement `.liquid-tint-cool`, `.liquid-tint-warm`, `.liquid-tint-mint` classes. Apply to appropriate sections.

**Rationale:** Tinting is a modifier of existing glass materials. Once tokens and refraction are stable, tinting is purely additive.

### Phase 4: Fluted + Clear Glass Variants
**Deps:** Phase 1 (tokens), Phase 3 (tinting -- for compound classes)
**Files:** liquid-glass.css (new Sections 17-18), HTML pages
**What:** Implement `.liquid-fluted` and `.liquid-clear` with `.liquid-clear-dim` companion. Add compound selectors for `.liquid-fluted.liquid-tint-*`. Apply sparingly to appropriate pages.

**Rationale:** These are new material variants. They depend on tinting being stable (for compound classes). Clear glass needs careful WCAG AA contrast verification before deploying.

### Phase 5: Specular Highlight Physics (Gyroscope)
**Deps:** None (independent JS feature, reads existing CSS custom properties)
**Files:** main.js
**What:** Add `initGyroSpecular()`. Permission UX on first card tap. ES5 syntax. Test on iOS Safari + Android Chrome.

**Rationale:** This is a JS-only addition that consumes existing CSS interfaces (`--mouse-x`, `--mouse-y`). Can technically run in parallel with CSS phases, but testing is easier when the visual glass system is stable.

### Phase 6: GPU Performance Audit
**Deps:** All CSS phases complete (1-4)
**Files:** None (dev workflow, no code changes)
**What:** Lighthouse audit all 7 pages. Chrome Layers panel audit. Identify and fix any `will-change` violations. Test on throttled CPU. Verify reduced-motion and reduced-transparency media queries.

**Rationale:** Performance audit only makes sense after all visual features are in place. Auditing mid-development wastes effort on code that will change.

### Phase 7: Cross-Browser Hardening
**Deps:** All phases complete (1-6)
**Files:** liquid-glass.css (fixes), main.js (fixes)
**What:** Run Playwright visual regression suite across Chromium/WebKit/Firefox at 3 breakpoints. Fix Safari-specific regressions. Verify Firefox graceful degradation. Update styleguide.html with all new glass variants.

**Rationale:** Cross-browser hardening is the final polish pass. All features must be implemented first.

### Phase 8: Design System Documentation
**Deps:** Phase 7 (all hardened)
**Files:** styleguide.html
**What:** Update styleguide page with interactive examples of all glass variants (regular, clear, fluted), tinting options, refraction levels. Add usage guidelines and anti-pattern warnings.

---

## Component Boundaries

### What Gets MODIFIED vs What Gets ADDED

| Component | Action | File | Lines Added (est.) |
|-----------|--------|------|--------------------|
| `--liquid-tint-*` tokens | ADD | theme.css :root | 6 |
| `--liquid-tint-*` dark overrides | ADD | theme.css .dark | 6 |
| `--liquid-clear-bg` token | ADD | theme.css :root + .dark | 2 |
| `--liquid-flute-*` tokens | ADD | theme.css :root + .dark | 6 |
| `.liquid-tint-cool/warm/mint` | ADD | liquid-glass.css S16 | 25 |
| `.liquid-fluted` | ADD | liquid-glass.css S17 | 30 |
| `.liquid-clear` + `.liquid-clear-dim` | ADD | liquid-glass.css S18 | 25 |
| Compound `.liquid-fluted.liquid-tint-*` | ADD | liquid-glass.css S17 | 20 |
| Refraction CSS selectors | MODIFY | liquid-glass.css S10 | 10 |
| `#liquid-refract-subtle/strong` | ADD | partials/svg-defs.html | 14 |
| `initGyroSpecular()` | ADD | js/main.js | 60 |
| `initAll()` registration | MODIFY | js/main.js (1 line) | 1 |
| Dead code removal | MODIFY | theme.css, *.html | -50 |
| **Total net change** | | | **~155 lines** |

### What is NOT Modified

- `tailwind.css` -- import chain unchanged
- `fonts.css` -- no font changes
- `squircles.css` -- mask system unchanged
- `animations.js` -- entrance animations unchanged
- `router.js` -- routing unchanged
- `Makefile` -- build pipeline unchanged
- `scripts/build-pages.sh` -- splicer unchanged
- `partials/header.html` -- header chrome unchanged
- `partials/footer.html` -- footer chrome unchanged
- `partials/mobile-menu.html` -- mobile menu unchanged
- `partials/sticky-bar.html` -- sticky bar unchanged

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Creating src/styles/liquid-tinting.css or similar

**What goes wrong:** Adding a new CSS source file requires modifying `tailwind.css` imports and the Tailwind CLI build step. The cascade order matters -- tinting CSS must come after the base glass material declarations. A separate file introduces import-order bugs.
**Instead:** Add new sections (16, 17, 18) to the existing `liquid-glass.css`. The file is well-sectioned with clear headers.

### Anti-Pattern 2: Using mix-blend-mode on elements with backdrop-filter

**What goes wrong:** In Safari, applying `mix-blend-mode` to an element that also has `backdrop-filter` causes the blur to disappear entirely. The element renders as if `backdrop-filter: none`.
**Instead:** Use the background-gradient overlay technique for tinting. Reserve `mix-blend-mode` for wrapper elements that do NOT have their own `backdrop-filter`.

### Anti-Pattern 3: Adding will-change: backdrop-filter to all glass elements

**What goes wrong:** Every `will-change` declaration creates a GPU composite layer. With 6+ glass cards visible simultaneously, this exhausts GPU memory on budget Android devices (common in KZ market). The result: janky scrolling, potential browser crash on devices with 2GB RAM.
**Instead:** Only add `will-change` to elements that actually transition their backdrop-filter value (header on scroll state change). Static glass cards get no `will-change`.

### Anti-Pattern 4: Requesting gyroscope permission on page load

**What goes wrong:** iOS blocks `DeviceOrientationEvent.requestPermission()` unless called from a user gesture. Calling it on load throws a `NotAllowedError`. Even on Android (where no permission is needed), prompting immediately is hostile UX.
**Instead:** Attach the permission request to the first user tap on a `.liquid-card`. Gate with `sessionStorage` to avoid re-prompting within the same session.

### Anti-Pattern 5: Using ES6 modules for new JS

**What goes wrong:** The existing architecture uses IIFE pattern with `<script defer>` tags. Switching to `<script type="module">` for the gyroscope code changes the execution model (modules are deferred by default, strict mode only, scoped) and creates inconsistency with `main.js` / `animations.js` / `router.js`.
**Instead:** Add `initGyroSpecular()` inside the existing IIFE in `main.js`. Same execution model, same global interface pattern (`window.MU`).

### Anti-Pattern 6: Nesting glass inside glass

**What goes wrong:** Double backdrop-filter compounds the blur, making text completely unreadable. Safari 18 has additional bugs with nested backdrop-filter + background-color.
**Instead:** The existing anti-pattern rule in liquid-glass.css header remains: "NEVER nest glass inside glass." New variants (clear, fluted) inherit this constraint.

---

## Scalability Considerations

| Concern | Current (7 pages) | At 15 pages | At 30+ pages |
|---------|-------------------|-------------|--------------|
| CSS size | ~70KB compiled (css/styles.css) | ~75KB (tokens + 3 new sections) | Consider CSS splitting by page if >100KB |
| Glass elements per viewport | Max 6 simultaneously | Same constraint | Same constraint -- GPU budget is per-viewport, not per-site |
| SVG filter definitions | 1 filter (svg-defs.html) | 3 filters (~484 -> ~700 bytes) | OK -- SVG defs are tiny |
| Build time | ~2s (Tailwind CLI + splicer) | ~3s (more pages to splice) | ~5s -- still acceptable |
| JS bundle | 3 files, ~42KB total | ~44KB (gyroscope adds ~2KB) | Consider bundling if >60KB |

---

## Data Flow Diagrams

### Glass Material Rendering Pipeline

```
theme.css :root
  |-- --liquid-bg, --liquid-blur-md, --liquid-saturate, --liquid-brightness
  |-- --liquid-tint-*, --liquid-clear-bg, --liquid-flute-*
  |
  v
liquid-glass.css classes
  |-- .liquid-regular     (base material)
  |-- .liquid-card        (card material + ::before glint + ::after specular)
  |-- .liquid-tint-*      (tint modifier via background composite)
  |-- .liquid-fluted      (stripe pattern via background composite)
  |-- .liquid-clear       (high-transparency variant)
  |
  v
HTML elements
  |-- class="squircle-lg liquid-card liquid-tint-cool"
  |
  v
Browser composite
  |-- backdrop-filter: url(#liquid-refract-subtle) blur() saturate() brightness()
  |-- background: gradient-tint + liquid-bg composite
  |-- ::before pseudo (glint border animation)
  |-- ::after pseudo (radial specular highlight at --mouse-x/--mouse-y)
```

### Specular Highlight Input Pipeline

```
Desktop:                              Mobile:
mousemove event                       DeviceOrientationEvent
  |                                     |
  v                                     v
initMouseSpecular()                   initGyroSpecular()
  |                                     |
  +-----> --mouse-x, --mouse-y <-------+
          (CSS custom properties on .liquid-card)
          |
          v
        .liquid-card::after {
          radial-gradient at var(--mouse-x) var(--mouse-y)
        }
```

---

## Sources

- [CSS-Tricks: Getting Clarity on Apple's Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/) -- glass variant definitions, design constraints (HIGH confidence)
- [DEV.to: Apple Liquid Glass CSS guide](https://dev.to/gruszdev/apples-liquid-glass-revolution-how-glassmorphism-is-shaping-ui-design-in-2025-with-css-code-1221) -- three-layer implementation pattern (MEDIUM confidence)
- [Josh W. Comeau: Next-level frosted glass](https://www.joshwcomeau.com/css/backdrop-filter/) -- header backdrop technique already used in codebase (HIGH confidence)
- [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) -- property support, syntax reference (HIGH confidence)
- [Safari CSS bugs workarounds (BSWEN)](https://docs.bswen.com/blog/2026-03-12-safari-css-issues-workarounds/) -- backdrop-filter + box-shadow conflict, force-GPU workaround (MEDIUM confidence)
- [Safari backdrop-filter + box-shadow (CopyProgramming)](https://copyprogramming.com/howto/backdrop-filter-blur-box-shadow-not-rendering-properly-in-safari) -- drop-shadow replacement pattern (MEDIUM confidence)
- [MDN browser-compat-data Issue #25914](https://github.com/mdn/browser-compat-data/issues/25914) -- Safari 18 still needs -webkit- prefix, CSS variables broken in -webkit-backdrop-filter (HIGH confidence)
- [Gyro-web: Device Orientation in JavaScript](https://trekhleb.dev/blog/2021/gyro-web/) -- DeviceOrientationEvent implementation patterns (HIGH confidence)
- [DEV.to: requestPermission for devicemotion in iOS 13+](https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2) -- iOS permission flow (HIGH confidence)
- [W3C Device Orientation and Motion spec](https://www.w3.org/TR/orientation-event/) -- updated Feb 2025 (HIGH confidence)
- [Playwright: Cross-browser testing](https://playwright.dev/docs/browsers) -- WebKit/Firefox/Chromium engine support (HIGH confidence)
- [Smashing Magazine: Naming Best Practices](https://www.smashingmagazine.com/2024/05/naming-best-practices/) -- token naming conventions (MEDIUM confidence)
- [EightShapes: Naming Tokens in Design Systems](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676) -- hierarchical token naming (MEDIUM confidence)
- Existing codebase analysis: direct file inspection of all source files (HIGH confidence)
