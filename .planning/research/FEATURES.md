# Feature Landscape: v5.0 Full Liquid Glass Rework

**Domain:** Medical consultation landing page -- Liquid Glass visual refinement to Apple WWDC 2025 fidelity
**Researched:** 2026-04-09
**Confidence:** HIGH for CSS techniques, MEDIUM for Apple Liquid Glass behavioral parity, LOW where flagged
**Scope:** NEW features only. Existing implementation (liquid-regular, liquid-card, liquid-btn-primary/secondary, stats-glass, specular rim-light, animated glint, mouse-tracking specular, SVG refraction, extended header backdrop, dark mode, section tints, shimmer sweep, scroll-edge fades) is documented but not re-specified.

---

## Existing Implementation Inventory

Before defining new features, what is already built and working in v4.0:

| Feature | Class/Mechanism | Status |
|---------|----------------|--------|
| Base glass material | `.liquid-regular` with `backdrop-filter: blur() saturate() brightness()` | Shipped |
| Card glass material | `.liquid-card` with same filter + mouse-tracking `::after` | Shipped |
| Button glass (secondary) | `.liquid-btn-secondary` with glass material | Shipped |
| Button solid (primary) | `.liquid-btn-primary` with gradient fill | Shipped |
| Stats grouped glass | `.stats-glass` with larger blur radius | Shipped |
| Specular rim-light | `::before` pseudo on regular/btn-secondary/stats | Shipped |
| Animated glint border | `::before` pseudo on liquid-card with mask-composite | Shipped |
| Mouse-tracking specular | `--mouse-x`/`--mouse-y` CSS vars via JS mousemove | Shipped |
| SVG refraction | `feTurbulence` + `feDisplacementMap`, Chromium-only via `data-refract` | Shipped |
| Extended header backdrop | 200% height + mask-image (Josh Comeau technique) | Shipped |
| Dark mode token cascade | `.dark` class with `--liquid-*` overrides | Shipped |
| Section tint backgrounds | `.section-tint-cool/warm/mint` gradient overlays | Shipped |
| Shimmer sweep | `.shimmer-sweep` hover animation on CTA | Shipped |
| Scroll-edge fades | `.scroll-fade-top/bottom` mask-image gradients | Shipped |
| Squircle masks | `.squircle-md/lg/xl` with SVG mask + corner-shape progressive enhancement | Shipped |
| Print/reduced-motion/reduced-transparency | Full media query fallbacks | Shipped |

---

## Table Stakes

Features that v5.0 MUST deliver. Without these, the Liquid Glass system feels incomplete -- a 70% reproduction of Apple's language rather than a convincing implementation. These are the features that separate "has glass effects" from "has a glass SYSTEM."

| Feature | Why Expected | Complexity | Depends On | Web Feasibility |
|---------|--------------|------------|------------|-----------------|
| Glass hierarchy system (3 tiers) | Apple defines glass as a material with explicit hierarchy: Regular (default), Clear (transparent), and navigation-level variants. Having only one `.liquid-regular` material means every glass element looks identical -- no visual hierarchy between nav, cards, and stats. | MEDIUM | Existing token architecture in theme.css | HIGH -- pure CSS token differentiation |
| Interaction states on glass (hover, press, focus) | v4.0 has hover on buttons (`brightness(1.08)`, `scale(0.97)`) but glass cards and glass surfaces have NO interaction feedback beyond the mouse-tracking specular. Apple's glass "illuminates from within" on touch and has spring-based feedback. | MEDIUM | liquid-glass.css, existing `--dur-hover`/`--dur-press` tokens | HIGH -- CSS transitions + radial-gradient manipulation |
| Adaptive tinting (background-aware glass color) | Apple's defining differentiator: glass shifts its tint based on the content behind it. Currently all glass elements use the same fixed `--liquid-bg: rgba(255,255,255,0.42)` regardless of section background. Glass over a cool-tint section looks the same as glass over a warm-tint section. | MEDIUM | Section tint system already in place | MEDIUM -- `mix-blend-mode` or per-section CSS variable override |
| Dark mode glass refinement | Current dark mode glass uses `rgba(30,40,60,0.45)` uniformly. Apple's dark glass is more nuanced: lighter edges, deeper center, stronger specular rim. The current dark glass looks flat. | LOW | `.dark` token cascade in theme.css | HIGH -- token value tuning only |

