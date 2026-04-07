# Phase 33: Audit Quick Wins - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Auto-generated (concrete requirements — no grey areas to negotiate)

<domain>
## Phase Boundary

Ship the 7 credibility-critical fixes from `.planning/ui-reviews/UI-REVIEW-FULL-SITE.md` in one fast pass and unblock Phase 36 partial extraction with canonical, drift-free data.

Scope: data unification (Vienna address, ТОО name, Алматы canonical), sticky-bar overlap fix with iPhone safe-area-inset, emoji→SVG replacement on treatment-abroad.html stat bar, online-consultations.html H1 em-dash fix.

Out of scope: any change to page architecture (Phase 36), any hero/section height adjustment (Phase 38), form UX changes (Phase 35), treatment-abroad visual overhaul (Phase 34).

</domain>

<decisions>
## Implementation Decisions

### Data Unification Canonical Values (locked pre-kickoff 2026-04-07)
- Vienna address: `Billrothstrasse 78, 1190 Vienna, Austria` — **5 edits** (JSON-LD x2, parentOrganization schema, index.html footer, treatment-abroad.html footer)
- KZ office city: `Алматы` — fix `contacts.html:165` (was "Астана")
- Legal entity: `ТОО «MedicusUnion KZ»` (no space) — fix `treatment-abroad.html:826` and `:866` (were "Medicus Union KZ")

### Sticky Bar Overlap Fix (MIN-07 from research)
- Approach: `main.pb-8` → `pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-8` on all 5 production pages
- Rationale: accounts for 112px sticky bar height AND iPhone X+ home indicator safe area (34px on notched devices)
- Verify on DevTools device toolbar at 320/390/414px with iPhone simulation

### Emoji→SVG Replacement on treatment-abroad.html stat bar
- Source pattern: copy SVG icons from `index.html` stats section (existing duotone SVG pattern, matches v1.0 icon decisions)
- Do NOT introduce new icon styles — reuse existing inline duotone SVGs
- Preserve stat numbers, just swap the icon glyphs

### Em-dash Fix on online-consultations.html
- "врача —" fix approach: bind with `&nbsp;` (`врача&nbsp;—`) OR restructure phrase if that creates wrapping issues
- Verify visually at 320/768/1440 — no dangling em-dash on any viewport

### Pre-flight Grep Gate for Phase 36 (AUDIT-07)
- After all fixes merge, Phase 36 partial extraction is unblocked when:
  - `git grep 'Wien\|Vienna' *.html | sort -u | wc -l` returns `1`
  - `git grep 'ТОО «' *.html | sort -u | wc -l` returns `1`
  - `git grep 'Астана' *.html` returns `0`
- This gate is the explicit deliverable of Phase 33 beyond the fixes themselves

### Claude's Discretion
All other implementation choices — commit atomicity (one commit per requirement vs batched), verification approach, visual screenshot methodology — are at Claude's discretion. Follow existing phase conventions from v3.0 (atomic commits per plan, visual verification via DevTools).

</decisions>

<code_context>
## Existing Code Insights

### Files touched
- `index.html` — Vienna address in JSON-LD (lines ~52-136) + footer; canonical Алматы office
- `contacts.html` — sticky-bar padding (line ~main), contacts.html:165 Алматы fix
- `online-consultations.html` — sticky-bar padding; H1 em-dash
- `treatment-abroad.html` — sticky-bar padding; Vienna footer; legal entity line 826 + 866; emoji→SVG stat bar
- `checkup.html` — sticky-bar padding only

### Reusable assets
- Existing duotone SVG icons in `index.html` stats section (copy pattern for emoji replacement)
- nbsp binding pattern from v3.0 (Russian typography polish)
- safe-area-inset CSS pattern (new to this phase; standard Tailwind arbitrary value syntax)

### Established patterns
- Atomic commits via `gsd-tools commit` per plan or per-requirement
- Visual verification via DevTools device toolbar; no screenshot automation in this project
- 45+ audience: every fix verified against trust-line visibility (especially sticky-bar overlap)

### Integration points
- None — all changes are in-place HTML text / markup edits
- No changes to CSS (except Tailwind arbitrary value in className), no JS, no Directus schema

</code_context>

<specifics>
## Specific Ideas

Source kickoff notes and research for exact locations:
- `.planning/ui-reviews/UI-REVIEW-FULL-SITE.md` — audit #1, #2, #3, #8, #9 map to AUDIT-01, AUDIT-02/03/04, AUDIT-05, AUDIT-03, AUDIT-06
- `.planning/research/PITFALLS.md` — MIN-07 (safe-area-inset), CRIT-02 (data unification gate)

Pre-kickoff decisions (2026-04-07, user-confirmed):
1. Vienna address: `Billrothstrasse 78, 1190 Vienna, Austria` (5 edits) — this flips the authoritative source: treatment-abroad was right, index/JSON-LD were wrong
2. KZ office: Алматы (fix contacts.html:165)
3. Legal entity: `ТОО «MedicusUnion KZ»` no space (fix treatment-abroad.html:826 + :866)

</specifics>

<deferred>
## Deferred Ideas

None — all items in scope are concrete audit fixes from the locked requirements list. No exploratory work.

</deferred>
