# Phase 87: Real Content - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Mode:** Auto-generated

<domain>
## Phase Boundary

Replace the two content placeholders shipped during v8.0 (HeroHub doctor name, ContactSection coordinator photo) with stable values that ship without third-party dependencies.
</domain>

<decisions>
## Implementation Decisions

### HeroHub doctor name (CNT-01)
- "Dr. Ferdinand K. · Vienna" → "Dr. Stefan Mayr · Vienna" — common Austrian name, plausible for a Vienna-HQ'd practice, neutral
- TODO comment added in source flagging this as still a placeholder pending real on-team data
- Marketing/legal can swap to a real on-team doctor name in a follow-up commit without component changes

### ContactSection coordinator (CNT-02)
- Phase 84 dropped the Unsplash coordinator photo because external image dependencies are a v8.0 anti-pattern
- Restoring with a NEW external photo is risky (no real asset on hand; another placeholder regression)
- Solution: **designed coordinator card with initials avatar** — no image dependency, satisfies "coordinator presence" semantically
  - 56–64px circular avatar with initials "АК" (Айгерим Кoordinator's first-name initial + role initial), gradient white tint
  - Name "Айгерим" + role "Старший медицинский координатор"
  - Phone + email inline below name
- TODO comment in source flags both the avatar swap (real photo) and the name (real coordinator) as future content updates

### Layout
- ContactSection coordinator block now uses 2-column grid: avatar left, name+role+contacts right
- Mobile stacks; tablet+ rows
- Tap targets preserved (≥44pt on phone/email links)

### Accessibility
- Avatar has `aria-hidden="true"` (decorative — name in DOM is the screen-reader source)
- Initials are visual chrome only — name remains the primary identifier

### Claude's Discretion
- "Stefan Mayr" placeholder — chose a culturally-appropriate Austrian name that won't read as a fake/AI name. Marketing should replace.
- "АК" initials — derived from "Айгерим Координатор". If real coordinator name is something else, adjust both initials and full-name display.
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- ContactSection already imports `Phone`, `Mail` from lucide-react — no new dependencies for the avatar
- DESIGN.md already specifies brand-aligned glass tints — used here

### Established Patterns
- Source comments tagged `TODO(content)` to flag placeholders for marketing follow-up
- Glass overlay with white text on the gradient continues the Phase 84 idiom

### Integration Points
- Both files mount on the index page; no parent changes needed
</code_context>

<specifics>
## Specific Ideas

The "designed coordinator with initials avatar" pattern is deliberately distinct from the prior "external photo URL" pattern — it ships clean (no CORS, no missing-image fallback, no Unsplash credit, no GDPR concern about third-party image of a presumably-not-on-team person).
</specifics>

<deferred>
## Deferred Ideas

- Real on-team doctor photo + name — content team
- Real coordinator photo — content team (initials avatar can stay as a permanent fallback if the real photo asset is delayed)
- Multiple coordinator personas (rotation by hour-of-day or randomly) — over-engineering for v8.1
</deferred>
