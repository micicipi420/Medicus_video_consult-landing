---
phase: 92-glass-rework-chrome-index-sections
plan: 07
subsystem: ui
tags: [glass, contact-form, wcag, tier-2, form-safety, react, tailwind, kd-v9-002, kd-v9-003]

requires:
  - phase: 92-glass-rework-chrome-index-sections/03
    provides: --glass-form-fill, --glass-form-blur tokens (Phase 90 frozen, consumed here)
  - phase: 92-glass-rework-chrome-index-sections/05
    provides: Wave 2/3 chrome + section sweeps establishing visual context
  - phase: 92-glass-rework-chrome-index-sections/06
    provides: Wave 3 section sweeps establishing typography hierarchy (text-mu-text-700/900)
provides:
  - ContactSection form panel migrated from opaque-white to Tier 2 form-fill
  - ContactForm inputs flattened from animated-transparency glass to opaque bg-white
  - Path A locked: blue-gradient outer preserved (KD-v9-003 — localized blob dimming deferred as architecturally moot)
  - WCAG AA measurement gate identified failure at default 0.14 (theoretical worst-case 2.80:1 body / 5.45:1 labels) — escalation decision deferred to user/orchestrator (Task 3 awaiting checkpoint)
affects: [phase 93+, form-safety patterns, KD-v9-002 escalation log]

tech-stack:
  added: []
  patterns:
    - "Archetype F (form panel + inputs FORM-SAFETY): bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)] panel + bg-white opaque inputs"
    - "Animated-transparency anti-pattern removed from input focus (no focus:bg-white/72; transition-[background-color] dropped)"
    - "Path A pattern: form panels over saturated brand-color rectangles preserve the rectangle (no localized blob dimming)"

key-files:
  created:
    - .planning/phases/92-glass-rework-chrome-index-sections/92-07-SUMMARY.md
  modified:
    - next/src/components/sections/ContactSection.tsx
    - next/src/components/sections/ContactForm.tsx

key-decisions:
  - "Path A locked per RESEARCH §Pitfall 2 + KD-v9-003: ContactSection blue-gradient outer preserved; localized blob dimming (Decision B step 4 / GLASS-07 sub-clause) deferred — form panel sits over opaque blue rectangle, not page blob field."
  - "Trust signal cards (lines 60, 63, 83) over the blue gradient: kept as-is per planner judgment (PATTERNS.md note). Migrating to --glass-button-fill would over-saturate against the white-on-blue contract."
  - "Task 2 WCAG measurement: theoretical contrast computation (no headless-browser tooling in worktree environment) shows default 0.14 fails AA at worst-case gradient point for body copy (text-mu-text-700) — see WCAG findings below. Escalation decision returned to orchestrator as structured checkpoint."

patterns-established:
  - "Theoretical-contrast computation as fallback when headless-browser tooling unavailable: computes alpha-over composite at gradient endpoints, applies WCAG luminance formula, reports worst-case ratio."

requirements-completed: []  # GLASS-07 NOT yet complete — awaiting Task 3 escalation decision

duration: ~15min (Tasks 1+2; Task 3 pending)
completed: 2026-04-30
---

# Phase 92 Plan 92-07: ContactForm/ContactSection Form-Safety Tier 2 Migration Summary

**ContactForm panel migrated to Tier 2 form-fill (`bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)]`); inputs flattened from `bg-white/50 backdrop-blur-md focus:bg-white/72` to opaque `bg-white`; submit gradient + success overlay preserved; theoretical WCAG measurement identifies AA failure at default 0.14 — escalation decision deferred to user.**

## Performance

- **Duration:** ~15 min (Tasks 1 + 2; Task 3 pending checkpoint)
- **Started:** 2026-04-30T11:40:00Z (approximate)
- **Completed:** 2026-04-30T11:55:20Z (Tasks 1 + 2)
- **Tasks completed:** 2 of 3 (Task 3 awaiting decision)
- **Files modified:** 2 (ContactSection.tsx, ContactForm.tsx)

## Accomplishments

