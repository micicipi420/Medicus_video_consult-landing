# Phase 34: Treatment Abroad Overhaul - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Auto-generated (concrete requirements + scope reconciliation with Phase 33)

<domain>
## Phase Boundary

Restore the worst-scoring page (treatment-abroad.html, 14/24) to parity by: (1) replacing 20+ hardcoded brand hex strokes with tokens/currentColor, (2) fixing typewriter dashes between digits, (3) swapping the inappropriate hero photo. Stat bar hierarchy already reworked in Phase 33 (AUDIT-05).

</domain>

<decisions>
## Implementation Decisions

### Scope reconciliation with Phase 33
- **TRTOVR-04 (stat bar rework) is DONE** via Phase 33's AUDIT-05 work. Verified at treatment-abroad.html:177-197 — already uses index.html's icon-less number-focused pattern with rotating accent colors. This phase should NOT re-touch the stat bar.
- Phase 34 now effectively scopes TRTOVR-01, TRTOVR-02, TRTOVR-03, TRTOVR-05, TRTOVR-06 (5 items, one pre-completed).

### TRTOVR-01 Hardcoded hex → tokens (verified count: 20 occurrences)
- `#38C6F4` (mu-accent-blue) → use `currentColor` with `text-mu-accent-blue` Tailwind class on the SVG parent, OR use `stroke="var(--mu-accent-blue)"`
- `#35B678` (mu-green-600 / cta-from family) → `currentColor` with `text-mu-green-600`, OR `stroke="var(--mu-green-600)"`
- `rgba(56,198,244,0.1)` → `fill="color-mix(in oklch, var(--mu-accent-blue) 10%, transparent)"` OR simpler: use a CSS class that defines the fill
- **Preferred approach:** Wrap each `<svg>` in a parent with the color class, then use `stroke="currentColor"` on the child elements. This matches v3.0's SVG pattern (duotone icons inherit parent text color).

### TRTOVR-02 #047857 (emerald-700) → mu-green-600
- Found at lines 748, 754, 760 (not just 752 as plan said). Multi-line — all 3 are the same checkmark pattern `<path d="M4 10l4 4 8-8" stroke="#047857">`. Replace all.
- Token: `var(--mu-green-600)` (not `--mu-green-700` — the project doesn't have that token; `mu-green-600` is the nearest available)

### TRTOVR-03 Typewriter dashes (verified count: 3, not 4+1)
- Line 443: `подбор 2--3 клиник` → `подбор 2&ndash;3 клиник` (with nbsp between number and unit if not already)
- Line 494: `2--4 дня` → `2&ndash;4&nbsp;дня`
- Line 520: `7--10 дней` → `7&ndash;10&nbsp;дней`
- Scoped by position (between digits) so no CSS comments are affected.

### TRTOVR-05 Hero photo BLOCKER
- **Current state (verified visually 2026-04-07):** `img/hero-treatment-abroad.webp` is a close-up of sterile packaged syringes. Emotionally inappropriate for 45+ oncology/cardiology decision audience. Alt text also drifts: `"Современная палата в европейской клинике"` doesn't match the actual image.
- **Blocker:** Needs sourcing. Options:
  1. User provides a specific free-license asset (Unsplash/Pexels clinic interior / care team)
  2. Orchestrator sources via WebFetch (license verification + vibe check required)
  3. Defer to v3.2 with a placeholder fix (alt text correction only)
- **Recommended path if sourcing fails:** Defer the photo swap to a sub-phase or v3.2. For v3.1, at minimum fix the alt text drift so at least `alt` matches reality (or make it more neutral: `"Медицинская клиника в Европе"`).

### TRTOVR-06 Re-audit score ≥17/24
- Preliminary assessment: if TRTOVR-01, -02, -03 ship cleanly, token-based branding should improve the audit score. Hero photo swap is a big chunk of the audit improvement — without it, the score may only reach ~16/24.
- Full re-audit is deferred to milestone audit step after all phases ship.

### Claude's Discretion
- Exact Tailwind class names for SVG color inheritance (text-mu-accent-blue vs stroke-mu-accent-blue); resolve during execution
- Whether to use CSS custom properties directly in SVG `stroke` attrs vs class-based currentColor inheritance — pick the pattern that produces smallest diff

</decisions>

<code_context>
## Existing Code Insights

### Reusable patterns
- v3.0 existing icons use `text-mu-*` class on SVG parent + `stroke="currentColor"` on children (see index.html service card icons around lines 380-420)
- theme.css has `--mu-accent-blue`, `--mu-green-600` tokens — confirmed

### Files touched
- `treatment-abroad.html` only (Phase 34 is page-scoped)
- Possibly `img/hero-treatment-abroad.webp` (replacement, pending TRTOVR-05 decision)

### Out of scope
- All other pages (Phase 33 + Phase 35-38 handle them)
- Any CSS token additions (existing tokens suffice)

</code_context>

<specifics>
## Specific Ideas

- Use `currentColor` pattern (not `var(--mu-*)` inline in stroke) to match v3.0 conventions
- Hero photo alt text fix is a zero-effort win even if swap is deferred
- Consider capturing the TRTOVR-05 asset request in a todo for client

</specifics>

<deferred>
## Deferred Ideas

- Full treatment-abroad.html copywriting rewrite (already done in v2.0)
- Client testimonial photo additions (out of scope for v3.1)
- Hero gradient overlay adjustments (only if new photo lands first)

</deferred>
