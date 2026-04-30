---
phase: 92-glass-rework-chrome-index-sections
plan: 03
subsystem: chrome-glass-sweep
tags: [glass, chrome, tokens, v9.0, tier-0, tier-3, mobile-perf, accessibility]
type: execute
wave: 2
requires:
  - 92-01 (token contract --glass-section-fill / --glass-section-blur / --glass-button-fill / --glass-button-blur)
  - 92-02 (CTA opaque-forever invariant baseline)
provides:
  - Tier 0 chrome surfaces (HeaderClient default+scrolled, MobileMenu burger+drawer, StickyBar wrapper, Footer outer card)
  - Tier 3 inner Footer contact icon chips (phone + mail)
  - Mobile blur ≤12px on every chrome surface (clamp via tokens)
  - Anti-pattern #6 retired on HeaderClient (backdrop-filter dropped from transition list)
affects:
  - All routes (chrome is global)
tech-stack:
  added: []
  patterns:
    - Tailwind arbitrary-value class consumption: bg-[var(--glass-section-fill)] / backdrop-blur-[var(--glass-section-blur)]
    - Tier-token tier-3 inner: bg-[var(--glass-button-fill)] / backdrop-blur-[var(--glass-button-blur)]
key-files:
  created: []
  modified:
    - next/src/components/layout/HeaderClient.tsx
    - next/src/components/layout/MobileMenu.tsx
    - next/src/components/layout/StickyBar.tsx
    - next/src/components/layout/Footer.tsx
