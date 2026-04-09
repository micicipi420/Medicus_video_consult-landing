# v4.0 Liquid Design System — Requirements

**Milestone:** v4.0
**Created:** 2026-04-09
**Requirements:** 30
**Categories:** 8 (GRID, SQUIRCLE, LIQUID, DIFF, CHROME, MIGRATE, VERIFY, DOCS)

---

## Grid (responsive 12/8/2-3)

- [ ] **GRID-01**: Все страницы используют responsive CSS grid — 12 col desktop, 8 col tablet, 2-3 col mobile — с `max-w-content: 1200px` контейнером и консистентными gutters (16/24/32px)
- [ ] **GRID-02**: Текстовые карточки занимают минимум 4 колонки на tablet breakpoint (8-col) — предотвращает overflow русских составных слов

## Squircle (superellipse shapes)

- [ ] **SQUIRCLE-01**: Все элементы с `border-radius` заменены на superellipse (squircle) shape — кнопки, карточки, инпуты, badge, nav pill, mobile menu, form container, hero-иллюстрации, avatars, flag-иконки. 4 variant scale: md/lg/xl/full
- [ ] **SQUIRCLE-02**: Chrome 139+ пользователи видят нативный `corner-shape: superellipse(2)` через `@supports` progressive enhancement; остальные получают `mask-image` SVG; без mask-image — graceful `border-radius`
- [ ] **SQUIRCLE-03**: Focus-visible кольца остаются видимыми и WCAG-compliant на squircle-элементах — `outline + outline-offset` вместо `box-shadow` (BLOCKER: must land before any squircle class applied)
- [ ] **SQUIRCLE-04**: Тени карточек/кнопок рендерятся корректно вне squircle-маски (shadow-wrap pattern: внешний wrapper несёт shadow, внутренний — mask)

## Liquid Glass (материалы и эффекты)

- [ ] **LIQUID-01**: Glass поверхности используют Regular material (`backdrop-filter: blur + saturate + brightness + tint`) с rim lighting (asymmetric inset shadow) на всех glass-элементах
- [ ] **LIQUID-02**: Dark mode показывает glass поверхности с tuned dark recipe — reverses v1.4 "glass off" решение. `rgba(30,40,60,0.45)` base, `blur 28px`, `saturate 160%`, `brightness 115%`. Dark selector audit завершён в Phase 1
- [ ] **LIQUID-03**: Primary CTA сохраняет gradient fill (green→teal) со specular edge treatment, НЕ clear glass — конверсионный affordance для ЦА 45+
- [ ] **LIQUID-04**: Secondary/tertiary кнопки используют Regular glass с `font-semibold` label, visible hover brightening, press `scale(0.97)`, icon+arrow label для affordance ЦА 45+
- [ ] **LIQUID-05**: Chrome 139+ пользователи видят refraction эффект через SVG `feTurbulence + feDisplacementMap` PE + JS probe `html[data-refract]` (~10 LOC)
- [ ] **LIQUID-06**: Print stylesheet рендерит glass поверхности как opaque с border (не серые прямоугольники)
- [ ] **LIQUID-07**: Reduced-motion пользователи видят статический glass без specular/shimmer/spring анимаций — расширяет v1.4 `@media prefers-reduced-motion` guard

## Differentiators (дистинктивные компоненты)

- [ ] **DIFF-01**: Hero primary CTA имеет shimmer sweep анимацию при hover (max 1 на viewport, только hero CTA)
- [ ] **DIFF-02**: Stats bar (index + checkup) использует grouped glass backdrop — 4 stat карты в одной liquid поверхности
- [ ] **DIFF-03**: Chrome/content overlap показывает scroll-edge fade эффект для плавного перехода

## Chrome Partials (shared chrome upgrade)

- [ ] **CHROME-01**: Все 4 chrome partials (header, footer, mobile menu, sticky bar) используют glass surfaces, squircle radii, grid-aligned `max-w-content` — 1 edit на partial = 6 pages inherit
- [ ] **CHROME-02**: Новый `partials/svg-defs.html` создан и сплайсится во все 6 страниц через build pipeline (BUILD marker + splicer line-19 update)

## Page Migration (per-page integration)

- [ ] **MIGRATE-01**: 404.html — grid wrapper + squircle CTA + liquid card surfaces
- [ ] **MIGRATE-02**: contacts.html — grid wrapper + liquid form container + squircle inputs + glass contact card
- [ ] **MIGRATE-03**: checkup.html — grid + squircle на program/stats/B2B/form cards + liquid surfaces; `whitespace-nowrap` "за 1–2 дня" preserved, nbsp bindings preserved
- [ ] **MIGRATE-04**: online-consultations.html — grid + squircle на doctor/pricing/trigger cards + liquid surfaces
- [ ] **MIGRATE-05**: treatment-abroad.html — grid + squircle на clinic/step/review cards + liquid surfaces
- [ ] **MIGRATE-06**: index.html (13 секций) — full grid + liquid + squircle treatment, включая floating hero cards + z-index map; mesh-bg blob compatibility; icon chip rotate-vs-squircle resolved

## Verification (a11y + perf audit)

- [ ] **VERIFY-01**: WCAG AA contrast (>= 4.5:1) verified manually на всех текстах over glass surfaces в light и dark mode
- [ ] **VERIFY-02**: Keyboard tab order корректен и focus-visible outline видим на всех interactive элементах across all 6 pages
- [ ] **VERIFY-03**: Budget Android scroll FPS >= 30 на реальном устройстве (Samsung Galaxy A32/A52 или Xiaomi Redmi Note 10)
- [ ] **VERIFY-04**: Reduced-motion preference отключает specular/shimmer/spring, показывает static glass — visually verified

## Documentation

