# Phase 44: Chrome Partials Upgrade - Research

**Researched:** 2026-04-09
**Domain:** POSIX-sh splicer pipeline + HTML chrome partials + Liquid Glass / Squircle CSS classes
**Confidence:** HIGH

## Summary

Phase 44 upgrades the 4 existing chrome partials (header, footer, mobile-menu, sticky-bar) to use v4.0 Liquid Glass and squircle classes, creates a new `partials/svg-defs.html` for the refraction SVG filter, extends the build splicer to handle the 5th partial, and adds `BUILD:svg-defs` marker pairs to all 6 HTML pages. The phase is purely additive to the existing splicer contract -- zero new BUILD:vars tokens, one new partial name added to `PARTIALS`.

The key complexity is the commit anatomy: every partial edit triggers regeneration of all 6 HTML pages, and the byte-identity pre-commit hook enforces consistency. The phase must produce atomic commits where partial changes and regenerated pages are staged together. A secondary complexity is that the ARCHITECTURE.md references `.liquid-nav`, `.liquid-sheet`, `.liquid-sticky-bar` classes that do NOT exist in the current `liquid-glass.css` -- the phase must either add these classes or compose existing primitives (`.liquid-regular`) with Tailwind utilities.

**Primary recommendation:** Split the phase into two logical units: (1) SVG defs infrastructure (new partial + splicer edit + marker pairs on all 6 pages), then (2) chrome partial visual upgrades (header/footer/mobile-menu/sticky-bar class rewrites). Each unit must end with `make build` + `make check` passing.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- New file: partials/svg-defs.html with hidden SVG containing filter id="liquid-refract"
- feTurbulence + feDisplacementMap filter for Chrome refraction PE
- Script block for refraction probe initialization (calls initRefractionProbe from main.js)
- All 6 pages get BUILD:svg-defs marker pairs
- scripts/build-pages.sh updated to splice this partial
- Header: .liquid-nav glass treatment on scroll, squircle radius, max-w-content grid alignment, dark mode glass
- Footer: Glass surface treatment, squircle radius, grid alignment
- Mobile Menu: Glass backdrop treatment, squircle radius on menu items
- Sticky Bar: Glass surface, squircle radius
- Build pipeline: POSIX-sh + awk splicer, byte-identity pre-commit hook, make build canonical entry point, atomic commits

### Claude's Discretion
- Exact glass class combinations on each partial element
- Whether header gets .liquid-regular or a specialized nav variant
- Grid container implementation details in partials
- SVG defs placement in HTML (recommended: right after body open, before BUILD:header)
- Whether refraction script is inline in svg-defs.html or calls window.MU.initRefractionProbe()

### Deferred Ideas (OUT OF SCOPE)
None -- all chrome upgrades are in scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CHROME-01 | All 4 chrome partials (header, footer, mobile menu, sticky bar) use glass surfaces, squircle radii, grid-aligned max-w-content -- 1 edit per partial = 6 pages inherit | Architecture patterns section: per-partial class mapping with available CSS classes; shadow-wrap pattern for elements needing outer shadow + squircle mask |
| CHROME-02 | New partials/svg-defs.html created and spliced into all 6 pages through build pipeline (BUILD marker + splicer line-19 update) | SVG defs infrastructure section: exact file content, splicer edit, marker placement, build validation commands |
</phase_requirements>

## Standard Stack

### Core (existing -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4.2.2 | Utility classes in partials | Standalone CLI binary, project convention [VERIFIED: Makefile line 10] |
| POSIX sh + awk + sed | System | Build splicer pipeline | `scripts/build-pages.sh` -- zero-dependency build [VERIFIED: build-pages.sh] |
| Vanilla JS (ES6+) | Current | Refraction probe already exists in main.js | `initRefractionProbe()` at js/main.js:533 [VERIFIED: codebase grep] |

