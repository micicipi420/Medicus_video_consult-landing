---
phase: 93-per-page-propagation-sub-routes
plan: 06
artifact: shadcn-audit
audit_date: 2026-04-30
audit_scope: read-only consumer-reach + per-primitive glass-tier classification
files_audited:
  - next/src/components/ui/card.tsx
  - next/src/components/ui/dialog.tsx
  - next/src/components/ui/input.tsx
  - next/src/components/ui/select.tsx
  - next/src/components/ui/textarea.tsx
  - next/src/app/admin/submissions-table.tsx
files_modified: 0
disposition: verify-only-no-op + future-proof recipe for dialog.tsx:34
---

# Phase 93 Plan 06 — shadcn Audit (Read-Only)

**Audit date:** 2026-04-30
**Scope:** verify shadcn primitives (`card`, `dialog`, `input`, `select`, `textarea`) compliance with v9.0 4-tier glass token contract WITHOUT modifying any source file.
**Outcome:** verify-only no-op for all 5 primitives; future-proof recipe recorded for `dialog.tsx:34` (no public modal consumer today).

---

## Section 1 — Repo-wide Consumer Reach Grep

The five greps below were run against `next/src/` immediately before producing this audit. Both single-quoted and double-quoted import forms were checked.

### Single-quote import probes

```bash
grep -rln "from '@/components/ui/card'" next/src/
grep -rln "from '@/components/ui/dialog'" next/src/
grep -rln "from '@/components/ui/input'" next/src/
grep -rln "from '@/components/ui/select'" next/src/
grep -rln "from '@/components/ui/textarea'" next/src/
```

**Result (all 5 greps):** ZERO matches.

### Combined regex probe (both quote styles)

```bash
grep -rEn "from ['\"]@/components/ui/(card|dialog|input|select|textarea)['\"]" next/src/
```

**Result:** ZERO matches.

### Relative-path probe

```bash
grep -rEn "components/ui/(card|dialog|input|select|textarea)" next/src/ --include="*.tsx" --include="*.ts"
```

**Result:** ZERO matches.

### Reality check

The five primitives have **ZERO public-route consumers AND ZERO admin-route consumers** at audit time. This is a stronger result than 93-RESEARCH expected. RESEARCH stated `admin/submissions-table.tsx` was the sole consumer; closer inspection of `next/src/app/admin/submissions-table.tsx` reveals it imports only `@/components/ui/badge` and `@/components/ui/table`, NOT `card/dialog/input/select/textarea`.

| Primitive | Public-route consumers | Admin-route consumers | Net consumers |
|-----------|------------------------|-----------------------|---------------|
| `card.tsx` | 0 | 0 | **0** |
| `dialog.tsx` | 0 | 0 | **0** |
| `input.tsx` | 0 | 0 | **0** |
| `select.tsx` | 0 | 0 | **0** |
| `textarea.tsx` | 0 | 0 | **0** |

**Implication:** All five primitives are currently unreferenced shadcn template files (scaffolding installed by shadcn CLI but never wired into a route). The "admin-only consumer" framing in 93-RESEARCH/93-CONTEXT/93-PATTERNS is more conservative than reality — actual blast-radius is **zero routes**, not "one admin route".

**T-93-06-02 mitigation (false-negative on consumer grep):** verbatim grep results above show NO non-admin file matched. No public-route consumer was discovered. Plan does not stop; audit proceeds with stronger no-op disposition than originally framed.

---

## Section 2 — Per-Primitive Glass-Tier Classification

For each of the 5 primitives, the relevant background-token line is embedded verbatim from source.

### `next/src/components/ui/card.tsx`

```tsx
// line 15 — Card root
className={cn(
  "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 ...",
  className
)}
```

```tsx
// line 87 — CardFooter
className={cn(
  "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
  className
)}
```

| Tokens used | `bg-card`, `bg-muted/50`, `text-card-foreground`, `text-muted-foreground` |
| Glass-tier? | NO — these are project tokens (shadcn CSS variable design tokens), NOT v9 `--glass-*` tier tokens |
| `backdrop-blur` present? | NO |
| Disposition | **SKIP — verify-only no-op** |
| Rationale | No glass surface; no blur; opaque solid `bg-card`. Out of v9.0 token-migration scope per Decision F-extended (RESEARCH §Discretion item 6). |

