# Phase 70: Index Content Sections - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

The middle of the index page presents the new informational content -- problem recognition, step-by-step process, differentiators, international clinic network, and platform features. Source of truth: feat/new-design branch at commit d450232.

</domain>

<decisions>
## Implementation Decisions

### General Approach
- Port all 5 sections directly from feat/new-design:index.html HTML to React server components
- Glass card styling consistent with Phase 68/69 design language
- All text content in Russian, with &nbsp; for orphan prevention
- lucide-react for all icons

### ProblemSection
- Title: "Узнаёте свою ситуацию?"
- 4 problem cards with icons and descriptions
- Glass card styling with accent color icons

### ProcessSection  
- Title: "От обращения до результата — 4 шага"
- 4 numbered steps with visual flow/connection
- Rewrite existing GuideGrid.tsx component

### WhyUsSection
- Title: "Чем мы отличаемся"
- 4 advantage cards with icons
- Rewrite existing AdvantagesGrid.tsx component

### ClinicsSection
- 8 countries: Германия, Австрия, Швейцария, Израиль, Южная Корея, Турция, ОАЭ, Индия
- Country groupings with clinic names from source HTML
- New component (no existing equivalent)

### PlatformSection
- Title: "Ваши документы, снимки и связь с врачом — в одном месте"
- Platform feature cards from source HTML
- New component (no existing equivalent)

### Claude's Discretion
- Component file organization (one file per section vs grouped)
- Responsive grid breakpoints
- Icon selection from lucide-react

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- AdvantagesGrid.tsx → rewrite as WhyUsSection
- GuideGrid.tsx → rewrite as ProcessSection
- Phase 68 glass tokens and patterns
- lucide-react icons

### Integration Points
- page.tsx — renders all sections in order
- globals.css — design tokens from Phase 68

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond matching feat/new-design HTML exactly.

</specifics>

<deferred>
## Deferred Ideas

- motion.js scroll animations — deferred to after all sections ported

</deferred>
