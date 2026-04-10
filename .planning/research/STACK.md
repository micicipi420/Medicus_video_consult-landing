# Technology Stack

**Project:** MedicusUnion KZ Landing -- v5.0 Full Liquid Glass Rework
**Researched:** 2026-04-09
**Scope:** NEW capabilities only for v5.0 milestone. Existing validated stack (HTML, Tailwind CSS v4.2.2 CLI, vanilla JS ES5/IIFE, backdrop-filter chain, SVG squircle masks, corner-shape progressive enhancement, SVG feTurbulence refraction, dark mode token cascade, Motion CDN) is NOT re-researched.

---

## What This Research Covers

Six new capability areas needed for v5.0 Liquid Glass:

1. **Adaptive tinting** -- glass surfaces that shift color based on background content
2. **Specular highlight physics** -- light reflections that respond to device orientation / cursor position
3. **Fluted glass variant** -- vertical ribbed/streaked glass pattern
4. **Clear glass variant** -- higher transparency with dimming layer behind
5. **GPU performance profiling** -- tools and techniques for will-change budget and composite layer audit
6. **Cross-browser hardening** -- backdrop-filter quirks in Safari, Firefox, and mobile browsers

**What is NOT covered:** Backend, fonts, build tools, dark mode toggle, basic glassmorphism, SVG refraction -- all validated in previous milestones.

---

## 1. Adaptive Tinting: mix-blend-mode Overlay Approach

### The Problem

Apple's Liquid Glass dynamically samples the background beneath a glass surface and shifts the glass tint to complement it. CSS has no `backdrop-sample-color()` function. We need a pure CSS approximation.

### Recommended Technique

Use a `::before` pseudo-element with `mix-blend-mode: color` over the glass surface. The pseudo-element carries a semi-transparent tint color, and the blend mode mixes it with whatever backdrop content bleeds through the glass.

```css
.liquid-tinted {
  position: relative;
  isolation: isolate;
  background: var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
}

.liquid-tinted::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--liquid-tint, rgba(56, 198, 244, 0.08));
  mix-blend-mode: color;
  pointer-events: none;
  z-index: 1;
}
```

### Why This Approach (Not Alternatives)

| Approach | Verdict | Reason |
|----------|---------|--------|
| `mix-blend-mode: color` on `::before` | **USE THIS** | Blends tint with backdrop content showing through glass. Pure CSS, no JS. Works in all browsers since Jan 2020. Creates stacking context (glass already does). |
| `background-blend-mode` on glass element | REJECT | Blends the element's own backgrounds with each other, NOT with backdrop content. Cannot tint based on what's behind the glass. |
| `mix-blend-mode: soft-light` | CONSIDER | Softer tinting effect. Less color shift, more luminosity preservation. Good for dark mode where `color` can over-saturate. |
| `mix-blend-mode: overlay` | CONSIDER | Stronger contrast effect. Good for hero glass surfaces. Too aggressive for cards -- use `color` for cards. |
| JS canvas sampling | REJECT | Requires reading pixels from behind element. Performance disaster, cross-origin image issues, violates vanilla constraint. |

### Token Integration

New tokens to add to `:root` in theme.css:

```css
:root {
  --liquid-tint-cool: rgba(56, 198, 244, 0.08);   /* brand blue tint */
  --liquid-tint-warm: rgba(255, 162, 92, 0.06);    /* complementary warm */
  --liquid-tint-mint: rgba(111, 222, 169, 0.07);   /* health/checkup tint */
  --liquid-tint-blend: color;                       /* default blend mode */
}

.dark {
  --liquid-tint-cool: rgba(56, 198, 244, 0.12);    /* slightly stronger on dark */
  --liquid-tint-warm: rgba(255, 162, 92, 0.10);
  --liquid-tint-mint: rgba(111, 222, 169, 0.10);
  --liquid-tint-blend: soft-light;                  /* softer on dark backgrounds */
}
```

### Section-Level Tinting via Data Attribute

Pair adaptive tinting with section context using data attributes:

```html
<section data-glass-tint="cool"> ... </section>
<section data-glass-tint="warm"> ... </section>
<section data-glass-tint="mint"> ... </section>
```