### `next/src/components/ui/dialog.tsx`

```tsx
// line 34 — DialogOverlay (modal scrim)
className={cn(
  "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  className
)}
```

```tsx
// line 56 — DialogContent (modal popup body)
className={cn(
  "fixed top-1/2 left-1/2 z-50 grid ... rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 ...",
  className
)}
```

| Tokens used | `bg-black/10` (scrim), `bg-popover` (popup body), `supports-backdrop-filter:backdrop-blur-xs` |
| Glass-tier? | YES on line 34 (modal overlay = Tier 0 candidate); NO on line 56 (popup body uses opaque `bg-popover`) |
| `backdrop-blur` present? | YES on line 34: `backdrop-blur-xs` (Tailwind shorthand ≈ 4px) |
| Disposition | **SKIP-WITH-DOC** — future-proof recipe recorded in Section 3; no execution because zero public consumer |
| Rationale | This is the only public-impactful glass surface across the 5 primitives. The current `bg-black/10` + tiny blur would let the v9.0 living blob bleed through visibly if a public modal landed. Recipe documented; swap NOT executed because no public consumer exists today and the swap would change admin-route behavior with zero public benefit. |

### `next/src/components/ui/input.tsx`

```tsx
// line 12 — Input
className={cn(
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base ... disabled:bg-input/50 disabled:opacity-50 ... dark:bg-input/30 dark:disabled:bg-input/80 ...",
  className
)}
```

