# Phase 9: Performance & SEO - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Final polish phase: meta tags for SEO and social sharing, semantic HTML audit, performance optimizations. No images exist on the page currently (text + emoji icons only), so image optimization is minimal. Focus on meta tags, Open Graph, semantic structure, and ensuring fast load times.

</domain>

<decisions>
## Implementation Decisions

### Meta Tags & Open Graph (PERF-03)
- title: MedicusUnion KZ — Консультации с европейскими врачами
- description: Видеоконсультация с европейским врачом из дома. Второе мнение, перевод документов, письменное заключение. От 450€.
- Open Graph: og:title, og:description, og:type=website, og:url, og:locale=ru_RU
- Twitter Card: summary_large_image (or summary)
- Canonical URL

### Semantic HTML Audit (PERF-04)
- Verify heading hierarchy (h1 → h2 → h3)
- Ensure landmark regions: header, main, footer
- Check all images have alt text (currently emojis with aria-hidden)
- Add lang attribute (already present: lang="ru")
- Verify form labels are properly associated

### Performance (PERF-01, PERF-02)
- Font preloads already in place
- CSS is already a single file, JS is single file
- No external dependencies
- Add meta viewport (already present)
- Ensure no render-blocking issues

### Claude's Discretion
- Whether to add structured data (JSON-LD)
- Favicon setup
- Additional performance headers documentation

</decisions>

<code_context>
## Existing Code Insights

### Current State
- index.html has basic title and viewport meta
- Fonts preloaded with crossorigin
- Single CSS file, single JS file with defer
- No images (all visual elements are CSS + emoji)
- Semantic HTML largely in place (header, main, footer)

### Integration Points
- Add meta tags to <head> in index.html
- Potentially minor HTML adjustments for semantics

</code_context>
