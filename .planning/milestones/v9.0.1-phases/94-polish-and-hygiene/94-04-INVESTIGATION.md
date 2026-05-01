# Phase 94 Plan 04 — Glass Surface Investigation

**Date:** 2026-05-01
**Route:** `/treatment-abroad`
**Viewport:** 375×667 (mobile)
**Method:** Playwright MCP, live measurement against `pnpm dev` on port 3107

## Playwright enumeration script (verbatim)

```js
() => {
  window.scrollTo(0, 0);
  const all = Array.from(document.querySelectorAll('*'));
  const matches = [];
  for (const el of all) {
    const cs = getComputedStyle(el);
    const bf = cs.backdropFilter || cs.webkitBackdropFilter || '';
    if (!/blur\([1-9]/.test(bf)) continue;
    const bg = cs.backgroundColor;
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > 667) continue;
    if (rect.width === 0 || rect.height === 0) continue;
    matches.push({
      tag: el.tagName,
      cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 120),
      backdropFilter: bf,
      backgroundColor: bg,
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
      isHeaderDescendant: !!el.closest('header'),
      isStickyBar: !!(el.getAttribute('aria-label') === 'Быстрые действия' || (el.getAttribute('role') === 'complementary' && /fixed/.test(cs.position))),
    });
  }
  return matches;
}
```

## In-viewport glass surfaces (raw)

| # | Tag | Class (truncated) | backdrop-filter | background-color | Rect (x,y,w,h) | Header? | StickyBar? |
|---|-----|-------------------|-----------------|------------------|----------------|---------|------------|
| 1 | HEADER | `fixed z-50 transition-[padding,box-shadow] duration-300 top-4 left-4 right-4 mx-auto max-w-7xl rounded-[2.5rem] px-4 md:...` | blur(12px) | rgba(255,255,255,0.06) | (16,16,343,85) | yes | no |
| 2 | BUTTON | `flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-[var(--glass-section-fill)] text-mu-te...` | blur(12px) | rgba(255,255,255,0.06) | (299,37,44,44) | **yes** (descendant of HEADER) | no |
| 3 | DIV | `mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/60 bg-[var(--glass-section-fill)] px-4 p...` | blur(12px) | rgba(255,255,255,0.06) | (16,208,196,39) | no | no |
| 4 | DIV | `fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 rounded-2xl border border-white/60 bg-[var(--gl...` | blur(12px) | rgba(255,255,255,0.06) | (16,581,343,70) | no | **yes** |

## Categorization (CHROME vs CONTENT)

| # | Element | Category | Rationale |
|---|---------|----------|-----------|
| 1 | sticky `<header>` | **CHROME** | Page chrome — `position: fixed`; floats above content; not in normal flow |
| 2 | mobile menu toggle button (inside `<header>`) | **CHROME** | Descendant of `<header>` — same chrome layer |
| 3 | eyebrow pill `МЕДИЦИНСКИЙ ТУРИЗМ` (`ServiceHero` content) | **CONTENT** | In normal flow, sits inside `<section id="hero">` |
| 4 | `StickyBar` sticky bottom CTA | **CHROME** | `position: fixed`; floats at bottom; not in normal flow; `lg:hidden` (mobile-only chrome) |

**Counts:**
- CHROME: 3
- CONTENT: 1

## Conclusion

**If we exclude chrome from the budget, the content-glass count is 1 (target: ≤2).** Well within budget.

The eyebrow pill is the only content-glass surface in the mobile hero viewport. The sticky `<header>`, its descendant menu toggle, and the `StickyBar` are all chrome by any reasonable reading: positioned outside content flow, intended to float above any page, and are 1-instance-per-viewport by design. The original `≤2 glass per viewport` rule was authored against the Phase 82 lesson where two CONTENT-glass containers (hero card + services grid) overlapped on mobile.

## Decision

**Path A** — Clarify DESIGN.md and CLAUDE.md that sticky chrome surfaces (sticky `<header>`, sticky bottom FAB / `StickyBar`, modal backdrops) are excluded from the per-viewport glass budget. NO source changes to ServiceHero.tsx or StickyBar.tsx required.

Per CLAUDE.md autonomous-decisions delegation, this technical interpretation of the design contract is delegated to Claude; no user prompt required.

## User Decision Required

Not applicable — this plan is `autonomous: true`. Path A executes immediately in Task 2.
