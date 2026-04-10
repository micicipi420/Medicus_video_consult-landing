# Domain Pitfalls: Liquid Glass v5.0 Full Rework

**Domain:** Advanced Liquid Glass effects for static medical landing page (backdrop-filter, SVG refraction, squircle masks, specular highlights, gyroscope, adaptive tinting, cross-browser hardening)
**Researched:** 2026-04-09
**Confidence:** HIGH for browser-specific bugs (verified via official bug trackers, MDN compat data); MEDIUM for performance thresholds (multiple credible sources agree but exact numbers vary by device); HIGH for project-specific pitfalls (verified against current codebase)

---

## Critical Pitfalls

Mistakes that cause rewrites, production failures, or user-facing breakage.

### Pitfall 1: Safari Ignores CSS Variables in -webkit-backdrop-filter

**What goes wrong:**
Safari (tested through Safari 18.3) does not resolve CSS custom properties inside `-webkit-backdrop-filter`. The declaration is silently dropped. Since Safari still requires the `-webkit-` prefix for backdrop-filter, the unprefixed `backdrop-filter` line also fails without the prefix, leaving glass elements with zero visual effect on all Safari and iOS browsers.

**Why it happens:**
WebKit's implementation of `-webkit-backdrop-filter` predates full CSS custom property resolution in filter functions. The unprefixed `backdrop-filter` is behind a developer feature flag (`CSS Unprefixed Backdrop Filter`) in Safari 18 and is disabled by default. CSS variables work in the unprefixed version when the flag is on, but the flag is off for all real users.

**Consequences:**
Every glass element in the current codebase is broken on Safari/iOS. The current code uses `var(--liquid-blur-md)`, `var(--liquid-saturate)`, `var(--liquid-brightness)` inside `-webkit-backdrop-filter` on all 5 glass classes. This means zero glass effect for ~18% of global web users, and significantly higher in the Apple-device-owning medical professional demographic.

**THIS IS ALREADY A BUG IN THE CURRENT CODEBASE.** Lines 62, 81, 147, 176, and 301 of `liquid-glass.css` all use CSS variables inside `-webkit-backdrop-filter`.

**Prevention:**
- Duplicate the `-webkit-backdrop-filter` declaration with hardcoded fallback values BEFORE the `var()`-based line:
  ```css
  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(108%);
  -webkit-backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  backdrop-filter: blur(var(--liquid-blur-md)) saturate(var(--liquid-saturate)) brightness(var(--liquid-brightness));
  ```
  Safari uses the hardcoded line (ignoring the var line); Chromium/Firefox use the var line. Order matters: hardcoded first, var-based second.
- Alternatively, use a mixin-like pattern that emits both lines for every glass class.
- Dark mode values differ (28px/160%/115%), so the hardcoded fallback in `.dark` must match those values.
- Test Safari specifically after every backdrop-filter change.

**Detection:**
- Open any page in Safari on macOS or iOS. Glass elements show as flat rectangles with no blur.
- Automated: Playwright WebKit test comparing computed `backdrop-filter` value.

**Phase:** Address IMMEDIATELY in Phase 1 (cross-browser hardening). This is a shipping bug.