### CSS Classes Available (from Phase 42-43)
| Class | File | Purpose |
|-------|------|---------|
| `.liquid-regular` | liquid-glass.css:57 | Base glass material -- backdrop-filter + rim lighting [VERIFIED: codebase] |
| `.liquid-card` | liquid-glass.css:74 | Glass material + padding for cards [VERIFIED: codebase] |
| `.liquid-card-wrap` | liquid-glass.css:86 | Shadow wrapper for cards with squircle mask [VERIFIED: codebase] |
| `.liquid-btn-primary` | liquid-glass.css:99 | Gradient CTA button with specular edges [VERIFIED: codebase] |
| `.liquid-btn-secondary` | liquid-glass.css:122 | Glass secondary button [VERIFIED: codebase] |
| `.squircle-md` | squircles.css:60 | 16px radius superellipse mask [VERIFIED: codebase] |
| `.squircle-lg` | squircles.css:68 | 24px radius superellipse mask [VERIFIED: codebase] |
| `.squircle-xl` | squircles.css:76 | 40px radius superellipse mask [VERIFIED: codebase] |
| `.squircle-full` | squircles.css:84 | Pill/circle -- border-radius only, no mask [VERIFIED: codebase] |

### Classes Referenced in Architecture but NOT Yet Created
| Class | Architecture Reference | Status |
|-------|----------------------|--------|
| `.liquid-nav` | ARCHITECTURE.md line 897 | Does NOT exist in liquid-glass.css [VERIFIED: codebase grep] |
| `.liquid-sheet` | ARCHITECTURE.md line 899 | Does NOT exist in liquid-glass.css [VERIFIED: codebase grep] |
| `.liquid-sticky-bar` | ARCHITECTURE.md line 900 | Does NOT exist in liquid-glass.css [VERIFIED: codebase grep] |

**Implication:** Phase 44 must either (a) add these specialized classes to liquid-glass.css, or (b) compose using `.liquid-regular` + Tailwind utilities. Option (b) is recommended -- `.liquid-regular` already provides the full glass material recipe, and the specialized classes in ARCHITECTURE.md are aspirational names from the research phase that were not implemented in Phase 43. Using `.liquid-regular` directly avoids creating thin wrapper classes that add no value.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Adding `.liquid-nav` class | Using `.liquid-regular` directly on header | Zero new CSS; `.liquid-regular` already encodes the full glass material. Header-specific adjustments (blur on scroll, padding) remain in inline `<style>` per page |
| Adding `.liquid-sheet` class | Using `.liquid-regular` directly on mobile menu | Mobile menu already has higher blur (80px); keep that as inline override or Tailwind utility |

## Architecture Patterns

### SVG Defs Partial: Exact File Content

Source: ARCHITECTURE.md E.1 [VERIFIED: codebase]

```html
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <filter id="liquid-refract">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4"/>
        <feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  </svg>
```

**Script block decision:** The refraction probe (`initRefractionProbe()`) already exists in `js/main.js:533-538` and is called from `initAll()` at line 544. It is also exported as `window.MU.initRefractionProbe`. The svg-defs partial does NOT need a script block -- the probe runs on DOMContentLoaded via `initAll()` regardless. Adding a redundant script block would create a double-initialization risk. [VERIFIED: js/main.js grep]

### Splicer Integration: One-Line Edit

`scripts/build-pages.sh` line 19 changes from:
```sh
PARTIALS="header footer sticky-bar mobile-menu"
```
to:
```sh
PARTIALS="header footer sticky-bar mobile-menu svg-defs"
```

No other splicer changes needed. The existing awk splice loop (lines 214-237) handles any partial name in `$PARTIALS`. `svg-defs.html` has no `{{...}}` token placeholders, so token substitution is a no-op. [VERIFIED: build-pages.sh lines 185-241]

### BUILD Marker Placement

Markers must be at column 0 (no leading whitespace) per splicer's awk matching at line 224:
```
if ($0 == "<!-- BUILD:" partial " -->") {
```

**Recommended placement:** After `<!-- BUILD:vars ... -->` line, before `<!-- BUILD:header -->`. This places SVG defs in the DOM before any element that references `url(#liquid-refract)`.

