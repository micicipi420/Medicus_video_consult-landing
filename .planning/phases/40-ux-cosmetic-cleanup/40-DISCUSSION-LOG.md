# Phase 40: UX Cosmetic Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 40-ux-cosmetic-cleanup
**Areas discussed:** 404 H1 sizing (COSMETIC-01), Favicon source/design (COSMETIC-02), Checkup H1 range binding (COSMETIC-03), Verification strategy

---

## Gray Area Selection

**Question:** Какие gray areas обсудить для Phase 40?

| Option | Description | Selected |
|--------|-------------|----------|
| 404 H1 sizing strategy (COSMETIC-01) | How to fit "Страница не найдена" in 320px — step-down, clamp(), or allow wrap | ✓ |
| Favicon source/design (COSMETIC-02) | Scope (minimal vs full set) + visual design source | ✓ |
| Checkup H1 range binding (COSMETIC-03) | Technique to bind "1–2" — whitespace-nowrap, non-breaking hyphen, word joiner | ✓ |
| Verification стратегия | Playwright MCP, curl only, permanent test suite, or CSS regression | ✓ |

**User's choice:** All 4 areas.

---

## Area 1: 404 H1 Sizing Strategy

**Scout findings before question:**
- `404.html:110` uses `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` — base 36px
- Phrase "Страница&nbsp;не&nbsp;найдена" is already nbsp-bound, can't wrap
- On 320px, the bound phrase at 36px ≈ 345px, overflows ~25px
- Text-3xl (30px) ≈ 288px — fits within container (viewport minus 32px padding = 288px)

**Question:** Какой step-function для 404 H1?

| Option | Description | Selected |
|--------|-------------|----------|
| `text-3xl sm:text-5xl md:text-6xl lg:text-7xl` | One mobile step down, sm:+ unchanged | ✓ |
| `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` | All breakpoints shifted down one step | |
| `text-[clamp(1.875rem,8vw,4.5rem)]` | Fluid typography via clamp() | |
| Allow wrap (remove nbsp) | Drop nbsp, let phrase wrap | |

**User's choice:** `text-3xl sm:text-5xl md:text-6xl lg:text-7xl` (Recommended)
**Notes:** Minimal surface area of change, matches the step-function pattern used everywhere on the site. nbsp binding preserved per user's subject+verb typography rule.

---

## Area 2: Favicon Source/Design

### Sub-question 2a: Scope

**Scout findings before question:**
- Zero `<link rel="icon">` tags in any of 6 HTML pages
- Zero favicon file in repo root
- No brand logo image in img/ — "MedicusUnion" in header is CSS gradient text
- Schema.org JSON-LD on index.html references external production URL only

**Question:** Какой scope для favicon'а?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal — только favicon.ico в корне | Single file, browser auto-request, zero HTML changes | |
| Минимум + favicon.svg | ico + svg + 1 link tag per page | |
| Полный набор (favicon.ico + svg + apple-touch + manifest) | 4 files + 4 link tags per page, PWA-ready | ✓ |

**User's choice:** Полный набор (favicon.ico + svg + apple-touch + manifest)
**Notes:** Full modern icon set. Adds infrastructure for future PWA work if ever needed.

### Sub-question 2b: Visual Source

**Scout findings after first answer:** Queried medicusunion.kz production to check existing assets.

**Question:** Что на favicon'e?

| Option | Description | Selected |
|--------|-------------|----------|
| Монограмма "M" в брендовом градиенте | Hand-designed SVG of letter M in gradient, matches header exactly | |
| Медицинский крест (plus) в градиенте | Generic medical symbol | |
| Я выдам свой asset | User provides existing file | |
| Стянуть с production medicusunion.kz | Pull current production favicon | ✓ |

**User's choice:** Стянуть с production medicusunion.kz
**Notes:** Wants brand consistency with parent site. Triggered a production asset check.

### Sub-question 2c: Conflict Resolution (production has only 1 PNG, user wants full set)

**Scout findings:**
- `medicusunion.kz/favicon.ico` → HTTP 200, content-type `image/png` (PNG renamed to .ico)
- `/favicon.svg` → 404, `/apple-touch-icon.png` → 404
- Actual link tag: `<link rel="shortcut icon" href="https://static.tildacdn.pro/tild6561-3034-4438-a235-376335643538/__2025-10-29_102930-.png">` — single PNG on Tilda CDN
- No SVG, no apple-touch, no manifest on production

