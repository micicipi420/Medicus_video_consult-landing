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

### Cumulative Quality

| Milestone | Pages | Codebase LOC | Notable a11y/perf gain |
|-----------|-------|-------------|------------------------|
| v1.0 | 1 (index) | ~64KB total | Semantic HTML, OG meta, lightweight assets |
| v2.0 | 5 (full multi-page) | ~3,150 LOC | Tailwind v4, pixel-perfect TSX parity |
| v3.0 | 6 (incl. 404) | ~4,714 LOC | WCAG AA contrast, focus-visible, JSON-LD, WebP |

### Top Lessons (Verified Across Milestones)
1. **The Redesign/ folder as design source of truth is a high-leverage decision.** Validated in v1.4 (initial application), v2.0 (Tailwind migration), and v3.0 (a11y compliance). Without it, we'd be guessing at brand consistency every phase.
2. **Russian typography needs explicit handling.** First surfaced in v1.4 (hero headings), reinforced in v3.0 (post-phase nbsp binding). Plan it in, don't bolt it on.
3. **Audit-first milestone completion** — `/gsd-audit-milestone` before `/gsd-complete-milestone` is the right order. v3.0 confirmed this when the audit caught all 18 requirements pre-shipping.