- ContactSection form panel migrated to Tier 2 form-fill (Archetype F): `bg-white p-6` → `bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)] p-6` (7× drop in opacity 1.00 → 0.14).
- ContactForm input template flattened: `bg-white/50 backdrop-blur-md focus:bg-white/72` + `transition-[background-color,...]` → `bg-white` opaque + transition list with `background-color` dropped. T-92-07-04 (animated-transparency on focus) mitigated.
- Path A locked: ContactSection blue-gradient outer (line 26 `from-mu-blue via-mu-accent-blue to-mu-blue`) preserved; KD-v9-003 deferral applied — localized blob dimming (Decision B step 4) is architecturally moot for the current layout.
- Preserved (verify-only): success overlay (`bg-white/82 backdrop-blur-3xl`), submit gradient CTA (`from-mu-blue to-mu-accent-blue` no `backdrop-*`), labels (`text-mu-text-900 font-bold` already promoted in v8.0), trust signal cards over the gradient.
- FORM-03 Directus endpoint integration unchanged (`submitContactForm` import + invocation intact).
- Theoretical WCAG analysis identifies AA gap at default `--glass-form-fill: 0.14` for the privacy-notice paragraph (`text-mu-text-700`) at the mu-accent-blue end of the section gradient (worst-case 2.80:1).

## Task Commits

1. **Task 1: ContactSection.tsx + ContactForm.tsx — form panel Tier 2 migration; inputs flattened** — `f1e87e1` (feat)
2. **Task 2: WCAG AA measurement; conditional KD-v9-002 escalation** — _no commit_ (measurement-only task; structured checkpoint returned)
3. **Task 3: KD-v9-002 escalation flow** — _PENDING_ (awaiting orchestrator/user decision per checkpoint below)

**Plan metadata commit:** to be issued after Task 3 resolves.

## Files Modified

- `next/src/components/sections/ContactSection.tsx` — line 120 form panel wrapper migrated to Tier 2 form-fill + form-blur tokens. All other elements (lines 26, 35–36, 60–63, 83) unchanged per Path A and planner judgment.
- `next/src/components/sections/ContactForm.tsx` — line 128 `inputBase` template: dropped `bg-white/50`, `backdrop-blur-md`, `focus:bg-white/72`, and `background-color` from transition list. Line 111 success overlay, line 247 submit gradient, lines 137/159/182/207 labels: untouched.

## Decisions Made

- **Path A confirmed (KD-v9-003 applied):** Blue-gradient backdrop on ContactSection preserved. The form panel sits over an opaque blue rectangle, not over the page blob field, so "localized blob dimming" (REQUIREMENTS.md GLASS-07 sub-clause / Decision B step 4) is not architecturally meaningful for this layout. Deferred under KD-v9-003 (already logged in PROJECT.md).
- **Trust signal cards over gradient kept as-is:** lines 60, 63, 83 (`bg-white/15`, `bg-white/20`, `bg-white/10`) NOT migrated to `--glass-button-fill`. Rationale: these sit over the saturated blue rectangle where 0.10/0.15/0.20 white reads as the "white-on-blue trust signals" contract; migrating to 0.12/0.16 (button-fill) over-saturates per PATTERNS.md planner-judgment guidance.
- **Theoretical-contrast computation used in lieu of live DevTools measurement:** no headless-browser tooling (Playwright, Puppeteer, Chromium) is available in this worktree environment. Per the orchestrator's checkpoint_handling clause ("If you cannot perform the contrast measurement, document the procedure ... and return a checkpoint asking the user"), the analytical alpha-over composite + WCAG luminance computation provides the deterministic worst-case reading.

## WCAG AA Findings (Task 2)

### Composition model

- Section background: `bg-gradient-to-br from-mu-blue via-mu-accent-blue to-mu-blue`
  - `--mu-blue: #38C6F4` → rgb(56, 198, 244)
  - `--mu-accent-blue: #4F84E8` → rgb(79, 132, 232)
  - Mid-gradient sample: rgb(67, 165, 238)
- Form panel: `--glass-form-fill: rgba(255, 255, 255, 0.14)` (single declaration in `:root`; no mobile override exists in current globals.css).
- Form panel `backdrop-blur-[var(--glass-form-blur)]` smooths the underlying gradient but does NOT change the worst-case mean color over a small text region (blur averages but the composite math reflects average luminance; treating gradient endpoints as worst-case is the correct conservative bound).
- Body copy element analyzed: `<p className="text-sm text-mu-text-700 ...">Мы перезвоним...</p>` (ContactForm.tsx line 257) — color `--mu-text-700: #4A4E5C` rgb(74, 78, 92).
- Label elements: `text-mu-text-900` rgb(27, 33, 44).
- Path A locks the backdrop to the gradient (no blob-heat influence at the form region), so heat=0 and heat=1 yield essentially identical composites for the form panel — they are equivalent measurements here.

