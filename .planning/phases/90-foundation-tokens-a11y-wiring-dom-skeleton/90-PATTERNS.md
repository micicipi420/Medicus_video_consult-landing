# Phase 90: Foundation — Tokens, A11y Wiring, DOM Skeleton — Pattern Map

**Mapped:** 2026-04-30
**Files analyzed:** 8 (5 modified, 1 new, 1 deleted, 1 doc-modified)
**Analogs found:** 8 / 8 (all in-repo precedents)

## File Classification

| File | Action | Role | Data Flow | Closest Analog | Match Quality |
|------|--------|------|-----------|----------------|---------------|
| `DESIGN.md` | MODIFY | MD-design-doc (YAML + body) | static contract | Self (existing `colors:` / `typography:` YAML blocks lines 11-118) | exact (extension of own structure) |
| `next/src/app/globals.css` | MODIFY (append `:root`) | CSS-token | static cascade | Self (existing `--liquid-blur-*` tokens lines 119-145) | exact |
| `next/src/styles/liquid-glass.css` | MODIFY (prepend a11y block + markers; class internals FROZEN) | CSS-a11y | static cascade | Self (existing Section 13 lines 717-754, Section 14 lines 768-829) | exact |
| `next/src/styles/blob.css` | NEW | CSS-component (sublayer styles) | static cascade | `next/src/styles/squircles.css` (sibling file in `next/src/styles/`); structurally analogous to `liquid-glass.css` Section 1 (`.liquid-regular` lines 74-105) | role-match |
| `next/src/app/layout.tsx` | MODIFY (add `<style>` seed + skeleton; remove MeshBackground import + render) | TSX-layout | static SSR | Self (current layout.tsx lines 47-62) | exact (in-place edit) |
| `next/src/components/layout/MeshBackground.tsx` | DELETE | FILE-DELETE | n/a | n/a — only consumer is `layout.tsx:9, 52` | n/a |
| `next/src/app/test-glass/page.tsx` | MODIFY (append blob-hot comparison swatch) | TSX-route (test/swatch) | static SSR | Self (existing "Squircle Shapes" row lines 82-98 — flat divs with labels) | exact (same row pattern) |
| `.planning/PROJECT.md` | MODIFY (append KD-v9-001 row to "Key Decisions" table) | MD-project-state | static doc | Self (existing Key Decisions table lines 159-187) | exact (table-row append) |

---

## Pattern Assignments

### `DESIGN.md` (MD-design-doc, modify YAML + body)

**Analog:** Self — existing `colors:` block at lines 11-73 + `typography:` at lines 75-118 establish flat top-level YAML keys with hyphen-cased token names quoted as strings.

**YAML "flat top-level key" pattern** (DESIGN.md lines 11-26):
```yaml
colors:
  # ── Brand core ──────────────────────────────────────────────
  brand-blue: "#38C6F4"
  brand-black: "#010101"
  brand-white: "#FFFFFF"

  # ── Green scale (CTA / success) ─────────────────────────────
  green-50: "#E4FAEF"
  …
  green-600: "#35B678"
```

**Apply for:**
- Append `# ── v9.0 Living Blob palette ──` subsection inside existing `colors:` block (DESIGN.md ~line 73, before `typography:`):
  ```yaml
  blob-core: "#35B678"
  blob-hot: "#4FE098"
  blob-halo: "rgba(98, 221, 177, 0.5)"
  blob-edge: "rgba(125, 205, 255, 0.18)"
  blob-glint: "rgba(255, 255, 255, 0.65)"
  ```
- Add NEW top-level `glass:` key after `colors:` with nested `section/card/form/button → fill/blur → desktop/mobile` as documented in RESEARCH.md Pattern 1 (lines 272-285).
- Add NEW top-level `antiPatterns:` key (15 entries; format `- name: "…" \n  why: "…" \n  addedIn: "v9.0 Phase 90"`) — full content list in CONTEXT.md `<decisions>` Decision D.

**Markdown body sections to add:**
- `## v9.0 Custom Rules` — z-index contract (FND-04: blob-field z-0, main z-1..10, header/sticky z-50+, modals z-100+) + CTA opaque-forever rule with 7-component master list (CONTEXT.md Decision C).
- `## v9.0 Anti-Patterns` — body expansion of YAML `antiPatterns` field with name/why/where-it-manifests/what-to-do-instead.