decisions:
  - Header.tsx (legacy, RENDERED via app/layout.tsx) carries no glass classes — the chrome glass surface is delegated entirely to HeaderClient.tsx; therefore Header.tsx required no migration despite being IN-SCOPE per 92-02-AUDIT Section 3
  - Anti-pattern #6 (animated backdrop-filter) retired by dropping background-color and backdrop-filter from HeaderClient's transition-[…] list; default+scrolled now share fill/blur tokens, so only saturate (150%/180%) and padding (py-5/py-3) actually transition
  - MobileMenu hover:bg-white/45 nav-link backgrounds left as-is (sanctioned by PATTERNS.md — interactive hover on transparent strips, not glass-tier surfaces); divider bg-white/40 left as-is (decorative line)
  - Footer cosmetic border-white/60 borders kept (not glass-tier surfaces) on outer card + 2 inner chips
  - MobileMenu overlay bg-mu-text-900/35 backdrop-blur-sm left untouched (sanctioned anti-pattern #13 exception 2 — dark dimmer, not glass-tier)
metrics:
  duration: ~12 minutes
  completed: 2026-04-30
---

# Phase 92 Plan 03: Wave 2 Chrome Glass Sweep — Summary

**One-liner:** Migrated 4 always-visible chrome components (HeaderClient, MobileMenu, StickyBar, Footer) from raw Tailwind opacity/blur literals to v9.0 tier-tokens (`--glass-section-fill/-blur`, `--glass-button-fill/-blur`), retiring HeaderClient's animated-backdrop anti-pattern and capping mobile blur at 12px on every chrome surface — while preserving every CTA gradient verbatim, the HIG 44pt mobile tap target, and the ESC dismissal handler.

## Objective vs. Outcome

| Goal | Outcome |
|------|---------|
| HeaderClient (default + scrolled) → Tier 0 tokens | ✅ Both states consume `--glass-section-fill` / `--glass-section-blur`; only `backdrop-saturate` (150%↔180%) and padding (py-5↔py-3) differ between states |
| MobileMenu burger + drawer → Tier 0 tokens | ✅ Burger (line 38) + drawer (line 52) both swept; HIG 44pt (`h-11 w-11`) preserved; ESC handler preserved; CTA at line 94 untouched |
| StickyBar wrapper → Tier 0 tokens | ✅ Line 44 swept; CTA at line 58 untouched |
| Footer outer card → Tier 0; inner chips → Tier 3 | ✅ Line 18 outer Tier 0; lines 89, 100 phone+mail chips Tier 3 |
| Mobile blur ≤12px on every chrome surface | ✅ Token clamps enforce ceiling (no hardcoded `[40px]/[60px]/[80px]/3xl/2xl/xl` survives in chrome files) |
| `pnpm build` clean | ✅ Build exits 0; only pre-existing `blob-engine/index.ts:85` ESLint warning (out-of-scope) |

## Tasks Executed

### Task 1: HeaderClient.tsx — `6b1500c`

**Per PATTERNS.md §Plan 92-02 → HeaderClient table.**

- Line 17 (default): `bg-white/30 backdrop-blur-[40px]` → `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]`
- Line 19 (scrolled, inside `cn()`): `bg-white/50 backdrop-blur-[60px]` → `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]`
- Line 12 (transition list): dropped `background-color` and `backdrop-filter` (anti-pattern #6 retirement, T-92-03-05 mitigated). Final: `transition-[padding,box-shadow]`
- `backdrop-saturate-[150%]` (default) and `backdrop-saturate-[180%]` (scrolled) preserved — these are the only properties that actually animate between scroll states now
- `border-[0.5px] border-white/50`, `shadow-glass-header`, `fixed top-0 z-50` all preserved verbatim

**Acceptance grep results:**
- `bg-white/30|50` count: 0 ✓
- `bg-[var(--glass-section-fill)]` count: 2 ✓ (default + scrolled)
- `backdrop-blur-[var(--glass-section-blur)]` count: 2 ✓
- `backdrop-blur-[40px]|[60px]` count: 0 ✓
- `transition-[…backdrop-filter…]` count: 0 ✓
- `shadow-glass-header` count: 1 ✓

### Task 2: MobileMenu.tsx — `bfe5e02`

**Per PATTERNS.md §Plan 92-02 → MobileMenu table; CTA invariant per 92-02-AUDIT Section 1 #2.**

- Line 38 (burger button): `bg-white/55 ... backdrop-blur-xl` → `bg-[var(--glass-section-fill)] ... backdrop-blur-[var(--glass-section-blur)]`. **`h-11 w-11` preserved** (HIG 44pt — REQ GLASS-01, T-92-03-03)
- Line 47 (overlay backdrop `bg-mu-text-900/35 backdrop-blur-sm`): NO CHANGE (dark dimmer — sanctioned anti-pattern #13 exception 2)
- Line 52 (drawer nav panel): `bg-white/68 ... backdrop-blur-[80px]` → `bg-[var(--glass-section-fill)] ... backdrop-blur-[var(--glass-section-blur)]`
- Lines 60, 69, 82 (`hover:bg-white/45`): NO CHANGE (sanctioned hover interactives per PATTERNS.md)
- Line 77 (divider `bg-white/40`): NO CHANGE (decorative line)
- Line 94 (CTA `from-mu-blue to-mu-accent-blue`): NO CHANGE (Archetype J — opaque-forever, T-92-03-02 mitigated; verbatim preservation per 92-02-AUDIT baseline #2)
- ESC keydown handler at lines 12–29: preserved (T-92-03-04 mitigated)
- `aria-modal`, `aria-labelledby`, `role="dialog"`: preserved

**Acceptance grep results:**
- `bg-white/55|68` count: 0 ✓ (background fills migrated; `border-white/55` borders are cosmetic and untouched)
- `backdrop-blur-[80px]|xl` count: 0 ✓
- `bg-[var(--glass-section-fill)]` count: 2 ✓ (burger + drawer)
- `backdrop-blur-[var(--glass-section-blur)]` count: 2 ✓
- `h-11 w-11` count: 1 ✓ (HIG 44pt preserved)
- `from-mu-blue to-mu-accent-blue` count: 1 ✓ (CTA preserved)
- CTA + backdrop pairing: 0 ✓ (opaque-forever holds)
- ESC handler grep (`Escape|keydown`) count: 3 ✓ (handler + listener register + listener unregister)
- `bg-mu-text-900/35` count: 1 ✓ (overlay dimmer preserved)

### Task 3: StickyBar.tsx + Footer.tsx — `2d4b52a`

**Per PATTERNS.md §Plan 92-02 → StickyBar + Footer tables; CTA invariant per 92-02-AUDIT Section 1 #3.**

**StickyBar.tsx:**
- Line 44 (wrapper): `bg-white/68 ... backdrop-blur-3xl` → `bg-[var(--glass-section-fill)] ... backdrop-blur-[var(--glass-section-blur)]`
- Line 58 (CTA): NO CHANGE (Archetype J — opaque-forever)

**Footer.tsx:**
- Line 18 (outer card): `bg-white/60 backdrop-blur-3xl` → `bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)]` (Tier 0)
- Line 89 (phone icon chip): `bg-white/60 backdrop-blur-md` → `bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)]` (Tier 3 inner)
- Line 100 (mail icon chip): same Tier 3 pattern as phone chip
- All `border-white/60` (3 occurrences across outer card + 2 chips): preserved as cosmetic borders
- `shadow-glass-lg` (outer) + `shadow-glass-inner-strong` × 2 (chips): preserved (token shadows)

**Acceptance grep results:**
- StickyBar `bg-white/68` count: 0 ✓
- StickyBar `bg-[var(--glass-section-fill)]` count: 1 ✓
- StickyBar `backdrop-blur-3xl` count: 0 ✓
- StickyBar `backdrop-blur-[var(--glass-section-blur)]` count: 1 ✓
- StickyBar CTA + backdrop pairing: 0 ✓
- Footer `bg-white/60` count: 0 ✓ (background fills migrated; `border-white/60` cosmetic borders untouched)
- Footer `bg-[var(--glass-section-fill)]` count: 1 ✓ (outer)
- Footer `bg-[var(--glass-button-fill)]` count: 2 ✓ (phone + mail chips)
- Footer `backdrop-blur-3xl|md` count: 0 ✓
- Footer shadow tokens count: 3 ✓ (1 outer + 2 inner chips)
- Footer `&nbsp;` count: 5 ✓ (Russian binding preserved — subject+verb + orphan prevention)
- HeaderClient/MobileMenu/StickyBar `&nbsp;` counts: 0 each ✓ (unchanged from baseline)

## Cross-Cutting Verification

**CTA invariant negative grep** (per 92-02-AUDIT Section 2):

```bash
grep -rn 'backdrop-filter\|backdrop-blur' \
  next/src/components/layout/{HeaderClient,Header,MobileMenu,StickyBar,Footer}.tsx \
  | grep -E 'gradient-to-r|from-mu-blue|from-mu-cta'
```

**Result:** ZERO MATCHES ✅ — opaque-forever invariant holds across all chrome files post-sweep.

**Hardcoded large blur scan** across all 4 modified files:

```bash
grep -nE 'backdrop-blur-\[[0-9]+px\]|backdrop-blur-3xl|backdrop-blur-2xl|backdrop-blur-xl' \
  next/src/components/layout/{HeaderClient,MobileMenu,StickyBar,Footer}.tsx
```

**Result:** ZERO MATCHES ✅ — every chrome surface now consumes a clamp-tokenized blur (mobile ≤12px guaranteed).

**`pnpm --dir next build`:** Exits 0; clean build; only the pre-existing `src/lib/blob-engine/index.ts:85` `Unused eslint-disable` warning (out of scope — Phase 91 territory).

## Header.tsx (Legacy) Handling

Per 92-02-AUDIT Section 3, Header.tsx is RENDERED via `next/src/app/layout.tsx:5`. Per the parallel-execution context note, it must be included if it carries glass styles requiring migration.

**Verification grep on Header.tsx:**
```bash
grep -nE 'bg-white/|backdrop-blur' next/src/components/layout/Header.tsx
```

**Result:** No matches.

**Conclusion:** Header.tsx contains zero glass-surface classes. Its visual responsibility is layout (flex grid for wordmark / nav / phone / CTA / MobileMenu) plus the CTA gradient at line 53 and the wordmark `bg-clip-text` gradient at line 14 (both gradients-on-text/buttons, not glass surfaces — and both verbatim per 92-02-AUDIT Section 1 #6 and #7). The chrome glass surface is delegated entirely to `HeaderClient.tsx` (which wraps `Header`'s children with the sticky/scrolled glass shell). Therefore Header.tsx required NO modification under Plan 92-03.

This delegation is by design (composition pattern: server component `Header.tsx` for layout/data; client component `HeaderClient.tsx` for scroll-state glass) and is not flagged as a follow-up.

## Threat Register Disposition

| Threat ID | Disposition | Evidence |
|-----------|-------------|----------|
| T-92-03-01 (mobile blur >12px battery/scroll DoS) | mitigated | All 4 files consume `--glass-section-blur` / `--glass-button-blur` (clamp ceiling 12px on mobile); zero hardcoded large blurs survive |
| T-92-03-02 (CTA disappear-into-blob regression) | mitigated | Cross-cutting negative-grep returns 0 matches; CTA className strings at MobileMenu:94 and StickyBar:58 are byte-identical to 92-02-AUDIT baseline |
| T-92-03-03 (HIG 44pt tap target lost) | mitigated | `h-11 w-11` grep on MobileMenu = 1 (preserved on burger button) |
| T-92-03-04 (ESC dismissal handler removed) | mitigated | `Escape|keydown` grep on MobileMenu = 3 (handler + register + unregister) |
| T-92-03-05 (animated backdrop-filter compositing cost) | mitigated | HeaderClient transition list reduced to `[padding,box-shadow]`; backdrop-filter and background-color removed |

## Deviations from Plan

None — plan executed exactly as written.

The audit baseline noted that Header.tsx is RENDERED and must be considered in chrome scope; investigation confirmed it has no glass surfaces requiring migration (all chrome glass lives in `HeaderClient.tsx`, which Plan 92-03 explicitly modifies). Documented in "Header.tsx (Legacy) Handling" section above and in the Decisions frontmatter; this is a clarification, not a deviation.

## Requirements Marked Complete

- **GLASS-01** — HIG 44pt tap target preserved on MobileMenu burger; mobile blur ≤12px enforced via tokens on every chrome surface
- **GLASS-09** — All chrome surfaces consume v9.0 tier tokens (--glass-section-* / --glass-button-*); zero raw `bg-white/*` or hardcoded blur literals remain on glass-tier surfaces

## Commits

| Hash | Type | Task |
|------|------|------|
| 6b1500c | feat(92-03) | Task 1 — HeaderClient.tsx Tier 0 sweep + anti-pattern #6 retirement |
| bfe5e02 | feat(92-03) | Task 2 — MobileMenu.tsx burger + drawer Tier 0 sweep |
| 2d4b52a | feat(92-03) | Task 3 — StickyBar.tsx Tier 0 + Footer.tsx Tier 0 outer / Tier 3 inner chips |

## Manual Verification (Deferred to Phase 91 / Wave 4)

Plan §<verification> items 3–5 require manual DevTools recipes that depend on Phase 91 (`window.__blobDebug.setMode?.('static')`) and on running mobile dev server. These are documented for the orchestrator's wave-4 cross-section verification (Plan 92-07):

1. DevTools Recipe 1 (chrome legibility at heat=0): force `static` blob; assert Computed `background-color` = `rgba(255,255,255,0.06)` desktop / `0.10` mobile on each chrome surface.
2. DevTools Recipe 4 (mobile blur cap): 375px viewport; assert Computed `backdrop-filter: blur(12px)` on each chrome surface.
3. Functional smoke: ESC closes MobileMenu; scroll changes HeaderClient padding (py-5↔py-3); StickyBar appears on mobile only and slides off when `#contact` or `<footer>` enters viewport.

Token-consumption verification (automated greps above) provides high-confidence evidence that the Computed-style outcomes will match expectations, since the tokens themselves are the contract established and frozen in Plan 92-01.

## Self-Check: PASSED

- HeaderClient.tsx exists and contains tier tokens ✓ (verified)
- MobileMenu.tsx exists and contains tier tokens ✓ (verified)
- StickyBar.tsx exists and contains tier tokens ✓ (verified)
- Footer.tsx exists and contains tier tokens (Tier 0 + Tier 3) ✓ (verified)
- Commit `6b1500c` exists ✓ (`git log` confirms)
- Commit `bfe5e02` exists ✓ (`git log` confirms)
- Commit `2d4b52a` exists ✓ (`git log` confirms)
- `pnpm --dir next build` exits 0 ✓ (verified after each task)
- CTA invariant negative-grep zero matches ✓ (verified)
- All hardcoded large blurs eliminated from chrome files ✓ (verified)
