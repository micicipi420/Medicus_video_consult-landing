# Phase 23: Micro-Animations Enhancement

**Milestone:** v1.4 2025 Visual Redesign
**Phase goal:** Extend existing scroll reveal animations with a `translateY` slide component, add tactile button `:active` feedback, and ensure the global `prefers-reduced-motion` guard covers all new transform additions. Animation catalogue is defined and capped at ≤5 types before any `@keyframes` is written.
**Depends on:** Phases 20, 21, 22 (all visual surfaces stable — adding animation on top of stable glass, typography, and dark mode)
**Status:** Pending

---

## Requirements Covered

| ID | Requirement | Notes |
|----|-------------|-------|
| ANIM-01 | `translateY(20px → 0)` добавлен к начальному состоянию `.animate-on-scroll` поверх существующего fade | Extends existing IntersectionObserver system; does not replace it |
| ANIM-02 | Кнопки CTA — `:active { transform: scale(0.97) }` с 100ms transition для тактильного подтверждения клика | Applied to `.btn` and `.cta-button` selectors; 100ms duration |
| ANIM-03 | Глобальный guard `prefers-reduced-motion` покрывает все новые анимации (включая сброс `transform: none`, не только `duration: 0`); итого различных типов анимаций на странице ≤5 | Pre-implementation check of existing guard; new transforms explicitly reset to `none` in the reduced-motion block |

---

## Files to Modify

### `css/styles.css`

**Pre-implementation check — read lines ~182-189 (Section 10)**
Verify the existing `prefers-reduced-motion` rule before making any changes. Confirm the existing block structure:

```css
/* Expected existing structure in Section 10 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

If `transform: none` is NOT already in this block, it must be added for ANIM-01 and ANIM-02 to be properly guarded (see below).

**Location: Section 10 (Animations) — `.animate-on-scroll` initial state**
Extend the existing initial state to include `translateY` (ANIM-01):

```css
/* Modify existing rule — add transform to the existing opacity: 0 state */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);  /* ADD — was not here before */
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;  /* ADD transform to transition */
}

/* Modify existing .is-visible rule — add transform reset */
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);  /* ADD */
}
```

**Location: Section 10 — `prefers-reduced-motion` block**
Extend the existing reduced-motion block to reset transforms (ANIM-03):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* ADD: Reset transform-based animations — duration-zero alone is insufficient
     because a duration-zero transform from translateY(20px) still snaps the element.
     Elements must start at their final position. */
  .animate-on-scroll {
    opacity: 1;
    transform: none;
  }

  .animate-on-scroll.is-visible {
    opacity: 1;
    transform: none;
  }

  /* ADD: Reset button active transform */
  .btn:active,
  .btn--primary:active,
  .btn--cta:active {
    transform: none;
  }
}
```

**Location: Section 4 or wherever `.btn`, `.btn--primary`, `.btn--cta` rules are defined**
Add `:active` state for tactile feedback (ANIM-02):

```css
/* ADD to existing button rules */
.btn,
.btn--primary,
.btn--cta {
  /* Ensure transition includes transform if not already present */
  transition:
    background-color var(--transition-fast),
    opacity var(--transition-fast),
    transform 100ms ease;  /* ADD */
}

.btn:active,
.btn--primary:active,
.btn--cta:active {
  transform: scale(0.97);  /* ADD */
}
```

**No changes needed to `index.html`** — no new HTML elements; all animation is CSS-driven.

**No changes needed to `js/main.js`** — the existing `initScrollAnimations()` function already handles adding `.is-visible` via IntersectionObserver. The new `transform` in the initial state is CSS-only. However, verify the IntersectionObserver function does not also set `transform` directly via inline styles, which would conflict.

---

## Key Implementation Notes

### Animation catalogue — define before writing code (ANIM-03)

The catalogue of animation types on the page after Phase 23 must total ≤5 distinct types. Count existing animations first:

| Type | Element | Status |
|------|---------|--------|
| Scroll fade-in | `.animate-on-scroll` → `.is-visible` | Existing — extended by ANIM-01 |
| FAQ accordion expand/collapse | `.faq__answer` height transition | Existing |
| Card hover lift | `.card:hover { transform: translateY(-2px) }` | Existing |
| Button active scale | `.btn:active { transform: scale(0.97) }` | New (ANIM-02) |
| Theme transition | `body` color/background-color 300ms | Optional — landed in Phase 20 patch |

Total: 4–5 types. This is within the ≤5 limit. Do not add more types without removing an existing one.

Prohibited additions (from PITFALLS.md and FEATURES.md):
- Animated number counters on social proof statistics
- Looping or continuous animations (pulsing, rotating)
- Any scale above `scale(1.02)` on hover
- Parallax or translate values above 10px on hover

### `translateY(20px)` — not `translateY(40px+)`

The existing scroll reveal uses opacity fade only. Adding `translateY(20px)` is a small, purposeful vertical shift — enough to signal "appearing" without triggering vestibular symptoms. 20px is within the acceptable range from PITFALLS.md (transforms above 10px on hover are the vestibular risk; scroll-reveal one-shot 20px at 400ms ease-out is acceptable).

The transition duration must match the existing opacity duration (400ms ease-out) to keep both properties in sync.