```css
[data-glass-tint="cool"] .liquid-tinted::before { background: var(--liquid-tint-cool); }
[data-glass-tint="warm"] .liquid-tinted::before { background: var(--liquid-tint-warm); }
[data-glass-tint="mint"] .liquid-tinted::before { background: var(--liquid-tint-mint); }
```

This mirrors the existing `.section-tint-cool/warm/mint` pattern from liquid-glass.css Section 12 but applies to glass surfaces rather than section backgrounds.

### Browser Support

| Browser | `mix-blend-mode` | Confidence |
|---------|-----------------|------------|
| Chrome 41+ | Full | HIGH |
| Firefox 32+ | Full | HIGH |
| Safari 8+ | Full | HIGH |
| iOS Safari 8+ | Full | HIGH |
| **Global** | ~97% | HIGH (MDN: Baseline since Jan 2020) |

### Performance Note

`mix-blend-mode` creates an implicit stacking context and forces compositing. Since `.liquid-tinted` already creates a stacking context via `isolation: isolate`, the additional cost of the blend mode pseudo-element is marginal -- no new layer promotion occurs.

**Confidence: HIGH.** mix-blend-mode is universally supported and well-documented.

---

## 2. Specular Highlight Physics: Device Orientation + Mouse Position

### The Problem

Specular highlights (the bright spot on glass that moves with viewing angle) need to respond to:
- **Desktop:** mouse cursor position (already partially implemented via `--mouse-x`/`--mouse-y` in `.liquid-card::after`)
- **Mobile:** device tilt via DeviceOrientationEvent gyroscope data

### Recommended Technique: Desktop (Mouse Tracking)

The existing `.liquid-card::after` radial-gradient using `--mouse-x`/`--mouse-y` custom properties is the correct pattern. Extend it:

```css
.liquid-specular::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse 120% 80% at var(--specular-x, 30%) var(--specular-y, 0%),
    rgba(255, 255, 255, 0.20) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.3s var(--ease-liquid);
}
```

JS for mouse tracking (ES5 IIFE pattern, extend existing):

```javascript
// Inside existing IIFE
var cards = document.querySelectorAll('.liquid-specular');
var rafId = null;

function updateSpecular(e) {
  if (rafId) return; // throttle to rAF
  rafId = requestAnimationFrame(function() {
    for (var i = 0; i < cards.length; i++) {
      var rect = cards[i].getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      cards[i].style.setProperty('--specular-x', x + '%');
      cards[i].style.setProperty('--specular-y', y + '%');
    }
    rafId = null;
  });
}

document.addEventListener('mousemove', updateSpecular);
```

### Recommended Technique: Mobile (Device Orientation API)

```javascript
// Gyroscope-driven specular for mobile
function initGyroSpecular() {
  var cards = document.querySelectorAll('.liquid-specular');
  if (!cards.length) return;

  // Check prefers-reduced-motion FIRST
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function handleOrientation(e) {
    // gamma: left-right tilt (-90 to 90)
    // beta: front-back tilt (-180 to 180)
    var x = ((e.gamma + 90) / 180 * 100).toFixed(1); // normalize to 0-100
    var y = (Math.max(0, Math.min(180, e.beta + 90)) / 180 * 100).toFixed(1);
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.setProperty('--specular-x', x + '%');
      cards[i].style.setProperty('--specular-y', y + '%');
    }
  }

  function startListening() {
    window.addEventListener('deviceorientation', handleOrientation);
  }

  // iOS 13+ requires explicit permission (user gesture required)
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // Attach to a user-initiated event (e.g., button or first touch)
    document.addEventListener('touchstart', function onTouch() {
      DeviceOrientationEvent.requestPermission()
        .then(function(state) {
          if (state === 'granted') startListening();
        })
        .catch(function() {});
      document.removeEventListener('touchstart', onTouch);
    }, { once: true });
  } else {
    // Android Chrome, Firefox -- permission not required
    startListening();
  }
}
```

### DeviceOrientationEvent API Details

