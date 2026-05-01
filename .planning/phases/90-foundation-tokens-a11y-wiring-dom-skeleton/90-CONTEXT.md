# Phase 90 Context — Foundation: Tokens, A11y Wiring, DOM Skeleton

**Created:** 2026-04-30
**Milestone:** v9.0 Living Blob Liquid Glass Scene
**Mode:** discuss (claude-decided — user delegated all 4 gray areas)
**Sequencing:** First v9.0 phase. Unblocks Phase 91 (renderer needs runtime CSS vars and `--blob-*` palette) and Phase 92 (glass tier tokens must exist for opacity sweep).

## <domain>

Establish the token system, accessibility contract, and DOM skeleton every later v9.0 phase builds on. **No visible change** — page renders as close to v8.1 as a static-blob ambient state can. Outcome: a foundation contract locked before Phase 91 writes a single line of renderer code.

Phase boundary (FIXED — no scope creep):
- ✅ Token registration in DESIGN.md YAML and `globals.css`
- ✅ Single-source `@layer` a11y block in `liquid-glass.css`
- ✅ DOM skeleton for blob field in `layout.tsx` (4 static sublayer divs, no canvas, no engine)
- ✅ Removal of `MeshBackground.tsx`
- ✅ DESIGN.md updates: z-index contract, CTA opaque-forever rule, v9.0 anti-pattern appendix
- ✅ Key Decision log for `--blob-hot: #4FE098` in PROJECT.md
- ❌ Canvas renderer (Phase 91)
- ❌ Pointer listeners, rAF loop, lerp physics (Phase 91)
- ❌ Glass component opacity sweep (Phase 92)
- ❌ Heat-leak `radial-gradient` rules in `liquid-glass.css` (Phase 92)

## <canonical_refs>

**MANDATORY reads for downstream agents.** Full relative paths.