### The reduced-motion guard must reset `transform: none` — not just zero the duration

This is explicitly flagged in REQUIREMENTS.md (ANIM-03), FEATURES.md, and PITFALLS.md. The reason:

`animation-duration: 0.01ms` means the animation completes in 0.01ms — but the element still starts at `translateY(20px)` and snaps to `translateY(0)`. For a user who has prefers-reduced-motion set, the element visually snaps from an offset position. This is still motion, just instant motion. It can cause visual disruption.

The correct fix is to explicitly reset the initial state in the reduced-motion block:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    opacity: 1;
    transform: none;
  }
}
```

This ensures that under reduced-motion, elements are visible immediately at their final position with no transform offset — as if the animation never existed.

### Stagger delay verification

The existing system applies stagger delays between sibling elements in card grids (`.stagger-children`). Confirm the stagger delay is ≤100ms per child. PITFALLS.md and FEATURES.md both flag stagger delays above 100ms as a readability and perceived-performance problem for the 45+ audience. If the current stagger is 150ms or higher, reduce it to 80–100ms during this phase.

### IntersectionObserver + transform: no conflict

The IntersectionObserver in `js/main.js` adds `.is-visible` to elements with `.animate-on-scroll`. The new `transform: translateY(0)` in `.animate-on-scroll.is-visible` is a CSS rule triggered by the class addition. There is no conflict because:
- IntersectionObserver only mutates class lists
- The transform is defined entirely in CSS
- The observer does not set inline styles for transform

Verify this by checking `initScrollAnimations()` in `main.js` — confirm it only adds/removes classes and does not set `element.style.transform` directly.

### Button `:active` scale — CTA buttons only

The `scale(0.97)` applies to `.btn`, `.btn--primary`, `.btn--cta`. Do not apply it to:
- Navigation links (`<a>` elements)
- The dark mode toggle button (`.theme-toggle`)
- Form submit button if it already has a loading state
- Accordion toggle buttons

The `:active` scale is a touch-feedback signal. Links use standard browser focus/active states. Applying scale to navigation links makes the nav feel unstable.

### Optional: smooth theme transition

If Phase 20 did not already include a 300ms theme transition on `body`, add it here:

```css
/* ADD to body rule — smooth theme color transitions */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Never add transition to :root — causes full-page jank on theme switch */
```

Scope strictly to `background-color` and `color` on `body` only. If this is included, it counts as animation type 5 on the catalogue — do not add any further animation types.

---

## Pitfalls to Avoid

**Pitfall — `transform: none` omission from reduced-motion guard (ANIM-03):** The existing reduced-motion block in styles.css only zeros animation and transition duration. Adding `transform: translateY(20px)` to `.animate-on-scroll` without also adding `transform: none` to the reduced-motion block means the element snaps from an offset position — still motion. This is the explicit requirement in ANIM-03. Check this before and after implementation.

**Pitfall — Vestibular triggers (Pitfall 7 from PITFALLS.md):** The `translateY(20px → 0)` scroll reveal is a one-shot, 400ms ease-out animation — this is within safe vestibular parameters. Do not increase the translate value. Do not make it bounce (no spring easing). Do not apply it to elements that are already visible on load (above the fold). IntersectionObserver only adds `.is-visible` when elements enter the viewport from below — this is the correct, safe pattern.

**Pitfall — Animation cognitive overload (Pitfall 8 from PITFALLS.md):** After Phase 23, count every distinct animation type on the page. If the count exceeds 5, remove or consolidate before sign-off. No looping animations should be visible when the page is at rest. Verify by loading the page and waiting 10 seconds without interaction — nothing should be moving.

**Pitfall — CSS regression:** The `.animate-on-scroll` rule modification affects every animated element across all 11 sections. After adding `transform: translateY(20px)` to the initial state, scroll through the entire page and verify every animated element appears correctly — no elements stuck in the offset position, no layout shifts.

**Pitfall — Scale applied to wrong button types:** The `.btn:active` rule should only target actual button elements that are CTAs. Check whether the selector matches navigation links or accordion triggers. If `.btn` is also used on nav items, scope the `:active` rule more precisely.

---

## Exit Criteria

Phase 23 is complete when all of the following are true:

- [ ] `.animate-on-scroll` initial state includes `transform: translateY(20px)` and `opacity: 0`
- [ ] `.animate-on-scroll.is-visible` state includes `transform: translateY(0)` and `opacity: 1`
- [ ] Scroll through the page — every scroll-reveal element slides up from 20px offset while fading in
- [ ] CTA buttons show `scale(0.97)` on press — test by clicking and holding a CTA button
- [ ] `prefers-reduced-motion` block explicitly resets `.animate-on-scroll` to `opacity: 1; transform: none`
- [ ] With OS reduced-motion preference enabled: no animations visible at all (elements appear at final position immediately)
- [ ] Total distinct animation types on page counted and verified ≤5
- [ ] No looping or continuous animations visible in the resting viewport state (wait 10 seconds without interaction)
- [ ] Stagger delay between card grid children is ≤100ms
- [ ] Button `:active` scale does not apply to navigation links or the dark mode toggle
- [ ] Form submission flow tested end-to-end in both light and dark mode
- [ ] All 11 sections visually verified at 390px and 1440px — no layout shifts from transform changes
