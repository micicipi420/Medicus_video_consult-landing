# Phase 22: Glassmorphism

**Milestone:** v1.4 2025 Visual Redesign
**Phase goal:** Apply selective glassmorphism to exactly two focal components (sticky header in scrolled state + pricing card) after establishing the gradient backgrounds those glass elements require. Maximum 2 glass elements visible simultaneously in any viewport. Android performance verified at 4x CPU throttle before sign-off.
**Depends on:** Phase 20 (glass tokens defined, dark mode available for testing glass in dark context) and Phase 21 (hero layout finalized at bold type sizes before gradient proportions are designed)
**Status:** Pending

---

## Requirements Covered

| ID | Requirement | Notes |
|----|-------------|-------|
| GLASS-01 | CSS gradient mesh фон в секции hero | Pure CSS `radial-gradient` on `.hero` — no image files; provides visual depth behind glass elements |
| GLASS-02 | Glassmorphism на `.site-header.is-scrolled` — `backdrop-filter: blur(8-12px) saturate(180%)`, минимальная opacity фона 0.75 | Modifies existing `.site-header.is-scrolled` rule |
| GLASS-03 | Glassmorphism на pricing-карточке — CSS-модификатор `.card--glass`; не более 2 стеклянных элементов на viewport | Modifier class; requires gradient background on `.pricing` section first |
| GLASS-04 | Fallback через `@supports not (backdrop-filter: blur(1px))` — сплошной цвет; тест прокрутки при 4x CPU throttle ≥50fps перед сдачей фазы | Fallback blocks in both header and card rules; DevTools throttle test is mandatory exit criterion |

---

## Files to Modify

### `css/styles.css`

**Location: Section 7 (Sections) — `.hero` rule**
Add gradient mesh background (GLASS-01):

```css
.hero {
  /* Append to existing rule — do not replace existing properties */
  background:
    radial-gradient(ellipse at 20% 50%, rgba(56, 198, 244, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(26, 198, 126, 0.07) 0%, transparent 55%),
    radial-gradient(ellipse at 60% 80%, rgba(13, 157, 181, 0.06) 0%, transparent 50%),
    var(--color-white);
}

[data-theme="dark"] .hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(56, 198, 244, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(26, 198, 126, 0.10) 0%, transparent 55%),
    radial-gradient(ellipse at 60% 80%, rgba(13, 157, 181, 0.09) 0%, transparent 50%),
    var(--color-white);
}
```

**Location: Section 7 — `.site-header.is-scrolled` rule**
Replace the existing box-shadow-only scrolled state with glass (GLASS-02):

```css
.site-header.is-scrolled {
  background: var(--glass-bg);
  -webkit-backdrop-filter: var(--glass-blur) saturate(180%);
  backdrop-filter: var(--glass-blur) saturate(180%);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: none;  /* remove old shadow */
}

/* Fallback: solid header for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .site-header.is-scrolled {
    background: var(--color-white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

/* Disable glass in dark mode — glass over dark backgrounds renders poorly */
[data-theme="dark"] .site-header.is-scrolled {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  background: var(--color-white);  /* --color-white is #0F1923 in dark mode */
  border-bottom: 1px solid var(--glass-border);
}
```

**Location: Section 7 — `.pricing` section rule**
Add gradient background to create visual depth for the glass card (GLASS-03 prerequisite):

```css
/* Append to existing .pricing rule */
.pricing {
  background: linear-gradient(135deg,
    #f0f9ff 0%,
    #e0f2fe 50%,
    #f0fdf4 100%
  );
}

[data-theme="dark"] .pricing {
  background: linear-gradient(135deg,
    #0c1a2e 0%,
    #0f2137 50%,
    #0c1f18 100%
  );
}
```

**Location: Section 6 (Components) — after `.card` base rule**
Add the `.card--glass` modifier (GLASS-03). Never modify the base `.card` rule:

```css
.card--glass {
  background: var(--glass-bg);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .card--glass {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.4);
  }
}

/* Disable glass in dark mode */
[data-theme="dark"] .card--glass {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  background: rgba(30, 44, 58, 0.95);  /* opaque dark surface */
  border: 1px solid var(--glass-border);
}
```

### `index.html`

**Location: The pricing card element inside `.pricing` section**
Add the `.card--glass` modifier class to exactly ONE pricing card. Do not add it to benefits cards, doctors cards, or advantages cards:

```html
<!-- Find the pricing card, add card--glass class -->
<div class="pricing__card card card--glass">
```

**No changes needed to `js/main.js`** — glassmorphism is pure CSS. The `.is-scrolled` JS logic already exists and adds the class on scroll.

---

## Key Implementation Notes

### Glass requires background content to blur through

Glass only creates visual depth when there is something visually interesting behind the element to blur. This is why:
1. The hero gradient mesh (GLASS-01) must be implemented before glass is applied to any hero-area element
2. The pricing section gradient must be added before `.card--glass` is applied to the pricing card
3. The header glass works because page content scrolls behind it — no preparation needed

Never apply `.card--glass` to cards that sit on a plain white/light flat background. The FAQ section, benefits section, and process steps section have flat backgrounds — do not glass their cards.

### Strict maximum: 2 glass elements per viewport

The performance constraint for mid-range Android (Samsung Galaxy A-series, Xiaomi Redmi — dominant KZ market) is 1–2 simultaneously visible `backdrop-filter` elements. With 2 glass elements (header + pricing card), the pricing card will only be visible when the user has scrolled to the pricing section — at which point the glass header is also visible. This is the worst case: 2 simultaneous glass compositing layers.

