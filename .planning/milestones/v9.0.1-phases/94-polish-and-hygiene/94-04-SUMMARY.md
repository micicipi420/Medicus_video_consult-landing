# Phase 94 Plan 04 — SUMMARY

**Status:** complete
**Requirements closed:** POL-02
**Date:** 2026-05-01
**Path selected:** **Path A** (DESIGN.md + CLAUDE.md clarification only — no source changes)

## Path selection rationale

Live Playwright measurement at `/treatment-abroad` mobile viewport (375×667) found 4 in-viewport glass surfaces:

| Element | Category | Notes |
|---------|----------|-------|
| `<header>` (sticky) | CHROME | Page chrome, `position: fixed` |
| Mobile menu toggle button (inside header) | CHROME | Descendant of `<header>` |
| Eyebrow pill `МЕДИЦИНСКИЙ ТУРИЗМ` | CONTENT | In normal flow inside `<section id="hero">` |
| `StickyBar` sticky bottom CTA | CHROME | `position: fixed`, `lg:hidden` |

**Content-glass count = 1** (well within ≤2 budget). Carving chrome out of the budget — which the original Phase 82 lesson always intended (it was about CONTENT-glass nesting, not chrome co-presence) — resolves the contract cleanly without any source edit.

Full investigation: `.planning/phases/94-polish-and-hygiene/94-04-INVESTIGATION.md`.

## DESIGN.md diff hunks

### Project-specific hard constraints (line ~633)

```
- - **Glass layer count:** ≤ 2 glass elements per viewport. Stacked glass-on-glass is forbidden — kills GPU on budget Android devices that dominate the KZ market.
+ - **Glass layer count (content):** ≤ 2 glass content surfaces per viewport. Stacked glass-on-glass is forbidden — kills GPU on budget Android devices that dominate the KZ market. **Sticky chrome surfaces** (`<header>`, sticky bottom FAB / `StickyBar`, modal backdrops) are excluded from this budget — they're at most 2 chrome layers in any viewport, are positioned outside the content flow, and were measured stable on real-device UAT (v9.0 Phase 93). The constraint targets content-glass nesting (the Phase 82 services-grid/sticky-bar overlap lesson), not chrome co-presence.
```

### YAML anti-pattern entry (line ~316)

```
-   - name: ">2 glass layers per viewport"
-     why: "DESIGN.md hard constraint; mobile-first ЦА 45+ readability + GPU budget"
-     addedIn: "v9.0 Phase 90"
+   - name: ">2 glass content layers per viewport"
+     why: "DESIGN.md hard constraint; mobile-first ЦА 45+ readability + GPU budget. Chrome surfaces (sticky header, sticky FAB) are excluded — see Project-specific hard constraints."
+     addedIn: "v9.0 Phase 90"
+     refinedIn: "v9.0.1 Phase 94 Plan 04 (chrome carve-out)"
```

### Markdown anti-pattern #13 (line ~739)

```
- 13. **>2 glass layers per viewport.** Why: `DESIGN.md` hard constraint; mobile-first ЦА 45+ readability + GPU budget. Where it manifests: nested glass cards inside a glass section inside a glass container. ...
+ 13. **>2 glass content layers per viewport.** Why: `DESIGN.md` hard constraint; mobile-first ЦА 45+ readability + GPU budget. Where it manifests: nested CONTENT-glass cards inside a CONTENT-glass section inside a CONTENT-glass container. Chrome (sticky header, sticky FAB) is excluded — see `Project-specific hard constraints` in the Liquid Glass section. ...
```

## CLAUDE.md diff hunks

### Constraints / Design line (line 23)

```
- - **Design**: Mobile-first, ЦА 45+ — крупный шрифт, понятная навигация, высокий контраст. Mobile blur ≤12px, ≤2 glass elements per viewport.
+ - **Design**: Mobile-first, ЦА 45+ — крупный шрифт, понятная навигация, высокий контраст. Mobile blur ≤12px, ≤2 glass CONTENT elements per viewport (sticky chrome — header, FAB — excluded; see DESIGN.md § "Project-specific hard constraints").
```

### Design Contract HIG mirror (line 157)

```
- 2. **Apple Liquid Glass HIG compliance** ... mobile blur ≤12px, ≤2 glass layers per viewport, dark mode disables ...
+ 2. **Apple Liquid Glass HIG compliance** ... mobile blur ≤12px, ≤2 glass CONTENT layers per viewport (sticky chrome excluded — see DESIGN.md § "Project-specific hard constraints"), dark mode disables ...
```

## ServiceHero.tsx — NOT modified

Path B was not selected; no source edit needed. Eyebrow pill remains glass on all viewports.

## Visual baseline regen

Not needed (Path A is doc-only; no rendered output changes).

## Verification

- `grep 'Glass layer count (content)' DESIGN.md` → match (1)
- `grep 'glass CONTENT elements per viewport' CLAUDE.md` → match (1)
- `cd next && pnpm build` → exit 0
- `cd next && pnpm lint` → 0 errors (1 pre-existing unrelated warning)

## Commits

- `fcab96a` feat(94-04): live-measure glass surfaces at /treatment-abroad mobile hero
- `7b0620f` docs(94-04): POL-02 — clarify ≤2 glass-per-viewport excludes chrome (Path A based on investigation)

## Deviations

- Plan said to also edit CLAUDE.md line 157 (the second HIG-mirror mention) — extended Path A to update that line too for consistency. Both CLAUDE.md mentions of the rule now use the "CONTENT" wording with cross-reference to DESIGN.md.