**Executor MUST NOT touch:**
- Existing `colors:` brand entries (lines 11-73 above blob subsection).
- Existing `typography:`, `rounded:`, `spacing:`, `shapes:`, `components:` keys.
- Front-matter YAML delimiters (`---` lines).

---

### `next/src/app/globals.css` (CSS-token, append `:root`)

**Analog:** Self — existing `--liquid-blur-*` mobile-aware token block at lines 119-145.

**Existing `clamp(mobile-floor, fluid-vw, desktop-ceiling)` pattern** (globals.css lines 119-145):
```css
/* Liquid Glass tokens (light mode) */
--liquid-bg: rgba(255, 255, 255, 0.42);
/* v8.0 mobile-aware glass blur (Phase 79) — clamp(mobile-floor, fluid-via-vw, desktop-ceiling) */
--liquid-blur-sm: clamp(8px, 1.2vw, 16px);
--liquid-blur-md: clamp(12px, 2vw, 24px);
--liquid-blur-lg: clamp(12px, 3vw, 40px);
--liquid-blur-xl: clamp(12px, 4vw, 60px);
--liquid-saturate: 180%;
--liquid-brightness: 108%;
…

/* Glass hierarchy tokens */
--liquid-nav-bg: rgba(255, 255, 255, 0.28);
--liquid-nav-blur: clamp(8px, 1.2vw, 16px);
…
```

**Apply for:** Append a single new comment block + tokens at end of `:root` block (before the closing `}`):

```css
/* v9.0 Living Blob palette (Phase 90) — see DESIGN.md > v9.0 Custom Rules */
--blob-core: #35B678;       /* alias of --mu-green-600 */
--blob-hot: #4FE098;        /* KD-v9-001 — pending brand approval */
--blob-halo: rgba(98, 221, 177, 0.5);
--blob-edge: rgba(125, 205, 255, 0.18);
--blob-glint: rgba(255, 255, 255, 0.65);

/* v9.0 Glass tier tokens (Phase 90) — clamp(12px, fluid-vw, desktop-ceiling); 12px is mobile floor (Phase 79 hard cap) */
--glass-section-fill: rgba(255, 255, 255, 0.06);
--glass-card-fill:    rgba(255, 255, 255, 0.10);
--glass-form-fill:    rgba(255, 255, 255, 0.14);
--glass-button-fill:  rgba(255, 255, 255, 0.12);
--glass-section-blur: clamp(12px, 2vw,   24px);
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
```

**Also add (after existing `@import "../styles/squircles.css";` at line 9):**
```css
@import "../styles/blob.css";
```

**Executor MUST NOT touch:**
- Existing `--mu-*` brand tokens (lines 18-50).
- Existing `--liquid-*` tokens (lines 119-145) — Phase 92 may repoint these; Phase 90 leaves them.
- Existing `--squircle-*` tokens (lines 114-117).
- Tailwind v4 `@theme inline` directive (line ~240) — new `--blob-*` and `--glass-*` are NOT registered as Tailwind utilities in Phase 90.
- `@import` order — keep `tailwindcss` first, then `tw-animate-css`, then design-system layers (liquid-glass.css, squircles.css, blob.css), then `shadcn/tailwind.css`.

---

### `next/src/styles/liquid-glass.css` (CSS-a11y, prepend single-source block; class internals FROZEN until Phase 92)

**Analog:** Self — existing Section 13 (`prefers-reduced-motion`, lines 717-754) and Section 14 (`prefers-reduced-transparency`, lines 768-829) demonstrate the enumeration pattern + `!important` specificity.

**Existing Section 13 pattern** (liquid-glass.css lines 717-733):
```css
@media (prefers-reduced-motion: reduce) {
  .liquid-regular,
  .liquid-card,
  .liquid-nav,
  .liquid-clear,
  .liquid-fluted,
  .liquid-btn-secondary,
  .stats-glass,
  html[data-refract="true"] .liquid-regular,
  …
  .stats-glass {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  …
}
```

