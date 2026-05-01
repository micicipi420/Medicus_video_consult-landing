# PITFALLS — v9.0 Living Blob + Transparent Glass Rework

**Project:** MedicusUnion KZ — v9.0 Living Blob Liquid Glass Scene
**Mode:** Project Research — Pitfalls
**Researched:** 2026-04-30
**Confidence:** HIGH (grounded in TZ + DESIGN.md + Phase 79/85 history; common WebKit/Blink behaviors are well-documented)

Each pitfall: **Impact** (HIGH/MED/LOW) → **Root cause** → **Prevention** (concrete) → **Phase to address**.

Phase taxonomy used below:
- **F** = Foundation phase (tokens, CSS layer, accessibility wiring, blob mount in `app/layout.tsx`)
- **B** = Blob engine phase (single rAF loop, pointermove, heat accumulator, mobile ambient mode)
- **G** = Glass rework per surface (header, hero, cards, form, controls)
- **C** = Per-component propagation (index → /checkup, /consultations, /treatment-abroad)
- **V** = Verification phase (Playwright UAT, perf budget, manual a11y QA, Lighthouse)

---

## 1. Performance pitfalls

### 1.1 Blur > 12px on mobile causes scroll jank — HIGH
**Cause:** `backdrop-filter: blur(N)` is GPU-bound. On budget Android (Mali / Adreno entry-tier dominant in KZ), >12px blur with concurrent scroll triggers tile re-rasterisation per frame. Phase 79 already shipped a 12px cap; v9.0 adds a *blob layer that itself renders blur*, multiplying cost.
**Prevention:**
- Hard token: `--blob-blur-mobile: 12px` and `--blob-blur-desktop: 24px`. No literal blur values in component CSS.
- Lint rule (stylelint or grep in CI): forbid `backdrop-filter:.*blur\((1[3-9]|[2-9]\d)px\)` inside any `@media (max-width: 767px)` block.
- Blob layer itself uses `filter: blur(...)` on subnodes — cap subnode blur to `--blob-blur-mobile` on small viewports. Mobile uses CSS radial gradient + transform (cheap), not multi-layer SVG/canvas blur.
**Phase:** F (tokens + lint), B (engine respects tokens), V (Playwright + DevTools perf trace on throttled device).

### 1.2 Animating layout properties (top/left/width) instead of transform — HIGH
**Cause:** Setting `top`/`left` on the blob each frame triggers layout → paint → composite. Only `transform` and `opacity` stay on compositor.
**Prevention:**
- Engine writes ONLY `transform: translate3d(x,y,0) scale(s)` and `opacity` to blob subnodes. Position is `fixed; inset: 0` (set once).
- Code review checklist item: "blob engine touches only transform/opacity/CSS custom properties bound to transform".
- Add a runtime DEV-mode assertion that fails if `style.top` / `style.left` ever changes on the blob root after mount.
**Phase:** B (engine implementation), V (verify in DevTools "Layout Shift Regions" / "Paint Flashing").

### 1.3 Layout thrash: reading geometry inside rAF loop — HIGH
**Cause:** `getBoundingClientRect()`, `offsetWidth`, `scrollY` reads inside the animation loop force synchronous layout. Common when porting "magnetic cursor" demos.
**Prevention:**
- Cache viewport geometry on `resize` only (debounced). Never read DOM geometry in the rAF body.
- Pointer position written to a single `pointer.x/y` ref; rAF only reads the ref, integrates inertia, writes transform.
- Code review pattern: rAF body is read-only against DOM (writes via `style.setProperty` to CSS vars on a single element).
**Phase:** B, V.

### 1.4 Untrottled pointermove — MED
**Cause:** Pointermove fires at device polling rate (120–240 Hz on modern trackpads). Doing work per event is wasted; rAF coalesces to display rate.
**Prevention:**
- Pointermove handler ONLY writes to `pointer.x/y` ref. All transform math happens in rAF.
- Use `{ passive: true }` listener flag.
- ONE pointermove listener on `window`, never per-element.
**Phase:** B.

### 1.5 rAF leak across route navigation — HIGH (App Router specific)
**Cause:** Next.js App Router keeps `app/layout.tsx` mounted across route changes, but if the blob component double-mounts (Strict Mode dev, fast refresh, hydration mismatch), `requestAnimationFrame` callbacks accumulate.
**Prevention:**
- `useEffect` returns cleanup that calls `cancelAnimationFrame(rafId)` AND removes pointermove listener.
- Use a `mountedRef` guard: rAF callback exits early if `!mountedRef.current`.
- Singleton pattern: blob engine module exports `start()` / `stop()`; component just toggles. If `start()` is called twice, second call is a no-op.
- Verify in DevTools Performance: after 5 route changes, pointermove listener count = 1, active rAF count = 1.
**Phase:** B, V (Playwright: navigate index → /checkup → /consultations → / and check `window.__blobDebug.rafCount === 1`).