Current marker order in all 6 pages (verified): [VERIFIED: grep across all pages]
```
<!-- BUILD:vars ... -->
  [mesh-bg / page content before header]
<!-- BUILD:header -->
<!-- /BUILD:header -->
<!-- BUILD:mobile-menu -->
<!-- /BUILD:mobile-menu -->
  [page content]
<!-- BUILD:footer -->
<!-- /BUILD:footer -->
<!-- BUILD:sticky-bar -->
<!-- /BUILD:sticky-bar -->
```

New marker pair inserts between `BUILD:vars` line and `BUILD:header`:
```
<!-- BUILD:vars ... -->
<!-- BUILD:svg-defs -->
<!-- /BUILD:svg-defs -->
<!-- BUILD:header -->
```

**Important:** On index.html, there is content between `BUILD:vars` (line 143) and `BUILD:header` (line 153) -- the animated mesh background div. The svg-defs markers should go right after the BUILD:vars line, before the mesh background. On other pages, the gap between BUILD:vars and BUILD:header varies.

### Per-Partial Class Mapping

#### Header (partials/header.html)

Current classes on `<header>` element:
```
fixed z-50 transition-all duration-500 top-4 left-4 right-4 mx-auto max-w-7xl
rounded-[2.5rem] px-4 md:px-8 border-[0.5px] border-white/50
shadow-glass-header bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%] py-5
```

v4.0 upgrade approach:
- **Replace** inline glass properties (`bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%] border-[0.5px] border-white/50 shadow-glass-header`) with `.liquid-regular`
- **Replace** `rounded-[2.5rem]` with `.squircle-xl` (40px radius superellipse)
- **Replace** `max-w-7xl` (1280px) with `max-w-content` (1200px per project token)
- **Keep** `fixed z-50 transition-all duration-500 top-4 left-4 right-4 mx-auto px-4 md:px-8 py-5`
- **Shadow-wrap consideration:** Header uses `shadow-glass-header` (outer shadow). With `.squircle-xl` mask, the shadow would be clipped. Options:
  - (a) Use `.liquid-regular` which uses inset shadows only (no outer shadow clipping issue)
  - (b) Add a shadow-wrap div around header (adds structural HTML complexity)
  - **Recommendation:** Option (a) -- `.liquid-regular` uses only inset box-shadows (`--liquid-shadow-inset-top` and `--liquid-shadow-inset-bottom`), which are safe inside mask. The existing `shadow-glass-header` outer shadow component (`0 8px 32px rgba(0,0,0,0.05)`) will be replaced by the rim lighting inset shadows. The header doesn't need an outer drop shadow -- its glass blur already creates visual separation from content.

- **Scroll state (`header--scrolled`):** Currently defined in each page's inline `<style>` block. This inline style overrides `background`, `backdrop-filter`, and `padding` on scroll. With `.liquid-regular`, the scroll state should override the glass tokens or add enhanced values. The `.header--scrolled` class must remain functional and the inline `<style>` in each page's `<head>` needs updating to work with `.liquid-regular`.

#### Footer (partials/footer.html)

Current classes on `.footer__wrapper`:
```
bg-white/60 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/60 shadow-glass-lg
```

v4.0 upgrade approach:
- **Replace** `bg-white/60 backdrop-blur-3xl border border-white/60 shadow-glass-lg` with `.liquid-card` + `.liquid-card-wrap` pattern
- **Replace** `rounded-[3rem]` with `.squircle-xl` (40px matches 3rem=48px close enough; or keep rounded-[3rem] and add squircle-xl for the superellipse shape)
- **Shadow-wrap pattern required:** Footer uses `shadow-glass-lg` (outer shadow). Apply shadow-wrap:
  ```html
  <div class="liquid-card-wrap">
    <div class="footer__wrapper squircle-xl liquid-card p-12">
      ...
    </div>
  </div>
  ```
- **Keep** `p-12` (`.liquid-card` includes `padding: 1.5rem` but footer needs `p-12` = 3rem)
- **Footer contact icons:** `.glass-icon bg-white/60 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-glass-inner-strong` -- replace with `.liquid-regular` + `.squircle-md` + inset shadow override

#### Mobile Menu (partials/mobile-menu.html)