| Property | Range | Use |
|----------|-------|-----|
| `alpha` | 0-360 degrees | Compass heading (z-axis rotation). NOT needed for specular. |
| `beta` | -180 to 180 degrees | Front-to-back tilt. Maps to specular Y position. |
| `gamma` | -90 to 90 degrees | Left-to-right tilt. Maps to specular X position. |

### Security Requirements

- **HTTPS required** -- DeviceOrientationEvent only works in secure contexts
- **iOS Safari 13+** -- requires `DeviceOrientationEvent.requestPermission()` called from a user gesture
- **Android Chrome** -- no permission required, works automatically
- **Firefox** -- no permission required

### Why NOT to Use Parallax Libraries

| Library | Why Reject |
|---------|-----------|
| parallax.js (wagerfield) | 22KB, jQuery optional but adds overhead. Our implementation is ~30 lines of vanilla JS. |
| parallaxify | jQuery dependency. Dead project (no updates since 2016). |
| parallaxTilt | jQuery dependency. |
| Any npm parallax package | Violates no-dependency constraint. |

### Accessibility: prefers-reduced-motion Guard

```javascript
// Check BEFORE initializing any specular motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Set static specular position, no event listeners
  cards.forEach(function(card) {
    card.style.setProperty('--specular-x', '30%');
    card.style.setProperty('--specular-y', '0%');
  });
  return;
}
```

```css
@media (prefers-reduced-motion: reduce) {
  .liquid-specular::after {
    /* Static highlight position, no transition */
    --specular-x: 30%;
    --specular-y: 0%;
    transition: none;
  }
}
```

### Browser Support

| Feature | Chrome | Firefox | Safari | iOS Safari | Confidence |
|---------|--------|---------|--------|------------|------------|
| DeviceOrientationEvent | 7+ | 6+ | 4.2+ | 4.2+ | HIGH |
| requestPermission() | N/A | N/A | 13+ (required) | 13+ (required) | HIGH (MDN) |
| CSS custom properties via JS | 49+ | 31+ | 9.1+ | 9.3+ | HIGH |
| requestAnimationFrame | 24+ | 23+ | 6.1+ | 7+ | HIGH |

**Confidence: HIGH.** DeviceOrientationEvent is Baseline Widely Available since Sep 2023 (MDN). The requestPermission pattern for iOS is well-documented. Mouse tracking via custom properties is already proven in the codebase.

---

## 3. Fluted Glass: repeating-linear-gradient + mix-blend-mode

### The Problem

Fluted (ribbed/reeded) glass creates vertical streak distortions that add texture without obscuring content. Think shower doors or architectural privacy glass.

### Recommended Technique

Layer a `repeating-linear-gradient` over the glass surface using a pseudo-element with `mix-blend-mode: color-dodge`:

```css
.liquid-fluted {
  position: relative;
  isolation: isolate;
  background: var(--liquid-bg);
  backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
}

/* Fluted vertical streaks */
.liquid-fluted::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: repeating-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.03) 0px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(255, 255, 255, 0.08) 4px
  );
  background-size: var(--fluted-pitch, 8px) 100%;
  mix-blend-mode: color-dodge;
  pointer-events: none;
  z-index: 1;
}
```

### Why These Values

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Direction | `to right` | Vertical flutes = horizontal gradient direction |
| Pitch (background-size) | `8px` | Narrow enough to read as texture, wide enough to not become noise. 4px = too fine on mobile. 16px = too coarse. |
| White stop opacity | `0.03 - 0.08` | Subtle. Higher values create visible bands that fight readability for CA 45+. |
| Dark stop opacity | `0.06` | Creates shadow between flutes. Higher = too dark. |
| `mix-blend-mode: color-dodge` | Required | Makes the gradient glow rather than overlay. Without it, the streaks look painted-on rather than refractive. |

### Token Integration

```css
:root {
  --fluted-pitch: 8px;
  --fluted-opacity: 1;
}

.dark {
  --fluted-pitch: 10px;     /* slightly wider on dark -- narrower is lost */
  --fluted-opacity: 0.6;    /* tone down on dark backgrounds */
}
```

```css
.dark .liquid-fluted::before {
  opacity: var(--fluted-opacity);
}
```

### Pseudo-Element Conflict Resolution