If the pricing section is far enough down the page that both are simultaneously visible during scroll, this is acceptable. If a third glass element is ever considered (form wrapper, etc.), the 4x CPU throttle test must be re-run.

### `--glass-*` tokens — never hardcode values

All glass CSS must reference the tokens defined in Phase 20. Do not hardcode `rgba(255, 255, 255, 0.65)` directly. The tokens have different values in light and dark mode — hardcoding breaks dark mode.

Correct:
```css
background: var(--glass-bg);
```

Incorrect:
```css
background: rgba(255, 255, 255, 0.65);
```

### Dark mode disables glass

In dark mode, glass over dark backgrounds creates a murky, low-contrast smear. The `[data-theme="dark"]` rules above disable `backdrop-filter` and replace with an opaque dark surface. This is the correct pattern — not a fallback but a deliberate dark-mode alternative.

### `-webkit-backdrop-filter` prefix is required

Add both the prefixed and unprefixed declarations for Safari compatibility. Always list `-webkit-backdrop-filter` first:

```css
-webkit-backdrop-filter: var(--glass-blur);
backdrop-filter: var(--glass-blur);
```

### Contrast floor — minimum 75% opacity background on glass elements

The most critical pitfall: glass cards sit over dynamically shifting blurred backgrounds. The blur averages whatever is behind the card. If a dark section scrolls behind a light glass card, the effective background darkens unpredictably.

Prevention: `--glass-bg` is defined as `rgba(255, 255, 255, 0.65)` in light mode (65% opacity). This is a minimum floor — do not lower the opacity. If contrast testing reveals issues, increase toward 0.75–0.85. The REQUIREMENTS.md spec explicitly states "минимальная opacity фона 0.75" for the header — apply this 75% floor to both glass elements:

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.75);  /* not 0.65 — use 0.75 per requirement */
}
```

### Hero gradient opacity balance

The gradient mesh opacity values (0.06–0.12 in the example above) are starting points. The goal is a barely perceptible visual depth — the page should feel "airy" not "colourful". If the gradients are too visible, they read as a design element competing with the hero content. Adjust the opacity values during implementation. At 0.06–0.08, the effect is subtle on most screens. On OLED screens (more saturated), it may appear more pronounced.

---

## Pitfalls to Avoid

**Pitfall — Glass contrast failure (Pitfall 1 from PITFALLS.md):** Test text contrast on the pricing card against the worst-case background — the darkest gradient midpoint of the `.pricing` section gradient. Do not test only against the hero background. The card will also be visible on a gradient that has deeper tones at 50% of its range. Use a contrast checker tool with the actual background color at the card's position.

**Pitfall — Android performance failure (Pitfall 2 from PITFALLS.md):** The mandatory exit criterion is a Chrome DevTools scroll test with CPU set to 4x throttle. Steps: DevTools → Performance → CPU: 4x slowdown → scroll through the page slowly while both glass elements are visible. Frame rate must remain above 50fps. If it drops below 50fps: first reduce blur from 12px to 8px in `--glass-blur`. If still failing: remove `.card--glass` from the pricing card and keep only the header glass.

**Pitfall — Glass applied to elements with no background content (ARCHITECTURE.md Anti-Pattern 2):** Before adding `.card--glass` to any element, confirm there is a gradient or image behind it. The FAQ section cards sit on `--color-white` (white) — adding glass there would create a "dirty semi-transparent rectangle."

**Pitfall — CSS regression:** After Phase 20 and 21 are stable, this phase modifies existing `.site-header.is-scrolled` (removing `box-shadow`). Verify the header still looks correct without the shadow in light mode, and that the glass effect is visible by scrolling to page section 2 or below. Also verify the pricing card base `.card` class is not modified — only the modifier `.card--glass` is added.

**Pitfall — Form submission after CSS changes:** After adding glass styles, test the full form submission flow: open the form, fill all fields, submit. The glass modifier must not interfere with the form wrapper, input styling, or the lead-form section background.

---

## Exit Criteria

Phase 22 is complete when all of the following are true:

- [ ] Hero section has visible CSS gradient mesh background (subtle depth, not overpowering)
- [ ] `.site-header.is-scrolled` shows glass effect when scrolled past the hero — frosted, not solid white
- [ ] Pricing card has `.card--glass` modifier applied — glass effect visible over the pricing section gradient
- [ ] Total glass elements visible simultaneously in any scroll position: 2 maximum (header + pricing card)
- [ ] `@supports not (backdrop-filter: blur(1px))` fallback present for both header and card — shows solid color on browsers without support
- [ ] Glass effect is disabled in dark mode (`backdrop-filter: none`, opaque surface shown instead)
- [ ] Chrome DevTools 4x CPU throttle scroll test: FPS stays above 50fps with both glass elements visible
- [ ] Text contrast on pricing card checked against worst-case background (darkest gradient point) — minimum 4.5:1
- [ ] Glass background opacity is ≥0.75 on header, ≥0.65 on pricing card (per REQUIREMENTS.md minimum)
- [ ] No `.card--glass` class on benefits, doctors, advantages, process, or FAQ cards
- [ ] Form submission flow tested end-to-end — no regressions
- [ ] All 11 sections visually verified at 390px and 1440px
