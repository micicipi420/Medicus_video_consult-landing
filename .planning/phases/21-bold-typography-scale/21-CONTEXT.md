# Phase 21: Bold Typography Scale

**Milestone:** v1.4 2025 Visual Redesign
**Phase goal:** Increase heading visual weight to display-scale 2025 standards using Manrope Variable weight 800 and `clamp()` responsive sizing. Every headline must be readable and well-broken at 320px and 390px before this phase closes.
**Depends on:** Phase 20 (dark mode tokens exist so typography can be verified in both themes)
**Status:** Pending

---

## Requirements Covered

| ID | Requirement | Notes |
|----|-------------|-------|
| TYPO-01 | h1 → `clamp(40px, 5vw, 56px)` / font-weight 800; h2 → `clamp(28px, 3.5vw, 44px)` / font-weight 800 (Manrope Variable уже загружен) | Token changes in Section 2 of `css/styles.css`; no HTML changes needed |
| TYPO-02 | `text-wrap: balance` на всех заголовках секций; отсутствие однословных «сирот» в кириллических заголовках на 320px и 390px | CSS rule added to h1, h2, h3 selectors; exit criterion requires manual viewport verification |

---

## Files to Modify

### `css/styles.css`

**Location: Section 2 (Design Tokens) — `:root` block**
Update the existing heading font-size token values and add/update weight tokens:

```css
/* Typography scale — update existing values */
--font-size-h1:    clamp(2.5rem, 5vw, 3.5rem);    /* 40px → 56px */
--font-size-h2:    clamp(1.75rem, 3.5vw, 2.75rem); /* 28px → 44px */
--font-size-h3:    clamp(1.375rem, 2.5vw, 2rem);   /* 22px → 32px */

--font-weight-heading:  800;  /* update from 700 to 800 */
--line-height-display:  1.1;  /* new token for display-size headings */
```

**Location: Section 3 or wherever h1, h2, h3 base rules are defined**
Update heading base rules to apply the new tokens and `text-wrap: balance`:

```css
h1 {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-heading);
  line-height: var(--line-height-display);
  text-wrap: balance;
}

h2 {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-heading);
  line-height: var(--line-height-display);
  text-wrap: balance;
}

h3 {
  font-size: var(--font-size-h3);
  font-weight: 700;  /* h3 stays 700, only h1/h2 go to 800 */
  line-height: 1.2;
  text-wrap: balance;
}
```

**Location: Section 5 or wherever `.hero__title` is defined**
The hero title is the highest-impact heading. If a separate class overrides heading size, ensure it uses the new token:

```css
.hero__title {
  font-size: var(--font-size-h1);  /* already using token — confirm it's wired */
  font-weight: 800;
  line-height: var(--line-height-display, 1.1);
}
```

**No changes needed to `index.html`** — typography is token-driven; no structural HTML modifications.

**No changes needed to `js/main.js`** — typography is pure CSS.

---

## Key Implementation Notes

### Manrope Variable already supports weight 800

Manrope Variable is self-hosted as WOFF2 and loaded with the project. The variable axis includes weights 200–800. Setting `font-weight: 800` on headings requires no new font file — it is already available. Confirm this in the existing `@font-face` declaration in Section 1 of `styles.css` (look for `font-weight: 200 800` in the `@font-face` range).

### `clamp()` values are ranges, not fixed points

`clamp(40px, 5vw, 56px)` means:
- Minimum: 40px at any viewport width
- Fluid: 5vw scales between the min and max as viewport changes
- Maximum: 56px, never exceeded

The 5vw midpoint means the fluid range spans from 800px (5vw = 40px = minimum) to 1120px (5vw = 56px = maximum). Between 320px and 800px the heading stays at 40px (minimum floor). This is the right behaviour for the 45+ mobile audience.

For h2 `clamp(28px, 3.5vw, 44px)`:
- Minimum: 28px at 800px and below
- Maximum: 44px at 1257px and above