`.liquid-card` already uses `::before` for the animated glint border and `::after` for the specular radial gradient. `.liquid-fluted` is a SEPARATE class -- it does NOT extend `.liquid-card`. It should be used for decorative panels (hero backdrop, divider panels) where glint animation is not needed.

If fluted + specular is needed on the same element, compose via a wrapper:

```html
<div class="liquid-fluted squircle-lg">
  <div class="liquid-specular-inner">
    <!-- content -->
  </div>
</div>
```

### Browser Support

All CSS features used (repeating-linear-gradient, mix-blend-mode, pseudo-elements) have 97%+ global support. No new browser requirements beyond existing stack.

**Confidence: HIGH.** Technique verified via Frontend.fyi tutorial and multiple CodePen implementations.

---

## 4. Clear Glass Variant: Higher Transparency + Dimming Layer

### The Problem

Clear glass has higher transparency (content behind is more visible) but needs a dimming layer to maintain text readability. Apple uses "clear" for overlays and modal backgrounds.

### Current Status in Codebase

The liquid-glass.css header comment explicitly marks clear glass as:
> "Clear glass is an anti-feature for medical CA 45+ audience -- contrast and legibility take priority over visual novelty."

### Revised Recommendation: Limited Use Only

Clear glass IS appropriate for exactly two use cases in this project:
1. **Modal overlay / backdrop dimming** -- behind the mobile menu or a confirmation dialog
2. **Hero section background panel** -- where the background image IS the content and text is minimal

It is NOT appropriate for:
- Cards with body text (fails WCAG AA at high transparency)
- Form containers (input readability suffers)
- Navigation elements (CA 45+ needs high contrast nav)

### Technique

```css
.liquid-clear {
  isolation: isolate;
  position: relative;
  background: var(--liquid-clear-bg);
  backdrop-filter: blur(var(--liquid-blur-sm)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  -webkit-backdrop-filter: blur(var(--liquid-blur-sm)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
}

/* Dimming layer behind the clear glass element */
.liquid-clear-dim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: var(--z-overlay, 40);
}
```

### Token Integration

```css
:root {
  --liquid-clear-bg: rgba(255, 255, 255, 0.18);  /* much lower than regular's 0.42 */
  --liquid-clear-blur: var(--liquid-blur-sm);      /* 16px -- less blur = more see-through */
}

.dark {
  --liquid-clear-bg: rgba(30, 40, 60, 0.22);
  --liquid-clear-blur: var(--liquid-blur-sm);
}
```

### Key Difference from Regular Glass

| Property | `.liquid-regular` | `.liquid-clear` |
|----------|--------------------|-----------------|
| Background alpha | `0.42` | `0.18` |
| Blur radius | `24px` (md) | `16px` (sm) |
| Use case | Cards, panels | Overlays, hero backdrop |
| Text readability | WCAG AA safe | Needs large/bold text only |

**Confidence: MEDIUM.** The technique is straightforward CSS, but the "anti-feature" annotation in the codebase reflects a considered decision. Use with restraint.

---

## 5. GPU Performance Profiling Tools and Techniques

### Chrome DevTools: The Primary Profiling Tool

No npm packages needed. Chrome DevTools is the authoritative GPU profiling tool.

#### Performance Panel Workflow

1. **Open DevTools > Performance tab**
2. **Enable Advanced Paint Instrumentation** (gear icon > checkbox). WARNING: This itself reduces performance -- use for profiling sessions only, not normal development.
3. **Record a scroll interaction** (5-10 seconds)
4. **Analyze the flame chart:**
   - Look for `Paint` events longer than 4ms (60fps budget = 16.6ms per frame)
   - `Composite Layers` events show GPU compositing cost
   - `Update Layer Tree` events show layer promotion overhead

#### Layers Panel Workflow

1. **Open DevTools > More Tools > Layers**
2. **Rotate the 3D view** to see layer stacking
3. **Click each layer** to see:
   - Memory consumption (bytes)
   - Compositing reason (e.g., "Has a backdrop filter", "Has will-change: transform")
   - Layer dimensions