### Measured (computed) contrast at default `--glass-form-fill: 0.14`

| Element | Color | Worst-case bg | Composite | Contrast | WCAG AA threshold | Result |
|---------|-------|---------------|-----------|----------|-------------------|--------|
| Body copy (privacy notice, line 257) | text-mu-text-700 #4A4E5C | mu-accent-blue rgb(79,132,232) | rgb(104,149,235) | **2.80:1** | 4.5:1 | **FAIL** |
| Body copy (privacy notice, line 257) | text-mu-text-700 #4A4E5C | mid-gradient rgb(67,165,238) | rgb(93,178,240) | **3.59:1** | 4.5:1 | **FAIL** |
| Body copy (privacy notice, line 257) | text-mu-text-700 #4A4E5C | mu-blue rgb(56,198,244) | rgb(84,206,246) | 4.55:1 | 4.5:1 | pass |
| Labels (lines 137/159/182/207) | text-mu-text-900 #1B212C | mu-accent-blue rgb(79,132,232) | rgb(104,149,235) | 5.45:1 | 4.5:1 | pass |
| Labels | text-mu-text-900 | mid-gradient | rgb(93,178,240) | 6.99:1 | 4.5:1 | pass |
| Labels | text-mu-text-900 | mu-blue | rgb(84,206,246) | 8.87:1 | 4.5:1 | pass |
| Headings (success overlay h3, large) | text-mu-text-900 | _N/A_ — success overlay is `bg-white/82` opaque-leaning | _N/A_ | _N/A_ | 3:1 | n/a |

**Note:** Inputs themselves are now opaque `bg-white`, so input value text and placeholders are over a pure white background (16.15:1 / contrast vs `text-mu-text-500` ~4.86:1) and unaffected by panel-fill opacity.

### Computed contrast at planner-proposed escalated `--glass-form-fill: 0.30`

| Element | Worst-case bg | Composite | Contrast | Result |
|---------|---------------|-----------|----------|--------|
| Body copy text-mu-text-700 | mu-accent-blue | rgb(132,169,239) | **3.51:1** | **STILL FAIL** |
| Body copy text-mu-text-700 | mid-gradient | rgb(123,192,243) | 4.21:1 | still fails AA |
| Body copy text-mu-text-700 | mu-blue | rgb(116,215,247) | 5.05:1 | pass |

**Critical finding:** the plan's proposed 0.14 → 0.30 escalation does NOT bring body-copy AA across the entire gradient. Worst-case (mu-accent-blue end, ≈ centre/right of the `via-mu-accent-blue` portion of the gradient) lands at 3.51:1, still below 4.5:1.

### Computed contrast at higher escalations (reference)

| `--glass-form-fill` α | Body text-mu-text-700 worst-case (mu-accent-blue) | Body text-mu-text-700 mid-gradient |
|-----------------------|---------------------------------------------------|------------------------------------|
| 0.50 | 4.60:1 (pass with margin <0.2) | 5.15:1 |
| 0.70 | 5.87:1 | 6.27:1 |
| 1.00 (opaque) | 8.28:1 | 8.28:1 |

Reaching AA across the full gradient with a margin of safety requires α ≥ ~0.50; comfortable margin requires ≥ ~0.70.

### Manual validation (recommended follow-up)

The computed worst-case is the conservative bound — actual perceived contrast may be slightly higher because:
1. The privacy notice (`<p>` line 257) sits BELOW the submit button inside a panel padded by `p-6 sm:p-8`, so the actual underlying gradient point is biased toward one end of the gradient depending on viewport width and form length.
2. `backdrop-blur-[var(--glass-form-blur)]` (12–18px) smooths the composite — Chrome DevTools' contrast picker uses a sampled actual color, which may differ from gradient-endpoint extremes.

A follow-up live-DevTools measurement using VALIDATION.md Recipe 3 is recommended to confirm or correct the computed worst-case before committing to an escalation level.

## Task 3 Status: AWAITING DECISION (Checkpoint Returned)

