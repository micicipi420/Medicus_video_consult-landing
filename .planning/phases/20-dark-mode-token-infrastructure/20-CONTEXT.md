# Phase 20: Dark Mode Token Infrastructure

**Milestone:** v1.4 2025 Visual Redesign
**Phase goal:** Lay the complete CSS and JS foundation for dark mode so every component auto-updates via the token cascade. No visual change in light mode. All new dark token pairs pass contrast audit before any component receives dark styling.
**Depends on:** Phase 19 (v1.3 stable baseline)
**Status:** Pending

---

## Requirements Covered

| ID | Requirement | Notes |
|----|-------------|-------|
| DM-01 | Кнопка переключения темы в sticky-навигации — `aria-pressed`, touch-target ≥44px, видимая текстовая метка рядом с иконкой | New `<button>` in `.site-header__container`; wired in `initDarkMode()` |
| DM-02 | CSS-блок `[data-theme="dark"]` с токенами для всех цветовых пар; все пары прошли контраст-аудит WCAG AA до применения в компонентах | Token block immediately after `:root` in `css/styles.css` |
| DM-03 | Inline `<script>` в `<head>` (ES5) для чтения localStorage перед первым рендером — устраняет FOUC при переходе между сессиями | Synchronous, before `<link rel="stylesheet">`, ES5 IIFE |
| DM-04 | Тема по умолчанию — всегда светлая; `localStorage` управляет выбором; `prefers-color-scheme` — только подсказка при первом визите | Light is default when no localStorage key exists; OS preference is first-visit hint only |

---

## Files to Modify

### `index.html`

**Location: `<head>`, before `<link rel="stylesheet" href="css/styles.css">`**
Insert the FOUC-prevention inline script (ES5, synchronous):

```html
<script>
  (function() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

**Location: `<html>` opening tag**
Add `data-theme="light"` attribute:
```html
<html lang="ru" class="no-js" data-theme="light">
```

**Location: `.site-header__container`, after the `<nav>` element**
Add the dark mode toggle button:
```html
<button
  class="theme-toggle"
  aria-pressed="false"
  aria-label="Переключить тёмную тему"
  type="button"
>
  <span class="theme-toggle__icon" aria-hidden="true">☀</span>
  <span class="theme-toggle__label">Тёмная тема</span>
</button>
```

### `css/styles.css`

**Location: Section 2 (Design Tokens) — append to `:root` block**
Add glass surface tokens to the existing `:root`:
```css
/* Glass surface tokens (light mode) */
--glass-bg:             rgba(255, 255, 255, 0.65);
--glass-border:         rgba(255, 255, 255, 0.9);
--glass-blur:           blur(12px);
color-scheme:           light dark;
```

**Location: Section 2 — immediately after `:root` closing brace**
Insert the full `[data-theme="dark"]` block (~40 lines):
```css
[data-theme="dark"] {
  color-scheme: dark;

  /* Backgrounds */
  --color-white:          #0F1923;
  --color-light:          #1A2533;
  --color-dark:           #E8F4FF;

  /* Text */
  --color-text-primary:   #E0ECF8;
  --color-text-on-dark:   #18212C;
  --color-text-muted:     rgba(224, 236, 248, 0.55);

  /* Interactive */
  --color-primary:        #5FD5F9;
  --color-primary-dark:   #38C6F4;
  --color-secondary:      #3FCF88;
  --color-secondary-dark: #1AC67E;

  /* Badges */
  --color-badge-bg:       #0D3324;
  --color-badge-text:     #3FCF88;

  /* Shadows */
  --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md:  0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg:  0 4px 20px rgba(0, 0, 0, 0.5);

  /* Glass surface tokens (dark mode) */
  --glass-bg:             rgba(255, 255, 255, 0.06);
  --glass-border:         rgba(255, 255, 255, 0.12);
  --glass-blur:           blur(12px);
}