**What to look for:**
- Total layer count: aim for < 20 layers per viewport on mobile
- Individual layer memory: > 2MB per layer = investigate
- Unexpected layers: elements promoted without `will-change` or backdrop-filter

#### Rendering Panel Workflow

1. **Open DevTools > More Tools > Rendering**
2. **Enable "Paint flashing"** -- green rectangles show repainted areas
3. **Enable "Layer borders"** -- orange borders show composite layers
4. **Scroll the page** and check:
   - Do glass elements cause paint flashing on scroll? (bad -- should be composited)
   - Are there unexpected orange borders? (unnecessary layer promotion)

### will-change Budget Guidelines

```css
/* CORRECT: will-change only on elements that animate */
.liquid-btn-primary {
  will-change: transform, filter;  /* transforms on :hover/:active */
}

/* CORRECT: will-change removed after animation */
.shimmer-sweep {
  will-change: transform;  /* for the ::before sweep */
}

/* WRONG: will-change on static glass cards */
.liquid-card {
  /* will-change: backdrop-filter;  <-- NEVER DO THIS */
  /* backdrop-filter already promotes to composite layer */
  /* Adding will-change doubles the GPU memory cost for zero benefit */
}
```

**Rule of thumb for this project:**
- backdrop-filter already creates a composite layer -- no `will-change` needed on static glass
- `will-change: transform` only on elements that animate `transform` (buttons, shimmer)
- Remove `will-change` after animation completion via JS if the animation is one-shot
- Maximum 5-7 elements with `will-change` per viewport

### Mobile Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Frame rate during scroll | 60fps (16.6ms/frame) | Performance Panel timeline |
| Total composite layers | < 20 per viewport | Layers Panel |
| Total GPU memory | < 100MB | Chrome `chrome://gpu` |
| Largest layer | < 4MB | Layers Panel detail |
| Paint duration per frame | < 4ms | Performance Panel paint events |

### Firefox-Specific Profiling

Firefox Profiler (about:profiling) can identify backdrop-filter performance issues specific to Firefox:

1. Open `about:profiling`
2. Set features: Paint, GPU, CSS
3. Record scroll interaction
4. Look for "BackdropFilter" markers in the timeline

Firefox renders `backdrop-filter` on the CPU in some configurations -- if you see long paint events without GPU markers, Firefox is software-rendering the blur.

**Confidence: HIGH.** Chrome DevTools Layers panel and Performance panel are authoritative tools. No external dependencies needed.

---

## 6. Cross-Browser Hardening for backdrop-filter

### Current Support Matrix (verified April 2026)

| Browser | backdrop-filter | SVG url() in backdrop-filter | Notes |
|---------|----------------|------------------------------|-------|
| Chrome 76+ | Full | YES (Chrome only) | Unprefixed |
| Edge 79+ | Full | YES (Chromium) | Unprefixed |
| Firefox 103+ | Full | NO | blur/saturate/brightness work; SVG filter url() does NOT |
| Safari 9+ | Full (prefixed) | NO | -webkit- required for older; unprefixed from 18+ |
| iOS Safari 9+ | Full (prefixed) | NO | Same as Safari |
| Samsung Internet 12+ | Full | Likely YES (Chromium) | |
| **Global** | **95.79%** | ~70% (Chromium only) | caniuse.com verified |

### Critical Quirk: SVG filter url() in backdrop-filter

The existing SVG refraction filter (`html[data-refract="true"]`) uses `backdrop-filter: url(#liquid-refract) blur(...) saturate(...) brightness(...)`. This is **Chrome/Edge only**.

Firefox and Safari silently ignore the entire `backdrop-filter` declaration when `url()` is present -- not just the SVG filter, but the blur/saturate/brightness too. The existing fallback selector structure in liquid-glass.css Section 10 handles this correctly by gating behind `html[data-refract="true"]`.

**Action:** No change needed. The existing JS probe that sets `data-refract="true"` only on Chromium browsers is the correct approach.

### Safari-Specific Quirks