**Existing Section 14 pattern** (liquid-glass.css lines 768-785):
```css
@media (prefers-reduced-transparency: reduce) {
  .liquid-regular,
  .liquid-card,
  .liquid-nav,
  .liquid-clear,
  .liquid-fluted,
  .liquid-btn-secondary,
  .stats-glass,
  …
  .stats-glass {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

**Note (assumption A4 from RESEARCH.md):** there is no existing `prefers-contrast` block in `liquid-glass.css` — Phase 90 is the first to add one.

**Apply for:** Prepend a NEW block at the top of the file (after the `*/` end of the file header comment at line 61, before `Section 1` at line 63):

```css
/* ================================================
   v9.0 Phase 90 — A11y coverage block (FND-03)
   Single-source enumeration of every glass class
   under prefers-reduced-motion, prefers-reduced-transparency,
   prefers-contrast: more.

   CTA opaque-forever rule — see DESIGN.md > v9.0 Custom Rules.
   Do NOT add CTA gradient classes (.btn-primary, .liquid-btn-primary,
   v6 gradient utilities) to this block — they must remain opaque
   regardless of user preference.

   Coverage verified by:
     grep -nE '\.(liquid|glass|blob|stats|living-blob)-' liquid-glass.css blob.css
       (every match must also appear between markers, except .btn-primary / .liquid-btn-primary)
   ================================================ */
/* @a11y-layer-coverage:start */

