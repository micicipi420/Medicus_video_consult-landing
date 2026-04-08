# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v3.0 — SEO, Performance & Polish

**Shipped:** 2026-04-06
**Phases:** 4 (29-32) | **Plans:** 7 | **Tasks:** 13

### What Was Built
- Branded 404 page + cross-page header/footer/script normalization across all 6 pages
- Full SEO: unique titles + descriptions + Open Graph + canonical URLs + Schema.org `MedicalBusiness` JSON-LD
- Performance: 11 Unsplash images → local WebP (660KB → 283KB, -57%), lazy loading + CLS-preventing `width/height`, critical resource preloads, deferred Motion CDN
- Accessibility / design system compliance: WCAG AA color tokens (7 text + 2 CTA gradient), `:focus-visible` keyboard ring, ARIA `role="alert"` on form errors, `prefers-reduced-motion` rule, Glass-5 form containers
- Russian typography polish: nbsp binding for subject+verb pairs, orphan prevention, responsive `<br>` on hero headings (post-phase commits)

### What Worked
- **Splitting a11y into 2 plans** (32-01 token foundation, 32-02 application) kept the diff reviewable and let the foundation land before mass-replace work
- **Audit-first acceptance**: running `/gsd-audit-milestone` before completion caught that v3.0-MILESTONE-AUDIT.md needed to exist as a shipping gate, not an afterthought
- **Local WebP over CDN**: data sovereignty + bytes win + zero third-party SLA risk — exactly the right call for KZ medical context
- **Tailwind v4 standalone CLI**: keeping the toolchain as a single binary made every CSS rebuild during 32-02 friction-free

### What Was Inefficient
- **Phase 32 was added late and never folded into the v3.0 milestone summary** — ROADMAP.md milestone line said "Phases 29-31" right up until completion, requiring a manual fix during archive
- **MILESTONES.md is missing v2.0 entry entirely** (Service Pages Copywriting Rewrite) — pre-existing gap that should be retroactively filled
- **Tech debt from 32 was deferred but never re-queued**: 4 visual polish items (border-radius, coordinator card sizing, H2 standardization, hero shadow) were noted in audit but no follow-up phase was created
- **Russian typography polish (nbsp binding, responsive br) was done as ~5 separate fix commits after phase 32 closed** — should have been a single planned plan inside 32 or a dedicated phase

### Patterns Established
- **Two-token CTA gradient** (`mu-cta-from` / `mu-cta-to`) — accessible-contrast variant separate from brand-identity tokens. Allows future redesigns to swap brand colors without breaking WCAG compliance.
- **Global `:focus-visible` rule, not per-component** — single CSS override propagates to all pages without component churn.
- **nbsp binding for Cyrillic widows/orphans** — `text-wrap: balance` is unreliable for Russian; explicit `&nbsp;` chains for subject+verb pairs is the only durable fix.
- **Responsive `<br class="md:hidden">`** for hero headings — lets Russian compound phrases break correctly on mobile without JS.
- **Audit-passed gate before milestone-complete** — `/gsd-audit-milestone` is a required step, not optional.

### Key Lessons
1. **When inserting a phase into an active milestone, immediately update the milestone summary line in ROADMAP.md.** Otherwise the archive is wrong and you do retroactive cleanup at completion.
2. **Russian typography is a first-class concern, not a polish task.** ЦА 45+ on mobile reads slowly — line breaks mid-clause cause real comprehension friction. Plan it into the page-rewrite phase, not after.
3. **A11y deferred items should always become a follow-up phase, not a footnote.** If audit catches 4 deferred items and you don't queue them, they evaporate.
4. **Audit before complete** — `/gsd-audit-milestone` finds the exact gaps you'd otherwise miss in retrospective ("requirements: 18/18 satisfied" gives confidence to ship).
5. **Pixel-perfect Tailwind from a TSX prototype works** — phase 25 (Tailwind migration) + phase 32 (a11y compliance) prove that the Redesign/ folder as design source of truth is a high-leverage decision.

### Cost Observations
- Model mix: predominantly Opus 4.6 (1M context) for orchestration + planning, Sonnet for executor agents
- Sessions: ~2 sessions for v3.0 (one for phases 29-31 SEO+perf, one for phase 32 a11y + post-phase typography)
- Notable: phase 32 (a11y) had the highest agent-spawn count of any v3.0 phase (~20 agents across discuss → plan → execute → verify) — accessible color token replacement is mechanically dense work that benefits from parallelization

---

## Milestone: v3.2 — Build Pipeline & Chrome Partials

**Shipped:** 2026-04-08
**Phases:** 2 (39, 40) | **Plans:** 6 | **Commits:** 32 | **Source diff:** 20 files, +891/-69