### 1.6 Heavy box-shadow on many transparent elements — HIGH
**Cause:** TZ §17 references `box-shadow: inset 0 1px 0..., 0 24px 80px ...`. Multi-layer shadows on every card on a page (services grid: 4 cards × 3 shadow stops × multiple sections) compound paint cost. Composite shadows + backdrop-filter + transform-on-hover = jank.
**Prevention:**
- Limit composite glass shadow to ≤2 layers per element (one inset highlight, one outer drop).
- Section-level glass uses softer single shadow; card-level uses crisper single shadow. No element gets both inner-strong + outer-lg simultaneously.
- Cap to ≤8 glass surfaces per viewport (existing constraint is ≤2 — but at the very thin opacity values v9.0 wants, we may need more; budget explicitly).
- Promote glass-shadow elements to their own compositor layer ONLY where needed (`will-change: transform` sparingly — not on all glass, that bloats GPU memory).
**Phase:** F (token tier definition), G (per-surface budget), V.

### 1.7 DOM bloat from many blob subnodes — MED
**Cause:** Tempting to author core/body/halo/glint as 4+ DOM nodes, then add per-section "amplifier" nodes.
**Prevention:**
- ≤4 DOM nodes total inside `.living-blob-field`. No per-section duplication.
- Halo / glint expressed via single `radial-gradient` background on a layer, animated via CSS custom properties (`--halo-x`, `--halo-y`, `--halo-strength`) — one element, multi-stop background.
- Glint is a single reusable element repositioned, not multiple nodes spawned on movement.
**Phase:** B.

### 1.8 `will-change` overuse — MED
**Cause:** Slapping `will-change: filter, backdrop-filter, transform` on dozens of glass elements creates compositor layer explosion → GPU OOM on budget Android.
**Prevention:**
- `will-change` ONLY on the blob root and on actively-animated chrome (e.g., header during scroll). Never on cards.
- Remove `will-change` after animation ends where feasible (toggle via class).
**Phase:** B, G.

---

## 2. Accessibility pitfalls