### Table Stakes: Detailed Specifications

#### 1. Glass Hierarchy System (3 Tiers)

Apple's Liquid Glass has three material variants. The web implementation needs three distinct visual tiers that create hierarchy through transparency, blur, and specular intensity.

**Tier 1: Navigation glass (`.liquid-nav`)**
- Purpose: Sticky header, toolbars, navigation bars
- Character: Highest blur (already `--liquid-blur-xl: 60px` on scroll), most opaque, minimal specular
- Reasoning: Navigation glass must be legible above all else. It is the substrate on which interactive controls sit. Apple explicitly reserves the heaviest glass treatment for navigation.
- Implementation: Already partially exists as `.header--scrolled` overrides. Formalize into a named class with its own token set.

**Tier 2: Surface glass (`.liquid-regular` -- existing, refined)**
- Purpose: Cards, grouped content containers, stat blocks
- Character: Medium blur (`--liquid-blur-md: 24px`), medium opacity, full specular + glint
- Reasoning: This is the workhorse material. Most of the visual personality lives here.
- Implementation: Already shipped. Token values may need tuning for contrast against the new Clear variant.

**Tier 3: Clear glass (`.liquid-clear`)**
- Purpose: Overlay panels, hero accent elements, decorative surfaces where background content should show through
- Character: Lower opacity, lower blur, requires dimming layer, bold/bright content only
- Reasoning: Apple's Clear variant deliberately sacrifices legibility for visual richness. Use ONLY where the background is media-rich and the foreground is bold (icons, large numbers).
- Implementation: New class. Requires a `::after` dimming pseudo-element.