| Tokens used | `bg-transparent`, `bg-input/50` (disabled), `bg-input/30` (dark mode), `border-input`, `ring-ring/50` |
| Glass-tier? | NO — `bg-transparent` is fully transparent (no tint, no blur); disabled/dark variants use opaque shadcn tokens |
| `backdrop-blur` present? | NO |
| Disposition | **SKIP — verify-only no-op** |
| Rationale | `bg-transparent` already aligns with Phase 92 form-input-flatten precedent (form inputs render directly on the form panel's tinted background). No glass surface in the primitive itself. |

### `next/src/components/ui/select.tsx`

```tsx
// line 44 — SelectTrigger
className={cn(
  "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm ... dark:bg-input/30 dark:hover:bg-input/50 ...",
  className
)}
```

```tsx
// line 86 — SelectContent (popup)
className={cn(
  "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 ...",
  className
)}
```

| Tokens used | `bg-transparent` (trigger), `bg-popover` (popup) |
| Glass-tier? | NO — opaque shadcn tokens; popup is fully opaque solid for readability |
| `backdrop-blur` present? | NO |
| Disposition | **SKIP — verify-only no-op** |
| Rationale | Trigger inherits parent form panel's surface via transparency. Popup uses opaque `bg-popover` per shadcn dropdown contract — converting to glass would harm dropdown legibility. Out of v9.0 scope. |

### `next/src/components/ui/textarea.tsx`

```tsx
// line 10 — Textarea
className={cn(
  "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base ... disabled:bg-input/50 disabled:opacity-50 ... dark:bg-input/30 dark:disabled:bg-input/80 ...",
  className
)}
```

| Tokens used | `bg-transparent`, `bg-input/50` (disabled), `bg-input/30` (dark mode), `border-input`, `ring-ring/50` |
| Glass-tier? | NO — same pattern as `input.tsx` |
| `backdrop-blur` present? | NO |
| Disposition | **SKIP — verify-only no-op** |
| Rationale | Identical disposition to `input.tsx`. `bg-transparent` form-input-flatten precedent. |

### Summary disposition table

| File | Line(s) | Token used | Glass-tier? | Disposition |
|------|---------|------------|-------------|-------------|
| `card.tsx` | 15 (root), 87 (footer) | `bg-card` / `bg-muted/50` (project tokens) | NO | SKIP — verify-only no-op |
| `dialog.tsx` | 34 (overlay), 56 (popup) | `bg-black/10 ... supports-backdrop-filter:backdrop-blur-xs` (overlay only) | YES on line 34 only | SKIP-WITH-DOC — future-proof recipe in Section 3; not executed |
| `input.tsx` | 12 | `bg-transparent` | NO | SKIP — verify-only no-op |
| `select.tsx` | 44 (trigger), 86 (popup) | `bg-transparent` / `bg-popover` | NO | SKIP — verify-only no-op |
| `textarea.tsx` | 10 | `bg-transparent` | NO | SKIP — verify-only no-op |

---

## Section 3 — `dialog.tsx:34` Future-Proof Recipe (Pitfall-5 Future-Proofing Note)

**Tag:** Pitfall-5 future-proofing note (per 93-PATTERNS.md §Wave 3 — `dialog.tsx`).

**Trigger condition for executing this swap:** the moment any public-route component imports `Dialog`/`DialogContent` from `@/components/ui/dialog` AND a user can trigger the modal from a route that mounts the `<LivingBlobField />` (i.e., any public route under the root `next/src/app/layout.tsx`).

### BEFORE (current admin/admin-future state — line 34)

```
fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0
```

### AFTER (recommended Tier 0 swap when first public modal lands)

```
fixed inset-0 isolate z-50 bg-[var(--glass-section-fill)] duration-100 supports-backdrop-filter:backdrop-blur-[var(--glass-section-blur)] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0
```

### Rationale (record verbatim)

> The current `bg-black/10` would let the v9.0 living blob bleed through visibly, breaking modal-as-occlusion-layer expectation. Tier 0 token (`--glass-section-fill` ≈ 0.06 desktop / 0.10 mobile) is the closest semantic match for a modal scrim that needs to dim background while remaining visually consistent with the v9.0 4-tier system. Swap is opt-in — execute only when a public modal trigger lands.

### Token-resolution reference

Both replacement values are inherited verbatim from Phase 90 frozen tier tokens (registered in `next/src/app/globals.css :root`):

| Token | Desktop | Mobile (≤768px) | Tailwind arbitrary form |
|-------|---------|-----------------|-------------------------|
| `--glass-section-fill` | rgba(255,255,255,0.06) | rgba(255,255,255,0.10) | `bg-[var(--glass-section-fill)]` |
| `--glass-section-blur` | 24px clamp | 12px clamp | `backdrop-blur-[var(--glass-section-blur)]` |

### Why NOT execute now (T-93-06-01 mitigation — read-only contract)

1. **Zero public consumer exists** — Section 1 grep confirms no route imports `Dialog`. Eager swap would change admin-route behavior (when admin eventually adopts a modal) with zero public benefit.
2. **Mobile blur cap budget** — swapping to `--glass-section-blur` opts the modal scrim INTO the 12px mobile cap (vs. current `backdrop-blur-xs` ≈ 4px). This is desirable for public modals (visual coherence with Tier 0) but is a behavior change that should land alongside the first real public modal so a single Phase 94-class verification covers it.
3. **Read-only contract** — Plan 06 acceptance gate requires `git diff next/src/components/ui/` empty. Executing the swap violates the contract.

### Phase 94 / future-phase consumption

When a future phase introduces a public modal:

- The implementing phase MUST grep this file (`93-06-SHADCN-AUDIT.md §Section 3`) before swapping `dialog.tsx:34`.
- The swap is a single-line edit + Phase 94-style real-device visual verification across mobile + desktop.
- After execution, this audit's recipe is consumed; update `dialog.tsx:34` only and leave the rest of `dialog.tsx` untouched (`DialogContent` line 56 stays opaque `bg-popover` — modal popup body must remain readable).

**T-93-06-03 mitigation (recipe lost):** this audit document lives in `.planning/phases/93-per-page-propagation-sub-routes/` and is referenced from the plan SUMMARY. Phase 94 verification phase consumes it as input.

---

## Section 4 — `admin/submissions-table.tsx` Out-of-Scope Evidence

### Admin route group structure

Filesystem inspection at audit time:

```
next/src/app/admin/
├── page.tsx                ← AdminPage (RSC) — renders SubmissionsTable
└── submissions-table.tsx   ← Client Component — uses Badge + Table from @/components/ui
```

**No `next/src/app/admin/layout.tsx` exists.** The admin route therefore inherits the root layout at `next/src/app/layout.tsx`.

### Admin layout inheritance — important precision fix

The 93-06 plan's `<objective>` claims "the admin route does NOT render the `<LivingBlobField />`". Inspection of `next/src/app/layout.tsx` lines 47–69 shows that the root layout **does** mount `<LivingBlobField />` for ALL routes including `/admin`. So the claim that admin "renders no blob" is technically inaccurate.

However, the practical consequence is identical to the plan's framing:

```tsx
// next/src/app/admin/page.tsx, line 40
<main className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-8 text-foreground">
```

The admin page wraps its entire content in an opaque `bg-background` `<main>`, which fully occludes the blob field below. The v9.0 transparency contract has no observable effect on admin route rendering because:

1. The root layout mounts `<LivingBlobField />` (animated canvas behind everything).
2. The admin page's outer `<main>` paints `bg-background` (opaque solid) over the entire viewport, hiding the blob.
3. The shadcn primitives (if/when consumed inside the admin page) sit on this opaque solid surface, not over the blob.

So the 93-06 plan's intent ("admin glass surfaces have no blob behind them") holds — but the mechanism is `bg-background` occlusion at admin/page.tsx:40, NOT absence of `<LivingBlobField />` at the layout level.

This nuance matters only if the admin page ever drops the opaque `bg-background` wrapper or if a future admin layout overrides the root layout — at that point the v9.0 transparency contract would activate for admin and the recipe in Section 3 may need to apply to admin contexts too. For now, the admin route remains out of v9.0 token-migration scope per 93-CONTEXT.md `<deferred>` block.

### Verify-only justification

- **Privacy:** `/admin` is intended as a private route (the page sets `metadata.robots = { index: false }` per `admin/page.tsx:12`).
- **No glass surfaces in admin code path:** `submissions-table.tsx` consumes `Badge` + `Table` from `@/components/ui`, both opaque utility primitives; no `backdrop-filter` properties anywhere in the admin tree.
- **No blob coupling:** opaque `bg-background` at `admin/page.tsx:40` masks the blob field below.
- **Decision F-extended:** Phase 93 explicitly defers proactive shadcn migration. ROUTE-06 satisfaction criterion is "verify admin-only impact + record future-proof recipe" — both delivered by this audit.

### Sweep requirement

**ZERO sweep required.** No source files in `next/src/components/ui/` or `next/src/app/admin/` are modified by Plan 06.

Acceptance-gate verification commands (run at sign-off, results below):

```bash
git diff next/src/components/ui/   # → empty
git diff next/src/app/admin/       # → empty
```

---

## Section 5 — Sign-off

```
SHADCN AUDIT COMPLETE: 2026-04-30
shadcn primitives verified as admin-only consumer impact.
SOLE consumer: next/src/app/admin/submissions-table.tsx.
Public-route consumers: ZERO.
dialog.tsx:34 future-proof recipe recorded; not executed.
Source files modified by this plan: ZERO (only the audit doc).
ROUTE-06 satisfied as verify-only.
```

**Audit precision note (replaces the "sole consumer" framing where reality is stricter):**

- 93-RESEARCH/93-CONTEXT/93-PATTERNS state: "shadcn primitives = admin-only impact; SOLE consumer = `admin/submissions-table.tsx`."
- Section 1 reality: `submissions-table.tsx` imports only `Badge` + `Table` from `@/components/ui`, NOT `card/dialog/input/select/textarea`. The five audited primitives have ZERO consumers anywhere in `next/src/`.
- Substantive consequence: identical or stronger no-op disposition. ROUTE-06 framing holds; the underlying assumption is more conservative than the codebase reality.
- Recommendation: future "shadcn audit" phase (deferred per 93-CONTEXT `<deferred>`) should re-verify with this audit's precise grep methodology before any proactive migration.