### 2.1 Cursor-follow ignores `prefers-reduced-motion` — HIGH
**Cause:** Phase 85 wired the media query for existing animations; new blob component is a fresh code path that can bypass that wiring.
**Prevention:**
- Blob engine reads `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at start AND on `change` event.
- When reduced: no pointermove listener at all, no heat accumulation, no glint. Static ambient gradient only (slow drift ≤ 0.05 px/frame, or fully static).
- CSS-level guard duplicated in stylesheet: `@media (prefers-reduced-motion: reduce) { .living-blob-field { animation: none !important; transition: none !important; } }` — defense in depth in case JS guard fails.
- Playwright UAT: emulate `forced-colors` and `prefers-reduced-motion: reduce`, assert no transform updates after pointer move.
**Phase:** F (tokens + media-query plumbing), B (engine respects), V.

### 2.2 Glass too transparent destroys text contrast — HIGH (medical-site critical)
**Cause:** TZ §9 prescribes `rgba(255,255,255,0.04..0.16)`. At 0.04, on a near-white desktop background, body text contrast can collapse below WCAG AA (4.5:1). When blob (saturated green) passes under, contrast becomes unpredictable.
**Prevention:**
- Run automated contrast checks on `text-primary (#18212C)` against the *worst-case* background simulated as `green-600 (#35B678)` showing through at the chosen alpha. Required ratio ≥ 4.5:1 (body) / ≥ 3:1 (large).
- Establish a "text-safety" tier: any element holding body copy uses a *minimum* glass alpha (start at 0.16, never 0.04). Decorative panels (image frames, hero scaffold) can go to 0.04.
- Add `prefers-contrast: more` override that pushes ALL glass alpha up by +0.20 (or switches to `bg-white` opaque).
- On dark theme, glass-off remains (existing rule); ensure blob is dimmed on dark backgrounds (see 7.x).
- A11y test in V phase: axe-core / Pa11y with simulated blob position under each copy block.
**Phase:** F (tier definition), G (per-surface), V.

### 2.3 Heat-accumulation flash → photosensitivity risk — MED
**Cause:** TZ §7 describes blob "наливается" over 1.5–3s when cursor lingers — a slow pulse. Risk: if implementation produces a brightness oscillation > 3 Hz or > 25% luminance jump, it may approach WCAG 2.3.1 (no flash threshold).
**Prevention:**
- Heat ramp duration ≥ 1500 ms (TZ floor). Never permit < 800 ms transitions on luminance-affecting properties.
- Cap luminance delta: peak heat opacity/scale change ≤ 1.4× base. Document in token (`--blob-heat-max: 1.4`).
- No "release flash": when cursor moves again, heat decays smoothly over ≥ 600 ms.
- Reduced-motion: heat disabled entirely.
**Phase:** F (tokens), B (engine), V (record screen, frame-by-frame analysis if any reviewer reports flicker).

### 2.4 `prefers-reduced-transparency` bypass — HIGH
**Cause:** Phase 85 wired for existing glass. New `.glass-surface-v9` class created in v9.0 won't be in the existing media-query selector list.
**Prevention:**
- Use a CSS `@layer` strategy: define `@layer reduced-transparency { @media (prefers-reduced-transparency: reduce) { .glass-surface, .glass-surface-v9, .blob-affected, .living-blob-field { backdrop-filter: none; background: var(--surface-opaque-fallback); } } }` — single source of truth that catches all classes.
- Lint check: any new class beginning with `glass-` must appear in the reduced-transparency block, validated by a CI grep.
- The blob layer ITSELF respects `prefers-reduced-transparency`: switches to a flat opaque hint (or hides), since the whole effect IS transparency.
**Phase:** F.

### 2.5 `prefers-contrast: more` not honored on new tokens — HIGH
**Cause:** Same pattern as 2.4 — Phase 85 covered existing surfaces.
**Prevention:**
- Same `@layer` pattern. New v9.0 surfaces enumerated in the high-contrast media block.
- Borders shift from `rgba(255,255,255,0.5)` to `rgba(0,0,0,0.85)` (or opposite by theme).
- Blob luminance dampened on `prefers-contrast: more` so it doesn't fight text.
**Phase:** F, V.

### 2.6 Keyboard-only users get no blob feedback — LOW
**Cause:** Effect is decorative. Not a problem unless someone wires focus-follow.
**Prevention:** Don't wire focus-follow. Blob is decoration; explicitly document in DESIGN.md that focus states use existing outline-2 + primary color (not blob luminance).
**Phase:** F (doc), G (verify focus rings unchanged).

---

## 3. Readability over blob

### 3.1 CTA disappears when blob passes under it — HIGH (conversion-critical)
**Cause:** Gradient CTA `#1AC67E → #0D9DB5` overlaps spectrally with `--blob-core #35B678`. When blob halo bleeds through a glass section that contains a CTA, the green-on-green produces a visual blur.
**Prevention:**
- CTA buttons are *opaque*, not glass. TZ §13 explicitly: CTA "может иметь собственную плотность". Lock CTA fills to existing `--gradient-cta`, full opacity, sit on a higher z-stack than glass tier.
- CTA never receives `backdrop-filter`. Verify by grep on shipped components.
- Optional: 1px outer dark stroke (via inset shadow) on CTA when site theme is in "blob-active" mode, to preserve edge against any background.
**Phase:** F (CTA contract update in DESIGN.md), G (CTA component audit), V (Playwright screenshot diff with blob parked under CTA position).

### 3.2 Form labels become illegible — HIGH (conversion-critical)
**Cause:** Form is the conversion endpoint. Labels at `text-muted (rgba(24,33,44,0.55))` over a `rgba(255,255,255,0.08)` surface with a green halo bleeding through can collapse to ~3:1 contrast.
**Prevention:**
- Form panel is in the "text-safety" glass tier (≥ 0.16 alpha + opaque text; or even step up to 0.30 for forms specifically).
- Field labels promoted from `text-muted` to `text-primary` for v9.0 (note as a Key Decision in PROJECT.md).
- Form panel sits at a higher z-stack with localized "blob dimming": when blob centroid is within form bounding box, multiply blob opacity by 0.5 (engine reads form bounds once on mount).
- Inputs themselves: white opaque background `bg-white`, NOT glass. Label text on glass; input chrome solid.
**Phase:** G (form-specific phase), V (filled form readability test).

### 3.3 Body copy contrast dipping under blob — HIGH
**Cause:** Long-form body in cards (e.g., service cards on /treatment-abroad) becomes hard to read when blob passes under.
**Prevention:**
- Body-text-bearing cards in text-safety tier (≥ 0.16 alpha minimum).
- Inside text blocks, optionally apply a localized opaque "text-mat" — a 1–2 px outset pseudo-element with `bg-white/0.85` behind text only, leaving glass effect on card chrome.
- Audit each section: list every text block; map to glass tier.
**Phase:** G, V.

---

## 4. Brand drift

### 4.1 "Kislotny" neon green — HIGH (brand-critical)
**Cause:** Saturated `#4FE098` (TZ `--blob-hot`) at full opacity on a white page reads as gaming/UFO neon. Medical brand demands calm.
**Prevention:**
- `--blob-hot` is the *peak* color; reached only at heat-max, only via a halo at low opacity (≤ 0.5). Direct viewing should never see solid `#4FE098` block.
- Default core color is `#35B678` (already the `--mu-primary`, brand-safe).
- Saturation cap: `filter: saturate(N)` on blob root capped at 1.2 (not the TZ-suggested 1.4). Validate visually side-by-side with medicusunion.com.
- Reviewer step: render a still frame at heat-peak; if it could pass for a fitness-tracker app, it's too saturated. Pull back.
**Phase:** F (token values), V (visual review against brand reference).

### 4.2 Awwwards-style cursor trails / particle effects — HIGH
**Cause:** "Living blob" + lerping inertia is one step from spawning trails or sparkles. Looks cheap on medical.
**Prevention:**
- Explicitly forbid in DESIGN.md (custom section): no trails, no particle systems, no SVG noise overlays, no "shimmer travel".
- Glint is a single reusable specular highlight, not a particle. Frequency cap: at most one glint visible per 4-second window.
- Code review checklist: any addition of >4 visible animated decorative elements requires Key Decision.
**Phase:** F (DESIGN.md update), V (UAT against checklist).

### 4.3 Spline / 3D-ish feel conflicting with calm medical tone — MED
**Cause:** Heavy bloom + radial highlight + parallax can read as "fitness app hero" rather than medical.
**Prevention:**
- No parallax (already in PROJECT.md "Out of Scope").
- Bloom radius capped: `--blob-halo-radius` ≤ 40% of viewport diagonal.
- Single light source convention: highlights all originate from blob centroid only — no fake top-light + bottom-light combos.
- Reference: medicusunion.com homepage as the calm baseline.
**Phase:** F, V.

---

## 5. Mobile UX failures

### 5.1 Touch-follow blob fights scroll — HIGH
**Cause:** If pointermove (or touchmove) on mobile is wired to follow, vertical scroll competes with blob motion; either scroll lags or blob lags.
**Prevention:**
- Mobile (≤ 767px or `(pointer: coarse)`): NO pointer/touch follow. Ambient drift only — slow Lissajous or sine path with period ≥ 12s.
- Detection: prefer `(pointer: coarse) and (hover: none)` media query — more reliable than width breakpoint (covers iPad in stylus mode etc.).
- Touchmove listener: never attached on mobile.
**Phase:** B.

### 5.2 Tap-pulse on every tap = noisy — MED
**Cause:** TZ §14 allows "мягкий pulse" on tap. If wired to every `pointerdown`, including taps on form fields and nav, page becomes a flashing minefield.
**Prevention:**
- Tap pulse only on background (taps where event target is NOT inside `[data-interactive]`, links, buttons, inputs).
- Pulse duration ≤ 400 ms, opacity delta ≤ 0.2.
- Reduced-motion: pulse disabled.
- Pulse rate-limited: max 1 per 600 ms (debounce).
**Phase:** B.

### 5.3 iOS safe-area + fixed blob layer — MED
**Cause:** `position: fixed; inset: 0` on iOS Safari with the URL bar collapsing/expanding makes the blob layer "jump" relative to scrolling content. Also home-indicator area: blob can render under a system overlay, looking glitchy.
**Prevention:**
- Use `100dvh` (dynamic viewport height) for any height calc, fall back to `100vh`.
- `inset: 0` is fine for the layer; ambient drift uses transform-only so URL-bar resize doesn't trigger re-layout.
- Test on iOS Safari 15.4+, 16, 17 — all three URL-bar collapse states.
**Phase:** F, V.

### 5.4 backdrop-filter quirks on iOS Safari — HIGH
**Cause:**
- iOS Safari < 15.4 needs `-webkit-backdrop-filter` prefix.
- Stacking-context bugs: `backdrop-filter` on an element inside a `transform`-ed ancestor sometimes reads through to the wrong layer (looks at the ancestor's pre-transform background).
- iOS 17 reintroduced a regression where `backdrop-filter: saturate()` over a translucent parent washes out.
**Prevention:**
- Always pair `backdrop-filter` with `-webkit-backdrop-filter`. Existing globals.css convention; enforce on new selectors.
- Glass surfaces avoid `transform` ancestors that introduce stacking contexts in unexpected places. Promote glass elements to their own stacking context (`isolation: isolate`).
- `@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))` gate; fallback is opaque white at 0.85.
- Manual UAT on real iPhone (not just simulator) at minimum on iOS 16 + 17.
**Phase:** F, V.

---

## 6. SEO / Core Web Vitals

### 6.1 INP regression from pointermove handler — HIGH
**Cause:** INP measures interaction latency. Pointermove handler that does any work (style writes, geometry reads) inflates INP; even pure ref-write handlers can regress if listener wiring is sloppy.
**Prevention:**
- Pointermove handler is < 5 lines: write to ref, return. All work in rAF.
- `passive: true` listener. Never `preventDefault()`.
- Verify in CWV report: INP p75 stays < 200ms after rollout.
- Field test: Lighthouse + WebPageTest from KZ POP if available; else Almaty 4G profile via WebPageTest.
**Phase:** B, V.

### 6.2 LCP regression — HIGH
**Cause:** If blob layer paints first or contributes to layout shift before LCP, it can be selected as LCP candidate (it's a large painted element). Also: heavy SVG / canvas blob delays first paint.
**Prevention:**
- Blob layer mounts AFTER hero LCP candidate. Defer JS engine init to `requestIdleCallback` or after `load` event (acceptable for decoration).
- Initial CSS state: blob layer renders ONE static gradient before JS hydrates — not blank, not animated. Cheap.
- `loading="lazy"` is irrelevant for CSS gradient; just keep total CSS for blob ≤ 4 KB gzipped.
- Verify Lighthouse mobile LCP < 2.5s post-rollout. If blob is selected as LCP, ensure hero text/image is larger paint area.
**Phase:** B, V.

### 6.3 CLS on hydration — HIGH
**Cause:** If SSR renders one DOM and client renders another (e.g., blob conditionally rendered), hydration can shift layout.
**Prevention:**
- Blob layer is `position: fixed` — it's out of normal flow; it CAN'T contribute to CLS itself.
- BUT: glass surfaces conditionally rendered (e.g., dark-mode glass-off branching) DO. Render the same DOM on server and client; toggle via CSS only (`[data-theme="dark"] .glass { backdrop-filter: none }`). Never `if (theme === 'dark') return <Opaque/>` in JSX.
- Theme detection: existing pattern (FOUC-free script in `<head>`) must continue to work; v9.0 does not introduce a parallel detection path.
**Phase:** F, G, V.

### 6.4 First-paint flash of empty blob — MED
**Cause:** Blob root is rendered, but JS engine hasn't initialized. User sees a static gradient flicker → motion start.
**Prevention:**
- SSR a CSS keyframe ambient drift on `.living-blob-field` so the layer is alive even without JS.
- JS engine, when starting, reads the current CSS-driven state and continues from there (or accepts a small jump masked by `transition: transform 200ms ease`).
**Phase:** B.

---

## 7. Glass over dark mode

### 7.1 Existing dark-mode disables backdrop-filter — but blob is now visible — HIGH
**Cause:** Phase 79+ rule: `[data-theme="dark"] backdrop-filter: none`. v9.0 adds a green blob glowing under dark navy — direct visibility on opaque dark surfaces produces a muddy smear (TZ explicitly forbids muddy results).
**Prevention:**
- On dark theme, blob is significantly dimmed (`opacity: 0.35`) AND saturation reduced (`filter: saturate(0.7)`). Token `--blob-opacity-dark`.
- Glass surfaces over the blob remain opaque dark in dark mode (existing behavior — preserve). The blob is essentially decorative ambient on dark.
- Consider: full disable of follow on dark theme.
- Visual review: dark theme + blob at multiple positions — does any state look like a video glitch? If yes, dim further.
**Phase:** F, G, V.

### 7.2 Glass drop-shadow on dark muddies the blob — MED
**Cause:** Outer drop shadows on dark theme can layer over blob halo, producing brown/grey wash.
**Prevention:**
- Dark theme uses sharper, smaller shadows (`shadow-glass-sm` only, not `lg`).
- Override token at theme level: `[data-theme="dark"] { --shadow-glass-blur: 12px; }`.
**Phase:** F, G.

---

## 8. Cross-route hydration

### 8.1 Fixed blob layer SSR vs client position mismatch — HIGH
**Cause:** Server has no `window.innerWidth`; if blob initial position depends on viewport, SSR HTML differs from CSR after hydration → React hydration warning + visible flash.
**Prevention:**
- Initial state is viewport-agnostic: blob centered (`50% 50%`). All offsets via CSS variables that default to neutral values.
- JS engine writes CSS variables `--blob-x`, `--blob-y` ONLY after first effect runs (post-hydration). Same DOM, just custom-property updates.
- Avoid `useLayoutEffect` for initial mount on SSR — gives React warnings; use `useEffect` for init (decoration, no FOUC concern since CSS already paints).
**Phase:** B.

### 8.2 Blob mount in `app/layout.tsx` re-mounts on theme toggle — MED
**Cause:** If blob component is conditionally rendered based on theme state held in layout, theme toggle remounts blob → engine reset → flash.
**Prevention:**
- Blob component always mounted. Theme branching is internal CSS-variable swap, never `null` return.
- Engine subscribes to theme change event and tweens its parameters smoothly (no remount).
- Test: toggle theme 5× rapidly; engine state and rAF count remain stable.
**Phase:** B, V.

### 8.3 Listener double-binding on hydration / Strict Mode — HIGH
**Cause:** React 18 Strict Mode in dev double-invokes effects. If pointermove listener is attached without idempotency, two listeners → double rAF schedules → stutter.
**Prevention:**
- Singleton engine module (outside React): `engine.start()` is idempotent (checks if already started).
- React component owns no listeners directly; just calls `engine.attach(rootEl)` / `engine.detach()`.
- Smoke test in Strict Mode dev: assert listener count via `getEventListeners(window)` in DevTools Console.
**Phase:** B.

---

## 9. Existing component breakage

### 9.1 Phase 86 service-page form readability collapses — HIGH (conversion-critical)
**Cause:** Service pages (/checkup, /consultations, /treatment-abroad) inherited the index visual language including form blocks. Dropping their backgrounds to alpha 0.04–0.16 may make labels/inputs unreadable when the rework PR lands.
**Prevention:**
- Form glass tier locked at ≥ 0.16 (text-safety floor).
- Per-page visual diff in V phase: run Playwright screenshot diff against pre-v9.0 baseline for every page's form section. Fail PR if hash diverges in label/input region beyond tolerance.
- Form is the LAST element to lose opacity; even after rework, form panel may be `bg-white/0.85` if testing reveals issues. Document in PROJECT.md as a Key Decision if so.
**Phase:** G (form phase), C (per-page propagation), V.

### 9.2 Sticky bars / mobile menu / modals — HIGH
**Cause:** v8.0 shipped HeaderClient, MobileMenu, StickyBar with HIG tap targets. v9.0 must preserve their opacity (header is the existing 1 allowed glass surface). Adding blob underneath could leak through if z-stack is wrong.
**Prevention:**
- z-index map updated in DESIGN.md:
  - blob-field: `z-0`
  - main content: `z-1`
  - sticky bar / mobile menu / header: `z-50+`
  - modals: `z-100+`
- Existing header glass remains opaque-ish (0.8 white). Don't push it down to 0.04.
- Modals: opaque solid backgrounds (already), unchanged.
- Verify each chrome element has its tier confirmed.
**Phase:** F (z-index map), G (per-component), V (open menu, modal, sticky bar — none should show blob bleed-through).

### 9.3 Existing `.card`, `.card-glass`, `.card-hero` semantics — MED
**Cause:** Three card variants exist. Reworking one may diverge the family. Mixed siblings violates DESIGN.md.
**Prevention:**
- All three variants migrated together to v9.0 alpha tiers, OR `.card` (flat) is preserved unchanged and `.card-glass` is the only one reworked. Decide explicitly; document.
- Lint: forbid mixing `.card` and `.card-glass` in same parent grid (existing siblings rule).
**Phase:** G.

---

## 10. Token / cascade conflicts

### 10.1 New tokens collide with existing `--liquid-blur-*` — MED
**Cause:** Existing scale (`sm/md/lg/xl` = 16/24/40/60). v9.0 may want intermediate values for blob layer or new tier semantics.
**Prevention:**
- Reuse existing tokens exclusively where possible. New tokens live under a clear namespace: `--blob-*` and `--glass-v9-*`.
- Update DESIGN.md YAML front matter to register all new tokens. CI lint: any token in CSS not in YAML fails.
- Avoid redefining existing tokens (e.g., do NOT change `--liquid-blur-md` from 24 to 20 mid-flight; add a new token instead).
**Phase:** F.

### 10.2 Specificity wars with Tailwind utilities — MED
**Cause:** Tailwind's `bg-white/80` produces inline-equivalent specificity. v9.0 utility class `.glass-surface-v9` may need `!important` to override, which is forbidden in DESIGN.md spirit.
**Prevention:**
- Use CSS `@layer` ordering: `@layer tailwind, components, utilities;` and place v9.0 glass classes in the right layer.
- Or: define v9.0 classes as Tailwind plugin / `@apply` so they inherit cascade naturally.
- Prefer custom-property-driven glass: `.glass-surface-v9 { background: var(--glass-v9-fill, rgba(255,255,255,0.16)); }` — variants override the variable, not the property.
**Phase:** F.

### 10.3 `.squircle-*` mask + new glass = clipped shadows — HIGH (already documented anti-pattern)
**Cause:** DESIGN.md explicitly forbids `box-shadow + mask-image` on same element. v9.0 wants composite shadows AND squircle masks on cards.
**Prevention:**
- Use existing shadow-wrap pattern from `squircles.css`: parent owns shadow, child owns mask + content.
- Pre-flight check: every glass surface in v9.0 follows the wrapper pattern. Add an example in DESIGN.md showing v9.0-specific composite.
**Phase:** F (doc), G (apply).

---

## 11. `prefers-reduced-transparency` / `prefers-contrast` rewiring

### 11.1 New blob layer bypasses existing wiring — HIGH
**Cause:** Phase 85 added prefers-reduced-transparency/contrast handling for shipped surfaces. The blob component is a new code path.
**Prevention:**
- Blob respects `prefers-reduced-transparency: reduce` → blob hidden entirely (or replaced by static, low-opacity hint).
- Blob respects `prefers-contrast: more` → blob saturation halved, opacity halved, no halo, no glint.
- Tests:
  - `prefers-reduced-motion: reduce` → no follow, no heat, ambient only.
  - `prefers-reduced-transparency: reduce` → blob hidden, glass surfaces opaque.
  - `prefers-contrast: more` → text contrast verified ≥ AAA, blob dampened.
- Add Playwright a11y emulation tests in V phase covering all three.
**Phase:** F (wiring), B (engine respects), V.

---

## 12. Browser compatibility

### 12.1 backdrop-filter on iOS Safari < 15.4 — MED (covered)
**Prevention:** Already in DESIGN.md — `-webkit-backdrop-filter` + `@supports` fallback. Re-verify for any new selector.
**Phase:** F, G.

### 12.2 Firefox `backdrop-filter` lag — MED
**Cause:** Firefox supports backdrop-filter (since 103) but at higher cost than Chromium. Combined with our heavy glass system + blob, Firefox may stutter even on desktop.
**Prevention:**
- Test in Firefox Stable + ESR. If stutter:
  - Detect via UA + reduce blur tier on Firefox (`@-moz-document` or feature query).
  - Document any Firefox-specific tweak in DESIGN.md.
**Phase:** V.

### 12.3 `mix-blend-mode` quirks — MED
**Cause:** Tempting to use `mix-blend-mode: screen` or `overlay` on blob to enhance "light through glass" feel. Mix-blend creates new stacking contexts, breaks `position: fixed`, can disable child `backdrop-filter`.
**Prevention:**
- AVOID `mix-blend-mode` on blob layer or any glass parent.
- Achieve the "light through" feel via opacity + saturate + carefully-chosen colors instead.
- DESIGN.md anti-pattern entry.
**Phase:** F (doc), B.

### 12.4 `filter: blur()` on large layers is GPU-heavy — HIGH
**Cause:** TZ uses `filter: blur(...)` on blob halo. On 1440×900 viewport, a 60px blur on a full-screen layer = ~50 MB GPU memory + heavy fragment shader work.
**Prevention:**
- Blob halo blur applied to a *small* element (e.g., 400×400 px) that is then `transform: scale(3)` to cover viewport — much cheaper.
- OR: use radial-gradient-based halo (zero filter cost) and reserve `filter: blur` for the small core only.
- Cap halo blur ≤ 40px even on desktop.
**Phase:** B.

---

## 13. Memory / leaks

### 13.1 rAF not cancelled on route change — covered (1.5).
### 13.2 Listener double-binding — covered (8.3).

### 13.3 Memoized closures retain stale viewport — LOW
**Cause:** `useMemo` / `useCallback` capturing initial `window.innerWidth`; on resize, blob scaling refers to old value.
**Prevention:**
- Window dimensions held in a singleton ref updated on resize, not in React state.
- Engine reads ref each frame.
**Phase:** B.

### 13.4 Long-running tab GPU memory creep — MED
**Cause:** After hours, with constant pointer activity, GPU layer counts can creep if `will-change` is mismanaged.
**Prevention:**
- Periodic micro-pause: every 30s of idle pointer, drop `will-change` on blob root for one frame to release memory, then restore.
- Optional: use Page Visibility API — when `document.hidden`, fully stop rAF.
**Phase:** B.

---

## 14. Maintenance / design-system drift

### 14.1 Blob tokens not in DESIGN.md — HIGH
**Cause:** Custom tokens (`--blob-core`, `--blob-hot`, `--blob-halo`, `--blob-edge`, `--blob-glint`) introduced in implementation but not in YAML front matter → drift.
**Prevention:**
- Foundation phase ships DESIGN.md update FIRST: new YAML group `colors.blob.*` and `effects.blob.*` registered with values + rationale.
- CI grep: any `--blob-*` in CSS that's not in DESIGN.md fails.
- Brand-parity rule applies: new colors must trace to `medicusunion.com/.kz` or be logged as Key Decision.
**Phase:** F.

### 14.2 No documentation of v9.0 anti-patterns — MED
**Cause:** New ways to break things (e.g., "do not put `mix-blend-mode` on glass"); future contributors will rediscover these.
**Prevention:**
- Foundation phase appends a "v9.0 Liquid Glass Scene" custom section to DESIGN.md mirroring TZ §16 forbids list, plus our discovered constraints.
**Phase:** F.

---

## 15. Testing / Playwright UAT

### 15.1 Flaky animation assertions — HIGH
**Cause:** "Blob exists and reacts" naively asserted via screenshot or transform value → flaky because blob position is time-dependent.
**Prevention:**
- Test the *system*, not the values:
  - Mount the page, freeze time (`page.clock.install()`), simulate pointer move from (100,100) to (500,500) over 1s, advance clock 60 frames, capture transform value, assert it has *changed* (not specific value).
  - Test reduced-motion: emulate `prefers-reduced-motion: reduce`, move pointer, assert transform DOES NOT change beyond ambient.
  - Test no-leak: navigate 5 times, expose `window.__blobDebug.rafCount` (DEV only) and assert == 1.
- Snapshot tests use `mask-color` + `mask` regions to ignore blob area; assert form/CTA/text regions stable.
- Lighthouse CI in V phase, perf budget gate: INP, LCP, CLS regressions vs baseline fail PR.
**Phase:** V.

### 15.2 Real-device manual UAT skipped — HIGH
**Cause:** Phase 89 already documented one cheat-pass on a11y; risk repeats.
**Prevention:**
- V phase has a hard gate: real-device tests on (a) iPhone iOS 16 or 17, (b) low-end Android (any 4 GB RAM device, e.g., Redmi 9), (c) desktop Chrome + Firefox + Safari. Each device has a checklist signed off with a screenshot or video attached to the phase report.
- No "trust me" passes. Phase 85 retro emphasized this.
**Phase:** V.

### 15.3 No perf budget enforcement — HIGH
**Cause:** Without a hard gate, perf creeps; v9.0 is exactly the kind of change that pushes p75 INP from 100ms to 300ms silently.
**Prevention:**
- Lighthouse CI config in repo with budgets: LCP ≤ 2500ms, INP ≤ 200ms, CLS ≤ 0.1, Total Blocking Time ≤ 200ms (mobile, throttled).
- Per-PR run; fail PR if regression > 10%.
**Phase:** V (set up budget), every subsequent phase respects.

---

## Phase Ordering Implications (for roadmapper)

Strict ordering required:

1. **Foundation phase (F)** — DESIGN.md update (tokens, anti-patterns, z-index map, accessibility opt-out wiring), CSS layer architecture, mount blob root in `app/layout.tsx` as static gradient (no JS yet). Deliverable: site looks identical to today, but `.living-blob-field` is in DOM with correct z-index and a11y opt-outs honored.

2. **Blob engine phase (B)** — Implement engine module (singleton, idempotent start/stop, rAF, pointermove, heat, mobile ambient, all media-query branches). Deliverable: blob is alive on all pages but glass surfaces are unchanged.

3. **Glass rework per surface (G)** — One sub-phase per surface family: header (already done, verify), hero, services grid, form, CTA section, pricing card, FAQ accordion. Per-sub-phase verification before next.

4. **Per-page propagation (C)** — Apply G outcomes to /checkup, /consultations, /treatment-abroad. Side-by-side visual diff vs index. Special attention to form readability (9.1).

5. **Verification phase (V)** — Playwright animated UAT, Lighthouse CI gate, real-device manual checklist, a11y audit (axe-core + manual screen reader sweep + reduced-motion / reduced-transparency / contrast emulation), brand review against medicusunion.com.

## Highest-Impact Watch Items (top 5)

1. **Form readability collapse** (3.2 + 9.1) — directly threatens conversion. Lock form panel at ≥ 0.16 alpha and keep input chrome opaque.
2. **CTA visibility under blob** (3.1) — green-on-green collision. CTA stays opaque, never glass.
3. **Mobile blur > 12px regression** (1.1) — Phase 79 hard-won; v9.0 must not relax it.
4. **Reduced-motion / reduced-transparency / contrast bypass** (2.1, 2.4, 2.5, 11.1) — new code path is the failure mode. Use `@layer` to enumerate all glass classes in one place.
5. **rAF / listener leaks across route navigation** (1.5, 8.3) — App Router + Strict Mode is a known footgun; singleton engine is the prevention.
