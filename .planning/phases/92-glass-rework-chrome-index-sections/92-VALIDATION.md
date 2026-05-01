---
phase: 92
slug: glass-rework-chrome-index-sections
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-30
---

# Phase 92 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
>
> Source: 92-RESEARCH.md §Validation Architecture (visual sweep — no unit-test surface; `pnpm build` is the compile gate; runtime checks are manual DevTools recipes; Playwright belongs to Phase 94).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None for Phase 92 (visual class-swap sweep, no logic). `pnpm build` is the compile gate. |
| **Config file** | `next/package.json` `scripts.build`; no test runner registered |
| **Quick run command** | `pnpm --dir next build` |
| **Full suite command** | `pnpm --dir next build` + DevTools recipes (1–5) per swept component |
| **Estimated runtime** | ~30–60 seconds for `pnpm build`; ~3–5 min manual recipes per component |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --dir next build` (catches arbitrary-value class syntax errors and TS regressions)
- **After every plan wave:** `pnpm build` clean + DevTools mobile (375px) + desktop (1440px) verification of swept components; CTA grep audit clean.
- **Before `/gsd-verify-work`:** All 11 sections + 4 chrome + form panel + utility CSS swept; CTA grep audit clean; chrome legibility verified at heat=0 + heat=1; ContactForm WCAG measurement recorded; `pnpm build` clean; no `mix-blend-mode` on FinalCTA after Plan 92-08.
- **Max feedback latency:** ~60 s (build) + manual visual smoke check per swept component.

---

## Per-Task Verification Map

> Wave / plan / task IDs are filled by the planner (Step 8). This map is keyed by REQUIREMENT for now; the planner will denormalize into per-task rows once PLAN.md files are written.

| Req ID | Behavior | Test Type | Automated Command | Manual Recipe | Status |
|--------|----------|-----------|-------------------|---------------|--------|
| GLASS-01 | Chrome at Tier 0 (≤0.16 fill); mobile blur ≤12px; HIG 44pt; ESC dismissal | grep audit + manual ESC | `pnpm --dir next build && grep -rn 'bg-white/[0-9]' next/src/components/layout/` (expect 0 except preserved over-photo / decorative chips) | Recipe 1 + Recipe 4 | ⬜ pending |
| GLASS-02 | HeroHub Tier 0 frame; CTA opaque, no `backdrop-filter` | grep audit | `grep -B 0 -A 5 'from-mu-blue to-mu-accent-blue' next/src/components/sections/HeroHub.tsx \| grep -i 'backdrop'` (expect 0) | Recipe 5 | ⬜ pending |
| GLASS-03 | StatsBar mobile 1 wrapper / desktop 4 cards; cards Tier 1 / hover Tier 2 | manual responsive | n/a (visual + computed-style) | DevTools 375px + 1440px viewport switch | ⬜ pending |
| GLASS-04 | ServicesGrid Tier 1 / hover Tier 2; ≤2 glass siblings per viewport | manual layer audit | n/a | DevTools "Layers" panel inspection | ⬜ pending |
| GLASS-05 | Process / Problem / WhyUs / Clinics / Platform / Reviews per-tier sweep | manual per-component | `pnpm --dir next build` clean | per-component DevTools computed-style | ⬜ pending |
| GLASS-06 | FAQSection closed Tier 1 / open Tier 2; accordion preserved | manual click + computed-style | n/a | click open → verify class swap to Tier 2 + max-height transition fires | ⬜ pending |
| GLASS-07 | ContactForm form-fill ≥0.16 effective; labels promoted; inputs opaque; body ≥4.5:1 | DevTools Color Picker | n/a | Recipe 3 (worst-case blob heat) | ⬜ pending |
| GLASS-08 | FinalCTA Tier 0 frame; CTA opaque; gradient unchanged; mix-blend-multiply retired | grep audit | `grep -n 'mix-blend' next/src/components/sections/FinalCTA.tsx` (expect 0) | Recipe 5 | ⬜ pending |
| GLASS-09 | Footer Tier 0 fill | DevTools computed-style | n/a | Recipe 1 (Footer variant) | ⬜ pending |
| GLASS-10 | liquid-glass.css re-pointed; heat-leak rules preserved on `.liquid-card` / `.liquid-regular` | grep audit | `grep -A 30 '\.liquid-card\s*{' next/src/styles/liquid-glass.css \| grep 'radial-gradient.*blob'` (expect ≥1 match — already shipped commit 9c93b9f) | Recipe 2 (on Phase 93 service-page consumer or `ContactMethodGrid`) | ✅ shipped (commit 9c93b9f) |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] **No Wave 0 gaps** — Phase 92 has no test infrastructure to set up. Existing `pnpm build` covers compile gate; visual verification is manual; Playwright is Phase 94 territory.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Chrome legibility at heat=0 | GLASS-01, GLASS-09 | Visual contrast judgement on 6× fill drop (0.6–0.8 → 0.06–0.10) | Recipe 1: force `static` blob; computed-style on `<header>`, Footer, StickyBar, MobileMenu drawer; Color Picker on nav text vs composite background ≥4.5:1 |
| Heat-leak gradient liveness | GLASS-10 | DevTools must observe `radial-gradient(... at <px> <px> ...)` updating with cursor | Recipe 2: move cursor; Computed → `background-image` on `.liquid-card` consumer reflects new `at` coordinates |
| ContactForm WCAG measurement | GLASS-07 | Composite-background contrast over blob requires Color Picker on rendered text | Recipe 3: `window.__blobDebug.setHeat(1.0)` + Color Picker on form `<p>`. If <4.5:1 → trigger KD-v9-002 escalation: change `--glass-form-fill` desktop 0.14 → 0.30, re-measure, log Key Decision in PROJECT.md |
| Mobile blur cap (≤12 px) | GLASS-01 | DOM resolves `clamp(12px, …)` differently per viewport | Recipe 4: 375 px viewport → Computed `backdrop-filter: blur(12px)` (lower bound hits) on every chrome surface |
| CTA opacity invariant | GLASS-02, GLASS-08 | grep audit covers it but visual confirmation matters | Recipe 5: 0 matches when chaining `from-mu-blue to-mu-accent-blue` files into `grep -l backdrop`; visual scan at multiple blob positions |
| ≤2 glass siblings per viewport | GLASS-04 | DevTools "Layers" panel inspection per route scroll position | Manual: scroll `/`, watch `Layers` panel — never >2 transparent layers stacked |
| FAQSection accordion preserved | GLASS-06 | CSS-only transition; click flips class; visual + DevTools | Click each item; DevTools computed-style toggles Tier 1 → Tier 2; `max-height` transition fires |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (grep / `pnpm build`) or are mapped to a Manual Recipe
- [ ] Sampling continuity: every wave ends with `pnpm build` clean + DevTools sweep
- [ ] Wave 0 covers all MISSING references — **N/A (no Wave 0 gaps)**
- [ ] No watch-mode flags
- [ ] Feedback latency < 60 s for `pnpm build`
- [ ] `nyquist_compliant: true` set in frontmatter once planner confirms every Phase-92 task aligns with this map and the gate review passes

**Approval:** approved 2026-04-30

---

## DevTools Recipes (mirrored from RESEARCH §Validation Architecture)

**Recipe 1: Chrome legibility at heat=0**

1. Open `/` in Chrome; force `static` blob via `window.__blobDebug.setMode?.('static')` in console (Phase 91 debug helper).
2. Elements → select `<header>` → Computed → `background-color` resolves to `rgba(255,255,255,0.06)` (or `0.10` mobile).
3. Color Picker on a nav link → composite background ≥4.5:1.
4. Repeat for Footer, StickyBar, MobileMenu drawer.

**Recipe 2: Heat-leak gradient liveness**

1. Move cursor to top-left of viewport.
2. Find a `.liquid-card` consumer (Phase 93 service pages or `ContactMethodGrid`; Phase 92 doesn't add new ones).
3. Computed → `background-image` shows `radial-gradient(... at <px>px <px>px ...)` matching cursor position.
4. Move cursor to bottom-right; verify `at` coordinates update.

**Recipe 3: ContactForm WCAG measurement**

1. Open `/#contact`; ensure ContactSection is visible.
2. Elements → select form `<p>` body copy.
3. Computed → Color Picker on text color → contrast ratio with composite background.
4. Force worst-case heat via `window.__blobDebug.setHeat(1.0)` and re-measure.
5. If <4.5:1 → trigger KD-v9-002 escalation flow.

**Recipe 4: Mobile blur cap verification**

1. DevTools → Toggle Device Toolbar → 375 px width.
2. Select swept chrome component (e.g., `HeaderClient`).
3. Computed → `backdrop-filter` resolves to `blur(12px)` exactly.
4. Repeat for any tier-token component.

**Recipe 5: CTA opacity invariant grep**

```bash
# 0 expected:
grep -rn "from-mu-blue to-mu-accent-blue" next/src/components/sections/ next/src/components/layout/ \
  | xargs -I {} grep -l "backdrop" {} 2>/dev/null

# All 5 in-scope CTAs present:
grep -rln "from-mu-blue to-mu-accent-blue" next/src/components/sections/ next/src/components/layout/ \
  | grep -E "(HeroHub|MobileMenu|StickyBar|ContactForm|FinalCTA|HeaderClient)" \
  | sort -u
# Expected: 5 file matches (HeaderClient included only if Header.tsx dead)
```