1. **`-webkit-backdrop-filter` required for Safari < 18.** Already handled in codebase.
2. **Backdrop-filter + mask-image on same element:** Works correctly in Safari 17+. Earlier versions may not render the backdrop through the mask. The squircle mask approach is safe because the mask is applied to the same element that has the backdrop-filter.
3. **Backdrop-filter + border-radius:** Safari sometimes clips the blur at the border-radius boundary differently than Chrome. Use `overflow: hidden` on the glass element if you see blur bleeding past corners.
4. **`corner-shape: squircle` + backdrop-filter:** Chrome 139+ only. When the squircle mask is removed (via `@supports (corner-shape: squircle)`) and replaced with `corner-shape: squircle`, the backdrop-filter renders correctly through the native squircle corner.

### Firefox-Specific Quirks

1. **Performance:** Firefox's backdrop-filter uses CPU rendering in some configurations, making it slower than Chrome/Safari. Higher blur values (>20px) are more expensive. Keep the existing blur budget (`--liquid-blur-md: 24px` is at the edge -- monitor).
2. **`backdrop-filter: url()` NOT supported:** Confirmed by MDN browser-compat-data issue #24110 (closed as "working as intended" per spec). SVG filters in backdrop-filter are a Chrome-only feature.
3. **`mix-blend-mode` + `backdrop-filter` stacking:** Firefox handles the interaction correctly but may produce slightly different color blending results due to gamma correction differences. Test the tint colors visually.

### Android-Specific Considerations (KZ Market)

- **Budget Android devices (common in KZ market):** Samsung Galaxy A series, Redmi phones. These have weak GPUs.
- **Existing constraint:** Max 2 glass elements per viewport, blur <= 12px on budget devices.
- **Detection approach:** No reliable "budget device" CSS media query exists. Use the existing `max 2 glass elements` constraint universally.
- **Samsung Internet:** Chromium-based, supports full backdrop-filter. No special handling needed.

### Testing Matrix

| Test | Tool | What to Check |
|------|------|---------------|
| Visual regression | Manual screenshots | Glass renders identically across browsers |
| backdrop-filter rendering | Chrome, Safari, Firefox real devices | Blur visible, not clipped, not bleeding |
| SVG refraction | Chrome only | `data-refract="true"` gated correctly |
| Performance (scroll fps) | Chrome DevTools Performance tab | 60fps scroll with glass elements |
| Performance (Firefox) | Firefox Profiler | No CPU-rendered backdrop-filter blocking main thread |
| iOS Safari permission | Real iOS device | DeviceOrientationEvent permission flow works |
| Reduced motion | OS setting toggle | All animations/gyro disabled, static fallback |
| Reduced transparency | OS setting toggle | Glass becomes opaque, readable |
| Print | `Ctrl+P` | Glass renders as opaque white with border |

**Confidence: HIGH.** Browser support figures verified via caniuse.com (95.79% global for backdrop-filter). SVG filter limitation confirmed via MDN browser-compat-data GitHub issue.

---

## New Token Additions Summary

All new tokens to add to theme.css `:root`:

```css
:root {
  /* === v5.0 Adaptive Tinting === */
  --liquid-tint-cool: rgba(56, 198, 244, 0.08);
  --liquid-tint-warm: rgba(255, 162, 92, 0.06);
  --liquid-tint-mint: rgba(111, 222, 169, 0.07);
  --liquid-tint-blend: color;

  /* === v5.0 Clear Glass === */
  --liquid-clear-bg: rgba(255, 255, 255, 0.18);

  /* === v5.0 Fluted Glass === */
  --fluted-pitch: 8px;
  --fluted-opacity: 1;
}

.dark {
  /* === v5.0 Adaptive Tinting (dark) === */
  --liquid-tint-cool: rgba(56, 198, 244, 0.12);
  --liquid-tint-warm: rgba(255, 162, 92, 0.10);
  --liquid-tint-mint: rgba(111, 222, 169, 0.10);
  --liquid-tint-blend: soft-light;

  /* === v5.0 Clear Glass (dark) === */
  --liquid-clear-bg: rgba(30, 40, 60, 0.22);

  /* === v5.0 Fluted Glass (dark) === */
  --fluted-pitch: 10px;
  --fluted-opacity: 0.6;
}
```

---

## What NOT to Add