Current classes on `.mobile-menu`:
```
bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%] shadow-glass-lg
rounded-3xl overflow-hidden border-[0.5px] border-white/50
```

v4.0 upgrade approach:
- **Replace** `bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%] border-[0.5px] border-white/50 shadow-glass-lg` with `.liquid-regular` + override blur if needed
- **Replace** `rounded-3xl` with `.squircle-xl`
- **Shadow-wrap consideration:** Mobile menu uses `shadow-glass-lg` (outer shadow). With squircle mask, need shadow-wrap OR switch to `.liquid-regular` inset-only shadows
- **Menu items:** `rounded-2xl` on nav links -- replace with `.squircle-lg`
- **CTA button:** `rounded-2xl` -- replace with `.squircle-lg`

#### Sticky Bar (partials/sticky-bar.html)

Current classes on `.sticky-bar`:
```
bg-white/60 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-glass-lg
```

v4.0 upgrade approach:
- **Replace** `bg-white/60 backdrop-blur-3xl border border-white/60 shadow-glass-lg` with `.liquid-regular`
- **Replace** `rounded-2xl` with `.squircle-lg` (24px)
- **CTA button:** `rounded-xl` -- replace with `.squircle-md` (16px)
- **Shadow-wrap pattern:** If outer shadow is desired, wrap. Otherwise `.liquid-regular` inset shadows are sufficient for a small bottom bar.

### Header Scroll State Update

The `.header--scrolled` class is defined in each page's inline `<style>` block (not in a CSS file). Current definition:

```css
.header--scrolled {
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(60px) saturate(180%);
  -webkit-backdrop-filter: blur(60px) saturate(180%);
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
```

With `.liquid-regular` on the header, the base glass material uses token-driven values (`--liquid-bg`, `--liquid-blur-md`, etc.). The scroll state should override to a denser glass:

```css
.header--scrolled {
  --liquid-bg: rgba(255, 255, 255, 0.45);
  --liquid-blur-md: 60px;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
```

This approach uses CSS custom property overrides rather than raw property declarations, ensuring dark mode cascade continues to work. [ASSUMED -- approach needs validation]

**IMPORTANT:** This inline `<style>` block exists in ALL 6 pages' `<head>` sections. It is NOT in a partial -- it is per-page inline CSS. Changing the header partial's base classes means the inline scroll override must also be updated. Since `<head>` is NOT a partial, this is a per-page edit (6 files). This is the one exception to "zero per-page chrome edits" -- the header scroll state definition in inline styles must be updated to align with `.liquid-regular` token overrides.

### Anti-Patterns to Avoid
- **NEVER nest glass inside glass:** Header is glass; do not add glass to nav links or CTA inside the header. The gradient CTA (`bg-gradient-to-r from-mu-cta-from to-mu-cta-to`) stays opaque per LIQUID-03. [CITED: liquid-glass.css anti-patterns comment block]
- **NEVER apply box-shadow AND mask-image on the same element:** Use shadow-wrap pattern or inset-only shadows. [CITED: squircles.css anti-patterns comment block]
- **NEVER apply border to a squircle element:** Use `box-shadow: inset 0 0 0 1px <color>` instead. `.liquid-regular` already uses inset rim lighting instead of border. [CITED: squircles.css anti-patterns comment block]
- **NEVER use will-change: backdrop-filter:** Research anti-recommendation. [CITED: REQUIREMENTS.md Out of Scope]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Glass material recipe | Inline `bg-white/30 backdrop-blur-[40px]` etc. | `.liquid-regular` class | Single source of truth; dark mode cascade; reduced-motion guard; print guard; refraction PE -- all handled by the class |
| Superellipse shape | `border-radius` with arbitrary values | `.squircle-md/lg/xl/full` classes | Three-tier degradation (Chrome 139+ native, mask-image, fallback border-radius) |
| Outer shadow on squircle | `box-shadow` on masked element | Shadow-wrap pattern (`liquid-card-wrap` outer, squircle inner) | Shadow clips against mask silhouette without the wrap |
| SVG refraction filter | Custom filter per page | `partials/svg-defs.html` single source | Splicer distributes to all 6 pages automatically |