Verify these breakpoints feel right against the actual Russian copy. Adjust the midpoint percentage (`5vw`, `3.5vw`) if the transition feels abrupt between mobile and desktop.

### `text-wrap: balance` behaviour

`text-wrap: balance` (Baseline 2023, all modern browsers) redistributes line lengths to avoid single-word orphans. It works best on short headings (1–3 lines). On very long headings it may have no effect — that is expected and fine. The browser only balances if it can do so within a 2-line adjustment. For a 320px viewport, check whether the hero h1 still produces a one-word final line; if it does, the `max-width` of the heading container may need to be tightened.

### Do not use `letter-spacing` on Cyrillic

This is a critical rule from PITFALLS.md: negative `letter-spacing` (tracking reduction) is a convention for Latin display type. Cyrillic glyphs do not benefit from it and can look awkward with reduced tracking. Do not add `letter-spacing: -0.02em` or similar. Leave letter-spacing at the inherited value.

### Weight policy — no font-weight below 400 for informational text

Any text that conveys information (prices, specializations, process steps, form labels) must use font-weight ≥ 400. The bold/light contrast system (e.g., 800-weight headline + 300-weight descriptor) is explicitly rejected for this project. The pricing display (`от 450 EUR`) must be checked at whatever weight it currently uses — if it is 300, change to 400.

### Dark mode verification

After applying new heading sizes, verify headings in dark mode using the Phase 20 toggle. The dark mode heading color is `--color-text-primary: #E0ECF8` on `--color-white: #0F1923`. At 56px/800w, check the contrast ratio — it should be approximately 12:1 (well above AAA). Also verify no heading uses a color (teal, green) that was not checked in dark mode.

---

## Pitfalls to Avoid

**Pitfall — Mobile typography orphan lines (Pitfall 7 from PITFALLS.md):** The exit criterion requires viewing every headline at 320px and 390px in the browser. Do not accept the design based on desktop review. Specifically check the hero h1, the first h2 in the "Знакомо?" section, and the pricing card heading — these are most likely to produce single-word final lines on narrow screens.

**Pitfall — `clamp()` minimum too large on narrow screens:** If the minimum is set to 48px, a 375px viewport gets 48px headings. At that width, a Russian headline of 5–7 words will force 4–5 line breaks. Set h1 minimum to 40px, h2 minimum to 28px. These are the values in REQUIREMENTS.md and are derived from testing norms in FEATURES.md.

**Pitfall — Bold typography drops contrast for thin weight text (Pitfall 6 from PITFALLS.md):** Increasing heading weight to 800 does not change existing body text weight. However, verify that no supporting text (section subheadings, card descriptors) uses weight 300 or lower. The `--font-weight-heading` token change only affects elements using that token. Check for any `font-weight: 300` or `font-weight: lighter` in existing rules.

**Pitfall — CSS regression:** This phase modifies token values used across all 11 sections. After implementation, verify the sticky mobile bar text is not larger (it should use a separate size token, not h1/h2), form labels are not larger, and FAQ accordion items are not affected.

---

## Exit Criteria

Phase 21 is complete when all of the following are true:

- [ ] h1 renders at `clamp(40px, 5vw, 56px)` — verify by resizing browser window from 320px to 1440px
- [ ] h2 renders at `clamp(28px, 3.5vw, 44px)` — same viewport range check
- [ ] All headings use font-weight 800 (h1, h2); h3 uses 700
- [ ] `text-wrap: balance` applied to all h1, h2, h3 elements
- [ ] Every Russian headline reviewed at 320px and 390px — no single-word orphan lines
- [ ] No font-weight below 400 used on any informational text (prices, labels, descriptions)
- [ ] Heading contrast verified in both light mode and dark mode (against Phase 20 tokens)
- [ ] Sticky mobile bar, form labels, and FAQ accordion are visually unaffected
- [ ] No letter-spacing added to any Cyrillic heading
- [ ] Form submission flow tested end-to-end (typography change should not affect form behavior)
