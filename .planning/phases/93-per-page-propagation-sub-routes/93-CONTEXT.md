# Phase 93: Per-Page Propagation — Sub-Routes — Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Source:** Research-derived + 1 user decision (no full discuss-phase run — 3 of 4 decisions resolved autonomously per user authorization "сам реши как лучше так и сделай")

<domain>
## Phase Boundary

Phase 93 propagates the v9.0 4-tier glass system established on `/` (Phase 92) to the four service pages (`/checkup`, `/consultations`, `/treatment-abroad`, `/contacts`), the four shared service-page primitives (`ServiceHero`, `FAQ`, `SocialProof`, `LeadFormSection`), and verifies/updates the five shadcn primitives (`card`, `dialog`, `input`, `select`, `textarea`). This is a **mechanical sweep** against the locked Phase 92 token contract — no new design tokens, no new archetypes. Per-route Playwright screenshot diffs guard against visual regression in non-blob regions.

**Out of scope (explicitly):**
- New design tokens or archetypes (Phase 92 final)
- ContactForm/ContactSection (Phase 92 territory)
- BL-01 mobile saturate-clobber root-fix (deferred — separate triage)
- BL-04 ContactForm anti-bot pattern root-fix (deferred — separate triage)
- `next/src/app/contacts/*` dead-code cleanup (4 unimported files — separate todo, see `.planning/todos/pending/contacts-route-dead-code-cleanup.md`)

</domain>

<decisions>
## Implementation Decisions

### LOCKED (from Phase 92 inheritance — non-negotiable)

- **Token contract** — consume `--glass-{section,card,form,button}-{fill,blur}` only. No raw `bg-white/N` opacity classes. No hardcoded `backdrop-blur-{xl,2xl,3xl}` values.
- **CTA opaque-forever invariant** — every gradient CTA stays opaque (`from-mu-blue to-mu-accent-blue` on bare bg, no `backdrop-filter`, no glass classes co-located). Verify via negative-grep gate per route.
- **Mobile blur cap ≤12px** — token clamp() values + globals.css media-query !important fallback both contribute. Phase 93 must respect; do not introduce arbitrary blur values.
- **A11y branch coverage** — globals.css :root token rewrite under `prefers-reduced-transparency` and `prefers-contrast: more` (BL-02 fix in Phase 92) covers ALL future glass surfaces consuming these tokens. Phase 93 inherits automatically. No per-component a11y selectors needed.
- **`liquid-glass.css` utilities** — re-pointed in Phase 92 (`.liquid-regular`, `.liquid-card`, `.liquid-nav`, `.liquid-btn-secondary`, `.stats-glass`). Phase 93 may consume them but does NOT modify them.
- **Heat-leak gradient contract** — `var(--blob-x)`, `var(--blob-y)`, `var(--blob-heat)` with vw/vh defaults. Phase 93 does not touch the blob engine or the heat-leak rules.

### LOCKED (Phase 93 — autonomous from researcher recommendation)

- **Decision A — LeadFormSection nesting** — current implementation has a Tier 0 outer wrapping a Tier 2 inner panel, violating glass-on-glass anti-pattern #13. **Resolution: flatten the Tier 0 outer** (remove the outer glass wrapper), keep the inner Tier 2 form panel with `--glass-form-fill` α=0.50 per KD-v9-002. The inner panel sits directly over the bare blob field with no occluding gradient.
- **Decision B — Per-route localized blob dimming** — KD-v9-003 (Path A: ContactSection blue-gradient occlusion makes blob dimming architecturally moot) does NOT propagate to sub-routes. None of `/checkup`, `/consultations`, `/treatment-abroad`, `/contacts` has a colored-gradient outer wrapper that occludes the blob field. **Resolution: NO localized blob dimming in any sub-route.** Glass surfaces sit directly over the bare blob field; heat-leak gradient response is the only blob→glass coupling.
- **Decision C — BL-04 anti-bot pattern propagation** — Phase 92 ContactForm has a honeypot + 3-second timing trap that silently drops sub-3s submissions while showing fake success UI (BL-04, deferred). **Resolution: DO NOT propagate this pattern to `LeadFormSection`.** New form variant must NOT silently drop legitimate submissions. Anti-bot for LeadFormSection is OUT OF SCOPE for Phase 93 — leave to a future explicit anti-bot decision phase. ContactForm BL-04 stays deferred for separate triage.
- **Decision E — KD-v9-002 α=0.50 inheritance** — `LeadFormSection` Tier 2 form panel inherits `--glass-form-fill` desktop = 0.50 by simply consuming the same token. Phase 92 already locked the value. No per-route empirical re-measurement is required during planning; Phase 94 hard-gate will Lighthouse/axe across all routes.