| Rejected | Why |
|----------|-----|
| WebGL / Three.js for glass refraction | Violates vanilla constraint. Massive bundle. SVG feTurbulence (existing) is sufficient for Chromium. |
| liquid-glass-js (GitHub library) | External dependency. 15KB+. Our implementation is ~50 lines of CSS + 30 lines of JS. |
| Any npm glass framework | Violates no-dependency constraint. |
| Canvas 2D for adaptive tinting | Requires reading pixels (tainted canvas for cross-origin images). Performance nightmare. |
| CSS `element()` for backdrop sampling | Experimental, Firefox-only, no other browser support. Dead spec. |
| CSS `backdrop-filter: color-adjust()` | Does not exist. Not a real CSS property. |
| `will-change: backdrop-filter` on static elements | Wastes GPU memory. backdrop-filter already promotes to composite layer. |
| Gyroscope polyfill libraries | No polyfill can create gyroscope data. Device either has one or does not. |
| CSS Houdini paint worklets for fluted glass | Chrome-only, no Firefox/Safari support. Violates cross-browser requirement. |

---

## Browser Support Summary Table (v5.0 Features)

| Feature | Chrome | Firefox | Safari | iOS Safari | Global | Confidence |
|---------|--------|---------|--------|------------|--------|------------|
| `mix-blend-mode` | 41+ | 32+ | 8+ | 8+ | ~97% | HIGH |
| `backdrop-filter` | 76+ | 103+ | 9+ (prefixed) | 9+ (prefixed) | ~96% | HIGH |
| SVG url() in `backdrop-filter` | 76+ | NO | NO | NO | ~70% | HIGH |
| `DeviceOrientationEvent` | 7+ | 6+ | 4.2+ | 4.2+ | ~98% | HIGH |
| `requestPermission()` (gyro) | N/A | N/A | 13+ | 13+ | iOS only | HIGH |
| `repeating-linear-gradient` | 26+ | 16+ | 6.1+ | 7+ | ~99% | HIGH |
| CSS custom properties via JS | 49+ | 31+ | 9.1+ | 9.3+ | ~98% | HIGH |
| `prefers-reduced-motion` | 74+ | 63+ | 10.1+ | 10.3+ | ~96% | HIGH |
| `prefers-reduced-transparency` | 118+ | 113+ | 17.4+ | 17.4+ | ~85% | MEDIUM |
| `corner-shape: squircle` | 139+ | NO | NO | NO | ~35% | HIGH |

---

## Sources

- [MDN: mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode) -- blend mode values and browser compatibility (verified)
- [MDN: DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent) -- API properties, requestPermission, HTTPS requirement (verified)
- [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) -- browser support and SVG filter limitations (verified)
- [Can I Use: CSS Backdrop Filter](https://caniuse.com/css-backdrop-filter) -- 95.79% global support (verified April 2026)
- [MDN browser-compat-data #24110](https://github.com/mdn/browser-compat-data/issues/24110) -- SVG filters NOT supported in Firefox/Safari backdrop-filter (closed, spec-compliant behavior)
- [CSS-Tricks: Getting Clarity on Apple's Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/) -- three-layer architecture (highlight, shadow, illumination)
- [Frontend.fyi: Frosted Glass Effect](https://www.frontend.fyi/tutorials/frosted-glass-effect) -- repeating-linear-gradient fluted glass technique with color-dodge
- [Chrome DevTools: Performance Reference](https://developer.chrome.com/docs/devtools/performance/reference) -- Advanced paint instrumentation, layers panel
- [Chrome DevTools: Layers Panel](https://developer.chrome.com/docs/devtools/layers) -- Composite layer inspection
- [DEV.to: Recreating Apple's Liquid Glass with Pure CSS](https://dev.to/kevinbism/recreating-apples-liquid-glass-effect-with-pure-css-3gpl) -- specular highlight via inset box-shadow pseudo-elements
- [DEV.to: DeviceOrientationEvent requestPermission](https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2) -- iOS 13+ permission pattern
- [Hacker News: CSS Glass Effect Generator](https://news.ycombinator.com/item?id=44445238) -- cross-browser pseudo-element layering to avoid Chrome color bleed