### What Was Built
- **Chrome partials architecture:** 4 partials (header, footer, sticky-bar, mobile-menu) extracted to `partials/*.html`; POSIX-sh + awk marker splicer (`scripts/build-pages.sh`) with 11-token substitution vocabulary regenerates all 6 pages from partial sources.
- **Byte-identity build pipeline:** `make build` canonical entry point, `build.sh` thin delegator, `Makefile` with 5 targets, `docs/BUILD.md` contributor reference, Tailwind v4.2.2 binary pinned and auto-installed via `install-tailwind` target.
- **First git hook in repo:** `scripts/hooks/pre-commit` enforces byte-identity gate on every commit. Dual-mode install via symlink works in both regular clones and git worktrees.
- **404.html H1 mobile fix at the source:** class stepped `text-4xl` → `text-3xl`, phrase "Страница не найдена" now fits 320px viewport without the `overflow-x: clip` safety net.
- **Full favicon set:** `favicon.ico` (3-frame ICO), `favicon.svg` (hand-drawn brand gradient), `apple-touch-icon.png` (180×180), `site.webmanifest`. 4 `<link>` tags in `<head>` of all 6 pages. Browser console silent on first load.
- **Russian typography range binding:** checkup.html "за 1–2 дня" wrapped in Tailwind `whitespace-nowrap` span. En-dash U+2013 preserved. Verified at 6 viewports.

### What Worked
- **Locked decisions in CONTEXT.md made planning trivial.** Phase 40's CONTEXT.md specified exact file paths, exact class strings, exact HTML fragments, and exact verification viewports. Planner produced 3 pass-on-first-iteration plans with no revisions needed and no research pass required.
- **Parallel worktrees for disjoint files.** Wave 1 (40-01 touching `404.html`, 40-03 touching `checkup.html`) ran in parallel isolated worktrees. Wave 2 (40-02 touching all 6 HTML pages + 4 new assets) was sequenced after — explicit wave ordering prevented merge-conflict risk on shared files.
- **Pillow as ImageMagick fallback** worked cleanly for the one-shot raster pipeline. Pre-authorizing the deviation in the executor prompt avoided a mid-plan stall to install new system tooling.
- **Playwright MCP `Range.getClientRects()` as the definitive single-line test** instead of `height === lineHeight`. Font metric overhead makes the height check unreliable (43px actual vs 39.6px lineHeight on a 1-line span) — client-rect count is the correct semantic.
- **Audit-free completion worked for this milestone** specifically because Phase 40 already had a rigorous Playwright verification pass per must-have, and Phase 39's byte-identity gate is enforced at commit time. For milestones with less automated verification, `/gsd-audit-milestone` remains the right call.

### What Was Inefficient
- **Bash cwd drift into a worktree during Wave 1 merge.** My shell's cwd silently moved into `agent-aeac346e` (the 40-03 worktree) without an explicit `cd`, so the `git merge worktree-agent-acbcd926` command landed the 40-01 merge commit on the 40-03 worktree branch instead of `feat/v3.1`. Recovered via explicit `cd` back to main repo + `git merge --ff-only` (which fast-forwarded cleanly since the merge commit already contained both plans), but this cost a round-trip of investigation.
- **`phase complete` CLI leaves checkbox drift in the active milestone section.** The CLI flipped plan checkboxes in the Phase Details sections and updated the Progress table, but did NOT flip the `- [ ] **Phase N:** ` items in the top-of-roadmap milestone listing (active-phase format) nor the unchecked items in REQUIREMENTS.md. Required manual drift fix before archival. Pre-existing CLI quirk that should be filed.
- **`milestone complete` CLI extracted garbage "Found during:" one-liners** for Phase 39 SUMMARYs because those files don't have a clean `one_liner` frontmatter field. Had to hand-rewrite the MILESTONES.md entry. SUMMARY template would benefit from a mandatory `one_liner` field.
- **Workflow `rm .planning/ROADMAP.md` line in complete-milestone.md is a doc bug** — reorganize_and_delete step tells you to reorganize ROADMAP.md THEN delete it, which contradicts itself. Treated as "reorganize + keep" based on intent.

### Patterns Established
- **Chrome as partials with marker splicer** — any duplicated HTML region that drifts between pages becomes a partial the moment the drift costs a fix. Marker comments are the interface, splicer is the implementation.
- **Pre-commit hook as byte-identity gate** — when a build produces deterministic output from checked-in sources, the hook runs the build and asserts `git diff --quiet` after. Blocks drift at the earliest possible point (commit time, not CI time).
- **Locked decisions + 0 research** — when CONTEXT.md names exact line numbers, exact strings, and exact verification protocol, skip research and plan directly. Saves a full agent turn without sacrificing quality.
- **Playwright MCP for cosmetic verification** over a committed test suite — ad-hoc browser measurements per phase are faster than maintaining permanent E2E infrastructure. `.playwright-mcp/` stays gitignored. Reserve permanent suites for high-regression-risk features.
- **Pre-authorize tooling deviations in executor prompts** — when the plan specifies a tool that isn't installed, tell the executor explicitly which fallback is approved and why, with example code. Prevents mid-plan stalls.