## Common Pitfalls

### Pitfall 1: Missing BUILD:svg-defs markers on one or more pages
**What goes wrong:** Splicer silently skips pages without the marker pair. Byte-identity hook passes because the page is unchanged (it was never spliced). Visual review of one page looks correct, but another page has no SVG defs and refraction fails silently.
**Why it happens:** Manual editing of 6 pages, easy to miss one.
**How to avoid:** After adding markers, run: `grep -c '<!-- BUILD:svg-defs -->' index.html online-consultations.html treatment-abroad.html checkup.html contacts.html 404.html` -- must return exactly 1 per file (6 total). [CITED: PITFALLS.md Pitfall C2]
**Warning signs:** `make build` output says "5 pages processed" instead of "6". Or splicer message says "applied 4 partials" for one page and "5 partials" for another.

### Pitfall 2: Splicer FATAL on svg-defs validation
**What goes wrong:** The splicer validates that both opening and closing markers exist (lines 187-192). If the opening marker `<!-- BUILD:svg-defs -->` exists but the closing marker `<!-- /BUILD:svg-defs -->` is missing (or vice versa, or has a typo), build fails with FATAL.
**Why it happens:** Copy-paste error in marker insertion.
**How to avoid:** Use exact marker text. Both markers must be at column 0 (no leading whitespace). Test with `make build` immediately after adding markers, before any partial content changes.

### Pitfall 3: Header shadow clipping with squircle mask
**What goes wrong:** Current header uses `shadow-glass-header` which includes an outer shadow component (`0 8px 32px rgba(0,0,0,0.05)`). Adding `.squircle-xl` clips this outer shadow to the mask silhouette.
**Why it happens:** `mask-image` clips all box-shadow (both inset and outer) to the mask shape.
**How to avoid:** Use `.liquid-regular` which has inset-only shadows. Remove the `shadow-glass-header` class from the header. The visual difference is minimal -- the header's glass blur already provides separation. [CITED: squircles.css shadow-wrap pattern comments]

### Pitfall 4: Inline `<style>` header--scrolled conflict with .liquid-regular
**What goes wrong:** `.header--scrolled` in each page's inline `<style>` sets raw `background` and `backdrop-filter` properties. But `.liquid-regular` uses `var()` token references. The inline style's raw values override `.liquid-regular`'s token-based values, creating an inconsistency where scroll state doesn't respect dark mode tokens.
**Why it happens:** Legacy inline styles predate the token system.
**How to avoid:** Update `.header--scrolled` to use custom property overrides (`--liquid-bg`, `--liquid-blur-md`) instead of raw property values. This requires editing ALL 6 pages' inline `<style>` blocks. This is explicitly a per-page edit, not a partial concern.

### Pitfall 5: nbsp entities in footer must survive
**What goes wrong:** Footer contains `&nbsp;` entities in Russian text (e.g., "Австрия&nbsp;&middot;&nbsp;Казахстан", "за&nbsp;рубежом", "+7&nbsp;701&nbsp;532&nbsp;24&nbsp;78"). Class changes in the footer partial must not accidentally alter text content.
**Why it happens:** Overzealous find-replace or reformatting tools that normalize whitespace.
**How to avoid:** Only edit class attributes and wrapper structure. Never reflow text content. Diff review must show text nodes unchanged. [CITED: REQUIREMENTS.md Protected Legacy item 1]

### Pitfall 6: Mobile menu overlay z-index must stay above header
**What goes wrong:** `.mobile-menu-overlay` is z-40, header is z-50. The overlay background (`bg-black/50`) must cover the viewport including the header area. Adding glass to the mobile menu panel doesn't change z-index, but if the overlay structure changes, z-order breaks.
**Why it happens:** Structural HTML changes to add shadow-wrap divs can inadvertently create new stacking contexts.
**How to avoid:** Do not change the overlay wrapper structure. Only modify classes on the inner `.mobile-menu` panel div.

## Code Examples

### svg-defs.html complete partial content
```html
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <filter id="liquid-refract">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4"/>
        <feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  </svg>
```
Source: ARCHITECTURE.md E.1 [VERIFIED: codebase]

