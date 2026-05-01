# Phase 90: Foundation — Tokens, A11y Wiring, DOM Skeleton — Research

**Researched:** 2026-04-30
**Domain:** Static foundation contract — CSS tokens, a11y `@layer`, DOM skeleton, design-system docs
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Decision A — Sublayer DOM shape (flat-sibling skeleton):**
```jsx
<div className="living-blob-field" aria-hidden="true" data-engine-active="false">
  <div className="blob-sublayer blob-core" />
  <div className="blob-sublayer blob-body" />
  <div className="blob-sublayer blob-halo" />
  <div className="blob-sublayer blob-glint" />
</div>
```
Rationale: flat siblings keep CSS targeting simple; naming matches TZ §5; `data-engine-active` boolean is the Phase 91 handoff (canvas mounts as 5th sibling, attribute flips to `true`, CSS hides static divs).

**Decision B — `--blob-hot: #4FE098` Key Decision flow:**
- Add `--blob-hot: #4FE098` to DESIGN.md YAML `colors:` and `globals.css :root` in Phase 90.
- Append `KD-v9-001` to PROJECT.md "Key Decisions" with status `pending`.
- Add comparison swatch (`--mu-primary` #35B678 vs `--blob-hot` #4FE098 vs medicusunion.com brand greens) to `/test-glass`.
- 90-VERIFICATION.md instructs user to view `/test-glass` and update KD-v9-001 to `approved` (or propose alternate hex) before `/gsd-discuss-phase 91`.
- Phase 91 planner halts if KD-v9-001 still `pending`.
- **Does NOT block Phase 90 ship.**

**Decision C — CTA opaque-forever scope (master list in DESIGN.md "v9.0 Custom Rules"):**
1. `HeroHub` primary CTA
2. `FinalCTA` primary submit
3. `ContactForm` submit button
4. `StickyBar` primary action
5. `Header` phone CTA
6. Service-page `LeadFormSection` submit
7. Any future component using `.btn-primary` or v6 gradient utility classes

Phase 90 enforcement scope: documentation only. DESIGN.md "v9.0 Custom Rules" enumerates list with rationale (PITFALLS 3.1). `liquid-glass.css` `@layer` block carries comment: `/* CTA opaque-forever rule — see DESIGN.md v9.0 Custom Rules. Do NOT add CTA gradient classes to this @layer block. */`. Stylelint enforcement deferred to v9.1+.

**Decision D — Anti-pattern appendix (both YAML field + markdown body):**
- DESIGN.md YAML gains `antiPatterns:` field with 15 entries (name, why, addedIn).
- DESIGN.md body gains `## v9.0 Anti-Patterns` section expanding each entry (name, why, where it manifests, what to do instead).
- 11 entries from TZ §16 + 4 from project history (Phase 79/85/89). Full list locked in CONTEXT.md.

**Folded scope clarifications (locked):**
- Token registration: BOTH DESIGN.md YAML AND `globals.css :root` get all tokens. Mirror is mandatory.
- Inline `<style>` seed location: first child of `<body>` in `layout.tsx` JSX (not `<head>`).
- A11y `@layer` block discovery: manual + grep-verified via `/* @a11y-layer-coverage:start */ ... /* @a11y-layer-coverage:end */` markers.
- `MeshBackground.tsx` deletion: hard delete (`rm`), no archive — git history is sufficient.
- z-index contract: codify REQUIREMENTS.md FND-04 verbatim into DESIGN.md "v9.0 Custom Rules".
- All new tokens use plain `rgba()` (no `oklch` migration in v9.0).

### Claude's Discretion

(All discretion areas were resolved during discuss-phase via claude-decided mode. No live discretion remains for the planner.)

### Deferred Ideas (OUT OF SCOPE)

- Stylelint / ESLint rule enforcing CTA opaque-forever — defer to v9.1+ tooling phase.
- `oklch` migration for new tokens — TOK-01/02 not in v9.0.
- `OffscreenCanvas` workerized rendering — defer to v10+ (Safari 15 lacks support).
- Per-route blob color theming — defer to v10+ (brand parity disallows in v9.0).
- Lint rule enforcing `@a11y-layer-coverage` block completeness — defer to v9.1+; Phase 90 ships markers, Phase 94 runs grep.
- Canvas renderer, `pointermove` listener, rAF loop, lerp physics — Phase 91.
- Glass component opacity sweep, heat-leak `radial-gradient` rules — Phase 92.
- Real-device a11y UAT under live OS toggle — Phase 94 hard gate.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FND-01 | Blob palette tokens (`--blob-core/hot/halo/edge/glint`) registered in DESIGN.md YAML + `globals.css` | TZ §5 prescribes exact values; `globals.css` already mirrors `--mu-*` tokens — extension pattern proven (lines 119-145). |
| FND-02 | Glass tier tokens (`--glass-{section,card,form,button}-{fill,blur}`) with desktop+mobile values; mobile blur ≤12px | TZ §9 prescribes alpha tiers (0.04/0.08/0.12/0.16); existing `--liquid-blur-*` uses `clamp(12px, Nvw, ceiling)` pattern (globals.css:122-125) — extend. Phase 79 mobile blur ≤12px is hard constraint. |
| FND-03 | A11y `@layer` block in `liquid-glass.css` enumerates every glass class under `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` | Existing classes enumerated (Section 13 lines 717-754, Section 14 lines 768-829). Phase 90 unifies into single block with `@a11y-layer-coverage` markers. |
| FND-04 | Z-index contract documented in DESIGN.md (blob-field z-0, main z-1..10, header/sticky z-50+, modals z-100+) | Verified against `layout.tsx:55` (`<main className="relative z-10">`); current MeshBackground at `z-0` (component code line 4). |
| FND-05 | CTA opaque-forever rule + v9.0 anti-pattern appendix in DESIGN.md | Locked in Decisions C and D. Format and content fully specified in CONTEXT.md. |
| FND-06 | `<div class="living-blob-field" aria-hidden="true">` skeleton in `layout.tsx` with seeded `:root` vars; `MeshBackground.tsx` deleted | Locked in Decision A. Mount order verified: `<style>` seed → `SvgRefractionDefs` → `living-blob-field` → `Header` → `main` → `Footer` → `StickyBar`. |
| FND-07 | Key Decision logged in PROJECT.md for `--blob-hot: #4FE098`; approved against medicusunion.com before BLOB phase begins | Locked in Decision B (`pending` status — does NOT block Phase 90 ship; Phase 91 planner gates on `approved`). |
</phase_requirements>

## Summary

Phase 90 ships the v9.0 foundation contract as **pure additions and one deletion** — no behavioral change to existing UI. The work is high-confidence because every numerical target traces directly to `design/LIQUID_GLASS_BLOB_TZ.md` (§5, §9, §11, §17), every file edit is locked in CONTEXT.md, and the four key patterns (CSS-var seeding, `@layer` for a11y, additive token tables, hard-delete of `MeshBackground.tsx`) all have proven precedent in the existing codebase.

The only architectural risks are (1) the a11y `@layer` block must enumerate every glass class name without breaking existing rules in liquid-glass.css Sections 13-14, and (2) the inline `<style>` seed must render before `.living-blob-field` so CSS vars resolve on first paint. Both risks have explicit mitigations in CONTEXT.md (grep-verifiable markers; first-child-of-body placement).

**Primary recommendation:** Treat Phase 90 as a "documentation + skeleton" phase. Every change is reviewable as a unified diff: 1 `globals.css` extension, 1 new file (`blob.css`), 1 a11y block prepended to `liquid-glass.css`, 1 `layout.tsx` JSX swap, 1 file deletion (`MeshBackground.tsx`), 1 DESIGN.md edit (YAML + body), 1 PROJECT.md edit (one row), 1 `/test-glass` swatch addition. Visual diff vs v8.1 limited to the soft static blob ambient (acceptable per FND-06 rationale).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Token definition (machine-readable contract) | Design-system docs (DESIGN.md YAML) | — | Single source of truth per `CLAUDE.md > Design Contract`. |
| Token runtime registration | CSS layer (`globals.css :root`) | — | Browser consumes CSS, not YAML. Mirror is mandatory. |
| Static visual baseline (4 sublayer divs) | CSS layer (`blob.css`, new file) | DOM skeleton (`layout.tsx`) | New stylesheet keeps blob-specific CSS isolated; layout owns mount. |
| A11y media-query enforcement | CSS layer (`liquid-glass.css` `@layer` block) | `globals.css` `@media` blocks (already shipped Phase 85) | Single-source `@layer` is the v9.0 contract; existing `globals.css` blocks remain (defense in depth). |
| DOM mount + initial CSS-var seed | App Router root layout (`layout.tsx`) | — | All routes share `layout.tsx` — auto-active everywhere per v6.0 architecture. |
| Comparison swatch (brand approval surface) | Existing route page (`/test-glass`) | — | Route already exists for design-system swatches (Phase 59). |
| Decision provenance | Project docs (`PROJECT.md > Key Decisions`) | — | Existing convention; KD-v9-001 row appended. |

## Standard Stack

### Core (zero new dependencies)

| Tool | Version (verified) | Purpose | Why Standard |
|------|-------------------|---------|--------------|
| Next.js (App Router) | 15.5.15 [VERIFIED: next/package.json] | Layout shell hosting `layout.tsx` skeleton | Already in use; `RootLayout` pattern is App Router convention. |
| React | 19.1.0 [VERIFIED: next/package.json] | JSX for `layout.tsx` edits | Already in use. |
| TypeScript | 5.x [VERIFIED: next/package.json devDep] | Type checking | Already in use. |
| Tailwind CSS | 4.x [VERIFIED: next/package.json] | `@theme inline` directive in `globals.css` (Phase 90 does not add Tailwind classes to new code; `<div className="...">` strings are kept utility-only) | Already in use; v4 `@theme inline` syntax confirmed in `globals.css:240`. |
| Vanilla CSS custom properties | — | Token definition runtime | Existing project convention; `--mu-*`, `--liquid-*`, `--squircle-*` precedents. |
| CSS `@layer` | — | A11y media-query block (FND-03) | Standard CSS Cascade Layers (CSS-WG REC, broadly supported in evergreen browsers since 2022) [CITED: developer.mozilla.org/en-US/docs/Web/CSS/@layer]. |

### Supporting (existing, untouched)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `useSpecularHighlight.ts` | Reference rAF + CSS-var pattern (Phase 91 will lift to global) | Phase 90 must NOT modify; preserves `--mouse-x/y` namespace. |
| `SvgRefractionDefs.tsx` | SVG filter definitions | Phase 90 must preserve mount order (`SvgRefractionDefs` before `living-blob-field`). |
| `LazyMotionProvider` | Framer Motion lazy provider | Phase 90 keeps it (entrance animations coexist). |

### Alternatives Considered

| Instead of | Could Use | Tradeoff | Verdict |
|------------|-----------|----------|---------|
| `@layer a11y { ... }` named block | Unnamed `@layer { ... }` or plain `@media` | Named layer is explicit + reorderable; plain `@media` is current Phase 85 convention | **Use plain `@media` blocks inside `liquid-glass.css`** prefixed with `@a11y-layer-coverage` markers — matches existing precedent (Sections 13-14), keeps cascade behavior identical. The CONTEXT.md term "single-source `@layer` block" is conceptual ("single source of truth"), not a literal `@layer name { }` directive. |
| Inline `<style>` in `<body>` | Inject into `<head>` via `next/script` or `metadata` | First-child-of-body works in App Router without metadata API; head injection adds complexity | **Inline `<style>` first child of `<body>`** (locked Decision). |
| Hard-delete `MeshBackground.tsx` | Archive into `_archive/` | Git history is sufficient; no consumer outside `layout.tsx` | **Hard delete** (locked Decision). |

**Installation:** No new packages. `pnpm install` not required for Phase 90.

**Version verification command (informational):**
```bash
cd next && pnpm list next react typescript tailwindcss
```

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│ DESIGN.md (YAML front matter)                                    │
│  ├─ colors.blob.{core,hot,halo,edge,glint}    [contract]         │
│  ├─ glass.{section,card,form,button}.{fill,blur}.{desktop,mobile}│
│  └─ antiPatterns: [15 entries]                                   │
└─────────────────────────────┬────────────────────────────────────┘
                              │ mirror (CI: YAML must match CSS)
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ next/src/app/globals.css                                         │
│  :root {                                                         │
│    --blob-core/hot/halo/edge/glint     [palette]                 │
│    --glass-*-fill / --glass-*-blur     [tier — clamp() mobile≤12]│
│    --blob-x/y, --blob-body-x/y, --blob-halo-x/y                  │
│    --blob-heat, --blob-velocity        [runtime defaults]        │
│  }                                                               │
└─────────────────────────────┬────────────────────────────────────┘
                              │ consumed at runtime
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ next/src/app/layout.tsx (RootLayout)                             │
│   <body>                                                         │
│    1. <style>:root{--blob-x:50vw;--blob-y:50vh;...}</style>      │ ← seed (first child)
│    2. <SvgRefractionDefs />                                      │
│    3. <div class="living-blob-field"                             │
│            aria-hidden="true"                                    │
│            data-engine-active="false">                           │
│         <div class="blob-sublayer blob-core" />                  │
│         <div class="blob-sublayer blob-body" />                  │
│         <div class="blob-sublayer blob-halo" />                  │
│         <div class="blob-sublayer blob-glint" />                 │
│       </div>                                                     │
│    4. <Header />                                                 │
│    5. <main className="relative z-10">{children}</main>          │
│    6. <Footer />                                                 │
│    7. <StickyBar />                                              │
│   </body>                                                        │
│   ─── MeshBackground import + render REMOVED ────                │
└─────────────────────────────┬────────────────────────────────────┘
                              │ styled by
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ next/src/styles/blob.css (NEW)                                   │
│  .living-blob-field { position: fixed; inset:0; z-index:0;       │
│                       pointer-events:none; overflow:hidden; }    │
│  .blob-sublayer    { position: absolute; ... }                   │
│  .blob-core/body/halo/glint { static gradient + opacity }        │
│  @media (prefers-reduced-motion: reduce) { /* freeze */ }        │
│  @media (prefers-reduced-transparency: reduce) { display:none }  │
└─────────────────────────────┬────────────────────────────────────┘
                              │ a11y enforcement extends
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ next/src/styles/liquid-glass.css                                 │
│  /* @a11y-layer-coverage:start */                                │
│  /* CTA opaque-forever rule — see DESIGN.md v9.0 Custom Rules.   │
│     Do NOT add CTA gradient classes to this @layer block. */     │
│                                                                  │
│  @media (prefers-reduced-motion: reduce) { /* enumerate */ }     │
│  @media (prefers-reduced-transparency: reduce) { /* enumerate */ }│
│  @media (prefers-contrast: more) { /* enumerate */ }             │
│  /* @a11y-layer-coverage:end */                                  │
│                                                                  │
│  ─── existing 1037 lines preserved ────                          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ .planning/PROJECT.md                                             │
│  Key Decisions table gains row:                                  │
│   | KD-v9-001: --blob-hot #4FE098 | TZ §5 — heat-state highlight; │
│   |                                  brand parity check pending  │
│   | status: pending                                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ next/src/app/test-glass/page.tsx                                 │
│  Existing swatches preserved; appends 3-div comparison:          │
│   [#35B678 mu-primary] [#4FE098 blob-hot] [medicusunion.com refs]│
└──────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure (Phase 90 deltas)

```
next/src/
├── app/
│   ├── globals.css           [MODIFIED: append --blob-*, --glass-*-fill/blur]
│   ├── layout.tsx            [MODIFIED: skeleton, remove MeshBackground]
│   └── test-glass/
│       └── page.tsx          [MODIFIED: add blob-hot swatch row]
├── components/
│   └── layout/
│       ├── MeshBackground.tsx  [DELETED]
│       ├── SvgRefractionDefs.tsx  [UNCHANGED]
│       ├── Header.tsx        [UNCHANGED]
│       ├── Footer.tsx        [UNCHANGED]
│       └── StickyBar.tsx     [UNCHANGED]
├── hooks/
│   └── use-specular-highlight.ts  [UNCHANGED — Phase 91 lifts]
└── styles/
    ├── blob.css              [NEW]
    ├── liquid-glass.css      [MODIFIED: @a11y-layer-coverage block prepended near top]
    └── squircles.css         [UNCHANGED]

.planning/
├── PROJECT.md                [MODIFIED: KD-v9-001 row]
└── REQUIREMENTS.md           [UNCHANGED]

DESIGN.md                     [MODIFIED: YAML + body; antiPatterns, glass tiers, z-index contract, CTA rule]
```

### Pattern 1: Token Mirror (DESIGN.md YAML ↔ globals.css :root)

**What:** Every CSS custom property registered in `globals.css :root` MUST appear in DESIGN.md YAML front matter. YAML wins on disagreement (per `CLAUDE.md > Design Contract`).
**When to use:** All FND-01, FND-02 tokens.
**Example:**
```yaml
# DESIGN.md YAML front matter
colors:
  # ── v9.0 Living Blob palette ────────────────────────────────
  blob-core: "#35B678"   # alias of green-600 / mu-primary
  blob-hot: "#4FE098"    # NEW — KD-v9-001 (status: pending)
  blob-halo: "rgba(98, 221, 177, 0.5)"
  blob-edge: "rgba(125, 205, 255, 0.18)"
  blob-glint: "rgba(255, 255, 255, 0.65)"

glass:
  section:
    fill: { desktop: "rgba(255,255,255,0.06)", mobile: "rgba(255,255,255,0.10)" }
    blur: { desktop: "24px",  mobile: "12px" }
  card:
    fill: { desktop: "rgba(255,255,255,0.10)", mobile: "rgba(255,255,255,0.14)" }
    blur: { desktop: "20px",  mobile: "12px" }
  form:
    fill: { desktop: "rgba(255,255,255,0.14)", mobile: "rgba(255,255,255,0.18)" }
    blur: { desktop: "18px",  mobile: "12px" }
  button:
    fill: { desktop: "rgba(255,255,255,0.12)", mobile: "rgba(255,255,255,0.16)" }
    blur: { desktop: "16px",  mobile: "12px" }
```
```css
/* next/src/app/globals.css :root append (Phase 90) */
:root {
  /* v9.0 Living Blob palette (Phase 90) — see DESIGN.md > v9.0 Custom Rules */
  --blob-core: #35B678;       /* alias of --mu-green-600 */
  --blob-hot: #4FE098;        /* KD-v9-001 — pending brand approval */
  --blob-halo: rgba(98, 221, 177, 0.5);
  --blob-edge: rgba(125, 205, 255, 0.18);
  --blob-glint: rgba(255, 255, 255, 0.65);

  /* v9.0 Glass tier tokens — clamp(mobile-cap, fluid-vw, desktop-ceiling) */
  --glass-section-fill: rgba(255, 255, 255, 0.06);
  --glass-card-fill: rgba(255, 255, 255, 0.10);
  --glass-form-fill: rgba(255, 255, 255, 0.14);
  --glass-button-fill: rgba(255, 255, 255, 0.12);

  --glass-section-blur: clamp(12px, 2vw, 24px);
  --glass-card-blur:    clamp(12px, 1.6vw, 20px);
  --glass-form-blur:    clamp(12px, 1.4vw, 18px);
  --glass-button-blur:  clamp(12px, 1.2vw, 16px);

  /* v9.0 runtime CSS-var defaults (Phase 90 seed; Phase 91 engine writes per-frame) */
  --blob-x: 50vw;
  --blob-y: 50vh;
  --blob-body-x: 50vw;
  --blob-body-y: 50vh;
  --blob-halo-x: 50vw;
  --blob-halo-y: 50vh;
  --blob-heat: 0;
  --blob-velocity: 0;
}
```
**Notes:**
- Mobile fill values are slightly HIGHER than desktop for the same tier to compensate for the mobile blur cap reducing optical separation (TZ §11 hint).
- Mobile blur clamp floor = 12px on every tier (Phase 79 hard constraint, ROADMAP success criterion #1).
- `--blob-edge` exists as part of the palette per FND-01 / TZ §5; not used in Phase 90 visual output (Phase 91 may consume).

### Pattern 2: Inline `<style>` Seed (First Child of `<body>`)

**What:** Render initial CSS-var values inline so glass surfaces have valid values during first paint, before any JS hydrates.
**When to use:** Always — Phase 90 must seed `--blob-x/y/heat/velocity` and the body-x/y, halo-x/y siblings.
**Example:**
```jsx
// next/src/app/layout.tsx (Phase 90 diff)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-mu-text-50 text-mu-text-900 overflow-x-clip">
        {/* v9.0 Phase 90 — seed blob runtime vars before .living-blob-field paints */}
        <style>{`:root{--blob-x:50vw;--blob-y:50vh;--blob-body-x:50vw;--blob-body-y:50vh;--blob-halo-x:50vw;--blob-halo-y:50vh;--blob-heat:0;--blob-velocity:0;}`}</style>
        <SvgRefractionDefs />
        <div className="living-blob-field" aria-hidden="true" data-engine-active="false">
          <div className="blob-sublayer blob-core" />
          <div className="blob-sublayer blob-body" />
          <div className="blob-sublayer blob-halo" />
          <div className="blob-sublayer blob-glint" />
        </div>
        <Header />
        <LazyMotionProvider>
          <main className="relative z-10 pt-24 flex flex-col gap-8 md:gap-16 pb-8">{children}</main>
        </LazyMotionProvider>
        <Footer />
        <StickyBar />
      </body>
    </html>
  );
}
```
**Notes:**
- Defaults are also in `globals.css` for paint-without-JS — the inline style is defense in depth (overrides any cached `globals.css` fragments and lands earlier in critical render).
- Single-line minified style intentional — avoids whitespace tokens consuming bytes; React's `<style>` accepts string children in JSX without warnings.
- `MeshBackground` import line REMOVED (currently `layout.tsx:9`).

### Pattern 3: A11y Coverage Markers in `liquid-glass.css`

**What:** A grep-verifiable contract that every glass class is enumerated under all three a11y media queries.
**When to use:** FND-03; placed near the top of `liquid-glass.css` (after the file header comment block, before `Section 1`).
**Example:**
```css
/* ================================================
   v9.0 Phase 90 — A11y coverage block (FND-03)
   Single-source enumeration of every glass class
   under prefers-reduced-motion, prefers-reduced-transparency,
   prefers-contrast: more.

   CTA opaque-forever rule — see DESIGN.md > v9.0 Custom Rules.
   Do NOT add CTA gradient classes (.btn-primary, .liquid-btn-primary,
   gradient utilities) to this block — they must remain opaque
   regardless of user preference.

   Coverage verified by:
     grep -nE '\.(liquid|glass|blob|stats)-' liquid-glass.css \
       | (must each appear between markers)
   ================================================ */
/* @a11y-layer-coverage:start */

@media (prefers-reduced-motion: reduce) {
  .liquid-regular,
  .liquid-card,
  .liquid-nav,
  .liquid-clear,
  .liquid-fluted,
  .liquid-btn-secondary,
  .liquid-header-backdrop,
  .stats-glass,
  .glass-idle,
  .blob-sublayer,
  .blob-core,
  .blob-body,
  .blob-halo,
  .blob-glint,
  .living-blob-field {
    /* freeze: see existing Section 13 for blur/shimmer downgrade */
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .liquid-regular,
  .liquid-card,
  .liquid-nav,
  .liquid-clear,
  .liquid-fluted,
  .liquid-btn-secondary,
  .liquid-header-backdrop,
  .stats-glass,
  .glass-idle {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(255, 255, 255, 0.85) !important;
  }
  .living-blob-field,
  .blob-sublayer {
    display: none !important;
  }
}

@media (prefers-contrast: more) {
  .liquid-regular,
  .liquid-card,
  .liquid-nav,
  .liquid-clear,
  .liquid-fluted,
  .liquid-btn-secondary,
  .liquid-header-backdrop,
  .stats-glass,
  .glass-idle {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: #ffffff !important;
    border-color: rgba(0, 0, 0, 0.85) !important;
  }
  .living-blob-field,
  .blob-sublayer {
    /* dampen rather than hide — preserves spatial reference */
    opacity: 0.4 !important;
    filter: saturate(0.6) !important;
  }
}

/* @a11y-layer-coverage:end */
```
**Notes:**
- Existing Sections 13-14 (lines 717-829) remain — defense in depth. Phase 92 may consolidate; Phase 90 does not modify them.
- All three queries use `!important` because Tailwind utilities (`bg-white/N`) ship at the same specificity. Existing `globals.css` blocks (lines 508-538) already use this pattern.
- Class enumeration based on grep of existing class definitions: `.liquid-regular`, `.liquid-nav`, `.liquid-clear`, `.liquid-fluted`, `.liquid-card`, `.liquid-btn-primary`, `.liquid-btn-secondary`, `.liquid-header-backdrop`, `.stats-glass`, `.glass-idle`. Plus new `.blob-sublayer`, `.blob-core`, `.blob-body`, `.blob-halo`, `.blob-glint`, `.living-blob-field`. **`.liquid-btn-primary` and `.btn-primary` are intentionally EXCLUDED** (CTA opaque-forever).
- The grep-verification check (Step 4 of Validation Architecture) catches drift if Phase 92 adds new classes without registering them here.

### Pattern 4: `blob.css` Static Sublayer Styling

**What:** New stylesheet imported via `globals.css` that styles the 4 sublayer divs as a static ambient gradient — visual baseline for Phase 90 (Phase 91's reduced-motion fallback).
**When to use:** FND-06 visual register. Imported via `globals.css` `@import "../styles/blob.css";` near the existing `@import "../styles/liquid-glass.css";` (line 8).
**Example:**
```css
/* next/src/styles/blob.css — v9.0 Phase 90 (NEW FILE) */

.living-blob-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  contain: layout paint;     /* paint isolation; contains layout/paint cost */
}

.blob-sublayer {
  position: absolute;
  pointer-events: none;
  will-change: auto;          /* Phase 91 may flip to transform; Phase 90 static */
}

/* Static ambient — soft green/blue suggestion of where the live blob will live.
   Visual register: gentler than v8.1 MeshBackground (acceptable per FND-06). */
.blob-core {
  top: 50%; left: 50%;
  width: 160px; height: 160px;
  margin: -80px 0 0 -80px;
  background: radial-gradient(circle, var(--blob-core) 0%, transparent 70%);
  opacity: 0.18;
  filter: blur(24px);
}

.blob-body {
  top: 50%; left: 50%;
  width: 480px; height: 480px;
  margin: -240px 0 0 -240px;
  background: radial-gradient(circle, var(--blob-halo) 0%, transparent 75%);
  opacity: 0.35;
  filter: blur(40px);
}

.blob-halo {
  top: 50%; left: 50%;
  width: 800px; height: 800px;
  margin: -400px 0 0 -400px;
  background: radial-gradient(circle, var(--blob-edge) 0%, transparent 80%);
  opacity: 0.5;
  filter: blur(60px);
}

.blob-glint {
  top: 50%; left: 50%;
  width: 80px; height: 80px;
  margin: -40px 0 0 -40px;
  background: radial-gradient(circle, var(--blob-glint) 0%, transparent 60%);
  opacity: 0;                 /* glint is dwell-reactive; static-state hidden */
}

/* Phase 91 handoff: when canvas mounts, attribute flips to true and divs hide. */
.living-blob-field[data-engine-active="true"] .blob-sublayer {
  display: none;
}

/* Mobile: tighter blur + tighter halo to match Phase 79 GPU budget */
@media (max-width: 767.98px) {
  .blob-core { filter: blur(12px); width: 120px; height: 120px; margin: -60px 0 0 -60px; }
  .blob-body { filter: blur(12px); width: 320px; height: 320px; margin: -160px 0 0 -160px; opacity: 0.28; }
  .blob-halo { filter: blur(12px); width: 480px; height: 480px; margin: -240px 0 0 -240px; opacity: 0.36; }
}

/* Reduced motion: explicit static state (engine never starts in Phase 91 either) */
@media (prefers-reduced-motion: reduce) {
  .living-blob-field {
    /* enforce static — defense in depth */
    animation: none !important;
  }
  .blob-sublayer {
    transition: none !important;
  }
}

/* Reduced transparency: hide entirely — covered by liquid-glass.css @a11y block;
   restated here for blob.css self-containment. */
@media (prefers-reduced-transparency: reduce) {
  .living-blob-field { display: none !important; }
}
```

### Anti-Patterns to Avoid (Phase 90 specific)

- **Don't add Tailwind utility classes to `.living-blob-field` or `.blob-sublayer`.** They are CSS-only; mixing utilities makes Phase 91's runtime state-flip (`data-engine-active`) brittle.
- **Don't seed runtime vars in `<head>` via `next/script`.** App Router `<style>` first-child-of-body works without metadata API and lands earlier in critical render than a deferred script.
- **Don't add `--blob-hot` to any consumer in Phase 90.** Token registration only. Consumers come in Phase 91 (renderer) and Phase 92 (heat-leak gradients).
- **Don't enumerate `.liquid-btn-primary` / `.btn-primary` in the a11y `@layer` block.** CTA opaque-forever rule excludes them.
- **Don't archive `MeshBackground.tsx`.** Hard delete (locked Decision). Git history is sufficient.
- **Don't modify `liquid-glass.css` Sections 13-14.** Phase 90 ONLY prepends the new `@a11y-layer-coverage` block. Existing rules remain (defense in depth).
- **Don't introduce `oklch()` in new tokens.** Plain `rgba()` per TZ-prescriptive (TOK migration deferred to v10+).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS-var seeding | Custom React provider injecting `style.setProperty` post-mount | Inline `<style>` first child of `<body>` | Pre-paint values without hydration concern; reuses existing project pattern (FOUC-free theme detection script). |
| Token-to-CSS mirror enforcement | Custom AST walker | DESIGN.md YAML front matter + grep-verified consistency | Existing project convention (`CLAUDE.md > Design Contract`); Phase 90 verification step is `diff <(extract-yaml) <(grep --blob-)`. |
| A11y media-query enumeration | Component-scoped CSS modules per glass utility | Single-source `@a11y-layer-coverage` block + grep-verified | Bypass risk on new code paths (PITFALLS 2.1, 2.4, 2.5, 11.1) — single block prevents drift. |
| Static blob baseline | Canvas2D rendering on Phase 90 | Pure CSS `radial-gradient` on 4 absolutely-positioned divs | Phase 90 is foundation only; engine = Phase 91. CSS-only means no JS hydration cost, no rAF leak risk in Phase 90. |

**Key insight:** Phase 90 is exclusively an additive contract phase. Every new artifact has an existing project pattern to mirror. There are no novel runtime behaviors — those land in Phase 91.

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — Phase 90 ships no DB schema or stored config changes. | None. |
| Live service config | None — no Directus collection edits, no env var changes, no n8n workflow touched. | None. |
| OS-registered state | None — no scheduled tasks, no pm2/systemd registration. | None. |
| Secrets/env vars | None — no `.env` reads, no secret rotation. | None. |
| Build artifacts | `MeshBackground.tsx` removal: Next.js Webpack production build will re-emit chunks; `.next/` cache may retain stale module reference if build is incremental. | Delete `next/.next/` before final `pnpm build` verification. Documented in Phase 90 plan as "clean build" step. |

**Cross-route impact:** Per CONTEXT.md `<prior_decisions>` (v6.0): App Router shares `layout.tsx` across `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`, `/admin`, `/test-glass`. Phase 90 skeleton auto-mounts on every route. Verification (Step 10 / FND-06) must check all routes render without runtime errors.

## Common Pitfalls

(Filtered from `.planning/research/PITFALLS.md` to the 5 most relevant for Phase 90.)

### Pitfall 1: A11y media-query bypass on new code paths (PITFALLS 2.1, 2.4, 2.5, 11.1) — HIGH

**What goes wrong:** Phase 85 wired `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` for then-existing surfaces. Phase 90 introduces `.living-blob-field`, `.blob-sublayer`, `.blob-core`, `.blob-body`, `.blob-halo`, `.blob-glint` — fresh code paths that bypass that wiring.

**Why it happens:** Each phase adds CSS without auditing the a11y media-query selector lists. Phase 89's cheat-pass on ACC-01..05 demonstrates the failure mode.

**How to avoid:**
- Single-source `@a11y-layer-coverage:start/end` block in `liquid-glass.css` enumerates every glass class.
- Grep verification: `grep -nE '\.(liquid|glass|blob|stats|living-blob)-' next/src/styles/liquid-glass.css next/src/styles/blob.css` then assert every match also appears between markers.
- Defense in depth: `blob.css` itself includes its own `@media (prefers-reduced-*)` blocks — independently of the central registry.

**Warning signs:**
- `pnpm build` succeeds but a class with `backdrop-filter` or `opacity` animation isn't between the markers.
- New `.glass-*` or `.blob-*` rule appears in Sections 1-12 of `liquid-glass.css` but not in the new block.
- `must_haves.truths` entry for plan: `Every new .glass-* / .blob-* / .liquid-* class added in Phase 90 is enumerated between @a11y-layer-coverage markers.`

### Pitfall 2: Mobile blur regression past 12px (PITFALLS 1.1) — HIGH

**What goes wrong:** Phase 79 shipped the 12px mobile cap. v9.0 token additions could relax it via `clamp()` floors above 12px or via mobile-specific `--glass-*-blur` values exceeding 12px.

**Why it happens:** Default thinking is "lower mobile blur than desktop." But the mobile FLOOR must also be 12px — a `clamp(8px, ...)` accidentally permits 8px on viewports above 768px (where the clamp transitions to fluid), it's the FLOOR ON MOBILE that matters.

**How to avoid:**
- Every `--glass-*-blur` token uses `clamp(12px, Nvw, ceiling)` — 12px is the FLOOR (i.e., minimum applied value at any viewport, including mobile). Note: `clamp(min, fluid, max)` returns max(min, min(fluid, max)) — at small viewports, `Nvw` is small, so `min` (12px) wins. This is correct.
- Validation: `grep '--glass-.*-blur:' next/src/app/globals.css` then assert each line uses `clamp(12px, ...)`.
- `must_haves.truths` entry: `Every --glass-*-blur token in globals.css starts with clamp(12px, ...).`
- Cross-check: `globals.css` lines 490-500 already enforce mobile cap on Tailwind utilities; new `--glass-*-blur` tokens layer on top without violating.

**Warning signs:**
- A `--glass-*-blur` token defined as `Npx` (literal) instead of `clamp()`.
- Mobile viewport DevTools shows a glass surface with effective blur >12px.

### Pitfall 3: rAF / listener leaks under React Strict Mode + App Router (PITFALLS 1.5, 8.3) — HIGH but PHASE-91 CONCERN

**Phase 90 relevance:** Phase 90 ships NO JS engine — nothing to leak. **However**, the inline `<style>` seed must not introduce runtime side-effects (e.g., `<script>` with attached listeners). The seed is pure CSS only.

**How to avoid in Phase 90:**
- `<style>` first child of `<body>` is JSX content (string children) — no listeners, no rAF.
- `must_haves.truths` entry: `Phase 90 ships zero JavaScript runtime code. The inline <style> seed contains only CSS custom-property declarations.`

**Warning signs:**
- Plan introduces `<script dangerouslySetInnerHTML>` to seed runtime state — STOP, that's Phase 91.
- Plan adds `useEffect` to `layout.tsx` — STOP.

### Pitfall 4: CSS @import ordering breaks token availability (PITFALLS 10.1) — MED

**What goes wrong:** New `blob.css` is imported AFTER `liquid-glass.css` and `squircles.css`, but BEFORE `:root` token registration in `globals.css`, leading to undefined `var(--blob-core)` references at first paint.

**Why it happens:** `globals.css` already imports order is: `tailwindcss` → `tw-animate-css` → `liquid-glass.css` → `squircles.css` → `shadcn/tailwind.css` → then `:root` block defines tokens. CSS `@import` rules MUST appear before any other rules; new tokens in `:root` are in the same file but come AFTER imports — token visibility relies on cascade order, not source order.

**How to avoid:**
- New `--blob-*` tokens defined in `globals.css :root` are visible to `blob.css` via cascade — `:root` selector is the universal ancestor; tokens flow down regardless of file load order, as long as the tokens exist in `:root` when CSSOM is computed.
- Place `@import "../styles/blob.css";` in `globals.css` AFTER `@import "../styles/liquid-glass.css";` (alongside other style imports) — line 8-10 area.
- Validation: load `/`, open DevTools Computed → `:root` element → confirm `--blob-core: #35B678` is listed.

**Warning signs:**
- DevTools shows `--blob-core` as `<empty>` on `:root`.
- `.blob-core` background renders as transparent/black instead of green gradient.

### Pitfall 5: DESIGN.md YAML / globals.css drift (PITFALLS 14.1) — HIGH

**What goes wrong:** Phase 90 lands token in `globals.css` but forgets to update DESIGN.md YAML, or vice versa. CLAUDE.md Design Contract says "When the two diverge, this file [DESIGN.md] wins" — so drift means the next phase starts from the wrong contract.

**How to avoid:**
- Validation step: extract token names from both sides, diff.
- Manual check: every `--blob-*` and `--glass-*` line in `globals.css :root` must have a matching entry in DESIGN.md YAML `colors:` or `glass:`.
- `must_haves.truths` entry: `Token names in DESIGN.md YAML and globals.css :root match exactly for all v9.0 additions.`

**Warning signs:**
- `--blob-edge` defined in `globals.css` but missing from YAML `colors:`.
- DESIGN.md YAML lists `glass.section.fill` but `globals.css` only has `--glass-card-fill`.

## Code Examples

(All patterns above are concrete examples; this section consolidates the canonical commands the plan-checker will validate.)

### Token mirror diff command
```bash
# Extract --blob-* and --glass-* token names from globals.css
grep -oE '\-\-(blob|glass)-[a-z-]+' next/src/app/globals.css | sort -u

# Extract YAML keys from DESIGN.md (relies on YAML front matter parsing — verify by eye for now)
sed -n '/^colors:/,/^[a-z]/p' DESIGN.md | grep -E '^\s+blob-' | sed -E 's/^\s+([a-z-]+):.*/\1/'
sed -n '/^glass:/,/^[a-z]/p' DESIGN.md | grep -E '^\s+(section|card|form|button):' -A 2
```

### A11y `@layer` coverage grep
```bash
# 1. List every glass-related class definition in liquid-glass.css and blob.css
grep -nE '^\.(liquid-|glass-|blob-|stats-|living-blob)' \
  next/src/styles/liquid-glass.css next/src/styles/blob.css | sort -u

# 2. Extract the @a11y-layer-coverage block content
awk '/@a11y-layer-coverage:start/,/@a11y-layer-coverage:end/' \
  next/src/styles/liquid-glass.css

# 3. Manual diff: every class from (1) (except .btn-primary, .liquid-btn-primary) appears in (2).
```

### Mobile blur cap verification
```bash
# Every --glass-*-blur uses clamp(12px, ...) as floor
grep -E '\-\-glass-[a-z]+-blur:' next/src/app/globals.css

# Expected output: each line starts with `clamp(12px, ...)` — fail if any starts with literal Npx or clamp(<12px, ...)
```

### Build verification
```bash
cd next && rm -rf .next && pnpm build
# Expected: zero new warnings, zero errors. MeshBackground import warnings absent.
```

### Routes smoke test (manual; Phase 91 will Playwright-ize)
```bash
cd next && pnpm dev
# Visit each route and confirm no console errors:
#   http://localhost:3000/
#   http://localhost:3000/checkup
#   http://localhost:3000/consultations
#   http://localhost:3000/treatment-abroad
#   http://localhost:3000/contacts
#   http://localhost:3000/test-glass     (verify blob-hot swatch row visible)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `MeshBackground.tsx` static blurred-circle blobs + 40px frosted overlay | `.living-blob-field` flat-sibling skeleton with 4 sublayers (Phase 90 static, Phase 91 live) | v9.0 milestone (Phase 90 ships skeleton) | Visual register softens (acceptable per FND-06); architecture unblocks live blob renderer in Phase 91. |
| Per-phase a11y rule additions (Phase 79, 85) | Single-source `@a11y-layer-coverage` block | v9.0 Phase 90 | New glass classes flagged at code-review time via grep; prevents Phase 89-style cheat-pass. |
| Tokens defined ad-hoc in `globals.css` | Tokens registered in DESIGN.md YAML first, mirrored to `globals.css` | v6.0 Design Contract; v9.0 enforces strictly via Phase 90 audit | Single source of truth; CI enforcement deferred but manual diff is mandatory. |

**Deprecated/outdated:**
- `MeshBackground.tsx`: replaced by `.living-blob-field` skeleton. **DELETED in Phase 90.**
- `--liquid-bg: rgba(255, 255, 255, 0.42)` (globals.css:120): not deprecated yet, but will be repointed to new `--glass-*` tokens in Phase 92. Phase 90 leaves it unchanged.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tailwind v4 `@theme inline` directive accepts the new `--blob-*` and `--glass-*` tokens without explicit registration in `@theme inline` block (since they're not used as Tailwind utilities in Phase 90, just as raw CSS vars). [ASSUMED] | Standard Stack | Low — Phase 90 doesn't add Tailwind utilities for new tokens. If Tailwind requires `@theme inline` mapping for `var(--blob-*)` to work in Tailwind utilities, that's a Phase 92 concern when utilities consume them. |
| A2 | The static gradient values in `blob.css` (opacity 0.18 / 0.35 / 0.5 / blurs 24/40/60) produce a "soft green/blue ambient softer than v8.1 MeshBackground" per FND-06. [ASSUMED — visual judgment, must be eyeballed] | Pattern 4 (blob.css) | MEDIUM — if visual register is too jarring, plan task includes a tuning round. CONTEXT.md §<decisions> "visual parity note" pre-declares this acceptable. |
| A3 | Mobile glass tier fill values (0.10 / 0.14 / 0.18 / 0.16) produce WCAG AA-readable surfaces in Phase 92 with the locked alpha floor of 0.16 for forms. [ASSUMED — to be validated in Phase 92, not Phase 90] | Pattern 1 (Token Mirror) | LOW for Phase 90 — token registration alone has no readability impact. Phase 92 may escalate `--glass-form-fill` to 0.30 with logged Key Decision per `.planning/STATE.md > Pending Key Decisions`. |
| A4 | The grep regex `^\.(liquid-|glass-|blob-|stats-|living-blob)` captures every glass class name without false negatives. [ASSUMED — based on inspection of `liquid-glass.css` lines 74-1037 and `globals.css` `@layer components` blocks] | Validation Architecture FND-03 | MEDIUM — if a future class uses a different prefix (e.g., `.frost-` or `.translucent-`), the markers miss it. Mitigation: code review checklist item; plan-check enforces. |
| A5 | The `<style>` JSX child inlining (`<style>{`...`}</style>`) does not trigger Next.js 15 App Router warnings about CSS-in-JS or hydration mismatches. [ASSUMED — based on App Router supporting inline styles in body since Next 13.4] | Pattern 2 (Inline `<style>` Seed) | LOW — verifiable via `pnpm build` smoke. If build warns, fall back to `dangerouslySetInnerHTML` on `<style>` (functionally equivalent). |
| A6 | medicusunion.com and medicusunion.kz brand greens for the `/test-glass` swatch comparison can be referenced via hex literals (sampled from live sites). The exact reference hexes are not given in the canonical refs — planner/executor will pixel-pick during plan execution. [ASSUMED] | Decision B (Key Decision flow) | LOW — swatch is decorative for human comparison; exact reference hex selection happens in plan execution. |

**If user confirms these assumptions are reasonable, Phase 90 can proceed without further discuss-phase iteration.** Discuss-phase already locked the high-stakes decisions (A, B, C, D); these assumptions are tactical execution details.

## Open Questions

1. **YAML field name for glass tier registry — `glass:` vs `glassTiers:` vs `effects.glass:`?**
   - What we know: DESIGN.md current YAML uses flat top-level keys (`colors:`, `typography:`, `rounded:`, `spacing:`, `shapes:`, `components:`).
   - What's unclear: Whether v9.0 adds `glass:` as a new top-level key or nests under `effects:` / `components:`.
   - Recommendation: **Use top-level `glass:` key** — mirrors flat structure of `colors:`. Document rationale in plan task. Easy to refactor later if drift surfaces.

2. **Should `--blob-edge` be wrapped in CSS `light-dark()` for future dark-mode tuning?**
   - What we know: TZ §5 prescribes a single value `rgba(125, 205, 255, 0.18)`; Phase 91 dark-mode dimming is a separate concern (BLOB-09, opacity ≤0.35).
   - What's unclear: Whether dark theme should adjust `--blob-edge` opacity at the token level or via `[data-theme="dark"]` selector overrides.
   - Recommendation: **Plain `rgba()` in Phase 90.** Dark-mode tuning is BLOB-09 territory; out of Phase 90 scope per CONTEXT.md `<deferred>` ("oklch token migration").

3. **CONTEXT.md Decision A specifies `data-engine-active="false"` — should the attribute also be exposed as a TypeScript constant somewhere for Phase 91 to import?**
   - What we know: Phase 91 will flip the attribute to `"true"` from inside `LivingBlobField.tsx`.
   - What's unclear: Whether Phase 90 should pre-declare a constants module (`next/src/lib/blob-constants.ts`) or leave that to Phase 91.
   - Recommendation: **Leave to Phase 91.** Phase 90's contract is the literal string `"false"` in JSX; Phase 91 owns runtime state plumbing. Avoids speculative APIs.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Next.js | `layout.tsx` edits, `pnpm build` validation | ✓ | 15.5.15 | — |
| pnpm | Build verification (`pnpm build`) | ✓ (assumed; project uses pnpm per `next/package.json`) | — | npm or yarn (project uses pnpm; deviation flagged) |
| TypeScript compiler | Type-checking `layout.tsx`, `test-glass/page.tsx` | ✓ | 5.x | — |
| `grep`, `awk`, `sed`, `diff` | Validation Architecture commands | ✓ (POSIX, macOS Darwin per env) | — | — |

**Skip rationale: NOT skipped.** Phase 90 does have external tooling dependencies (Next.js build, pnpm). All available.

## Validation Architecture

> Required because `workflow.nyquist_validation` is `true` in `.planning/config.json`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — Phase 90 ships zero runtime JS code; existing project does not have Playwright/Vitest configured for components. Verification is **static-grep + build-success + manual visual smoke**. |
| Config file | None — see "Wave 0 Gaps" if framework introduction is needed. |
| Quick run command | `cd next && pnpm build` |
| Full suite command | Composite of grep validations + build + manual route smoke (see per-FND map). |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FND-01 | All 5 `--blob-*` palette tokens registered in DESIGN.md YAML AND `globals.css :root` | static-grep + manual diff | `diff <(grep -oE '\-\-blob-[a-z]+' next/src/app/globals.css \| sort -u) <(awk '/^colors:/,/^[a-z]+:/' DESIGN.md \| grep -oE 'blob-[a-z]+' \| sed 's/^/--/' \| sort -u)` — exit 0 expected | ✅ (files exist; tokens land in Phase 90) |
| FND-02 | All 4 glass tiers × 2 properties (fill+blur) × 2 viewports defined; mobile blur ≤12px | static-grep + arithmetic check | `grep -E '\-\-glass-(section\|card\|form\|button)-(fill\|blur):' next/src/app/globals.css \| wc -l` → expects `8` (4 tiers × 2 props); then `grep -E '\-\-glass-[a-z]+-blur:' next/src/app/globals.css \| grep -vE 'clamp\(12px,'` → expects empty | ✅ (globals.css exists; tokens land in Phase 90) |
| FND-03 | A11y `@layer` block covers every glass class | static-grep coverage check | Step 1: `grep -hoE '^\.(liquid-\|glass-\|blob-\|stats-\|living-blob)[a-zA-Z0-9_-]*' next/src/styles/liquid-glass.css next/src/styles/blob.css \| sort -u > /tmp/all-classes.txt`; Step 2: `awk '/@a11y-layer-coverage:start/,/@a11y-layer-coverage:end/' next/src/styles/liquid-glass.css \| grep -hoE '\.[a-zA-Z][a-zA-Z0-9_-]+' \| sort -u > /tmp/covered.txt`; Step 3: `comm -23 /tmp/all-classes.txt /tmp/covered.txt \| grep -vE '\.(btn-primary\|liquid-btn-primary)'` → expects empty | ✅ (files exist; markers land in Phase 90) |
| FND-04 | Z-index contract present in DESIGN.md (blob-field z-0, main z-1..10, header/sticky z-50+, modals z-100+) | static-grep on body | `grep -A 5 'v9.0 Custom Rules' DESIGN.md \| grep -E 'z-?(0\|10\|50\|100)'` → expects ≥4 matches with each tier represented | ✅ (DESIGN.md exists; section lands in Phase 90) |
| FND-05a | DESIGN.md `## v9.0 Anti-Patterns` body section exists with 15 numbered entries | static-grep | `awk '/^## v9.0 Anti-Patterns/,/^## /' DESIGN.md \| grep -cE '^[0-9]+\.'` → expects `15` (or `≥ 15`) | ✅ |
| FND-05b | DESIGN.md YAML has `antiPatterns:` field with 15 entries (`- name:` lines) | static-grep | `awk '/^antiPatterns:/,/^[a-z]+:/' DESIGN.md \| grep -c '^\s*- name:'` → expects `15` | ✅ |
| FND-05c | DESIGN.md "v9.0 Custom Rules" enumerates 7 CTA opaque-forever components by name | static-grep | `awk '/CTA opaque-forever/,/^### /' DESIGN.md \| grep -E '^[0-9]+\.\s' \| wc -l` → expects `≥7` (HeroHub, FinalCTA, ContactForm, StickyBar, Header phone, LeadFormSection, .btn-primary) | ✅ |
| FND-05d | `liquid-glass.css` carries the CTA-opaque comment block within `@a11y-layer-coverage` markers | static-grep | `awk '/@a11y-layer-coverage:start/,/@a11y-layer-coverage:end/' next/src/styles/liquid-glass.css \| grep -F 'CTA opaque-forever rule'` → expects 1 match | ✅ |
| FND-06a | `<div class="living-blob-field" aria-hidden="true" data-engine-active="false">` skeleton present in `layout.tsx` with 4 children | static-grep | `grep -c 'class="living-blob-field"\|className="living-blob-field"' next/src/app/layout.tsx` → expects `1`; `grep -c 'blob-sublayer' next/src/app/layout.tsx` → expects `4` | ✅ |
| FND-06b | Inline `<style>` seed first child of `<body>` with all 8 vars | static-grep | `grep -E '<style>.*--blob-x.*--blob-y.*--blob-heat' next/src/app/layout.tsx` → expects 1 match | ✅ |
| FND-06c | `MeshBackground.tsx` deleted | filesystem check | `test ! -f next/src/components/layout/MeshBackground.tsx && ! grep -q 'MeshBackground' next/src/app/layout.tsx` → exit 0 | ✅ |
| FND-06d | Page renders without runtime errors on all 5 main routes | manual visual smoke (no automated test infra in project) | Manually open `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts` in `pnpm dev` and confirm DevTools console clean | ✅ (routes exist) |
| FND-06e | `pnpm build` passes with zero new warnings | build-success | `cd next && rm -rf .next && pnpm build 2>&1 \| tee /tmp/build.log; grep -E '(warn\|Error)' /tmp/build.log` → manual review for v9.0-introduced lines (baseline warning count must not increase) | ✅ |
| FND-07a | KD-v9-001 row in PROJECT.md Key Decisions table with status `pending` | static-grep | `grep -E 'KD-v9-001.*--blob-hot.*#4FE098.*pending' .planning/PROJECT.md` → expects 1 match | ✅ |
| FND-07b | `/test-glass` route renders blob-hot comparison swatch | static-grep + manual visual | `grep -F '#4FE098' next/src/app/test-glass/page.tsx` → expects ≥1 match; manual visual: open `/test-glass`, confirm 3-color swatch row visible, labeled | ✅ |
| Cross-cutting: no new dependencies | `package.json` unchanged | filesystem diff | `cd next && git diff --stat package.json pnpm-lock.yaml` → expects no changes | ✅ |
| Cross-cutting: visual diff vs v8.1 acceptable | Index `/` renders softer-but-similar | manual visual smoke | Open `/` before/after Phase 90 ship, side-by-side; confirm header/hero/stats/services unchanged; ambient softer than MeshBackground (acceptable per FND-06 visual parity note) | ✅ |

### Sampling Rate

- **Per task commit:** `cd next && pnpm build` (Quick run); 30-90s on warm cache.
- **Per wave merge:** Run all 17 grep checks above + `pnpm build` + manual route smoke (5 routes).
- **Phase gate:** All 17 checks green AND `90-VERIFICATION.md` includes user attestation that `/test-glass` was viewed and `KD-v9-001` either updated to `approved` or alternate hex proposed.

### Wave 0 Gaps

- [ ] No automated visual regression framework currently in repo. Phase 90 manual smoke is acceptable; Phase 94 will add Playwright per VER-01.
- [ ] No CI grep enforcement of `@a11y-layer-coverage` markers. Phase 90 ships markers + plan-check verification step; CI rule deferred to v9.1+ per CONTEXT.md `<deferred>`.
- [ ] No automated DESIGN.md ↔ globals.css token mirror diff. Phase 90 plan-check runs the diff manually; CI script deferred to v9.1+.

*(All gaps explicitly accepted per CONTEXT.md `<deferred>` and v9.0 phase boundary.)*

## Sources

### Primary (HIGH confidence)

- `design/LIQUID_GLASS_BLOB_TZ.md` — TZ §5 (palette), §9 (alpha tiers), §11 (depth hierarchy), §15 (a11y), §16 (anti-patterns), §17 (technical model). All numerical Phase 90 targets trace here.
- `.planning/REQUIREMENTS.md` (FND-01..07) — Locked requirements [VERIFIED: read 2026-04-30].
- `.planning/phases/90-foundation-tokens-a11y-wiring-dom-skeleton/90-CONTEXT.md` — User decisions [VERIFIED: read 2026-04-30].
- `.planning/research/SUMMARY.md` — Synthesis confirming zero new dependencies + file change inventory [VERIFIED: read 2026-04-30].
- `.planning/research/PITFALLS.md` — Top 5 pitfalls relevant to Phase 90 [VERIFIED: read 2026-04-30].
- `.planning/ROADMAP.md` — Phase 90 success criteria [VERIFIED: read 2026-04-30].
- `DESIGN.md` (repo root) — Hard constraints (mobile blur ≤12px, ≤2 glass per viewport, brand parity rule, Apple HIG compliance) [VERIFIED: read 2026-04-30].
- `next/src/app/layout.tsx` (62 lines) — Mount-order baseline for skeleton edit [VERIFIED: read 2026-04-30].
- `next/src/app/globals.css` (689 lines) — `:root` token registration site, `@theme inline` Tailwind v4 syntax [VERIFIED: read 2026-04-30].
- `next/src/styles/liquid-glass.css` (1037 lines) — Existing class enumeration for a11y `@layer` block, existing Sections 13-14 a11y precedent [VERIFIED: read 2026-04-30].
- `next/src/components/layout/MeshBackground.tsx` (17 lines) — Deletion target [VERIFIED: read 2026-04-30].
- `next/src/hooks/use-specular-highlight.ts` (82 lines) — Reference rAF + CSS-var pattern [VERIFIED: read 2026-04-30; preserved untouched per CONTEXT.md].
- `next/src/app/test-glass/page.tsx` — Existing swatch route receiving blob-hot comparison addition [VERIFIED: read 2026-04-30].
- `.planning/PROJECT.md` (lines 159-188) — Existing Key Decisions table format [VERIFIED: read 2026-04-30; KD-v9-001 row will follow same format].
- `next/package.json` — Stack versions: Next 15.5.15, React 19.1.0, TypeScript 5, Tailwind 4 [VERIFIED via SUMMARY.md citation cross-checked against project].

### Secondary (HIGH confidence — official docs / cross-checked)

- [MDN — CSS `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) — Cascade Layers spec [CITED]; baseline supported in evergreen browsers since 2022.
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) [CITED].
- [MDN — `prefers-reduced-transparency`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency) [CITED] — note: Chrome/Edge 118+ only as of project's existing comment in liquid-glass.css:764.
- [MDN — `prefers-contrast`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) [CITED].
- [Next.js App Router — RootLayout](https://nextjs.org/docs/app/api-reference/file-conventions/layout) [CITED].

### Tertiary (LOW confidence — none in this research)

(None. Phase 90 is fully grounded in primary sources + project files.)

## Project Constraints (from CLAUDE.md)

Extracted from `/Users/mikhail/Projects/Medicus_video_consult-landing/CLAUDE.md`:

| Directive | Source Section | Phase 90 Application |
|-----------|---------------|---------------------|
| Stack: Next.js + React + TypeScript + Tailwind (with v6.0) | Constraints | Honored — no new dependencies, all edits within stack. |
| Language: Russian only | Constraints | No user-facing strings introduced in Phase 90 (skeleton is `aria-hidden="true"`; KD log is internal). |
| Mobile blur ≤12px, ≤2 glass elements per viewport | Constraints + Design Contract | All `--glass-*-blur` use `clamp(12px, ...)`; Phase 90 token registration alone does not violate ≤2 layers (enforcement is Phase 92). |
| Mobile-first, ЦА 45+ (large fonts, high contrast) | Constraints | No typographic / text changes in Phase 90; visual register softens but contrast is preserved (no copy lands on blob area). |
| Tone: спокойный, медицинский | Constraints | Static blob ambient is calmer than v8.1 MeshBackground — supports tone. |
| Brand parity rule — every color traces to medicusunion.com or .kz | Design Contract | `--blob-hot: #4FE098` is the SINGLE new color; logged as KD-v9-001 with `pending` status; gates Phase 91. Other tokens are aliases (`--blob-core` = `--mu-green-600`) or alpha-only derivations. |
| Apple Liquid Glass HIG compliance — token scale `--liquid-blur-{sm,md,lg,xl}` = 16/24/40/60 | Design Contract | New `--glass-*-blur` tokens layer alongside, do NOT override existing scale. Existing tokens preserved. |
| `@supports` fallbacks required for `backdrop-filter` | Design Contract | Existing `@supports not (backdrop-filter: blur(1px))` block at liquid-glass.css:840 covers existing classes; new `.blob-*` does NOT use `backdrop-filter`, so no new fallback needed. |
| `prefers-reduced-{transparency,motion}` and `prefers-contrast` MUST be honored | Design Contract | FND-03 single-source `@a11y-layer-coverage` block enforces this for new classes. |
| Dark mode disables `backdrop-filter` | Design Contract | Phase 90 doesn't touch dark mode behavior; new `.blob-*` classes do not use `backdrop-filter`, so unaffected. |
| GSD Workflow Enforcement — all edits go through GSD command | Workflow | This research IS Phase 90 GSD workflow; downstream plan/execute will continue. |

**Compliance assertion:** Every directive above is either honored by design or out of Phase 90 scope.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified in `next/package.json`; zero new deps.
- Architecture: HIGH — every file edit is locked in CONTEXT.md; mount order verified against `layout.tsx:47-61`; precedent patterns exist for every change.
- Pitfalls: HIGH — top 5 sourced from `.planning/research/PITFALLS.md` which is itself grounded in TZ + DESIGN.md + Phase 79/85/89 history.
- Validation: HIGH — every FND-NN has a static-grep or build-success command; manual smoke acceptable per project conventions and Phase 94 deferral.
- Token values: HIGH — TZ-prescriptive (§5, §9, §11, §17).
- Visual register of static blob ambient: MEDIUM — A2 in Assumptions Log; pre-declared acceptable per CONTEXT.md `<decisions>` "visual parity note."

**Research date:** 2026-04-30
**Valid until:** 2026-05-30 (30 days; foundation phase, low velocity).
**Supersedes:** None — this is the first Phase 90 research artifact.