### LOCKED (Phase 93 — autonomous, scope/cleanup)

- **Decision F — `/contacts` dead-code disposition** — User-confirmed 2026-04-30: treat `next/src/app/contacts/*` (4 unimported files) as dead-code, delete OUTSIDE Phase 93 scope. Phase 93 sweeps `next/src/app/contacts/page.tsx` against whatever it actually renders. Cleanup todo logged at `.planning/todos/pending/contacts-route-dead-code-cleanup.md`.

- **Decision G — REQUIREMENTS.md file-count correction** — ROADMAP claims `/checkup` (8 files), `/consultations` (8 files), `/contacts` (2 files). Research found actual: checkup = 7 rendered, consultations = 7 rendered, contacts = 0–4 rendered (depending on Decision F resolution → resolved to "whatever page.tsx imports"). Treatment-abroad = 4, correct. Plan must use actual counts, not ROADMAP estimates. ROADMAP itself stays as-is; the SUMMARY.md will note the discrepancy.

### LOCKED (Phase 93 — Wave 0 infrastructure)

- **Decision H — Playwright infrastructure** — Playwright is NOT installed in the repo. ROUTE-07 cannot ship without Wave 0 infrastructure work: `pnpm --dir next add -D @playwright/test @playwright/test` + `npx playwright install chromium` + `next/playwright.config.ts` + screenshot baseline capture. Wave 0 is a hard prerequisite for Wave 1+.
- **Decision I — Screenshot baseline source-of-truth** — Pre-Phase-93 baseline = current state of `feat/v3.1` HEAD (post-Phase 92 merge). Capture once at Wave 0 start, before any Phase 93 sweep commits. Mask the `.living-blob-field` region per-screenshot. Use `window.__blobDebug.setMode?.('static')` for determinism IF that surface exists (verify Wave 0 task 1); fallback `page.emulateMedia({ reducedMotion: 'reduce' })` if not.

### LOCKED (Phase 93 — wave decomposition)

- **Decision J — Wave structure** — 4 waves total:
  - **Wave 0 (FOUNDATION):** Playwright install + config + baseline capture (sequential — single agent)
  - **Wave 1 (SERVICE PRIMITIVES):** sweep `ServiceHero`, `SocialProof`, `FAQ`, `LeadFormSection` — propagates to 3 of 4 routes automatically; LeadFormSection executes Decision A (flatten Tier 0 outer); produces baseline that Wave 2 sub-routes consume
  - **Wave 2 (SUB-ROUTES, parallel):** `/checkup` (7 files), `/consultations` (7 files), `/treatment-abroad` (4 files), `/contacts` (page.tsx + whatever it renders) — 4 agents in parallel worktrees
  - **Wave 3 (shadcn verification):** confirm shadcn primitives are admin-only impact (research grep showed only `admin/submissions-table.tsx` consumes); future-proof `dialog.tsx:34` if a public modal ever lands; verify across all consumer call-sites; per-route screenshot diff against Wave 0 baseline; submission-path smoke (Directus E2E)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 92 — direct dependency (locked patterns)
- `.planning/phases/92-glass-rework-chrome-index-sections/92-PATTERNS.md` — per-line migration tables; Archetypes A–J reused verbatim
- `.planning/phases/92-glass-rework-chrome-index-sections/92-UI-SPEC.md` — design contract; tier system inherited
- `.planning/phases/92-glass-rework-chrome-index-sections/92-CONTEXT.md` — locked Phase 92 decisions and propagation rules
- `.planning/phases/92-glass-rework-chrome-index-sections/92-02-AUDIT.md` — CTA invariant baseline; negative-grep gate template
- `.planning/phases/92-glass-rework-chrome-index-sections/92-08-SWEEP-AUDIT.md` — close-out audit; reusable acceptance gates
- `.planning/phases/92-glass-rework-chrome-index-sections/92-REVIEW.md` + `92-REVIEW-FIX.md` — Phase 92 code review findings; informs Phase 93 anti-pattern prevention
- `.planning/phases/92-glass-rework-chrome-index-sections/92-VALIDATION.md` — Phase 92 Nyquist validation strategy; Phase 93 inherits structure
- All `92-*-SUMMARY.md` — Phase 92 plan deliverables; treat as binding source-of-truth for what's already done
- `.planning/PROJECT.md` — KD-v9-001 (`--blob-hot: #4FE098`), KD-v9-002 (`--glass-form-fill = 0.50`), KD-v9-003 (Path A blue-gradient occlusion)