### Header partial upgrade pattern
```html
  <header class="header liquid-regular squircle-xl fixed z-50 transition-all duration-500 top-4 left-4 right-4 mx-auto max-w-content px-4 md:px-8 py-5" id="header">
    <div class="header__inner flex items-center justify-between">
      <!-- nav links, logo, CTA -- no class changes needed on children -->
    </div>
  </header>
```
[ASSUMED -- exact class list subject to visual validation]

### Footer shadow-wrap pattern
```html
  <footer class="footer relative overflow-hidden z-10 py-16" id="footer">
    <div class="container mx-auto px-4 lg:px-6 relative z-10">
      <div class="liquid-card-wrap">
        <div class="footer__wrapper squircle-xl liquid-card p-12">
          <!-- footer content unchanged -->
        </div>
      </div>
    </div>
  </footer>
```
[ASSUMED -- shadow-wrap may not be needed if inset shadows are sufficient]

### BUILD:svg-defs marker insertion (per page)
```html
<!-- BUILD:vars CTA_HREF=#contact CTA_LABEL="Оставить заявку" CURRENT_PAGE=index -->
<!-- BUILD:svg-defs -->
<!-- /BUILD:svg-defs -->
  <!-- Animated Mesh Background -->
  <div class="fixed inset-0 ...">
```
[VERIFIED: marker format matches existing BUILD markers in codebase]

### Splicer validation command
```bash
# Must return exactly 1 per file (6 lines of output, each showing "1")
grep -c '<!-- BUILD:svg-defs -->' index.html online-consultations.html treatment-abroad.html checkup.html contacts.html 404.html
```

### Build validation sequence
```bash
make build                     # Compile CSS + splice all partials
make check                     # Verify byte-identity (no drift)
# Additional smoke test:
grep -c '<!-- BUILD:svg-defs -->' *.html | grep -v ':1$' && echo "FAIL: missing markers" || echo "OK"
grep 'filter id="liquid-refract"' index.html && echo "SVG defs spliced" || echo "FAIL: svg-defs not spliced"
```

## Build Pipeline Details

### Current splicer flow (scripts/build-pages.sh)
1. Validate all partials in `PARTIALS` exist as files in `partials/` directory (lines 37-42)
2. For each page in PAGES:
   a. Parse `BUILD:vars` block for CTA_HREF, CTA_LABEL, CURRENT_PAGE (lines 59-121)
   b. Compute derived tokens (LOGO_ARIA_CURRENT, NAV_HEADER_*, NAV_MOBILE_*) (lines 123-168)
   c. For each partial in PARTIALS:
      - Substitute tokens via sed (lines 197-209)
      - Splice expanded content between BUILD markers via awk (lines 214-237)
3. Report pages processed

### Impact of adding svg-defs to PARTIALS:
- **Validation (line 37-42):** Will check `partials/svg-defs.html` exists -- MUST create file before running build
- **Token substitution (lines 197-209):** All 11 sed substitutions run, but svg-defs.html has no `{{...}}` placeholders, so they are no-ops
- **Splice (lines 214-237):** Works identically to other partials -- awk replaces content between `<!-- BUILD:svg-defs -->` and `<!-- /BUILD:svg-defs -->` markers
- **Output message (line 243):** Will report "5 partials" instead of "4 partials" per page (the message currently hardcodes "4 partials") -- this message should be updated

### Splicer output message fix
Line 243 currently says:
```sh
echo "[build-pages] $FILE updated (4 partials)"
```
This should change to either:
```sh
echo "[build-pages] $FILE updated (5 partials)"
```
Or dynamically count:
```sh
# Count partials in PARTIALS variable
_partial_count=0; for _p in $PARTIALS; do _partial_count=$((_partial_count + 1)); done
echo "[build-pages] $FILE updated ($_partial_count partials)"
```
The hardcoded "4" will be factually wrong after adding svg-defs. [VERIFIED: build-pages.sh line 243]

## Marker Insertion Points (per page)