**Confidence:** HIGH for the three-tier concept (directly from Apple's WWDC 2025 "Meet Liquid Glass" session). MEDIUM for the specific CSS values -- will need visual tuning.

**Why NOT four or five tiers:** Apple has Regular, Clear, and Identity. Identity is "no glass" -- just the content. For a landing page with known, finite use cases, three tiers plus "no glass" covers every element.

#### 2. Interaction States on Glass

Apple's glass material provides four distinct interaction responses:

**Hover (desktop):**
- Glass surface brightens subtly (increase `--liquid-brightness` from 108% to ~115%)
- Specular highlight intensifies (increase `::after` opacity from 0.15 to 0.25)
- Inset shadow lightens (top highlight becomes more prominent)
- Transition: `280ms` using `--ease-liquid` (already tokenized)

**Press/Active:**
- Glass surface dims slightly (decrease brightness to ~100%)
- Element scales down: `transform: scale(0.98)` (already 0.97 on buttons, extend to cards)
- Specular highlight concentrates under the press point (narrow the `::after` radial-gradient)
- Apple describes this as "the glow spreads throughout the element starting from under your fingertips"
- Transition: `120ms` using `--ease-liquid`

**Focus (keyboard):**
- Outer focus ring: `2px solid var(--mu-blue-text)` with `outline-offset: 3px` (already implemented globally)
- Inner glass: increase specular rim opacity to ensure the focused element is visually distinct even when the focus ring is subtle
- Glass cards should receive the same focus treatment as buttons

**Glow spread (interaction feedback):**
- When a glass element is interacted with, a subtle glow radiates from the interaction point
- CSS implementation: transition the `::after` radial-gradient from tight (30% spread) to wide (80% spread) on `:active`, then ease back on release
- This is Apple's "illuminates from within" behavior

**Confidence:** MEDIUM. The behavioral descriptions come from WWDC session summaries and Apple's HIG. Exact CSS values are my recommendations based on what works visually -- they will need tuning.

**What NOT to do:**
- Do NOT add spring physics (bounce on release). This requires JS animation libraries and is excessive for a static landing page with a 45+ audience. A smooth CSS ease-out is sufficient.
- Do NOT animate `backdrop-filter` values directly. GPU-intensive, causes frame drops on Android.

#### 3. Adaptive Tinting

Apple's glass dynamically shifts its tint based on what is behind it. On the web, true per-pixel tinting is not possible without WebGL. However, the project already has section-level tinting (`.section-tint-cool/warm/mint`), which provides a practical approximation.

**Implementation approach: CSS custom property cascade per section.**

Each section with a tint already declares a gradient background. Extend this by also declaring a `--liquid-tint` override that glass elements inside that section inherit:

```css
/* In theme.css or liquid-glass.css */
.section-tint-cool  { --liquid-tint: rgba(56, 198, 244, 0.06); }
.section-tint-warm  { --liquid-tint: rgba(255, 162, 92, 0.05); }
.section-tint-mint  { --liquid-tint: rgba(111, 222, 169, 0.06); }

/* In .liquid-regular, .liquid-card, etc. */
.liquid-card {
  background: color-mix(in srgb, var(--liquid-bg), var(--liquid-tint, transparent) 30%);
  /* Falls back to --liquid-bg when --liquid-tint is not set */
}
```

**Alternative approach: `mix-blend-mode`.**
Overlay a pseudo-element with `mix-blend-mode: color` and a background matching the section tint. This creates a color-shift effect on the glass surface. However, `mix-blend-mode` interacts unpredictably with `backdrop-filter` stacking contexts. The CSS variable approach is safer and more controllable.

**Confidence:** LOW for `color-mix()` approach (needs browser testing -- `color-mix()` is Baseline 2023 per MDN, should be fine). MEDIUM for the design concept (Apple's tinting is GPU-shader-level; this is a deliberate simplification).

**Risk:** Over-tinting makes glass look dirty or muddy, especially on warm sections. Keep tint contribution under 30% blend ratio. Test visually per section.

#### 4. Dark Mode Glass Refinement

Current dark mode glass is flat: `rgba(30, 40, 60, 0.45)` with reduced specular. Apple's dark glass has more depth:

- **Stronger edge highlights:** Increase `--liquid-shadow-inset-top` from `rgba(255,255,255,0.15)` to `rgba(255,255,255,0.22)`. The rim-light on dark glass is what defines the shape.
- **Deeper center:** Reduce `--liquid-bg` from `rgba(30,40,60,0.45)` to `rgba(20,30,50,0.5)` -- darker center creates the "well" effect.
- **Subtle gradient fill:** Replace flat `rgba()` with a top-to-bottom gradient (`rgba(40,50,70,0.35)` to `rgba(20,30,50,0.55)`) so dark glass has internal depth.
- **Specular rim stays visible:** `::before` rim-light opacity in dark mode should be 0.4, not current 0.3.

**Confidence:** HIGH -- these are token value changes in existing `.dark` cascade.

---

## Differentiators

Features that elevate the Liquid Glass implementation beyond basic glassmorphism. Not expected, but create the "wow, that looks like Apple" reaction. These are the features that justify calling it "Liquid Glass" rather than "glassmorphism."

| Feature | Value Proposition | Complexity | Depends On | Web Feasibility |
|---------|-------------------|------------|------------|-----------------|
| Fluted glass variant (`.liquid-fluted`) | Vertical streak pattern that resembles privacy glass / reeded glass. Apple uses this sparingly for decorative panels. Creates visual variety within the glass system without adding a fundamentally new material. | MEDIUM | Existing glass base, `repeating-linear-gradient` | HIGH -- pure CSS |
| Specular highlight physics (tilt response) | Mouse-tracking specular already exists but the highlight is a fixed radial gradient that follows the cursor. Physics-based specular would adjust the highlight SHAPE and INTENSITY based on the cursor angle from the element center, creating a more convincing light simulation. | HIGH | Existing `--mouse-x`/`--mouse-y` JS system | MEDIUM -- requires JS enhancement |
| Glass-on-content dimming layer | Apple's Clear glass variant requires a dimming layer behind it when placed over content. This creates a subtle vignette/darkening effect that improves text legibility without fully obscuring the background. | LOW | `.liquid-clear` class (new) | HIGH -- `::before` pseudo with gradient overlay |
| SVG refraction tuning (per-element calibration) | Current refraction uses one global `feTurbulence` filter with fixed parameters (`baseFrequency="0.008"`, `scale="30"`). Per-element calibration would vary the displacement scale based on element size -- large surfaces get subtler refraction, small elements get more pronounced bending. | MEDIUM | Existing SVG filter infrastructure, `data-refract` probe | MEDIUM -- multiple SVG filters or JS parameter injection |
| Concentric corner radius | Apple's glass nests shapes concentrically: inner elements subtract padding from the parent's corner radius. Currently all squircle tiers are independent. Adding concentric radius calculation (parent radius - padding = child radius) creates the "set within" look. | LOW | Existing squircle system | HIGH -- `calc()` with CSS custom properties |

### Differentiators: Detailed Specifications

#### 5. Fluted Glass Variant (`.liquid-fluted`)

Fluted glass (also called reeded glass or ribbed glass) features vertical parallel streaks that partially distort what is behind them while maintaining the frosted quality. In Apple's system, this is a texture variant applied to decorative surfaces.

**CSS implementation:**

```css
.liquid-fluted {
  /* Base glass material (same as .liquid-regular) */
  isolation: isolate;
  position: relative;
  background: var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur-sm)) saturate(var(--liquid-saturate));
  -webkit-backdrop-filter: blur(var(--liquid-blur-sm)) saturate(var(--liquid-saturate));
}

.liquid-fluted::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 0px,
    rgba(255, 255, 255, 0.04) 2px,
    transparent 2px,
    transparent 6px
  );
  pointer-events: none;
  z-index: 1;
}
```

**Use cases on this landing page:**
- Hero section decorative accent panel
- Stat block background as an alternative to `.stats-glass`
- Potentially the FAQ section background

**When NOT to use fluted glass:**
- NEVER on text-heavy content areas -- the vertical lines interfere with horizontal text reading for 45+ users
- NEVER on cards with body text -- only on elements where the primary content is icons, numbers, or large headings
- NEVER nested inside another glass element

**Confidence:** MEDIUM. The CSS technique is straightforward (repeating-linear-gradient is universally supported), but the visual tuning (line width, spacing, opacity) needs real-device testing. The shadcn-glass-ui library includes a "fluted" variant confirming this is an established pattern in the Liquid Glass ecosystem.

#### 6. Specular Highlight Physics (Enhanced Mouse Tracking)

The current mouse-tracking specular is a radial gradient at the cursor position. To simulate light physics, the highlight should respond to the cursor's ANGLE relative to the element center, not just position.

**Enhancement approach (JS modification to `initMouseSpecular()`):**

1. Calculate the angle from element center to cursor position
2. Calculate the distance from center (0-1 normalized)
3. Map angle to an ellipse orientation (the specular "stretch")
4. Map distance to opacity falloff (brighter at edge, dimmer at center)

```javascript
// Pseudocode for enhanced specular
var cx = rect.width / 2;
var cy = rect.height / 2;
var dx = (e.clientX - rect.left) - cx;
var dy = (e.clientY - rect.top) - cy;
var angle = Math.atan2(dy, dx) * (180 / Math.PI);
var dist = Math.min(1, Math.sqrt(dx*dx + dy*dy) / Math.max(cx, cy));

card.style.setProperty('--spec-angle', angle + 'deg');
card.style.setProperty('--spec-dist', dist);
card.style.setProperty('--mouse-x', x + '%');
card.style.setProperty('--mouse-y', y + '%');
```

```css
.liquid-card::after {
  background: radial-gradient(
    ellipse at var(--mouse-x, 30%) var(--mouse-y, 0%),
    rgba(255, 255, 255, calc(0.08 + 0.12 * var(--spec-dist, 0))) 0%,
    transparent calc(40% + 20% * var(--spec-dist, 0))
  );
}
```

**Mobile consideration:** On touch devices, specular could respond to `DeviceOrientationEvent` (gyroscope) to create a tilt-responsive highlight. However:
- `DeviceOrientationEvent` requires user permission on iOS 13+ (`DeviceOrientationEvent.requestPermission()`)
- The 45+ audience will NOT grant motion permissions for a medical landing page
- Recommendation: Skip gyroscope. Keep CSS default fallback (`--mouse-x: 30%; --mouse-y: 0%`) on touch devices.

**Confidence:** MEDIUM for the approach. LOW for gyroscope -- explicitly recommend skipping it for this audience.

#### 7. Glass-on-Content Dimming Layer

Apple's Clear glass variant requires a dimming layer to maintain legibility. This is a semi-transparent overlay between the background content and the glass surface.

**Implementation:**

```css
.liquid-clear-dimming {
  position: relative;
}

.liquid-clear-dimming::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(0, 0, 0, 0.08);
  z-index: 0;
}

/* Dark mode: stronger dimming */
.dark .liquid-clear-dimming::before {
  background: rgba(0, 0, 0, 0.25);
}
```

The dimming layer sits BELOW the glass element's content but ABOVE the page background. It is the "softener" that makes bold white text readable over busy backgrounds without needing opaque glass.

**Confidence:** HIGH. Simple CSS technique, well-documented in Apple's guidelines.

#### 8. SVG Refraction Tuning

Current filter: `baseFrequency="0.008"`, `numOctaves="2"`, `scale="30"`.

Recommended calibration per element size:

| Element Type | Scale | baseFrequency | Rationale |
|-------------|-------|---------------|-----------|
| Header (wide, thin) | 15 | 0.012 | Wide surfaces need subtler, higher-freq noise |
| Cards (medium) | 30 | 0.008 | Current values -- working well |
| Stats block (large) | 20 | 0.006 | Large area needs lower freq to avoid "noise carpet" |
| Buttons (small) | 40 | 0.015 | Small surfaces benefit from more visible distortion |

**Implementation:** Define multiple SVG filter elements with different parameters:

```xml
<filter id="refract-sm" ...><feTurbulence baseFrequency="0.015" .../><feDisplacementMap scale="40" .../></filter>
<filter id="refract-md" ...><feTurbulence baseFrequency="0.008" .../><feDisplacementMap scale="30" .../></filter>
<filter id="refract-lg" ...><feTurbulence baseFrequency="0.006" .../><feDisplacementMap scale="20" .../></filter>
```

Then reference via CSS:
```css
html[data-refract="true"] .liquid-btn-secondary {
  backdrop-filter: url(#refract-sm) blur(...);
}
html[data-refract="true"] .stats-glass {
  backdrop-filter: url(#refract-lg) blur(...);
}
```

**Confidence:** MEDIUM. The approach is sound (Chromium-only, already gated). The specific parameter values need visual calibration.

#### 9. Concentric Corner Radius

Apple's nested glass shapes use concentric radius: `child_radius = parent_radius - padding`.

**Implementation with CSS custom properties:**

```css
.liquid-card {
  --card-radius: 24px;
  --card-padding: 24px;
  --card-inner-radius: calc(var(--card-radius) - var(--card-padding));
  border-radius: var(--card-radius);
}

.liquid-card > .inner-content {
  border-radius: var(--card-inner-radius);
}
```

This creates the "set within" look where the inner content hugs the parent's curve smoothly rather than having an independent corner radius.

**Confidence:** HIGH. Pure CSS `calc()`, universally supported. The squircle mask system would also need to adapt -- the inner element may need a tighter squircle mask.

---

## Anti-Features

Features to explicitly NOT build. These are commonly requested or seem obvious for a "Liquid Glass" implementation but would harm the project.

| Anti-Feature | Why Tempting | Why Wrong for This Project | What to Do Instead |
|--------------|-------------|---------------------------|-------------------|
| Glass-on-glass nesting | "More glass = more premium" | Apple explicitly warns against stacking glass on glass. Double `backdrop-filter` compounds blur, kills readability, and doubles GPU cost. The 45+ audience cannot read text through double-blurred surfaces. | Use hierarchy tiers (nav=opaque-ish glass, card=medium glass, clear=transparent glass). Each tier differs in opacity and blur, but they never overlap. |
| Gyroscope/DeviceOrientation specular on mobile | "Apple's glass responds to device tilt" | Requires permission prompt that 45+ medical users will not understand or trust. `DeviceOrientationEvent.requestPermission()` popup looks like a privacy invasion on a medical site. Even if granted, the effect is disorienting for vestibular-sensitive older users. | Use fixed specular position (top-left light source) on touch devices. The CSS default `--mouse-x: 30%; --mouse-y: 0%` already does this. |
| WebGL/Three.js glass shader | "True refraction, most faithful reproduction" | @specy/liquid-glass-react uses html2canvas + WebGL. This adds ~200KB+ of JS dependencies, requires a build step (violates project constraint), and creates a canvas overlay that breaks text selection, accessibility, and print. Performance on mid-range Android is catastrophic. | SVG `feDisplacementMap` (already implemented) is the maximum fidelity appropriate for a production landing page. It is Chromium-only but degrades gracefully. |
| Animated backdrop-filter values | "Blur intensity changes during hover for a living glass feel" | Animating `backdrop-filter: blur()` forces a full GPU recomposite on every frame. On M4 Macs this might be smooth; on a Redmi Note in Kazakhstan it will drop to 5fps and drain battery. Apple's own implementation uses GPU shaders, not CSS animation. | Animate the `::after` pseudo-element opacity and gradient instead. The glass surface stays static; only the specular overlay transitions. This is compositable and GPU-friendly. |
| Background video behind glass | "Glass over moving content shows refraction beautifully" | Video in hero is explicitly Out of Scope in PROJECT.md. Bandwidth constraint in KZ market. autoplay video + glass = guaranteed jank on budget devices. | Static gradient mesh backgrounds. The section tint system already provides color variety for glass to blur against. |
| Glass on text-heavy sections (FAQ, process steps) | "Consistent glass language across all sections" | Text-heavy content behind glass reduces readability. The FAQ section has paragraph-length answers. The process section has multi-line descriptions. Glass over these areas forces either illegible text or opaque-enough glass that defeats the purpose. | Apply glass to CONTAINER elements (card wrappers, stat blocks) where content is SHORT (1-2 lines, numbers, icons). Leave text-heavy sections on solid/tinted backgrounds. |
| Spring physics / bounce animations on glass | "Apple's glass has gel-like flexibility and spring-based response" | Requires a JS animation library (GSAP, Motion, Spring.js) or the Web Animations API with spring timing. Adds weight and complexity. For a 45+ medical audience, bouncy UI elements feel frivolous, not professional. The calm/confident tone specified in PROJECT.md is incompatible with bouncing cards. | Use `--ease-liquid: cubic-bezier(0.2, 0, 0, 1)` (already tokenized). This is Apple's system ease -- fast start, gentle settle. It has the "responsive" feel without the "playful bounce." |
| Multiple shimmer sweeps per viewport | "Glass cards should all shimmer" | Already documented as anti-pattern in liquid-glass.css. More than 1 shimmer per viewport is visual noise. Shimmer is a CTA draw, not a decoration. | Keep shimmer on hero CTA only. Other cards use the glint border (already implemented) which is subtler. |

---

## Feature Dependencies

```
[Glass Hierarchy System]
    |-- .liquid-nav (new)
    |     `-- depends on: header--scrolled values (refactor into named class)
    |-- .liquid-regular (existing, unchanged)
    |-- .liquid-clear (new)
    |     `-- depends on: dimming layer (anti-feature for text-heavy areas)
    |     `-- rule: ONLY use over media-rich backgrounds with bold/bright content
    `-- token differentiation in theme.css :root and .dark

[Interaction States]
    |-- hover: brightness/specular transition
    |     `-- depends on: existing --dur-hover, --ease-liquid tokens
    |-- press: scale + glow spread
    |     `-- depends on: existing --dur-press token
    |-- focus: enhanced glass rim
    |     `-- depends on: existing focus-visible ring system
    `-- all states must degrade under prefers-reduced-motion

[Adaptive Tinting]
    |-- per-section --liquid-tint CSS variable
    |     `-- depends on: .section-tint-cool/warm/mint classes (already exist)
    `-- glass elements pick up tint via var() inheritance
         `-- no change to HTML needed -- CSS cascade handles it

[Fluted Glass]
    |-- .liquid-fluted (new class)
    |     `-- depends on: base glass tokens
    |     `-- conflict: consumes ::after pseudo (cannot have mouse-tracking specular AND fluted texture on same element)
    `-- restricted to non-text-heavy elements only

[Specular Physics Enhancement]
    |-- JS enhancement to initMouseSpecular()
    |     `-- depends on: existing --mouse-x/--mouse-y system
    |     `-- adds: --spec-angle, --spec-dist variables
    `-- CSS update to ::after gradient (use new variables)

[SVG Refraction Tuning]
    |-- multiple SVG filter definitions (refract-sm/md/lg)
    |     `-- depends on: existing <filter id="liquid-refract"> in index.html
    |     `-- depends on: existing data-refract JS probe
    `-- per-class CSS backdrop-filter references

[Concentric Corner Radius]
    |-- CSS calc() based on parent padding
    |     `-- depends on: squircle mask system (may need inner squircle masks)
    `-- mostly affects .liquid-card internal layout
```

### Pseudo-element Budget

Critical constraint: CSS pseudo-elements (`::before`, `::after`) are limited to 2 per element. The existing implementation already uses both:

| Class | `::before` | `::after` |
|-------|-----------|----------|
| `.liquid-regular` | specular rim-light | **available** |
| `.liquid-card` | animated glint border | mouse-tracking specular |
| `.liquid-btn-secondary` | specular rim-light | **available** |
| `.stats-glass` | specular rim-light | **available** |

**Implication:** `.liquid-card` has NO pseudo-elements available for fluted texture or dimming layer. Fluted glass must be a SEPARATE class that cannot be composed with `.liquid-card`. The Clear variant's dimming layer needs a wrapper element or a separate DOM element, not a pseudo.

This is a hard architectural constraint that shapes which features can compose with which.

---

## MVP Recommendation for v5.0

### Phase 1: Foundation (Hierarchy + Interaction States)

1. **Glass hierarchy system** -- define `.liquid-nav`, refine `.liquid-regular`, add `.liquid-clear` with tokens
2. **Interaction states** -- hover/press/focus transitions on all glass surfaces
3. **Dark mode glass refinement** -- tune dark token values for depth

Rationale: These are pure CSS changes with no JS modifications. They establish the vocabulary before adding texture and physics.

### Phase 2: Tinting + Texture

4. **Adaptive tinting** -- per-section `--liquid-tint` cascade
5. **Fluted glass variant** -- new `.liquid-fluted` class with vertical streak pattern

Rationale: These add visual variety to the glass system. Tinting is low-risk (CSS variable cascade). Fluted is medium-risk (visual tuning needed, pseudo-element constraints).

### Phase 3: Physics + Refinement

6. **Specular highlight physics** -- JS enhancement to mouse tracking
7. **SVG refraction tuning** -- per-element filter calibration
8. **Concentric corner radius** -- calc()-based inner radius

Rationale: These require JS changes and visual calibration. Ship after the CSS foundation is stable.

### Defer

- Gyroscope specular -- skip entirely (anti-feature for this audience)
- WebGL shader -- skip entirely (violates project constraints)
- Spring animations -- skip entirely (tone mismatch)

---

## Complexity Assessment

| Feature | Lines of CSS | Lines of JS | Risk Level | Performance Impact |
|---------|-------------|-------------|------------|-------------------|
| Glass hierarchy (3 tiers) | ~60 | 0 | LOW | None -- token changes only |
| Interaction states | ~80 | 0 | LOW | Minimal -- CSS transitions on existing composited layers |
| Adaptive tinting | ~30 | 0 | MEDIUM | None -- CSS variable cascade |
| Dark mode glass refinement | ~20 | 0 | LOW | None -- token value changes |
| Fluted glass variant | ~40 | 0 | MEDIUM | LOW -- repeating-linear-gradient is cheap |
| Specular physics | ~20 | ~30 | MEDIUM | LOW -- math in existing mousemove handler |
| SVG refraction tuning | ~30 | 0 | MEDIUM | None -- same filters, different params |
| Concentric corners | ~15 | 0 | LOW | None -- calc() on existing properties |
| **Total new code** | **~295** | **~30** | | |

---

## Sources

### Confirmed (HIGH confidence)

- Apple WWDC 2025 "Meet Liquid Glass" session (Session 219) -- glass hierarchy, clear vs regular rules, adaptive tinting concept, interaction principles
- [CSS-Tricks: Getting Clarity on Apple's Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/) -- three-layer composition (highlight, shadow, illumination), clear variant rules
- [Kube.io: Liquid Glass in the Browser](https://kube.io/blog/liquid-glass-css-svg/) -- SVG refraction approach, specular as rim-light overlay, Chromium-only limitation confirmed
- [Josh Comeau: Next-level frosted glass](https://www.joshwcomeau.com/css/backdrop-filter/) -- extended backdrop technique (already implemented)
- MDN Web Docs: `backdrop-filter` Baseline 2024, `mix-blend-mode` widely available, `repeating-linear-gradient` widely available, `color-mix()` Baseline 2023
- Existing codebase: liquid-glass.css, theme.css, squircles.css, main.js -- pseudo-element usage audit, token architecture, JS mouse-tracking system

### Referenced (MEDIUM confidence)

- [LogRocket: Adopting Liquid Glass best practices](https://blog.logrocket.com/ux-design/adopting-liquid-glass-examples-best-practices/) -- clear variant three-condition rule, hierarchy guidance
- [Apple Newsroom: Liquid Glass announcement](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) -- spring animations, "illuminates from within" interaction description
- [DesignFast: CSS Liquid Glass Effects](https://designfast.io/liquid-glass) -- three-layer structure confirmation
- [DEV Community: Recreating Liquid Glass with CSS](https://dev.to/kevinbism/recreating-apples-liquid-glass-effect-with-pure-css-3gpl) -- CSS-only approach patterns
- shadcn-glass-ui library (npm) -- confirmed "fluted" variant exists as established pattern with vertical streaks

### Not Found / Unable to Verify

- Apple's exact spring constant values for glass interaction animations -- not publicly documented for web
- Specific `backdrop-filter` performance benchmarks on budget Android devices common in Kazakhstan market -- relied on community reports (HN: "M4-Max MacBook Pro judders")
- Whether `color-mix()` interacts well with `backdrop-filter` in the same element -- needs browser testing
- Exact opacity thresholds for adaptive tinting that maintain WCAG AA contrast -- needs per-section visual audit

---

*Feature research for: MedicusUnion KZ Landing -- v5.0 Full Liquid Glass Rework*
*Researched: 2026-04-09*
*Downstream consumer: v5.0 roadmap phase planning*