**Question:** Как разрешаем конфликт: production даёт 1 PNG, а ты хочешь полный набор?

| Option | Description | Selected |
|--------|-------------|----------|
| Скачать PNG, сгенерировать производные | PNG → ico (multi-size) + apple-touch (180×180) + manifest; skip SVG | |
| Scope back to minimal | Just PNG renamed to favicon.ico, drop the full-set commitment | |
| Скачать PNG + нарисовать SVG вручную | PNG for raster variants, hand-drawn SVG in brand gradient | ✓ |

**User's choice:** Скачать PNG + нарисовать SVG вручную
**Notes:** Keeps full set commitment AND brand consistency. Accepts that SVG is a separate deliverable that visually matches production PNG but uses the brand gradient cleanly for vector rendering.

---

## Area 3: Checkup H1 Range Binding

**Scout findings before question:**
- `checkup.html:138`: `<span class="text-mu-text-900"> &mdash; за&nbsp;1&ndash;2&nbsp;дня</span>`
- Entity-level nbsp binds "за"+"1" and "2"+"дня", but `&ndash;` is breakable
- Some viewports break between "1–" and "2 дня"
- User memories strongly favor nbsp binding for Russian typography

**Question:** Какой техникой связать "1–2" чтобы диапазон не ломался?

| Option | Description | Selected |
|--------|-------------|----------|
| Tailwind `whitespace-nowrap` на всё "за 1–2 дня" | One CSS span, remove entity nbsp, en-dash preserved | ✓ |
| `whitespace-nowrap` только на "1–2" | Narrower scope, hybrid entity + CSS | |
| Заменить `&ndash;` на non-breaking hyphen `&#8209;` | Downgrades typography from en-dash to hyphen | |
| Word joiner `&#8288;` вокруг ndash | Invisible char solution | |

**User's choice:** Tailwind `whitespace-nowrap` на всё "за 1–2 дня"
**Notes:** Cleanest — one CSS control replaces multiple scattered nbsps. En-dash preserved as the correct Russian typographic symbol.

---

## Area 4: Verification Strategy

**Scout findings before question:**
- Playwright MCP browser tools available (`mcp__playwright__*`)
- No existing tests/ directory or test runner in repo
- `.playwright-mcp/` already gitignored
- Phase 38.1 found these 3 items originally via Playwright UX audit

**Question:** Какой verification план для 3 фиксов?

| Option | Description | Selected |
|--------|-------------|----------|
| Playwright MCP ad-hoc скрипт + curl | Use MCP tools during verify step, results in SUMMARY/VERIFICATION, nothing committed | ✓ |
| Только curl + manual visual check | Low-fi, user manually verifies, VERIFICATION.md as human_needed | |
| Playwright как скрипт + коммит в репо | Permanent Playwright test file (violates no-Node-runtime constraint or adds dev dep) | |
| CSS regression test через `documentElement.scrollWidth` | Runtime self-diagnostic in main.js with console warnings | |

**User's choice:** Playwright MCP ad-hoc скрипт + curl
**Notes:** Reuses existing MCP machinery. No permanent test files. Verifier runs checks inline during verify_phase_goal step.

---

## Claude's Discretion

Areas where the planner has latitude (documented in CONTEXT.md):
- Plan granularity (1 combined plan vs 3 separate plans — recommendation is 3 small plans)
- Favicon file locations (root vs `/icons/` subdirectory)
- apple-touch-icon padding / background handling (if source PNG isn't square)
- site.webmanifest fields beyond the minimum required set
- Tool choice for PNG → ICO conversion (ImageMagick, sharp-cli, online generator)

## Deferred Ideas

- Head-element partial extraction — not in v3.2 scope, justify with future per-page `<head>` variation
- PWA install prompt + offline caching — out of scope, own phase if ever prioritized
- Permanent Playwright test suite — out of scope, separate infrastructure phase
- Stale `phase32-regressions.md` debug session cleanup — separate `/gsd-debug` track