Exact line numbers where `<!-- BUILD:svg-defs -->` / `<!-- /BUILD:svg-defs -->` markers should be inserted, based on current file structure:

| Page | BUILD:vars line | Insert after | Before |
|------|----------------|--------------|--------|
| index.html | 143 | Line 143 | Line 144 (mesh background div) |
| online-consultations.html | 61 | Line 61 | Line 62 (content before header) |
| treatment-abroad.html | 67 | Line 67 | Line 68 (content before header) |
| checkup.html | 58 | Line 58 | Line 59 (content before header) |
| contacts.html | 54 | Line 54 | Line 55 (content before header) |
| 404.html | 47 | Line 47 | Line 48 (content before header) |

[VERIFIED: grep for BUILD:vars across all pages]

## Protected Legacy Checklist

Items from REQUIREMENTS.md Protected Legacy that this phase must preserve:

| # | Item | Risk in Phase 44 | Mitigation |
|---|------|-------------------|------------|
| 1 | `&nbsp;` entities | Footer text contains nbsp bindings | Only edit class attributes, never text content |
| 3 | `whitespace-nowrap` span | Not in chrome partials | No risk |
| 4 | Honeypot hidden inputs | Not in chrome partials | No risk |
| 5 | `role="alert"` + `aria-live` | Not in chrome partials | No risk |
| 6 | Per-page SEO metadata | In `<head>`, not in partials | No risk (but inline `<style>` in head IS edited for header--scrolled) |
| 7 | Favicon link set | In `<head>`, not in partials | No risk |
| 8 | Vertical rhythm tokens | In theme.css, not touched | No risk |
| 9 | WCAG AA text tokens | Not changed | No risk |
| 10 | `overflow-x: clip` | In theme.css, not touched | No risk |
| 11 | Reduced-motion guard | liquid-glass.css already has reduced-motion block | No risk |
| 12 | `scroll-margin-top: 6rem` | Not in chrome partials | No risk |
| 13 | Byte-identity hook | MUST pass after build | Gate check: `make check` exits 0 |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual validation + shell commands (no automated test runner) |
| Config file | Makefile + scripts/build-pages.sh |
| Quick run command | `make build` |
| Full suite command | `make check` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CHROME-02 | svg-defs.html exists and splices into all 6 pages | smoke | `make build && grep -c 'filter id="liquid-refract"' index.html` | N/A (shell) |
| CHROME-02 | BUILD:svg-defs markers on all 6 pages | smoke | `grep -c '<!-- BUILD:svg-defs -->' *.html \| grep -v ':1$'` (must be empty) | N/A (shell) |
| CHROME-01 | Header uses liquid-regular + squircle | smoke | `grep 'liquid-regular' partials/header.html` | N/A (shell) |
| CHROME-01 | Footer uses liquid-card + squircle | smoke | `grep 'liquid-card' partials/footer.html` | N/A (shell) |
| CHROME-01 | Byte-identity passes | gate | `make check` | Existing |
| CHROME-01 | Visual review all 6 pages | manual-only | Browser inspection | N/A |

### Sampling Rate
- **Per task commit:** `make build && make check`
- **Per wave merge:** Full `make check` + visual review
- **Phase gate:** `make check` green + grep validation for all 6 pages

### Wave 0 Gaps
None -- existing build infrastructure (`make build`, `make check`, `scripts/build-pages.sh`) covers all phase requirements. No new test framework needed.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `.liquid-regular` is sufficient for header/mobile-menu/sticky-bar without specialized .liquid-nav/.liquid-sheet/.liquid-sticky-bar classes | Architecture Patterns | LOW -- `.liquid-regular` provides the complete glass recipe; specialized classes would just be aliases. If visual result differs from intent, can add specialized classes in Phase 44 itself |
| A2 | Header scroll state can be updated via CSS custom property overrides (`--liquid-bg`, `--liquid-blur-md`) in inline `<style>` | Header Scroll State Update | MEDIUM -- if CSS specificity of .liquid-regular properties beats inline custom property override, the scroll state won't visually change. Needs validation |
| A3 | Footer shadow-wrap is needed for outer shadow with squircle mask | Footer pattern | LOW -- if outer shadow is dropped in favor of inset-only shadows, the wrap is unnecessary and code is simpler |
| A4 | Splicer output message line 243 hardcoded "4 partials" should be updated | Build Pipeline Details | LOW -- cosmetic; build still works even if message is wrong |