The plan offered three responses: `passed`, `escalate <ratio>`, `defer <reason>`. Computed analysis says: **escalate** — but the planner-proposed 0.14 → 0.30 alone is mathematically insufficient at gradient worst-case. Returning a structured decision checkpoint per checkpoint_handling clause:

- **Option A (recommended math-driven):** Escalate to `--glass-form-fill: 0.50` — minimal value that yields AA across the full gradient (4.60:1 worst-case, ~0.1 margin). Log KD-v9-002 with rationale "0.30 insufficient at gradient worst-case (3.51:1); 0.50 minimum for AA-across-gradient".
- **Option B (planner-proposed):** Escalate to 0.30 as plan specifies. Risk: AA fails at mu-accent-blue end of gradient. Mitigation: combine with localized darken-tint of the form panel (vec via additional dark layer) — but Decision I freeze prevents this without further authorization.
- **Option C (visual-design driven):** Escalate to 0.70 — comfortable AA margin (5.87:1 worst-case), still preserves Tier-2 visual presence (form panel reads as "tinted glass" not opaque card).
- **Option D (conservative anti-pattern revert):** Revert form panel to opaque `bg-white` (Tier 0), accept that the form panel is the page's only opaque-white surface; document the form-safety override as a permanent exemption in PROJECT.md. Trade-off: visual continuity with the rest of v9.0 Liquid Glass system breaks at the conversion point.
- **Option E (defer + live-measure):** Spin up dev server + manual DevTools measurement to confirm whether computed worst-case is actually realized in practice; the visible privacy-notice region may not actually overlap mu-accent-blue depending on responsive layout. Defer Task 3 until live measurement produces an empirical reading.

## Path A & Trust Signal Notes

- **Localized blob dimming (Decision B step 4 / GLASS-07 sub-clause):** Deferred under KD-v9-003 — form panel sits over opaque blue rectangle, not page blob field. No dimming overlay added.
- **Trust signal cards over blue gradient (lines 60, 63, 83):** Kept as-is per planner judgment per PATTERNS.md. RATIONALE: these sit over the vivid blue gradient where 0.10/0.15/0.20 white reads correctly per the white-on-blue trust signals contract. Migrating to `--glass-button-fill` (0.12/0.16) would over-saturate the white tint relative to the blue background.

## FORM-03 Directus Integration Smoke Test

- `submitContactForm` import (line 4) intact: `import { submitContactForm } from '@/lib/db/actions';`
- `await submitContactForm(...)` invocation (line 83) intact.
- Honeypot + timing + validation flow unchanged.
- `pnpm --dir next build` exits 0; `/` route compiles.
- Functional submit-to-Directus smoke (browser test) NOT performed in this executor (no Directus instance available in worktree). Recommended as part of pre-merge validation.

## Acceptance Criteria Verification (Task 1)

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| `pnpm --dir next build` | exits 0 | 0 | ✓ |
| ContactSection: `bg-white p-6\|bg-white p-8` | 0 | 0 | ✓ |
| ContactSection: standalone `bg-white([^/]\|$)` | dropped ≥1 | 0 (was ≥1) | ✓ |
| ContactSection: `bg-[var(--glass-form-fill)]` | ≥1 | 1 | ✓ |
| ContactSection: `backdrop-blur-[var(--glass-form-blur)]` | ≥1 | 1 | ✓ |
| ContactSection: `from-mu-blue via-mu-accent-blue to-mu-blue` | ≥1 | 1 | ✓ (Path A) |
| ContactForm: `bg-white/50\|focus:bg-white/72` | 0 | 0 | ✓ |
| ContactForm: `bg-white` (input + success + success-icon) | ≥1 | 3 | ✓ |
| ContactForm: `backdrop-blur-md` | 0 | 0 | ✓ |
| ContactForm: `transition-[background-color` | 0 | 0 | ✓ |
| ContactForm: `bg-white/82` (success overlay) | ≥1 | 1 | ✓ (preserved) |
| ContactForm: labels `text-mu-text-900 font-bold` | ≥4 | 4 | ✓ (already promoted) |
| ContactForm: submit `from-mu-blue to-mu-accent-blue` | ≥1 | 1 | ✓ |
| CTA invariant: submit + `backdrop` | 0 | 0 | ✓ |
| FORM-03 invariant: `submitContactForm\|fetch\|/items/submissions` | ≥1 | 2 | ✓ |
| `&nbsp;` ContactSection (baseline 5) | 5 | 5 | ✓ |
| `&nbsp;` ContactForm (baseline 0) | 0 | 0 | ✓ |