### Token system (Phase 90)
- `next/src/app/globals.css` (`:root` block lines 240–264, a11y block lines 536–602, mobile blur cap lines 518–528)
- `next/src/styles/liquid-glass.css` (utilities + heat-leak gradients lines 178–182, 343–347)
- `DESIGN.md` (root) — YAML token contract + v9.0 anti-patterns appendix

### Blob engine (Phase 91)
- `next/src/lib/blob-engine/index.ts` (engine writes `--blob-x/y/heat` per rAF tick; Phase 93 consumes via heat-leak gradients only)
- `next/src/components/effects/LivingBlobField.tsx` (canvas mount; Phase 93 does not touch)
- `next/src/styles/blob.css` (4 sublayer base styles; Phase 93 does not touch)

### Project rules
- `./CLAUDE.md` — Apple Liquid Glass HIG compliance, design contract rules, GSD workflow enforcement
- `next/src/app/contacts/page.tsx` — only file from /contacts that page.tsx imports + actually renders (treat as the contacts route source-of-truth for sweep)

</canonical_refs>

<specifics>
## Specific Ideas

- **Form-safety propagation** — `LeadFormSection` MUST consume `--glass-form-fill` (α=0.50 desktop), `--glass-form-blur`, opaque `bg-white` inputs, and `text-mu-text-900 font-bold` labels. Mirror ContactForm's pattern verbatim; do not re-derive contrast.
- **Service primitives consumer count** — `ServiceHero`, `FAQ`, `SocialProof`, `LeadFormSection` are imported by 3 of 4 sub-routes (verify in research file). Wave 1 sweeps the primitives ONCE; Wave 2 sub-routes pick up the changes automatically via import graph.
- **shadcn primitives location** — `next/src/components/ui/{card,dialog,input,select,textarea}.tsx`. Research confirmed only `admin/submissions-table.tsx` consumes them on public routes. Wave 3 verifies admin-only impact and produces a future-proofing note for `dialog.tsx:34` if it ever ships in a public modal.
- **Per-route screenshot baseline** — captured at Wave 0 task 2, after Wave 0 task 1 (install) but before any Wave 1 commits. Two breakpoints (≥1280px desktop, ≤375px mobile). Mask `.living-blob-field` region. Determinism via `window.__blobDebug.setMode('static')` (verify availability Wave 0 task 1) or `page.emulateMedia({ reducedMotion: 'reduce' })` fallback.
- **Submission-path E2E** — Wave 3 final task: submit one test record from each of the 4 routes, confirm arrival in Directus admin UI. This satisfies ROUTE-07 success criterion. Marker: `[E2E]` test record with timestamp suffix; cleanup via Directus admin or DELETE call.
- **Anti-pattern register** — Phase 93 SUMMARY (last plan) appends one new anti-pattern to DESIGN.md: "Do not propagate ContactForm honeypot/3-second timing pattern to new form components without explicit anti-bot decision phase."

</specifics>

<deferred>
## Deferred Ideas

- **`next/src/app/contacts/*` dead-code cleanup** — separate todo (`.planning/todos/pending/contacts-route-dead-code-cleanup.md`).
- **BL-01 root-fix (mobile saturate-filter clobber)** — Phase 92 deferral; needs separate triage. Phase 93 sub-routes inherit the issue; Phase 94 real-device UAT confirms severity.
- **BL-04 root-fix (ContactForm honeypot/timing)** — Phase 92 deferral; product/server-side decision required. Phase 93 explicitly does NOT propagate the broken pattern; LeadFormSection ships without it.
- **WR-01..11 root-fixes** (glass-on-glass nesting in Footer/HeroHub/WhyUsSection, viewport-budget overshoot on StatsBar, MobileMenu scroll-lock leak, StickyBar IntersectionObserver re-bind on SPA route change, dead engine writes for unconsumed `--blob-body/halo/velocity` vars) — Phase 92 deferrals. Phase 93 must NOT compound these (per-viewport glass-layer audit per plan), but root-fix is out of scope.
- **shadcn primitives proactive token migration** — research found public routes don't consume them. Wave 3 verifies admin-only impact only; full migration deferred to a "shadcn audit" phase if/when public routes start consuming.
- **REQUIREMENTS.md file-count edits** — ROADMAP estimates are stale (checkup says 8 actual 7, etc.). Plan SUMMARY notes discrepancy; ROADMAP itself stays as-is until milestone-end audit.

</deferred>

---

*Phase: 93-per-page-propagation-sub-routes*
*Context gathered: 2026-04-30 — research-derived + 1 user decision*
