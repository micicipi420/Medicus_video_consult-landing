# Phase 31: Performance Optimization - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase)

<domain>
## Phase Boundary

Replace external Unsplash image URLs with local optimized WebP files. Add lazy loading, preload critical resources, defer Motion CDN script.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
- Download Unsplash images, convert to WebP using sharp-cli or squoosh-cli
- Store in img/ directory with descriptive names
- Add width/height attributes for CLS prevention
- Preload: css/styles.css, above-fold hero image
- Motion CDN script: add defer attribute

</decisions>