**Sources:**
- [mdn/browser-compat-data #25914](https://github.com/mdn/browser-compat-data/issues/25914)
- [Safari WebKit CSS Bugs Workarounds (2026)](https://docs.bswen.com/blog/2026-03-12-safari-css-issues-workarounds/)
- [lightningcss #537](https://github.com/parcel-bundler/lightningcss/issues/537)

---

### Pitfall 2: SVG Filters in backdrop-filter Are Chromium-Only

**What goes wrong:**
The refraction effect (`backdrop-filter: url(#liquid-refract) blur(...)`) works ONLY in Chromium browsers (Chrome 76+, Edge 79+, Samsung Internet). Safari and Firefox silently ignore the entire `backdrop-filter` declaration when it contains `url()` references to SVG filters, even for the blur/saturate functions that follow it in the same shorthand.

**Why it happens:**
The CSS Filter Effects Level 2 spec allows SVG filters in `backdrop-filter`, but only Chromium implemented it. Firefox has an open feature request (Mozilla Connect, September 2025) but no timeline. Safari/WebKit has no public intent to ship. This is not a temporary gap -- it has been this way since backdrop-filter shipped.

**Consequences:**
When `backdrop-filter: url(#liquid-refract) blur(24px) saturate(180%) brightness(108%)` is parsed by Safari or Firefox, the ENTIRE declaration is invalid -- not just the `url()` part. This means the fallback blur/saturate/brightness are also lost. Glass elements become fully transparent on Safari and Firefox.

**Prevention:**
- The current codebase gates refraction behind `html[data-refract="true"]` (Section 10 of liquid-glass.css). This is correct.
- The gated selector must override the FULL backdrop-filter chain, not just prepend `url()`. Current code does this correctly.
- JS probe must verify SVG filter support in backdrop-filter at runtime, not just check `CSS.supports('backdrop-filter', 'blur(1px)')`. Test specifically: `CSS.supports('backdrop-filter', 'url(#test)')`.
- NEVER put `url(#svg-filter)` in the base glass classes. Always in a separate, gated selector.
- Future: if fluted glass or other variants use SVG filters, they MUST follow the same gating pattern.

**Detection:**
- Open any page in Firefox or Safari with `data-refract="true"` forced on -- glass disappears entirely.
- JS probe must set `data-refract="true"` ONLY after confirming support.

**Phase:** Already partially handled. Verify JS probe correctness in Phase 1 (cross-browser hardening).

**Sources:**
- [mdn/browser-compat-data #24110](https://github.com/mdn/browser-compat-data/issues/24110)
- [Mozilla Connect feature request](https://connect.mozilla.org/t5/ideas/support-svg-filters-in-backdrop-filter-for-advanced-glass/idi-p/98453)

---

### Pitfall 3: filter: drop-shadow() on Parent Breaks backdrop-filter on Children

**What goes wrong:**
Applying `filter: drop-shadow()` on a parent element creates a new stacking context and containing block. Any child element with `backdrop-filter` stops working because the filter property on the ancestor becomes a "backdrop root" boundary -- the backdrop-filter cannot "see through" the parent's filter to the content behind it.

**THIS ALREADY HAPPENED IN THIS PROJECT.** Git commit `ba29f8a` ("fix: revert drop-shadow to box-shadow -- drop-shadow breaks backdrop-filter children") documents the exact bug and revert.

**Why it happens:**
Per the CSS Filter Effects Level 2 spec, an element with `filter` (including `drop-shadow()`) establishes a backdrop root. The `backdrop-filter` on a descendant only captures pixels between itself and the nearest backdrop root ancestor. If that ancestor has a filter, the captured backdrop is the filtered intermediate result, not the actual page content behind the element.

**Consequences:**
Glass cards inside shadow-wrapped parents show no blur effect. The backdrop appears as a solid color (the parent's background) instead of the blurred page content.

**Prevention:**
- NEVER use `filter: drop-shadow()` on any ancestor of a glass element.
- For squircle elements needing outer shadows, use the shadow-wrap pattern: a wrapper `<div>` with `box-shadow` + `border-radius`, and the inner element with `mask-image` + `backdrop-filter`.
- If the shadow must follow the squircle mask shape, accept the limitation: either use `box-shadow` with standard `border-radius` (close enough) or sacrifice the outer shadow entirely.
- Document this constraint in the design system: "Shadow-wrap pattern is required for all masked glass elements."
- In Chrome 139+ where `corner-shape: squircle` is used (no mask needed), `box-shadow` works natively and this workaround is unnecessary.

**Detection:**
- Any glass element nested inside a `filter: drop-shadow()` parent will show no blur.
- Visual QA: look for glass elements that appear as flat semi-transparent rectangles despite having backdrop-filter.

**Phase:** Already resolved. Maintain discipline in all future phases -- add ESLint/stylelint rule if possible.

**Sources:**
- Project git history (commit `ba29f8a`)
- [MDN: filter property](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- [CSS Filter Effects Level 2 spec](https://drafts.fxtf.org/filter-effects-2/)

---

### Pitfall 4: GPU Memory Exhaustion from Composite Layer Explosion

**What goes wrong:**
Every element with `backdrop-filter`, `will-change`, `transform: translateZ(0)`, or `filter` gets promoted to its own GPU composite layer. Each layer consumes VRAM proportional to the element's pixel area. On a 1440px-wide page with 8+ glass cards visible simultaneously, you can exhaust GPU memory on mid-range Android devices (2-4GB RAM, shared GPU memory), causing browser crashes or forced reloads.

**Why it happens:**
Developers add `will-change: backdrop-filter` or `transform: translateZ(0)` to every glass element "for performance." Combined with the implicit layer promotion from `backdrop-filter` itself, this doubles the layer count. The current v4.0 codebase wisely avoids `will-change` on static cards (documented anti-pattern in liquid-glass.css header comments), but v5.0 adds more glass elements (fluted glass, clear glass, adaptive tinting) that increase the total count.

**Consequences:**
- Budget Android devices (dominant in Kazakhstan market): browser tab crashes with no error message
- Mid-range devices: scroll jank averaging 12fps drop per glass element beyond the 5th
- Desktop: Chrome DevTools "Layers" panel shows 20+ composite layers where 5-8 would suffice

**Prevention:**
- Enforce a hard budget: MAX 5 glass elements per viewport at any scroll position. Count ALL elements with `backdrop-filter`, not just `.liquid-card`.
- NEVER add `will-change: backdrop-filter` to static (non-animating) elements. Current anti-pattern docs are correct -- maintain them.
- Use `will-change` only on elements about to animate, and remove it via JS after animation completes.
- Use Chrome DevTools > Layers panel to audit composite layer count.
- For sections with many cards, consider using glass effect only on hover/focus (JS-toggled class), not permanently.
- Test on a budget Android device (Samsung Galaxy A14 or equivalent, ~$150 device common in KZ).

**Detection:**
- Chrome DevTools > Rendering > "Layer borders" shows green borders around every composite layer
- Chrome DevTools > Performance tab shows "Compositor Layers" count
- Android remote debugging: `chrome://inspect` from desktop Chrome

**Phase:** Phase 2 (GPU performance audit). Audit BEFORE adding new glass variants.

**Sources:**
- [Smashing Magazine: CSS GPU Animation](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [Chromium GPU Compositing docs](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/)

---

### Pitfall 5: WCAG Contrast Failure Through Glass on Dynamic Backgrounds

**What goes wrong:**
Text on glass elements has no fixed background color -- the effective contrast depends on whatever content is behind the glass at any given scroll position. A card that passes WCAG 4.5:1 contrast against a white section fails when scrolled over a dark image, gradient, or colored tint section. For a 45+ medical audience, this directly impacts readability and trust.

**Why it happens:**
`backdrop-filter: blur()` averages the colors behind the element, but the result is unpredictable and varies per viewport. Static contrast checkers cannot test this. Manual testing at every scroll position is impractical.

**Consequences:**
- WCAG AA failure (4.5:1 for normal text, 3:1 for large text)
- 45+ users with age-related vision changes cannot read card content
- Legal risk for medical service (accessibility lawsuits increasing in EU/CIS)

**Prevention:**
- Current `--liquid-bg` at `rgba(255,255,255,0.42)` is too low for worst-case scenarios. Floor at `rgba(255,255,255,0.65)` for any glass element containing body text.
- For glass elements that scroll over varied backgrounds, use `rgba(255,255,255,0.75)` minimum -- accept reduced translucency for readability.
- Implement a contrast-safe mode: `@media (prefers-contrast: more)` and `@media (prefers-reduced-transparency: reduce)` should bump opacity to 0.90+.
- Test every glass card against EVERY section background it will appear over, including transitions between sections.
- Use `text-shadow: 0 1px 2px rgba(0,0,0,0.1)` on glass text for additional legibility floor (subtle, not obvious).
- Dark mode: `rgba(30,40,60,0.45)` current value is reasonable against dark backgrounds.

**Detection:**
- axe-core accessibility audit at multiple scroll positions
- Manual: scroll slowly through entire page, checking text readability on each glass card

**Phase:** Phase 1 (cross-browser hardening) -- accessibility is not optional.

**Sources:**
- [WCAG 2.1 SC 1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Moderate Pitfalls

### Pitfall 6: Firefox backdrop-filter Breaks with border-radius + overflow + sticky

**What goes wrong:**
In Firefox (tested through Firefox 147), `backdrop-filter` stops working on a `position: sticky` element when an ancestor has both `border-radius` and `overflow: auto|hidden|scroll` set. The blur effect completely disappears.

**Prevention:**
- The sticky header (`.liquid-header-backdrop`) must not have an ancestor with `border-radius` + `overflow` combo.
- If a scrollable container needs rounded corners, apply `border-radius` via a separate wrapper that does NOT have `overflow` set, or use `clip-path` instead of `overflow: hidden` for rounding.
- Workaround: add `filter: blur(0px)` or `z-index: 1` to the ancestor with `border-radius` + `overflow`.

**Phase:** Phase 1 (cross-browser hardening).

**Sources:**
- [Firefox Bug 1803813](https://bugzilla.mozilla.org/show_bug.cgi?id=1803813)

---

### Pitfall 7: mix-blend-mode + backdrop-filter Interaction Causes Double Application

**What goes wrong:**
When using `mix-blend-mode` for adaptive tinting on glass elements, the filter effects (blur, brightness, saturate) get applied TWICE to the portion of the image that has been backdrop-filtered. This creates an unnaturally saturated, overly bright appearance. The problem compounds exponentially if glass elements are nested.

**Why it happens:**
Per the CSS Filter Effects Level 2 spec, `backdrop-filter` captures the backdrop image, applies filters to it, then composites the result. If the element also has `mix-blend-mode`, the blending operation applies to the already-filtered result, and filters from ancestor stacking contexts may re-apply to the filtered region. The spec explicitly warns about this in the "Backdrop Root" definition.

**Prevention:**
- Do NOT apply `mix-blend-mode` directly to the glass element. Instead, use a pseudo-element (`::after`) with `mix-blend-mode` positioned above the glass content but below the text.
- Test with extreme colors behind the glass -- oversaturation is most visible with red/orange backgrounds.
- If adaptive tinting uses `mix-blend-mode: multiply` or `mix-blend-mode: color`, limit `saturate()` in the `backdrop-filter` to 120% max (not the current 180%).
- NEVER nest glass inside glass. Current anti-pattern docs cover this -- maintain them.

**Phase:** Phase 2 or 3 (adaptive tinting implementation).

**Sources:**
- [WebKit Bug 176830](https://bugs.webkit.org/show_bug.cgi?id=176830)
- [Firefox Bug 1083241](https://bugzilla.mozilla.org/show_bug.cgi?id=1083241)
- [W3C FXTF Issue #53](https://github.com/w3c/fxtf-drafts/issues/53)

---

### Pitfall 8: Device Orientation API Requires Explicit Permission on iOS

**What goes wrong:**
Specular highlight physics (gyroscope-based light movement on mobile) silently fails on iOS 13+ because `DeviceOrientationEvent.requestPermission()` must be called from a user gesture (tap/click). Calling it on page load throws a security error. Android does not require this permission.

**Why it happens:**
Apple added mandatory permission gating in iOS 13 beta 2 (2019) for accelerometer/gyroscope data. The API exists, but it requires HTTPS + user gesture + explicit permission dialog. If the user denies permission, the gyroscope is permanently blocked until the user manually resets permissions in Safari settings.

**Prevention:**
- Gate gyroscope features behind a "Try" button or first interaction with the glass element.
- Check for `DeviceOrientationEvent.requestPermission` existence before calling:
  ```javascript
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS path: request on user gesture
    button.addEventListener('click', async () => {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') { startGyroscope(); }
    });
  } else {
    // Android/desktop: start immediately
    startGyroscope();
  }
  ```
- Provide a CSS-only fallback (parallax on `mousemove` for desktop, subtle CSS animation for mobile without gyroscope).
- Do NOT show a permission dialog on page load -- medical audience 45+ will likely deny unexpected permission requests.
- Consider: is gyroscope-driven specular highlight worth the UX friction of a permission dialog for a medical landing page? Probably not. Use mouse parallax on desktop and static highlight position on mobile instead.

**Detection:**
- Test on a physical iPhone (iOS 13+). Simulator does not trigger permission requirement.

**Phase:** Phase 3 (specular highlight physics). Strongly recommend desktop-only parallax, skip mobile gyroscope entirely.

**Sources:**
- [Device Orientation Permission in iOS 13 (Lee Martin)](https://leemartin.dev/how-to-request-device-motion-and-orientation-permission-in-ios-13-74fc9d6cd140)
- [W3C Device Orientation spec](https://www.w3.org/TR/orientation-event/)
- [DEV Community: requestPermission iOS 13+](https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2)

---

### Pitfall 9: SVG feTurbulence Performance Destroys Mobile Scroll

**What goes wrong:**
SVG `feTurbulence` generates Perlin noise at render time. When used inside `backdrop-filter` (via `url(#filter)`), it recomputes on every frame during scroll. On an M4 Max MacBook Pro, community reports show visible judder; on budget Android devices, frame rates drop to single digits.

**Why it happens:**
`feTurbulence` is CPU-rendered in all browsers (not GPU-accelerated). Each frame requires computing noise values for every pixel in the filter region. `numOctaves="2"` means 2x the computation. Combined with `feDisplacementMap` (which reads the noise output and displaces source pixels), the per-frame cost is proportional to `element_area * numOctaves`.

**Prevention:**
- NEVER animate `feTurbulence` parameters (`baseFrequency`, `seed`). Generate once, cache the result.
- Reduce `numOctaves` to 1 for production. Visual difference between 1 and 2 octaves is minimal at blur distances.
- Use `feGaussianBlur` to soften the noise BEFORE `feDisplacementMap` (current approach in the research reference uses `stdDeviation="2"` -- this is correct).
- Limit refraction to 1-2 hero elements, not all glass cards.
- Consider pre-rendering the displacement map as a PNG and using `feImage` instead of runtime `feTurbulence`. This trades a ~5KB asset for eliminating per-frame noise generation entirely.
- Set `filterUnits="userSpaceOnUse"` with fixed dimensions to prevent recomputation on resize.

**Detection:**
- Chrome DevTools > Performance tab > scroll recording shows long "Rasterize Paint" tasks.
- Safari Web Inspector > Timeline shows SVG filter rendering as separate paint events.

**Phase:** Phase 2 (SVG refraction tuning). Pre-render displacement map as PNG for production.

**Sources:**
- [GSAP feTurbulence Mobile Performance](https://gsap.com/community/forums/topic/33075-gsap-and-feturbulence-mobile-performance/)
- [Apple Liquid Glass research article (project reference)](compass_artifact)

---

### Pitfall 10: mask-image + box-shadow Clipping (Shadow-Wrap Pattern)

**What goes wrong:**
Applying `box-shadow` to an element with `mask-image` causes the shadow to be clipped to the mask silhouette. Instead of a soft shadow around the element, you get two thin arcs or no visible shadow at all.

**THIS IS A KNOWN PATTERN IN THE CODEBASE** -- documented in both `liquid-glass.css` and `squircles.css` header comments.

**Why it happens:**
CSS `mask-image` clips ALL visual output of the element, including box-shadow. This is per spec, not a bug. The shadow is rendered within the element's border box, then the mask is applied, clipping the shadow to the mask shape.

**Prevention:**
- Use the shadow-wrap pattern: outer `<div>` with `box-shadow` + `border-radius`, inner element with `mask-image`.
- OR use `filter: drop-shadow()` on a NON-glass parent (remember Pitfall 3: this breaks child backdrop-filter).
- OR accept `border-radius` shadow (close visual match for most cases) and skip mask entirely on elements where shadow is critical.
- In Chrome 139+ with `corner-shape: squircle`, `mask-image` is removed (progressive enhancement in `squircles.css`). `box-shadow` works natively. This is the ideal future state.
- Current `.liquid-card-wrap` is marked DEPRECATED (comment says "use drop-shadow instead"), but drop-shadow was reverted (Pitfall 3). Need to UN-deprecate shadow-wrap or find a third approach.

**Detection:**
- Visual: shadow appears as thin arcs instead of soft glow around squircle elements.

**Phase:** Phase 1. Reconcile the DEPRECATED comment with the drop-shadow revert. Either restore shadow-wrap as the canonical pattern or document the new approach.

---

### Pitfall 11: isolation: isolate Creates Implicit Stacking Context Traps

**What goes wrong:**
Every `.liquid-regular`, `.liquid-card`, `.liquid-btn-secondary`, and `.stats-glass` element has `isolation: isolate`. This creates a new stacking context. Any `z-index` on descendant elements is scoped to that stacking context and cannot escape it. Modals, tooltips, dropdowns, or other overlays inside glass elements cannot appear above elements outside the glass element, regardless of z-index value.

**Why it happens:**
`isolation: isolate` is intentionally used in the glass system to prevent `mix-blend-mode` from bleeding into parent contexts. But it has the side effect of creating a stacking context boundary that traps z-index.

**Prevention:**
- Never place modals, tooltips, or dropdown menus as children of glass elements. Render them at the body level (or use a portal pattern).
- The sticky header (`.liquid-header-backdrop`) must have a z-index higher than the glass cards' parent stacking contexts, not the glass cards themselves.
- When adding new interactive elements (dropdowns in nav, tooltips on stats), verify they escape the glass element's stacking context.
- Document: "Glass elements are stacking context roots. Overlays must be rendered outside glass elements."

**Detection:**
- z-index on a child element has no effect beyond the glass parent.
- A dropdown menu appears behind content below the glass card.

**Phase:** Phase 1 (design system documentation). Ongoing discipline for all phases.

---

### Pitfall 12: Animating backdrop-filter Values Causes Full Repaint

**What goes wrong:**
Directly animating `backdrop-filter` properties (e.g., transitioning `blur(0px)` to `blur(24px)` on scroll) triggers a full repaint every frame. Unlike `transform` and `opacity` (which are compositor-only, GPU-cheap), `backdrop-filter` changes require re-rasterizing the entire filter area. This causes visible jank, especially on scroll-linked animations.

**Why it happens:**
`backdrop-filter` is not a compositor-only property. Changing its value requires the browser to re-capture the backdrop, re-apply the filter, and re-composite. This touches the CPU paint pipeline, not just the GPU compositor.

**Prevention:**
- NEVER transition/animate `backdrop-filter` values directly. The header scroll enhancement (`.header--scrolled` changes `--liquid-blur-md` from 24px to 60px) should use a class toggle (instant swap), not a CSS transition.
- To "animate" a blur-in effect, use opacity on the entire glass element instead:
  ```css
  .glass { opacity: 0; transition: opacity 0.3s; }
  .glass.visible { opacity: 1; }
  ```
- The shimmer sweep (`.shimmer-sweep::before`) correctly animates `transform` (not filter), which is compositor-only. Maintain this pattern.
- The glint border (`.liquid-card::before`) animates `background-position`, which triggers repaint but is limited to a 2px-wide pseudo-element, so the cost is negligible. Acceptable.

**Detection:**
- Chrome DevTools > Performance > enable "Paint flashing" -- green flashes on scroll indicate repaints.
- Smooth scroll with glass header should not show green flash on the header element during scroll.

**Phase:** Phase 2 (GPU performance audit).

---

## Minor Pitfalls

### Pitfall 13: prefers-reduced-transparency Has Limited Browser Support

**What goes wrong:**
The `@media (prefers-reduced-transparency: reduce)` query in `liquid-glass.css` (Section 14) only works in Chrome 118+ and Edge 118+. Safari and Firefox do not support it as of April 2026. Users on macOS who enable "Reduce transparency" in System Preferences will NOT get the opaque fallback in Safari.

**Prevention:**
- Keep the media query (it is correct for progressive enhancement).
- For Safari/macOS users, consider adding a manual toggle in the page UI alongside the dark mode toggle.
- Firefox support is not expected soon (no public intent).
- The `prefers-reduced-motion` query (Section 13) has universal support and serves as a partial fallback for motion-sensitive users.

**Phase:** Phase 1 (cross-browser hardening). Low effort, add a comment noting limited support.

**Sources:**
- [Can I Use: prefers-reduced-transparency](https://caniuse.com/wf-prefers-reduced-transparency)

---

### Pitfall 14: Print Stylesheet Must Neutralize ALL Glass Effects

**What goes wrong:**
The current print stylesheet (Section 11, liquid-glass.css) correctly disables backdrop-filter, background, box-shadow, and shimmer. However, it does NOT disable:
- The glint border animation (`.liquid-card::before`)
- The specular rim lights (`.liquid-regular::before`, `.liquid-btn-secondary::before`, `.stats-glass::before`)
- The header backdrop (`.liquid-header-backdrop`)
- Scroll-fade masks on content (content may be clipped in print)
- Section tints (`.section-tint-*` gradients -- harmless but waste ink)
- Future: refraction SVG filters, adaptive tinting, fluted glass patterns

**Prevention:**
- Extend the print stylesheet to cover ALL glass-related pseudo-elements and effects.
- Add `display: none !important` for all decorative pseudo-elements in `@media print`.
- Ensure scroll-fade masks are removed (already done for `.scroll-fade-top`/`.scroll-fade-bottom` but verify completeness).
- As new glass effects are added in v5.0, add corresponding print overrides. Make this a checklist item for every new glass class.

**Phase:** Each phase that adds a new glass effect must update the print stylesheet.

---

### Pitfall 15: Samsung Internet Browser Lag on backdrop-filter

**What goes wrong:**
Samsung Internet (Chromium-based, ~5% global market share, higher in KZ due to Samsung device prevalence) renders `backdrop-filter` correctly but with worse performance than stock Chrome. Samsung's Chromium fork adds browser-level overlays and effects that compete for GPU resources with glass elements.

**Prevention:**
- Test on a real Samsung device with Samsung Internet, not just Chrome on Android.
- Samsung Internet versions 25+ (Chromium 121+) have improved compositor performance.
- The 5-element-per-viewport budget (Pitfall 4) is especially important for Samsung Internet.
- If Samsung Internet performance is unacceptable, detect it via user-agent and reduce glass effects.

**Phase:** Phase 2 (GPU performance audit). Include Samsung Internet in test matrix.

---

### Pitfall 16: Squircle Mask Distortion During CSS Transforms

**What goes wrong:**
SVG `mask-image` data-URI masks distort during CSS `transform: rotate()`. The mask is applied in element-local coordinates, but rotation changes the relationship between the mask and the element, causing visible artifacts at corners.

**THIS IS ALREADY DOCUMENTED** in `squircles.css` anti-patterns: "NEVER apply squircle to rotating elements."

**Prevention:**
- Keep `border-radius` on rotating elements (icon chips, loading spinners).
- The 15 rotating icon chips across the pages correctly use `rounded-*` instead of `squircle-*`.
- `transform: scale()` and `transform: translateY()` are safe with squircle masks (no rotation component).
- Chrome 139+ `corner-shape: squircle` handles rotation correctly (native rendering, not mask-based).

**Phase:** Ongoing. No action needed beyond maintaining current discipline.

---

### Pitfall 17: Overflow: hidden on Glass Parent Kills Backdrop-Filter

**What goes wrong:**
Adding `overflow: hidden` to a glass element's parent can break `backdrop-filter` in specific browser combinations. The blur effect disappears or renders incorrectly because the overflow clipping creates an intermediate rendering surface that becomes the backdrop instead of the actual page content.

**Prevention:**
- Avoid `overflow: hidden` on direct parents of glass elements. Use `overflow: clip` instead (which does not create a new stacking context or block formatting context).
- Current codebase uses `overflow-x: clip` on `html` element (correct, documented in theme.css comments).
- If clipping is needed for decorative overflow (floating badges, mesh-bg blobs), apply it to a separate wrapper that is NOT an ancestor of glass elements.

**Phase:** Phase 1 (cross-browser hardening).

**Sources:**
- [CSS Backdrop-Filter Overflow Hidden Fix Guide (2026)](https://copyprogramming.com/howto/transitioning-backdrop-filter-blur-on-an-element-with-overflow-hidden-parent-is-not-working)

---

### Pitfall 18: White-on-White Glass Invisibility

**What goes wrong:**
Glass elements on white/near-white section backgrounds are invisible because `backdrop-filter: blur()` on white blurs white into white. The frosted glass effect requires color variation in the backdrop to produce a visible result.

**THIS ALREADY HAPPENED IN THIS PROJECT.** Documented in `.planning/debug/invisible-glass-on-white.md`. Fixed by raising `--liquid-bg` to `0.42` opacity and adding section tint utility classes (`.section-tint-cool`, `.section-tint-warm`, `.section-tint-mint`).

**Prevention:**
- Every section that contains glass elements MUST have a non-white background or a section tint applied.
- When adding new pages or sections, always apply a section tint class.
- Consider making glass cards automatically apply a subtle gradient background via their own CSS, independent of section tints.
- Verify glass visibility on inner pages (not just index.html with its mesh-bg).

**Phase:** Already resolved. Maintain discipline when adding new sections.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Severity | Mitigation |
|-------------|---------------|----------|------------|
| SVG refraction tuning | feTurbulence CPU cost (P9), Chromium-only (P2) | HIGH | Pre-render displacement PNG, gate behind JS probe |
| Adaptive tinting (mix-blend-mode) | Double filter application (P7), oversaturation | MEDIUM | Use pseudo-element for blend, cap saturate at 120% |
| Specular highlight physics (gyroscope) | iOS permission (P8), UX friction for 45+ | MEDIUM | Desktop-only parallax; skip mobile gyroscope |
| Fluted glass variant | SVG filter performance (P9), Chromium-only (P2) | HIGH | CSS-only vertical streak pattern, not SVG filter |
| Clear glass variant | WCAG contrast failure (P5), reduced readability | HIGH | Minimum 0.65 opacity, dimming layer behind text |
| GPU performance audit | Layer explosion (P4), Samsung Internet (P15) | CRITICAL | 5-element budget, test on budget Android |
| Cross-browser hardening | Safari CSS vars (P1), Firefox sticky (P6) | CRITICAL | Hardcoded fallbacks, test matrix |
| Design system docs | Shadow-wrap confusion (P10, P3), stacking traps (P11) | MEDIUM | Clear docs with anti-pattern examples |
| Dead code cleanup | Deprecated .liquid-card-wrap inconsistency (P10) | LOW | UN-deprecate or replace with new pattern |
| Dark mode glass | White-on-dark already tuned (P18 inverse) | LOW | Current values (0.45 opacity) are correct |

## Integration-Specific Warnings

These pitfalls are specific to adding v5.0 features to the EXISTING v4.0 codebase.

### Adding refraction to existing glass classes
The `html[data-refract="true"]` selector pattern (Section 10) is correct. When adding fluted glass or clear glass variants, follow the SAME gating pattern. Do not create new gating attributes -- reuse `data-refract` or create `data-fluted` with the same JS probe discipline.

### Changing --liquid-bg opacity for clear glass
Clear glass needs lower opacity (~0.15-0.25). If implemented by changing `--liquid-bg`, it will break the WCAG contrast floor established for regular glass. Create separate tokens: `--liquid-bg-clear`, `--liquid-bg-regular`.

### Adding new pseudo-elements to glass classes
`.liquid-card` already uses BOTH `::before` (glint border) and `::after` (specular radial gradient). If a new effect needs a pseudo-element on `.liquid-card`, it must be done via a child `<div>` or the existing pseudo-element must be composited with the new effect using `background` shorthand with multiple gradients.

### Increasing glass element count per page
v4.0 has roughly 6-8 glass elements per page. v5.0 features (fluted, clear, adaptive tinting) risk increasing this to 15+. Each new glass variant should be audited against the 5-per-viewport budget (Pitfall 4). Some effects may need to be CSS-only (no backdrop-filter) to stay within budget.

## Sources Summary

### Official Bug Trackers
- [WebKit Bug 176830: mix-blend-mode + backdrop-filter](https://bugs.webkit.org/show_bug.cgi?id=176830)
- [WebKit Bug 158807: backdrop-filter artifacts on rounded borders](https://bugs.webkit.org/show_bug.cgi?id=158807)
- [WebKit Bug 224899: Unprefix -webkit-backdrop-filter](https://bugs.webkit.org/show_bug.cgi?id=224899)
- [Firefox Bug 1803813: backdrop-filter + border-radius + overflow + sticky](https://bugzilla.mozilla.org/show_bug.cgi?id=1803813)
- [Firefox Bug 1083241: mix-blend-mode + filters](https://bugzilla.mozilla.org/show_bug.cgi?id=1083241)
- [Firefox Bug 1718471: backdrop-filter lag with many elements](https://bugzilla.mozilla.org/show_bug.cgi?id=1718471)

### Compatibility Data
- [mdn/browser-compat-data #25914: Safari CSS variables in backdrop-filter](https://github.com/mdn/browser-compat-data/issues/25914)
- [mdn/browser-compat-data #24110: SVG filters not supported in backdrop-filter](https://github.com/mdn/browser-compat-data/issues/24110)
- [Can I Use: backdrop-filter](https://caniuse.com/css-backdrop-filter)
- [Can I Use: prefers-reduced-transparency](https://caniuse.com/wf-prefers-reduced-transparency)

### Performance References
- [Smashing Magazine: CSS GPU Animation: Doing It Right](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [Chromium GPU Compositing Design](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/)
- [Chrome DevTools: Hardware-Accelerated Animation](https://developer.chrome.com/blog/hardware-accelerated-animations)
- [shadcn-ui #327: CSS Backdrop filter performance issues](https://github.com/shadcn-ui/ui/issues/327)

### Accessibility
- [WCAG 2.1 SC 1.4.3: Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Project History
- `.planning/debug/invisible-glass-on-white.md` -- white-on-white glass bug
- `.planning/debug/knowledge-base.md` -- v4.0 resolved debug sessions
- Git commit `ba29f8a` -- drop-shadow breaks backdrop-filter children
- Git commit `a6379f7` -- mask-repeat: no-repeat for Safari