### Key Lessons
1. **Explicit `cd` before every git operation when worktrees exist.** Bash shell state can drift between tool calls in ways that aren't visible from the output of the previous command. Prefixing merges with `cd /absolute/path/to/repo` eliminates the entire class of "wrong worktree" bugs.
2. **When a CLI has known drift, lint for it before archiving.** The `phase complete` CLI's failure to flip active-milestone checkboxes is a silent data-quality bug — it only surfaces when the next command (autonomous, audit, complete) reads the drifted state. A linter pass before archival catches it.
3. **`Range.getClientRects()` is the right single-line check for `whitespace-nowrap` spans.** `height === lineHeight` false-negatives due to font ascender/descender overhead. `clientRects.length === 1` is semantically exact and independent of font metrics.
4. **En-dash U+2013 is a first-class character in Russian typography.** It is not interchangeable with hyphen-minus for numeric ranges. Verification must grep for the literal entity to catch regressions, not just "dash present".
5. **Smaller, tighter milestones ship faster and cleaner.** v3.2 was 2 phases and 6 plans and landed in a single day with zero plan revisions. v3.0 was 4 phases and 7 plans over multiple sessions with typography polish bleeding out post-completion. There's a ceiling where milestone breadth compounds friction — staying under it is worth the discipline.

### Cost Observations
- Model mix: predominantly Opus 4.6 (1M context) for orchestration, planning, executor agents; Sonnet for plan checker, code reviewer, verifier.
- Sessions: 1 session for the full milestone (discuss → plan → execute → verify → complete for both phases).
- Notable: Phase 40 Wave 1 was the first phase where I ran Playwright MCP verification inline in the orchestrator context rather than delegating to a verifier subagent. Saved one agent turn per plan and kept the measurement tables in the orchestrator's working set where they could be written into SUMMARYs directly.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 MedicusUnion KZ Landing | 10 | 24 | Initial landing build, vanilla HTML/CSS/JS |
| v1.1 Visual Polish | 4 | 5 | Sticky header, social proof, hero illustration |
| v1.2 Brand Visual Alignment | 2 | 2 | Pill CTAs, warm cream hero, design tokens |
| v1.3 KZ Design Alignment | 3 | 3 | Gradient CTAs, white hero, mint badges |
| v1.4 2025 Visual Redesign | 4 | 6 | Dark mode, glassmorphism, bold typography, micro-animations |
| v2.0 Service Pages Rewrite | 4 | 8 | Tailwind v4 migration + service-page copywriting rewrite from копирайтинг-документы |
| v3.0 SEO, Performance & Polish | 4 | 7 | Local WebP, full SEO + Schema.org, WCAG AA tokens + focus-visible + ARIA, Russian typography polish |
| v3.2 Build Pipeline & Chrome Partials | 2 | 6 | Chrome partials extraction + POSIX-sh marker splicer + byte-identity pre-commit hook + 3 UX cosmetic fixes at the source |

### Cumulative Quality

| Milestone | Pages | Codebase LOC | Notable a11y/perf gain |
|-----------|-------|-------------|------------------------|
| v1.0 | 1 (index) | ~64KB total | Semantic HTML, OG meta, lightweight assets |
| v2.0 | 5 (full multi-page) | ~3,150 LOC | Tailwind v4, pixel-perfect TSX parity |
| v3.0 | 6 (incl. 404) | ~4,714 LOC | WCAG AA contrast, focus-visible, JSON-LD, WebP |
| v3.2 | 6 (incl. 404) | ~5,600 LOC | Chrome partials drift-proof, byte-identity build gate, full favicon set, console silent on first load |

### Top Lessons (Verified Across Milestones)
1. **The Redesign/ folder as design source of truth is a high-leverage decision.** Validated in v1.4 (initial application), v2.0 (Tailwind migration), and v3.0 (a11y compliance). Without it, we'd be guessing at brand consistency every phase.
2. **Russian typography needs explicit handling.** First surfaced in v1.4 (hero headings), reinforced in v3.0 (post-phase nbsp binding). Plan it in, don't bolt it on.
3. **Audit-first milestone completion** — `/gsd-audit-milestone` before `/gsd-complete-milestone` is the right order for milestones with multi-phase dependencies and non-trivial integration flows. v3.0 confirmed this. v3.2 skipped the audit because every must-have was already verified by Playwright MCP during phase execution — rigorous per-phase verification can substitute for milestone-level audit when the phase count is small and the gates are machine-checkable.
4. **Byte-identity build gates catch drift at the earliest point.** v3.2 shipped the first git hook in the repo; the pre-commit hook asserts `make build` + `git diff --quiet` on every commit. Any duplicated HTML that drifts between the partials source and the rendered pages fails the commit. This pattern generalizes: any deterministic build should be enforced by a hook that asserts post-build cleanness.
5. **Smaller milestones compound less friction.** v3.2 (2 phases, 6 plans, 1 day) shipped with zero plan revisions and zero post-completion follow-ups. v3.0 (4 phases, 7 plans) required post-phase typography polish and deferred audit items. Smaller milestones mean tighter feedback loops and less context-carry between phases.
