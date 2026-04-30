# Phase 88: Code Hygiene - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Resolve three hygiene items left over from v8.0:
- HYG-01: 2 pre-existing lint warnings
- HYG-02: Fate of unused `LiquidBlobLayer.tsx` + `liquid-depth.css` from stash
- HYG-03: Fate of stash's massive research-doc rewrites
</domain>

<decisions>
## Implementation Decisions

### HYG-01: Lint warnings — RESOLVED upstream
Both warnings auto-resolved by the Phase 86 stash extraction:
- `variant` unused in `ServiceHero.tsx` → fixed by stash version that wires `variant` to `data-hero-variant` DOM attribute
- `PHONE_NUMBER` unused in `/treatment-abroad/page.tsx` → import removed in stash version

`pnpm build` confirmed clean at end of Phase 86 — zero lint warnings now.

### HYG-02: LiquidBlobLayer + liquid-depth.css — DISCARD
The stash contains:
- A new component `next/src/components/layout/LiquidBlobLayer.tsx` (untracked)
- A new stylesheet `next/src/styles/liquid-depth.css` (untracked)
- A 1-line addition to `globals.css` importing `liquid-depth.css`
- A 2-line addition to `app/layout.tsx` importing and mounting `<LiquidBlobLayer />`

Together these would inject an additional decorative blob layer on every page. **Decision: discard.** Reasoning:
1. v8.0 just shipped without this layer. Adopting it now would introduce a visual change that wasn't part of the v8.0 spec
2. Each layout addition costs against the Phase 79 mobile glass budget (≤2 layers); without an explicit phase to evaluate impact, adding it is a regression risk
3. The component and stylesheet have no current consumers — they're "free" in the stash but would be live the moment the layout.tsx/globals.css edits land
4. If decorative depth is needed in a future milestone, it should be designed against a fresh spec rather than adopted as a side-effect of stash cleanup

The two new files stay in `stash@{0}` (Phase 89 will drop the stash; both files are NOT in the working tree currently and never were extracted).

### HYG-03: Research docs rewrites — DISCARD
The stash contains massive rewrites of:
- `.planning/research/ARCHITECTURE.md` (936 → 580 lines, ±50% rewrite)
- `.planning/research/FEATURES.md` (427 → 383 lines)
- `.planning/research/PITFALLS.md` (576 → 650 lines)
- `.planning/research/STACK.md` (343 → 550 lines)

**Decision: discard.** Reasoning:
1. These rewrites were drafted before v8.0 shipped. v8.0 changed the codebase substantially — adding these stale drafts would create research drift, not resolve it
2. Without context on what the rewrites tried to convey, validating them line-by-line is impractical
3. If the research docs need refresh for v8.1+, that should be a deliberate research phase against the post-v8.0 codebase

The original research docs remain in the working tree, unchanged.

### Verification
- `pnpm build` already confirmed clean at end of Phase 86
- No source-code changes in this phase (decision-only documentation)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- N/A — this phase makes no code changes

### Established Patterns
- "Don't apply pre-shipped drafts to a post-shipped codebase" — pattern reinforced

### Integration Points
- N/A
</code_context>

<specifics>
## Specific Ideas

This is a documentation-only phase — the substantive lint fixes already landed in Phase 86, and HYG-02/HYG-03 are deliberate "don't do" decisions. The phase exists to formally close the items in REQUIREMENTS.md so they don't drift.
</specifics>

<deferred>
## Deferred Ideas

- Research docs refresh against post-v8.0 codebase — separate research phase if/when needed
- Decorative blob layer reconsideration — separate design phase if/when needed
</deferred>