## Open Questions

1. **Header scroll state inline `<style>` update scope**
   - What we know: `.header--scrolled` is defined in inline `<style>` in all 6 pages' `<head>` sections. It sets raw `background` and `backdrop-filter` values that will conflict with `.liquid-regular` token-based approach.
   - What's unclear: Whether the inline `<style>` can use CSS custom property overrides to affect `.liquid-regular` (specificity question), or whether `.header--scrolled` needs to use `!important` or a more specific selector.
   - Recommendation: Test by applying `.liquid-regular` to header, adding `--liquid-bg` and `--liquid-blur-md` overrides to `.header--scrolled` in a single page, and verifying scroll behavior works. Then replicate to other 5 pages.

2. **Footer outer shadow: wrap or drop?**
   - What we know: Footer currently uses `shadow-glass-lg` (outer shadow). Squircle mask clips outer shadow. Shadow-wrap pattern adds HTML complexity.
   - What's unclear: Whether the visual difference between outer shadow and inset-only shadows is significant enough to warrant the shadow-wrap wrapper div.
   - Recommendation: Try without shadow-wrap first (inset shadows from `.liquid-regular`/`.liquid-card`). If visual result lacks depth, add `liquid-card-wrap` wrapper.

3. **Mobile menu blur level**
   - What we know: Current mobile menu uses `backdrop-blur-[80px]` and `backdrop-saturate-[200%]` which are higher than `.liquid-regular`'s `--liquid-blur-md: 24px` and `--liquid-saturate: 180%`.
   - What's unclear: Whether the reduced blur from `.liquid-regular` is acceptable for the mobile menu overlay or if it needs a Tailwind override.
   - Recommendation: Apply `.liquid-regular` first, evaluate visually. If too transparent, add `backdrop-blur-[80px]` as an inline Tailwind override on top of `.liquid-regular`.

## Sources

### Primary (HIGH confidence)
- `partials/header.html` -- current header structure and classes [VERIFIED: codebase read]
- `partials/footer.html` -- current footer structure and classes [VERIFIED: codebase read]
- `partials/mobile-menu.html` -- current mobile menu structure and classes [VERIFIED: codebase read]
- `partials/sticky-bar.html` -- current sticky bar structure and classes [VERIFIED: codebase read]
- `scripts/build-pages.sh` -- complete splicer logic [VERIFIED: codebase read]
- `src/styles/liquid-glass.css` -- all available glass classes [VERIFIED: codebase read]
- `src/styles/squircles.css` -- all available squircle classes [VERIFIED: codebase read]
- `src/styles/theme.css` -- all token definitions [VERIFIED: codebase read]
- `js/main.js` -- initRefractionProbe() and header scroll behavior [VERIFIED: codebase grep]
- `.planning/research/ARCHITECTURE.md` -- E.1 svg-defs, E.5 vocabulary, G.1 migration order [VERIFIED: codebase read]
- `.planning/research/PITFALLS.md` -- C2 byte-identity hook, C1 focus-visible [VERIFIED: codebase read]

### Secondary (MEDIUM confidence)
- `.planning/phases/44-chrome-partials-upgrade/44-CONTEXT.md` -- user decisions [VERIFIED: codebase read]

## Metadata

**Confidence breakdown:**
- SVG defs infrastructure: HIGH -- exact file content, splicer edit, and marker format are fully documented in ARCHITECTURE.md and verified against codebase
- Chrome partial class mapping: HIGH -- current classes fully catalogued, available v4.0 classes verified in CSS files
- Header scroll state approach: MEDIUM -- CSS custom property override approach is sound but untested with `.liquid-regular` specificity
- Shadow-wrap decisions: MEDIUM -- correct pattern per squircles.css docs, but visual impact needs validation

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable -- no external dependencies, all based on project codebase)
