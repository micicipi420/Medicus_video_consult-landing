# Phase 82: Stats Bar - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning
**Mode:** Auto-generated (smart discuss skipped per user mandate)

<domain>
## Phase Boundary

Upgrade the existing `StatsBar` component to add icons (STATS-01) and adopt a mobile-budget-aware glass strategy: one outer glass surface on mobile holding a 2×2 grid of unsoftened stat cells, switching to four independent glass cards at `sm` and above.

</domain>

<decisions>
## Implementation Decisions

### Mobile Glass Budget Compliance
- **Single glass surface on mobile**, four glass surfaces from `sm` (640px) up. Below 768px the page already shows the Phase 80 floating header (1 glass layer). With 4 stat cards composing simultaneously the page would have 5 layers — blowing the Phase 79 mobile cap of 2.
- Solution: outer wrapper provides the only glass on mobile (`bg-white/60 backdrop-blur-2xl`); inner cells are flat (`bg-transparent`). At `sm:` the wrapper flattens (`sm:bg-transparent sm:backdrop-blur-none`) and each cell becomes the glass card.

### Icon Mapping
- 43 клиники → `Building2` (hospital structure)
- 11 стран → `Globe` (countries)
- 500+ врачей → `Stethoscope` (doctors)
- 15+ лет опыта → `Award` (achievement)
- Each icon sits in a tinted square (`{accent}/12 backdrop`) with the matching text color — repeats the stat's accent color twice for instant chromatic anchoring

### Color Strategy
- `text-mu-accent-blue` (43)
- `text-mu-accent-teal` (11)
- `text-mu-accent-orange` (500+)
- `text-mu-green-600` (15+)
- Same accent applied to icon and number — eye reads "icon and number are one unit"

### Layout
- Mobile: 2×2 grid (`grid-cols-2 gap-3`) inside the single glass wrapper, padding `p-4` outside, `px-3 py-5` per cell
- Desktop: 1×4 grid (`sm:grid-cols-4 gap-6`), `sm:p-7` per cell
- Both: vertical stack inside cell — icon → number → label
- Number scales `text-3xl` mobile → `text-5xl sm` → `text-6xl md+`
- Label: uppercase, tracking-wider — established stats-bar typography pattern

### Hover/Transition
- Hover only on `sm:` (no hover concept on touch). Scoped `sm:transition-[background-color,border-color,box-shadow] duration-300` — no `transition-all`
- Hover swaps to `sm:hover:bg-white/70 sm:hover:border-glass-border-strong sm:hover:shadow-glass-lg`

### Accessibility
- Icons are `aria-hidden="true"` (decorative; the number+label carry the meaning)
- `<section aria-label="Ключевые цифры">` preserved
- Number-and-label cell stays semantically siblings, no figcaption needed since the number is the primary content

### Claude's Discretion
- "500+ врачей" — exact value retained from prior version
- Border-radius cascade `rounded-2xl` mobile → `sm:rounded-[2.5rem]` matches DESIGN.md component shape vocabulary

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lucide-react` — already a dependency (used in HeroHub, MobileMenu, StickyBar)
- Glass utility tokens (`bg-white/60`, `backdrop-blur-2xl`, `shadow-glass`, `glass-border`) — established
- Component already mounted in `app/page.tsx:3` immediately after `<HeroHub />` — wiring satisfies STATS-02 (sits directly below hero)

### Established Patterns
- Server component (no `'use client'`) — preserved
- `as const` array of stats — preserved
- `<section aria-label>` for landmark naming — preserved

### Integration Points
- `app/page.tsx` mounts `<StatsBar />` between `<HeroHub />` and `<ServicesGrid />` — no parent changes
- Phase 80 header sits above; mobile budget calculation is header (1) + stats wrapper (1) = 2 (within cap)

</code_context>

<specifics>
## Specific Ideas

The "responsive glass nesting" pattern (one wrapper on mobile, four cards on desktop) is the load-bearing technique here. It's the only way to satisfy STATS-01 (4 glass cards) AND the Phase 79 mobile glass budget simultaneously. Phase 83 (services + process sections) will face a similar trade-off and should adopt the same pattern.

</specifics>

<deferred>
## Deferred Ideas

- Animated number count-up on scroll-into-view — out of scope; motion budget already taut
- Source citation for 500+ figure — content/legal, not a Phase 82 visual concern
- Replacing 500+ with a more concrete number — content team decision

</deferred>