| Path | Why |
|------|-----|
| `design/LIQUID_GLASS_BLOB_TZ.md` | Primary spec — 20 sections, 12 acceptance criteria. §5/§9/§11/§17 prescribe exact token values; §15 prescribes a11y branches; §16 lists anti-patterns. **All numerical targets trace here.** |
| `.planning/REQUIREMENTS.md` (v9.0 section, FND-01..07) | Locked requirements for this phase — token names, tier values, a11y `@layer` requirement, z-index contract, CTA rule, Key Decision trigger. |
| `.planning/research/SUMMARY.md` | Research synthesis — confirms zero new dependencies, identifies 5 highest-impact pitfalls, maps file changes (modified vs new), confirms `useSpecularHighlight.ts` as proven internal pattern. |
| `.planning/research/PITFALLS.md` | Top 5 pitfalls relevant to Phase 90: a11y MQ bypass on new code paths (#2.1, 2.4, 2.5, 11.1), mobile blur regression (#1.1). |
| `.planning/ROADMAP.md` (Phase 90 detail) | Success criteria — exact token values, mobile blur ≤12px cap, z-index integers, deletion of MeshBackground. |
| `.planning/PROJECT.md` | Project constraints (mobile-first ЦА 45+, Russian only, Apple HIG Liquid Glass), milestone status. Receives Key Decision log for `--blob-hot`. |
| `DESIGN.md` (repo root) | Hard constraints (≤2 glass per viewport, mobile blur ≤12px, dark mode disables `backdrop-filter`, brand-color parity rule). **Receives Phase 90 edits** — YAML token registration, anti-pattern appendix, z-index contract, CTA opaque-forever rule. |
| `next/src/app/globals.css` | Receives `--blob-*` palette + `--glass-{section,card,form,button}-{fill,blur}` tier tokens + seeded runtime vars. |
| `next/src/styles/liquid-glass.css` | Receives single-source `@layer` a11y block enumerating all glass class names. **Do NOT touch utility class internals in Phase 90 — Phase 92 sweeps those.** |
| `next/src/app/layout.tsx` | Receives `<div class="living-blob-field">` skeleton + inline `<style>` seed. `MeshBackground` import + render removed. |
| `next/src/components/layout/MeshBackground.tsx` | **DELETED** in Phase 90 (FND-06). 17 lines, only consumer is `layout.tsx`. |
| `next/src/hooks/use-specular-highlight.ts` | Reference pattern — proven internal rAF + CSS-var + pointer-listener combination. Phase 91 will lift this to global scope; Phase 90 must not interfere with its `--mouse-x/y` namespace. |
| `next/src/components/layout/SvgRefractionDefs.tsx` | Coexists in `layout.tsx`. Phase 90 must preserve mount order. |

## <prior_decisions>

**From v8.1 closeout (Phase 89, shipped 2026-04-30):**
- Cheat-pass on a11y verification (ACC-01..05) is a recorded failure mode. Phase 90 a11y `@layer` block must be grep-verifiable to enumerate every glass class — preventing recurrence.
- `LiquidBlobLayer.tsx` and `liquid-depth.css` confirmed non-existent; no removal needed.

**From v8.0 (Phase 79):**
- Mobile blur cap = 12px. **Hard constraint.** All `--glass-*-blur` mobile values must honor this.
- ≤2 glass elements per viewport. Tier tokens in Phase 90 don't violate this on their own; enforcement falls to Phase 92.

**From v7.0 (Phase 73-78):**
- Token migration to `color-mix(in oklch)` was attempted (TOK-01..02). Phase 90 token additions stay in plain `rgba()` (TZ-prescriptive); `oklch` migration is out of scope.

**From v6.0 (Phase 67.1):**
- App Router shares `layout.tsx` across all routes. Phase 90 mounts blob skeleton there — automatically active on `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`, `/admin`, `/test-glass`.

## <decisions>

### Sublayer DOM shape (Decision A)

**Flat-sibling skeleton:**

```jsx
<div className="living-blob-field" aria-hidden="true" data-engine-active="false">
  <div className="blob-sublayer blob-core" />
  <div className="blob-sublayer blob-body" />
  <div className="blob-sublayer blob-halo" />
  <div className="blob-sublayer blob-glint" />
</div>
```

**Why:** Flat siblings keep CSS targeting simple (`.blob-sublayer.blob-core`); naming matches TZ §5 vocabulary (core / body / halo / glint); `data-engine-active` boolean is a clean handoff to Phase 91 (canvas mounted as sibling, attribute flips to `true`, CSS hides the static divs).

**How to apply (Phase 91 contract):**
- Phase 91 adds `<canvas className="blob-canvas">` as a 5th sibling inside `.living-blob-field`.
- Phase 91 flips `data-engine-active="true"` once renderer is running.
- `blob.css` rules:
  - Default: 4 sublayer divs visible, canvas hidden (Phase 90 default state).
  - `[data-engine-active="true"]`: canvas visible, sublayer divs hidden via `display: none`.
  - `(prefers-reduced-motion: reduce)`: forces `data-engine-active="false"` rule via `@media`; sublayer divs render static ambient gradient — engine never starts.
  - `(prefers-reduced-transparency: reduce)`: entire `.living-blob-field` hidden via `display: none`.
- Phase 90 ships `blob.css` with the static-state styling for the 4 sublayers (positioned, gradients, opacity matching v8.1 visual register approximately — soft green/blue ambient, not the milky-mesh look of MeshBackground).

**Visual parity note:** "No visible change vs v8.1" is aspirational — the static blob sublayer state will look softer than the current MeshBackground (which has 3 colored blobs + frosted overlay at 40% white + 40px blur). Acceptable per FND-06 because:
1. The new ambient is the correct end-state for `prefers-reduced-motion` users.
2. Phase 91 immediately replaces it with the live blob.
3. Index page legibility is preserved (no new contrast issues).

### `--blob-hot` Key Decision approval flow (Decision B)

**Manual gate before Phase 91 unlocks. Does NOT block Phase 90 shipping.**

Phase 90 plan tasks (sequenced):
1. Add `--blob-hot: #4FE098` to DESIGN.md YAML `colors:` block + `globals.css` `:root`.
2. Append to PROJECT.md "Key Decisions" section: entry `KD-v9-001` with value, rationale (TZ §5 — heat-state highlight; brand parity check pending), reference URLs (`medicusunion.com`, `medicusunion.kz`), and approval status `pending`.
3. Add a static comparison swatch to `/test-glass` route — `--mu-primary` (#35B678) next to `--blob-hot` (#4FE098) next to medicusunion.com brand greens, rendered as plain divs labeled.
4. Document in `90-VERIFICATION.md` that user must view `/test-glass` and update `KD-v9-001` status to `approved` (or propose alternate hex) before `/gsd-discuss-phase 91`.

**How to apply downstream:**
- Phase 91 planner MUST verify `KD-v9-001` status is `approved` in PROJECT.md before generating PLAN.md. If still `pending`, planner halts with clear message.
- If user requests color change, only `globals.css` and DESIGN.md YAML need updating — no other Phase 90 artifact changes.

### CTA opaque-forever scope (Decision C)

**Master list (lives in DESIGN.md "v9.0 Custom Rules" section):**

Components/elements where the v6 CTA gradient (`from-mu-cta-from-v6 to-mu-cta-to-v6`) renders, all of which MUST stay opaque (no `backdrop-filter`, no `bg-white/{n}`, no glass utilities):

1. `HeroHub` primary CTA (заявка на консультацию)
2. `FinalCTA` primary submit
3. `ContactForm` submit button
4. `StickyBar` primary action (mobile sticky CTA)
5. `Header` phone CTA (where rendered with gradient)
6. Service-page `LeadFormSection` submit
7. Any future component using `.btn-primary` or its v6 gradient utility classes

**Enforcement (Phase 90 scope only):**
- DESIGN.md "v9.0 Custom Rules" section enumerates the list above with rationale (PITFALLS 3.1 — CTA disappears into green blob).
- `liquid-glass.css` `@layer` block has a comment block at top: `/* CTA opaque-forever rule — see DESIGN.md v9.0 Custom Rules. Do NOT add CTA gradient classes to this @layer block. */`
- PR review checklist (added in `90-VERIFICATION.md`): grep for `from-mu-cta-from-v6` and confirm none have `backdrop-filter` or `bg-white/`.

**Deferred to later (NOT Phase 90):**
- Stylelint / ESLint rule that enforces this — defer to v9.1+ (REQUIREMENTS.md does not require it; rule belongs with broader code-quality phase).
- Phase 92 will physically verify each CTA component matches the rule during the glass sweep.

### v9.0 Anti-pattern appendix format (Decision D)

**Both formats — YAML field for machine readability, markdown body for rationale.**

DESIGN.md YAML front matter gains:

```yaml
antiPatterns:
  - name: "Multiple blobs"
    why: "TZ §1 single-protagonist rule; multiple blobs read as decoration not protagonist"
    addedIn: "v9.0 Phase 90"
  - name: "Cursor trail"
    why: "TZ §14 explicit ban; trails read as gaming/playful, violate medical tone"
    addedIn: "v9.0 Phase 90"
  # ... (full list below)
```

DESIGN.md markdown body gains a new top-level section `## v9.0 Anti-Patterns` with each entry expanded — name, why, where it would manifest, what to do instead.

**Content (15 entries):**

From TZ §16 reject list:
1. Multiple blobs — TZ §1
2. Cursor trail (N copies) — TZ §14
3. Per-frame React `useState` from pointer events — TZ §16
4. Solid-white / milky glass fills above 0.16 — TZ §9
5. Green tint on cards — TZ §9
6. Animated `backdrop-filter` blur values — TZ §16, GPU-poison on mobile
7. Animated `box-shadow` on dozens of elements — TZ §16
8. `mix-blend-mode` on glass surfaces — TZ §16
9. Spring physics with overshoot — tone violation
10. Heat-driven color shift toward red/orange — brand parity violation
11. `backdrop-filter` on `.living-blob-field` itself — blob is behind glass, not glass

From project history (Phase 79, 85, 89):
12. Mobile blur >12px — DESIGN.md hard constraint, regressed historically
13. >2 glass layers per viewport — DESIGN.md hard constraint
14. Adding new glass class without registering it in `liquid-glass.css` `@layer` a11y block — Phase 89 cheat-pass failure mode
15. Cheat-passing a11y verification (declaring rules without live OS-toggle test) — Phase 89 ACC-01..05 lesson

**How to apply downstream:**
- Phase 91-94 planners MUST grep DESIGN.md `## v9.0 Anti-Patterns` before generating tasks; any task that would violate an entry must be rewritten.
- Phase 92 glass sweep MUST add a check: for every new glass class added, append to `liquid-glass.css` `@layer` block (entry #14 enforcement).

### Folded scope clarifications

**Token registration scope:** Both `DESIGN.md` YAML AND `globals.css` `:root` get all tokens (FND-01, FND-02). Mirror is mandatory; YAML is the contract, CSS is the runtime.

**Inline `<style>` seed location:** Inline `<style>` element rendered as the first child of `<body>` in `layout.tsx` JSX (NOT in `<head>` via Next metadata — App Router handles inline body scripts safely; head injection adds complexity). Seeds: `:root { --blob-x: 50vw; --blob-y: 50vh; --blob-body-x: 50vw; --blob-body-y: 50vh; --blob-halo-x: 50vw; --blob-halo-y: 50vh; --blob-heat: 0; --blob-velocity: 0; }`. Defaults also in `globals.css` for paint without JS.

**A11y `@layer` block discovery method:** Manual + grep-verified. Author the block by reading `liquid-glass.css` end-to-end and listing every `.liquid-*`, `.glass-*`, `.blob-*` class. Add a CI-friendly comment marker so a future grep can confirm coverage: `/* @a11y-layer-coverage:start */ ... /* @a11y-layer-coverage:end */`. Phase 90 verification step runs `grep -E '\.liquid-|\.glass-|\.blob-' liquid-glass.css` and asserts every match also appears between markers.

**MeshBackground deletion:** Hard delete (`rm next/src/components/layout/MeshBackground.tsx`), remove import + render from `layout.tsx`. No archive copy — git history is sufficient.

**Z-index contract:** Already enumerated in REQUIREMENTS.md FND-04 — codify verbatim into DESIGN.md "v9.0 Custom Rules" section. Values: `.living-blob-field` `z-0`, `<main>` `z-1..10`, `Header`/`StickyBar` `z-50+`, modals/dialogs `z-100+`.

## <code_context>

**Reusable assets:**
- `useSpecularHighlight.ts` — proven rAF + CSS-var pattern; Phase 91 will lift to global scope. Phase 90 must NOT touch this file or its `--mouse-x/y` vars.
- `liquid-glass.css` (1037 lines) — existing utility classes (`.liquid-card`, `.liquid-regular`, etc.). Phase 90 ONLY adds the `@layer` a11y block at top + the `@a11y-layer-coverage` markers. Class internals stay frozen until Phase 92.
- `globals.css` (689 lines) — already has `--liquid-blur-{sm,md,lg,xl}` and brand color tokens. Phase 90 appends new tokens; does NOT modify existing.
- `SvgRefractionDefs` — coexists; preserve.
- `LazyMotionProvider` — coexists; framer-motion stays for entrance animations.

**Confirmed non-existent:**
- `LiquidBlobLayer.tsx` — does not exist (despite v8.1 audit mention)
- `liquid-depth.css` — does not exist
- No prior `blob.css` — Phase 90 creates it new

**Mount order in `layout.tsx`** (v8.1 current → v9.0 target):
- v8.1: `<SvgRefractionDefs /> <MeshBackground /> <Header /> <main>...</main> <Footer /> <StickyBar />`
- v9.0 Phase 90: `<style>{seed}</style> <SvgRefractionDefs /> <div class="living-blob-field">...</div> <Header /> <main>...</main> <Footer /> <StickyBar />`
- The `<style>` seed must render BEFORE `.living-blob-field` so CSS vars exist on first paint.

## <deferred>

(Captured for future phases — NOT for Phase 90.)

- **Stylelint rule for CTA opaque-forever** — defer to v9.1+ tooling phase.
- **`oklch` token migration for new tokens** — TOK-01/TOK-02 not in v9.0 scope; new `--blob-*` and `--glass-*` tokens use plain `rgba()` per TZ.
- **`OffscreenCanvas` workerized rendering** — defer to v10+; Safari 15 lacks support.
- **Per-route blob color theming** — defer to v10+; brand parity disallows in v9.0.
- **Lint rule enforcing `@a11y-layer-coverage` block completeness** — defer to v9.1+; Phase 90 ships the markers, Phase 94 verification runs the grep.

## <success_criteria>

Phase 90 ships when:

1. ✅ DESIGN.md YAML has all `--blob-*` palette tokens + 4 `--glass-{section,card,form,button}-{fill,blur}` tiers (desktop + mobile) — mobile blur all ≤12px.
2. ✅ DESIGN.md gains: z-index contract section, CTA opaque-forever rule with master list, `## v9.0 Anti-Patterns` body section + `antiPatterns:` YAML field with 15 entries.
3. ✅ `globals.css` mirrors all token additions and seeds runtime vars.
4. ✅ `liquid-glass.css` has single-source `@layer` block bounded by `@a11y-layer-coverage` markers, covering every glass class name under `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more`. Grep verifies coverage.
5. ✅ `next/src/styles/blob.css` exists with sublayer base styles + reduced-motion static fallback.
6. ✅ `layout.tsx` has inline `<style>` seed + `<div class="living-blob-field" aria-hidden="true" data-engine-active="false">` skeleton with 4 sublayer children. `MeshBackground` import + render gone.
7. ✅ `MeshBackground.tsx` deleted from repo.
8. ✅ PROJECT.md gains Key Decision `KD-v9-001` for `--blob-hot: #4FE098`, status `pending` (approval gates Phase 91).
9. ✅ `/test-glass` route renders blob-hot comparison swatch.
10. ✅ Page renders without runtime errors on `/`, `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`. Visual regression vs v8.1 acceptable (static ambient differs softly from MeshBackground).
11. ✅ `pnpm build` passes with zero new warnings.
12. ✅ No new dependencies in `package.json`.

---

*Discussed: 2026-04-30 — claude-decided mode (user delegated all 4 gray areas after presenting domain analysis).*
*Next: `/gsd-plan-phase 90` — generates PLAN.md with task breakdown.*
