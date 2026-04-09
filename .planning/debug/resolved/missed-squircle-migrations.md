---
status: resolved
trigger: "Not all rounded elements were migrated to squircle classes during v4.0"
created: 2026-04-09T00:00:00Z
updated: 2026-04-09T00:15:00Z
---

## Current Focus

hypothesis: CONFIRMED -- 2 hero badge icon boxes were the only missed migrations
test: Post-fix grep audit across all 7 pages shows 0 non-rotating non-full rounded-* remaining
expecting: User confirms hero floating badges render with squircle shape in browser
next_action: Awaiting human verification

## Symptoms

expected: ALL card elements, buttons, form containers, badge elements across all pages should use squircle-md/lg/xl classes (per SQUIRCLE-01 requirement)
actual: Some elements still have plain rounded-* classes and show standard border-radius instead of squircle shapes
errors: No errors — incomplete migration coverage
reproduction: Open http://localhost:8080/index.html and look at cards in various sections
started: Since Phase 45-47 migration. Some elements were missed.

## Eliminated

- hypothesis: Other pages (online-consultations, treatment-abroad, checkup, contacts, 404, styleguide) have missed migrations
  evidence: grep audit shows 0 non-full rounded-* classes (excluding sr-only focus states) on all pages except index.html
  timestamp: 2026-04-09T00:10:00Z

- hypothesis: rounded-full elements (CTA buttons, checkmark circles, avatars, blur blobs, footer dots) should be squircle-full
  evidence: CTA gradient buttons are documented pill-shape exception; checkmark circles (6-32px) are tiny decorative; avatars are circular; blur blobs are invisible behind 100-120px blur; footer dots are 1.5px
  timestamp: 2026-04-09T00:11:00Z

- hypothesis: 15 rotating icon chips on index.html (rounded-2xl/rounded-[1.5rem]) should be squircle-md
  evidence: All 15 have group-hover:rotate-3 -- squircles.css anti-pattern: "NEVER apply squircle to rotating elements. mask-image distorts during CSS transform: rotate()"
  timestamp: 2026-04-09T00:12:00Z

- hypothesis: Step cards (lines 574-612) with "dogovorennosti" text lack squircle on the card itself
  evidence: Card outer div at line 576 already has "liquid-card squircle-xl" -- the squircle IS applied. The rounded-2xl at line 577 is the "01" number box which rotates on hover
  timestamp: 2026-04-09T00:13:00Z

## Evidence

- timestamp: 2026-04-09T00:08:00Z
  checked: squircles.css header comment and class definitions
  found: squircle-md=16px, squircle-lg=24px, squircle-xl=40px, squircle-full=9999px. Anti-patterns: no squircle on rotating elements, no box-shadow+mask on same element, no border on squircle elements
  implication: Rotating icon chips correctly keep rounded-*. Inset shadows are safe.

- timestamp: 2026-04-09T00:09:00Z
  checked: All 9 root-level HTML files for non-full rounded-* classes (excluding sr-only, blur blobs)
  found: Only index.html has 17 matches. 15 are rotating icon chips (correct exception). 2 are hero floating badge icons at lines 271, 282 -- NO rotate, have shadow-inner (inset, safe)
  implication: Only 2 elements need migration across entire site

- timestamp: 2026-04-09T00:10:00Z
  checked: Phase 47 plan docs (47-01-PLAN.md lines 123, 125)
  found: Plan explicitly said "keep rounded-2xl" for hero badge icons. Rationale: "decorative icon inside badge, not a rotating element but also no need for squircle here"
  implication: Original plan contradicts SQUIRCLE-01 "ALL elements" requirement. These should be migrated.

- timestamp: 2026-04-09T00:14:00Z
  checked: liquid-card-wrap CSS definition
  found: Has border-radius: 24px (matches squircle-lg). Step cards use squircle-xl (40px) inside this wrap. Radius mismatch is cosmetic only (shadow approximation). Not the user's reported issue.
  implication: Shadow-wrap pattern is working as designed

## Resolution

root_cause: Phase 47 plan explicitly decided to keep rounded-2xl on 2 hero floating badge icon boxes (lines 271, 282 in index.html) as "decorative, no need for squircle." This contradicted the SQUIRCLE-01 requirement that ALL border-radius elements be migrated. These were the only 2 non-rotating elements across all 7 pages still using rounded-* instead of squircle-*.
fix: Replaced rounded-2xl with squircle-md on both hero floating badge icon containers (w-14 h-14 boxes inside liquid-regular squircle-lg badges). shadow-inner (inset shadow) is safe inside mask per squircles.css docs. Rebuilt CSS via make build.
verification: Final grep audit across all 7 pages confirms 0 non-rotating non-full rounded-* classes remain. Total squircle classes on index.html increased from 82 to 84.
files_changed: [index.html]