@media (prefers-reduced-motion: reduce) {
  .liquid-regular, .liquid-card, .liquid-nav, .liquid-clear, .liquid-fluted,
  .liquid-btn-secondary, .liquid-header-backdrop, .stats-glass, .glass-idle,
  .blob-sublayer, .blob-core, .blob-body, .blob-halo, .blob-glint, .living-blob-field {
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .liquid-regular, .liquid-card, .liquid-nav, .liquid-clear, .liquid-fluted,
  .liquid-btn-secondary, .liquid-header-backdrop, .stats-glass, .glass-idle {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(255, 255, 255, 0.85) !important;
  }
  .living-blob-field, .blob-sublayer { display: none !important; }
}

@media (prefers-contrast: more) {
  .liquid-regular, .liquid-card, .liquid-nav, .liquid-clear, .liquid-fluted,
  .liquid-btn-secondary, .liquid-header-backdrop, .stats-glass, .glass-idle {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: #ffffff !important;
    border-color: rgba(0, 0, 0, 0.85) !important;
  }
  .living-blob-field, .blob-sublayer {
    opacity: 0.4 !important;
    filter: saturate(0.6) !important;
  }
}

/* @a11y-layer-coverage:end */
```

**Class enumeration source-of-truth** (grep on liquid-glass.css produced this set; full list in PATTERNS Shared Patterns below): `.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.liquid-clear`, `.liquid-fluted`, `.liquid-btn-secondary`, `.liquid-header-backdrop` (line 469), `.stats-glass`, `.glass-idle` (line 999) + new `.living-blob-field`, `.blob-sublayer`, `.blob-core`, `.blob-body`, `.blob-halo`, `.blob-glint`. **Excluded from a11y block per CTA opaque-forever rule:** `.liquid-btn-primary` (line 281), `.btn-primary`.

**Executor MUST NOT touch:**
- Sections 1-15 of `liquid-glass.css` (lines 63-1037) — all class internals stay frozen until Phase 92's opacity sweep. This is the explicit Phase boundary in CONTEXT.md `<canonical_refs>` and `<code_context>`.
- Existing Section 13 (`prefers-reduced-motion` lines 717-754) — defense-in-depth retention; Phase 92 may consolidate.
- Existing Section 14 (`prefers-reduced-transparency` lines 768-829) — same.
- Specular-highlight `::after` rules (lines 743-753, 956-973) — owned by `useSpecularHighlight.ts` runtime contract.

---

### `next/src/styles/blob.css` (CSS-component, NEW FILE)

**Analog:** Sibling stylesheets in `next/src/styles/` (`liquid-glass.css`, `squircles.css`) — same load mechanism via `@import` from `globals.css`. Closest structural analog is `liquid-glass.css` Section 1 (`.liquid-regular` definition at lines 74-105) for the "primary class + variant classes + reduced-motion fallback" shape.

**Existing `.liquid-regular` opening pattern** (liquid-glass.css lines 74-105):
```css
.liquid-regular {
  isolation: isolate;
  position: relative;
  background:
    linear-gradient(
      to bottom,
      var(--liquid-bg),
      …
```

**Apply for:** New file with the static-blob structure documented in RESEARCH.md Pattern 4 (lines 461-543). Verbatim contents (executor copies and adjusts only if visual smoke fails):

```css
/* next/src/styles/blob.css — v9.0 Phase 90 (NEW FILE)
   Static sublayer baseline for .living-blob-field. Phase 91 hides these
   when canvas mounts (data-engine-active="true"). */

.living-blob-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  contain: layout paint;
}

.blob-sublayer {
  position: absolute;
  pointer-events: none;
  will-change: auto;
}

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
  opacity: 0;
}

/* Phase 91 handoff: when canvas mounts, divs hide. */
.living-blob-field[data-engine-active="true"] .blob-sublayer { display: none; }

/* Mobile blur cap (Phase 79 hard constraint, ≤12px) */
@media (max-width: 767.98px) {
  .blob-core { filter: blur(12px); width: 120px; height: 120px; margin: -60px 0 0 -60px; }
  .blob-body { filter: blur(12px); width: 320px; height: 320px; margin: -160px 0 0 -160px; opacity: 0.28; }
  .blob-halo { filter: blur(12px); width: 480px; height: 480px; margin: -240px 0 0 -240px; opacity: 0.36; }
}

/* Defense in depth — central a11y block in liquid-glass.css covers this; restated for self-containment */
@media (prefers-reduced-motion: reduce) {
  .living-blob-field { animation: none !important; }
  .blob-sublayer { transition: none !important; }
}
@media (prefers-reduced-transparency: reduce) {
  .living-blob-field { display: none !important; }
}
```

**Executor MUST NOT:**
- Add `backdrop-filter` to `.living-blob-field` itself (anti-pattern #11 in CONTEXT.md `<decisions>` Decision D — blob is BEHIND glass, not glass).
- Add Tailwind utility classes (mixing utilities makes Phase 91's `data-engine-active` flip brittle — RESEARCH.md "Anti-Patterns to Avoid").
- Use `mix-blend-mode` (anti-pattern #8).
- Wire pointer listeners or rAF — those are Phase 91.

---

### `next/src/app/layout.tsx` (TSX-layout, modify)

**Analog:** Self — current implementation at lines 47-62.

**Existing `RootLayout` body** (layout.tsx lines 47-62):
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-mu-text-50 text-mu-text-900 overflow-x-clip">
        <SvgRefractionDefs />
        <MeshBackground />
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

**Apply for:** Three precise diffs.

1. **Remove import** (delete line 9):
   ```tsx
   import { MeshBackground } from '@/components/layout/MeshBackground';
   ```

2. **Replace body children** with:
   ```tsx
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
   ```

**Executor MUST NOT touch:**
- `metadata` object (lines 30-41).
- `viewport` object (lines 43-45).
- `inter` and `manrope` `localFont` declarations (lines 12-28).
- `<html>` element attributes — `lang="ru"` and `className={`${inter.variable} ${manrope.variable}`}`.
- `<body>` className string — preserve `bg-mu-text-50 text-mu-text-900 overflow-x-clip`.
- `<main>` className — preserve `relative z-10 pt-24 flex flex-col gap-8 md:gap-16 pb-8` (z-10 is the z-index contract anchor; FND-04).
- `LazyMotionProvider` wrapping pattern.
- Other component imports — `Header`, `Footer`, `StickyBar`, `SvgRefractionDefs`, `LazyMotionProvider` stay imported.

**Mount-order requirement:** `<style>` MUST be first child of `<body>` so the seeded CSS vars exist on first paint, BEFORE `.living-blob-field` paints (RESEARCH.md Pitfall 4).

---

### `next/src/components/layout/MeshBackground.tsx` (FILE-DELETE)

**Analog:** n/a — hard delete.

**Current contents** (17 lines, only consumer is `layout.tsx:9, 52`):
```tsx
export function MeshBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Blob 1: blue, top-left */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-mu-blue/30 mix-blend-multiply blur-[120px]" />
      {/* Blob 2: green, top-right */}
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-mu-green-300/20 mix-blend-multiply blur-[120px]" />
      {/* Blob 3: accent-blue, bottom-left */}
      <div className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-mu-accent-blue/15 mix-blend-multiply blur-[120px]" />
      {/* Frosted overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] backdrop-saturate-[180%]" />
    </div>
  );
}
```

**Apply for:**
- `rm next/src/components/layout/MeshBackground.tsx`
- Confirm `grep -r "MeshBackground" next/src` returns no remaining references after `layout.tsx` import removal.
- No archive copy (CONTEXT.md "Folded scope clarifications": git history is sufficient).

**Executor MUST:**
- Delete the file BEFORE running `pnpm build` to confirm no other consumer (build will fail if any).
- Run `cd next && rm -rf .next && pnpm build` (clean build) per RESEARCH.md Runtime State Inventory — Webpack chunks may retain stale module reference on incremental build.

---

### `next/src/app/test-glass/page.tsx` (TSX-route, append swatch row)

**Analog:** Self — existing "Squircle Shapes" row at lines 82-98 demonstrates the "labeled flat divs in a flex row" pattern.

**Existing flat-div swatch pattern** (test-glass/page.tsx lines 82-98):
```tsx
{/* Squircle shapes test */}
<div>
  <h2 className="text-xl font-heading mb-4">Squircle Shapes</h2>
  <div className="flex gap-4 flex-wrap">
    <div className="squircle-md bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs text-mu-text-700">
      .squircle-md
    </div>
    …
  </div>
</div>
```

**Apply for:** Append a NEW section after the existing "Section Tints" block (after line 123, before `<footer>` at line 125):

```tsx
{/* v9.0 Phase 90 — Blob palette comparison (KD-v9-001 brand approval surface) */}
<div>
  <h2 className="text-xl font-heading mb-4">v9.0 Blob Palette — KD-v9-001 Comparison</h2>
  <p className="text-sm text-mu-text-500 mb-4">
    Compare <code>--blob-hot</code> against current brand greens.
    User must approve <code>KD-v9-001</code> in <code>.planning/PROJECT.md</code> before Phase 91.
  </p>
  <div className="flex gap-4 flex-wrap">
    <div className="w-32 h-32 flex items-end justify-center text-xs text-white p-2" style={{ background: '#35B678' }}>
      --mu-primary<br/>#35B678
    </div>
    <div className="w-32 h-32 flex items-end justify-center text-xs text-white p-2" style={{ background: '#4FE098' }}>
      --blob-hot<br/>#4FE098 (KD-v9-001)
    </div>
    <div className="w-32 h-32 flex items-end justify-center text-xs text-white p-2" style={{ background: '#1AC67E' }}>
      cta-gradient-from<br/>#1AC67E (medicusunion.kz ref)
    </div>
  </div>
</div>
```

**Executor MUST NOT touch:**
- Existing imports (`GlassInteraction` — line 1).
- Existing gradient-test container (lines 12-79) — `.liquid-regular`, `.liquid-card`, `.liquid-clear`, `.liquid-fluted`, `.liquid-nav`, button rows.
- Existing "Squircle Shapes" section (lines 82-98).
- Existing "Section Tints" section (lines 100-123).
- Footer (lines 125-127).

---

### `.planning/PROJECT.md` (MD-project-state, append KD row)

**Analog:** Self — existing "Key Decisions" table at lines 159-187.

**Existing Key Decisions table pattern** (PROJECT.md lines 161-188):
```markdown
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| HTML/CSS/JS вместо фреймворка | Простота, скорость загрузки, лёгкий деплой | ✓ Good — 64KB total, no build step |
…
| Max 2 glass elements per viewport; blur ≤12px | GPU budget constraint for budget Android devices dominant in KZ market | ✓ Good — v1.4 |
| Dark mode disables backdrop-filter (glass-off) | Murky smear on navy #0F1923; opaque surface better on dark backgrounds | ✓ Good — v1.4 |
…
```

**Apply for:** Append a NEW row at the end of the table (after line 187, before the `## Evolution` heading at line 189):

```markdown
| KD-v9-001: --blob-hot #4FE098 | TZ §5 — heat-state highlight; brand parity check pending against medicusunion.com / medicusunion.kz | pending — user must view /test-glass and approve (or propose alternate hex) before /gsd-discuss-phase 91 |
```

**Executor MUST NOT touch:**
- Existing 25 Key Decisions table rows (lines 163-187).
- "Evolution" section (lines 189-205).
- Constraints section (lines 153-157).
- Table header (lines 161-162) — preserve column structure `Decision | Rationale | Outcome`.

**Note:** Status field uses lowercase `pending` for grep-matchability — RESEARCH.md test FND-07a regex: `KD-v9-001.*--blob-hot.*#4FE098.*pending`.

---

## Shared Patterns

### Pattern S1: CSS Custom Property Mirror (DESIGN.md YAML ↔ globals.css :root)

**Source contract:** `CLAUDE.md > Design Contract` — "YAML is the contract, CSS is the runtime."

**Apply to:** Every `--blob-*` and `--glass-*` token added in Phase 90.

**Validation excerpt** (RESEARCH.md "Code Examples"):
```bash
grep -oE '\-\-(blob|glass)-[a-z-]+' next/src/app/globals.css | sort -u
sed -n '/^colors:/,/^[a-z]/p' DESIGN.md | grep -E '^\s+blob-' | sed -E 's/^\s+([a-z-]+):.*/\1/'
```

### Pattern S2: A11y Coverage Markers

**Source:** New convention in Phase 90 (FND-03). Builds on existing `liquid-glass.css` Section 13 (lines 717-754) and Section 14 (lines 768-829) precedents that enumerate glass classes under `prefers-reduced-*` queries.

**Apply to:** Every existing AND new `.liquid-*`, `.glass-*`, `.blob-*`, `.stats-*`, `.living-blob-*` class.

**Excluded by CTA opaque-forever rule:** `.btn-primary`, `.liquid-btn-primary` (and any future v6-gradient utility class). Comment in `@a11y-layer-coverage:start` block records this exclusion.

**Coverage grep** (RESEARCH.md):
```bash
grep -hoE '^\.(liquid-|glass-|blob-|stats-|living-blob)[a-zA-Z0-9_-]*' \
  next/src/styles/liquid-glass.css next/src/styles/blob.css | sort -u
awk '/@a11y-layer-coverage:start/,/@a11y-layer-coverage:end/' \
  next/src/styles/liquid-glass.css | grep -hoE '\.[a-zA-Z][a-zA-Z0-9_-]+' | sort -u
```

### Pattern S3: Mobile Blur Floor (clamp(12px, …))

**Source:** Phase 79 hard constraint, mirrored in `globals.css` lines 122-125 (`--liquid-blur-md` etc.).

**Apply to:** Every new `--glass-*-blur` token AND every `filter: blur(N)` rule in `blob.css` mobile media query.

**Test:** `grep -E '\-\-glass-[a-z]+-blur:' next/src/app/globals.css` — every match must start with `clamp(12px, …`.

### Pattern S4: Inline `<style>` Seed (First Child of `<body>`)

**Source:** New in Phase 90 (Decision A.1 in CONTEXT.md `<code_context>`). No prior precedent — Next.js 15 App Router supports inline `<style>` in body since 13.4 (RESEARCH.md A5).

**Apply to:** `layout.tsx` `<body>` first child only. Pure CSS string children — NO `<script>`, NO listeners, NO `useEffect`.

**Defense in depth:** Same defaults are also defined in `globals.css :root`, so a missing `<style>` does not cause undefined vars.

### Pattern S5: Mount Order Preservation

**Source:** RESEARCH.md System Architecture Diagram (lines 167-184).

**Required mount order in `<body>`:**
1. `<style>` (seed — first child, before any consumer)
2. `<SvgRefractionDefs />` (existing — preserved)
3. `<div class="living-blob-field" …>` with 4 sublayer children (replaces `<MeshBackground />`)
4. `<Header />`
5. `<LazyMotionProvider>` wrapping `<main>`
6. `<Footer />`
7. `<StickyBar />`

---

## No Analog Found

| File | Role | Reason |
|------|------|--------|
| (none) | — | All Phase 90 files have either an in-place analog (own existing structure) or a structural sibling pattern in the same directory. Phase 90 is exclusively additive contract work. |

`prefers-contrast: more` is the only construct in Phase 90 with no prior precedent in `liquid-glass.css` (no `prefers-contrast` block exists today — confirmed by grep). Treated as additive: planner copies the selector list from the sibling `prefers-reduced-transparency` block (RESEARCH.md Pattern 3 lines 424-445).

---

## Frozen Areas (Executor Must Not Modify)

| File | Frozen Range | Why |
|------|--------------|-----|
| `next/src/styles/liquid-glass.css` | Sections 1-15 (lines 63-1037) | Class internals frozen until Phase 92 opacity sweep. Phase 90 ONLY prepends a new `@a11y-layer-coverage` block at top + leaves existing Section 13/14 intact. |
| `next/src/app/globals.css` | Lines 13-238 (existing `:root` tokens before Tailwind `@theme inline`) | Phase 90 APPENDS only. Existing `--mu-*`, `--liquid-*`, `--squircle-*`, `--ease-*`, `--motion-*`, `--font-size-*`, `--fs-*` tokens stay untouched. |
| `next/src/hooks/use-specular-highlight.ts` | Entire file | Phase 91 will lift this to global scope. Phase 90 must not touch — preserves `--mouse-x/y` namespace. |
| `next/src/components/layout/SvgRefractionDefs.tsx` | Entire file | Coexists; preserve mount order (renders BEFORE `.living-blob-field`). |
| `next/src/components/motion/LazyMotionProvider.tsx` | Entire file | Framer Motion provider stays — entrance animations coexist. |
| `next/src/app/test-glass/page.tsx` | Lines 1-123 (existing swatches) | Phase 90 ONLY appends the blob-hot comparison row before the footer. |
| `.planning/PROJECT.md` | Lines 1-187 (existing Key Decisions + everything above) | Phase 90 ONLY appends ONE new row to the Key Decisions table. |
| `DESIGN.md` | Existing `colors:`/`typography:`/`rounded:`/`spacing:`/`shapes:`/`components:` entries | Phase 90 EXTENDS YAML with `blob-*` colors subsection + new top-level `glass:` and `antiPatterns:` keys. Existing values untouched. |

---

## Metadata

**Analog search scope:**
- `next/src/app/` (layout.tsx, globals.css, test-glass/page.tsx)
- `next/src/components/layout/` (MeshBackground.tsx, SvgRefractionDefs.tsx, Header.tsx, Footer.tsx, StickyBar.tsx)
- `next/src/styles/` (liquid-glass.css, squircles.css)
- `next/src/hooks/` (use-specular-highlight.ts)
- `DESIGN.md` (root)
- `.planning/PROJECT.md`

**Files scanned:** 12 (all read-only) — globals.css (lines 1-200), layout.tsx (full), MeshBackground.tsx (full), liquid-glass.css (header lines 1-80 + a11y sections 710-840 + class definition grep), test-glass/page.tsx (full), DESIGN.md (lines 1-120 + line counts), PROJECT.md (lines 155-206 + Key Decisions grep).

**Pattern extraction date:** 2026-04-30.

---

## PATTERN MAPPING COMPLETE

**Phase:** 90 - foundation-tokens-a11y-wiring-dom-skeleton
**Files classified:** 8
**Analogs found:** 8 / 8 (100% in-repo precedent coverage)

### Coverage
- Files with exact analog (self/in-place edit): 7 (DESIGN.md, globals.css, liquid-glass.css, layout.tsx, test-glass/page.tsx, PROJECT.md; MeshBackground.tsx delete trivially "exact")
- Files with role-match analog: 1 (blob.css → liquid-glass.css Section 1 + squircles.css sibling)
- Files with no analog: 0
- New construct without prior in-repo precedent: 1 (`prefers-contrast: more` block — copies selector list from sibling `prefers-reduced-transparency` block in same file)

### Key Patterns Identified
- All token additions follow the `clamp(mobile-floor, fluid-vw, desktop-ceiling)` shape; mobile floor MUST be 12px (Phase 79 hard cap, RESEARCH.md Pitfall 2).
- A11y `@layer` block is conceptual single-source — implemented as plain `@media` blocks bounded by `/* @a11y-layer-coverage:start/end */` markers (RESEARCH.md Alternatives Considered: keeps cascade behavior identical to existing Section 13/14).
- Mount order in `layout.tsx`: `<style>` seed FIRST so CSS vars resolve before `.living-blob-field` paints.
- Hard delete of `MeshBackground.tsx` (no archive — git history is sufficient per CONTEXT.md "Folded scope clarifications").
- CTA opaque-forever rule: `.btn-primary` and `.liquid-btn-primary` are EXCLUDED from the a11y block; comment in `@a11y-layer-coverage:start` records this contract.
- Phase boundary discipline: Phase 90 is exclusively additive contract work + one deletion. NO behavioral change to existing UI surfaces (Sections 1-15 of liquid-glass.css stay frozen until Phase 92).