/* System preference hint — applies only when no localStorage choice has been made */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --color-white:          #0F1923;
    --color-light:          #1A2533;
    --color-dark:           #E8F4FF;
    --color-text-primary:   #E0ECF8;
    --color-text-on-dark:   #18212C;
    --color-text-muted:     rgba(224, 236, 248, 0.55);
    --color-primary:        #5FD5F9;
    --color-primary-dark:   #38C6F4;
    --color-secondary:      #3FCF88;
    --color-secondary-dark: #1AC67E;
    --color-badge-bg:       #0D3324;
    --color-badge-text:     #3FCF88;
    --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md:  0 2px 8px rgba(0, 0, 0, 0.4);
    --shadow-lg:  0 4px 20px rgba(0, 0, 0, 0.5);
    --glass-bg:   rgba(255, 255, 255, 0.06);
    --glass-border: rgba(255, 255, 255, 0.12);
  }
}
```

**Location: Wherever `.site-header` rules are in Section 7 (or whichever section contains header styles)**
Add the toggle button styling:
```css
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 44px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid var(--color-border, rgba(0,0,0,0.12));
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-text-primary);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.theme-toggle:hover {
  background: var(--color-light);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### `js/main.js`

**Location: Inside the existing IIFE, alongside the other `initXxx()` functions**
Add `initDarkMode()` function (ES5 syntax strictly):

```javascript
function initDarkMode() {
  var toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    var icon = toggle.querySelector('.theme-toggle__icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☾' : '☀';
    }
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0F1923' : '#ffffff');
    }
  }

  var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(currentTheme);

  toggle.addEventListener('click', function() {
    var next = document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'light'
      : 'dark';
    applyTheme(next);
  });
}
```

Call `initDarkMode()` inside the DOMContentLoaded handler alongside the other init calls.

---

## Key Implementation Notes

### Token architecture (do not skip)

All 1,640 existing CSS lines already reference `var(--color-*)` tokens. The `[data-theme="dark"]` block overrides the same token names — zero existing rules need modification. The cascade does the work automatically.

Never define parallel token names (`--color-white-dark`, `--color-bg-dark`). Redefine the exact same token names inside `[data-theme="dark"]`.

New v1.4 glass tokens use `--glass-*` prefix. This namespace is reserved for Phase 20-22 additions. Never use `--glass-*` for non-glass purposes.

### FOUC prevention is critical

Without the inline `<script>` in `<head>`, users who previously selected dark mode will see a white flash on every page load. The script must be:
- Synchronous (no `defer`, no `async`, no `type="module"`)
- Before the `<link rel="stylesheet">` tag
- ES5 syntax (IIFE with `var`, no arrow functions)

### Default policy — always light

When no `localStorage` key exists: default to light mode.
When `localStorage` key is `'dark'`: apply dark.
`prefers-color-scheme: dark` only activates when `localStorage` is absent (first visit hint). Once the user has made any choice, localStorage wins forever.

This is an explicit business decision: 45+ medical audience associates light interfaces with clinical credibility. Never default to dark.

### ES5 requirement

The project decision (PROJECT.md) is ES5 throughout. `initDarkMode()` must use:
- `var` (not `const`/`let`)
- `function` declarations (not arrow functions)
- String concatenation (not template literals)
- `getAttribute`/`setAttribute` (not destructuring)

### Hero illustration in dark mode

The SVG hero illustration was designed for a light background. In dark mode it will look washed out. Decision must be made during implementation:
- Option A: Apply `filter: brightness(0.85) contrast(1.1)` to the illustration in `[data-theme="dark"]`
- Option B: Accept the degraded appearance and revisit in a later patch

Document the chosen approach in this phase's plan.

---

## Pitfalls to Avoid

**Pitfall — Dark mode FOUC:** Inline script must run before any CSS renders. Test by: hard-refresh in Chrome Incognito with OS set to dark mode. The page should appear in dark mode immediately, no white flash.

**Pitfall — Dark mode WCAG contrast failures:** Every token pair in `[data-theme="dark"]` must be audited before Phase 21 begins. Target 7:1 for body text (AAA, appropriate for 45+ audience). Minimum 4.5:1 (AA) for all text. Use contrast.tools or browser DevTools accessibility panel. Grey-on-dark is the most common silent failure (e.g., `rgba(224, 236, 248, 0.55)` muted text — check this explicitly against `#0F1923` background).

**Pitfall — Trust erosion:** Never activate dark mode automatically based on OS preference alone. The `prefers-color-scheme` block must be scoped to `:root:not([data-theme="light"])` — meaning it only fires when the user has not yet made a choice. Once `localStorage` has any value, the explicit attribute wins.

**Pitfall — CSS regression:** This phase adds ~40 lines to `styles.css` and modifies `<html>` and `<head>` in `index.html`. After implementation: manually verify the form submission flow (all states), FAQ accordion, sticky header on scroll, sticky mobile bar. Screenshot all 11 sections at 390px and 1440px and compare against v1.3 baseline.

**Pitfall — Toggle inaccessibility:** The toggle button must be ≥44×44px tap target. Must have `aria-pressed` state that updates on click. Must have a visible text label ("Тёмная тема") alongside the icon — icon alone is insufficient for the 45+ audience.

---

## Exit Criteria

Phase 20 is complete when all of the following are true:

- [ ] Toggle button is present in sticky navigation, visible on both mobile and desktop
- [ ] Toggle tap target measures ≥44px in Chrome DevTools element inspector
- [ ] Toggle has visible text label alongside icon
- [ ] `aria-pressed` attribute updates correctly on each click
- [ ] Clicking the toggle switches the page between light and dark mode
- [ ] Theme persists across page reload (localStorage stores the choice)
- [ ] Hard-refresh with OS dark preference shows correct theme with no white flash (FOUC test)
- [ ] Hard-refresh with no localStorage entry shows light mode (default-light test)
- [ ] Every `[data-theme="dark"]` token pair documented and contrast-checked (minimum 4.5:1 AA; 7:1 AAA for body text)
- [ ] No visual regression in light mode — form, accordion, header, mobile bar all function identically to v1.3
- [ ] `--glass-bg`, `--glass-border`, `--glass-blur` tokens defined in both `:root` and `[data-theme="dark"]` (ready for Phase 22)