- [ ] **DOCS-01**: `docs/DESIGN-SYSTEM.md` документирует shadow-wrap idiom, class inventory, token scale, anti-patterns, Russian typography rules, protected files list, scope creep guards
- [ ] **DOCS-02**: `styleguide.html` — live visual reference page со всеми design system компонентами (glass cards, squircle masks, typography scale, button variants, form elements); доказывает 7th-page invariant

---

## Future Requirements (deferred to v4.1+)

- Scroll-linked header blur progression (deferred per Architecture research — minimum-change principle)
- Tinted glass variants (green, blue glass tints in dark mode) — adds complexity beyond v4.0 scope
- `<head>` extraction to partial — rejected for v4.0 (massive BUILD:vars vocabulary cost per Architecture E.2)
- Playwright regression test suite — valid, own milestone
- View Transitions API for page navigation — static multi-page site, zero measurable benefit
- Shimmer on surfaces beyond hero CTA — scope creep guard (research says max 1 per viewport)
- styleguide.html as 7th production page with full routing — v4.0 ships it as dev reference, not production endpoint
- Budget Android graceful degradation tier (mobile blur reduction to 12px) — deferred unless Phase 8 FPS < 30

## Out of Scope

- **Clear material variant** — anti-feature: no adaptive legibility for Cyrillic over photos, fails WCAG AA on variable backgrounds (FEATURES research Section A.2)
- **Cross-browser refraction** — SVG `feDisplacementMap` in `backdrop-filter` is Chrome-only (WebKit Bug 245510); Chrome PE is in scope, universal is not
- **Chromatic aberration** — shader territory, no pure CSS implementation
- **Scroll-linked parallax** — PROJECT.md explicit out-of-scope, ЦА 45+ vestibular concern
- **Nested glass (glass inside glass)** — doubled compositor cost, z-index chaos; research anti-recommendation
- **Cursor-follow specular highlight** — JS complexity for minimal value, cognitive load for 45+
- **`will-change: backdrop-filter`** — research anti-recommendation: multiplies compositor layer cost, makes perf worse
- **`text-wrap: balance` on Cyrillic** — v3.0 locked decision: unreliable, breaks nbsp bindings
- **Copy rewrites** — copywriting locked per v2.0 (копирайтинг-документы first). Design system visual language only
- **Typography scale changes** — v1.4 h1 clamp(40→56)/800 and h2 clamp(28→44)/800 stay
- **Color palette changes** — v1.3 brand colors (green→teal CTA gradient, mint badges) preserved
- **Kazakh language toggle** — PROJECT.md explicit out-of-scope
- **Directus backend changes** — form submission API untouched; this is frontend-only milestone
- **Analytics / telemetry** — privacy implications; use manual Phase 8 measurement

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| GRID-01 | Phase 41 (tokens) + Phases 45-47 (applied) | — | Pending |
| GRID-02 | Phase 47 | — | Pending |
| SQUIRCLE-01 | Phase 42 | — | Pending |
| SQUIRCLE-02 | Phase 42 | — | Pending |
| SQUIRCLE-03 | Phase 41 | — | Pending |
| SQUIRCLE-04 | Phase 42 | — | Pending |
| LIQUID-01 | Phase 43 | — | Pending |
| LIQUID-02 | Phase 43 | — | Pending |
| LIQUID-03 | Phase 43 | — | Pending |
| LIQUID-04 | Phase 43 | — | Pending |
| LIQUID-05 | Phase 43 | — | Pending |
| LIQUID-06 | Phase 43 | — | Pending |
| LIQUID-07 | Phase 43 | — | Pending |
| DIFF-01 | Phase 43 | — | Pending |
| DIFF-02 | Phase 43 | — | Pending |
| DIFF-03 | Phase 43 | — | Pending |
| CHROME-01 | Phase 44 | — | Pending |
| CHROME-02 | Phase 44 | — | Pending |
| MIGRATE-01 | Phase 45 | — | Pending |
| MIGRATE-02 | Phase 45 | — | Pending |
| MIGRATE-03 | Phase 46 | — | Pending |
| MIGRATE-04 | Phase 46 | — | Pending |
| MIGRATE-05 | Phase 46 | — | Pending |
| MIGRATE-06 | Phase 47 | — | Pending |
| VERIFY-01 | Phase 48 | — | Pending |
| VERIFY-02 | Phase 48 | — | Pending |
| VERIFY-03 | Phase 48 | — | Pending |
| VERIFY-04 | Phase 48 | — | Pending |
| DOCS-01 | Phase 49 | — | Pending |
| DOCS-02 | Phase 49 | — | Pending |

---

## Protected Legacy (v3.0–v3.2)

These items MUST survive v4.0 migration. Per-phase gate checks enforce preservation:

1. All `&nbsp;` entities in Russian content (subject+verb bindings, orphan prevention)
2. `<br class="md:hidden">` in hero headings (Russian phrase breaking)
3. `<span class="whitespace-nowrap">за 1–2 дня</span>` in checkup.html (v3.2 COSMETIC-03)
4. Honeypot hidden inputs on all 6 forms
5. `role="alert"` + `aria-live="polite"` on 20 form error containers
6. Per-page SEO metadata — title, meta description, og tags, canonical URLs, JSON-LD (index only)
7. Favicon link set (4 `<link>` per page)
8. Vertical rhythm tokens — `--section-h-hero-*`, `--spacing-section-*` (v3.1 Phase 38)
9. WCAG AA text tokens — contrast ratios must not decrease
10. `html { overflow-x: clip }` safety net (v3.1 Phase 38.1)
11. `@media (prefers-reduced-motion: reduce)` guard — extend only, never remove
12. `scroll-margin-top: 6rem` on anchor targets
13. Byte-identity pre-commit hook — scripts/hooks/pre-commit untouched