All Task 1 acceptance criteria pass.

## Deviations from Plan

**1. [Rule 3 — Blocking] Installed missing node_modules in worktree**
- **Found during:** Task 1 verification (`pnpm --dir next build`)
- **Issue:** Worktree did not have node_modules; build command failed with `next: command not found`.
- **Fix:** Ran `pnpm install --prefer-offline` inside `next/`. Did not commit lockfile/node_modules (gitignored).
- **Files modified:** none committed.
- **Verification:** Subsequent `pnpm --dir next build` exited 0.

**2. [Rule 4 — Architectural — RETURNED AS CHECKPOINT, not auto-fixed] Planner-proposed 0.14→0.30 KD-v9-002 escalation is mathematically insufficient**
- **Found during:** Task 2 (WCAG measurement)
- **Issue:** Computed worst-case body-copy contrast at the planner-proposed 0.30 escalation is 3.51:1 (vs 4.5:1 AA threshold) at the mu-accent-blue end of the section gradient. Plan defines KD-v9-002 as a fixed 0.14→0.30 bump but doesn't anticipate the gradient worst-case.
- **Why architectural (Rule 4 not Rule 1):** Choosing a different α value, reverting to opaque, or accepting <AA at one gradient end has visual-design implications that need user/orchestrator sign-off — not a localised correctness bug.
- **Action:** Returned as structured decision checkpoint (see Task 3 Status section above and Awaiting block at end of summary) offering Options A–E.

**3. [Rule 3 — Blocking] No headless-browser tooling for live WCAG measurement**
- **Found during:** Task 2
- **Issue:** Plan's Recipe 3 prescribes Chrome DevTools live measurement; no `playwright`, `puppeteer`, `chromium`, or `chrome` binary available in this executor environment.
- **Fix:** Performed deterministic theoretical contrast computation (alpha-over composite + WCAG luminance formula) at gradient endpoints + mid-gradient sample. Documented full procedure in this SUMMARY.md so a follow-up live measurement can either confirm or refine the computed worst-case.
- **Files modified:** none.
- **Verification:** Math reproduces known reference values (text-mu-text-700 vs pure white = 8.28:1, matches Chrome DevTools).

---

**Total deviations:** 3 (1 blocking install, 1 architectural-returned-as-checkpoint, 1 blocking-resolved-with-fallback). Impact on plan: Tasks 1 + 2 complete; Task 3 paused at decision checkpoint per plan's own conditional.

## Issues Encountered

- **node_modules missing in worktree** — resolved via `pnpm install`.
- **No headless-browser tooling for live measurement** — resolved via theoretical-contrast fallback documented in SUMMARY.md.
- **0.30 escalation insufficient** — escalated to user as Rule 4 architectural decision via structured checkpoint.

## Self-Check

Per execute-plan.md self-check protocol:

```
[ -f next/src/components/sections/ContactSection.tsx ] && echo FOUND   → FOUND
[ -f next/src/components/sections/ContactForm.tsx ] && echo FOUND       → FOUND
git log --oneline | grep -q f1e87e1 && echo FOUND                       → FOUND
```

## Self-Check: PASSED (Task 1 artifacts + commit verified; Task 2 measurement documented; Task 3 awaiting decision)

## Awaiting

User/orchestrator decision on Task 3 escalation level (Options A–E above). Recommended: **Option A (0.50)** — minimum value that satisfies AA across the full section gradient with a small margin, AND **Option E (live-measure)** as confirmation step before committing the globals.css edit.

After decision: re-spawn executor with the chosen α value; it will perform the conditional Task 3 (globals.css edit + KD-v9-002 row in PROJECT.md + re-measurement), then commit metadata and complete the plan.

## Next Phase Readiness

- Tasks 1 + 2 are stable and committed; the form panel is functionally on Tier 2 form-fill and inputs are flat opaque. The visual rework is in place.
- GLASS-07 requirement is **NOT yet complete** until Task 3 resolves (either escalation logged or explicit accept-and-defer).
- Wave 4 of Phase 92 cannot be marked complete until this checkpoint resolves.

---
*Phase: 92-glass-rework-chrome-index-sections*
*Plan: 07*
*Completed (Tasks 1+2): 2026-04-30*
*Task 3: pending decision*
