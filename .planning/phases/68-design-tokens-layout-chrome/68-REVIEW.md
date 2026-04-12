---
phase: 68-design-tokens-layout-chrome
reviewed: 2026-04-12T00:00:00Z
depth: standard
files_reviewed: 10
files_reviewed_list:
  - next/package.json
  - next/src/app/globals.css
  - next/src/app/layout.tsx
  - next/src/components/layout/MeshBackground.tsx
  - next/src/lib/navigation.ts
  - next/src/components/layout/Header.tsx
  - next/src/components/layout/HeaderClient.tsx
  - next/src/components/layout/MobileMenu.tsx
  - next/src/components/layout/Footer.tsx
  - next/src/components/layout/StickyBar.tsx
findings:
  critical: 0
  warning: 5
  info: 6
  total: 11
status: issues_found
---

# Phase 68: Code Review Report

**Reviewed:** 2026-04-12
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

Phase 68 introduces design tokens, a mesh background component, and updates to all persistent layout chrome: header, footer, sticky bar, and mobile menu. The token system is well-structured and the server/client component split is correct. No security issues were found.

Five warnings require attention before the phase is closed: the Header's `bg-white` conflicts with the glassmorphism spec from the context document, the desktop nav breakpoint was not switched from `md` to `lg` as decided, the Footer omits the agreed Services column and is missing `<Link>` for internal routes, the mobile menu lacks a focus trap, and `FOOTER_SERVICES_LINKS` is exported but never consumed.

Six info items call out dead code, duplicate color tokens, a missing `/privacy` page, and minor inconsistencies with the implementation decisions.

---

## Warnings

### WR-01: Header uses solid `bg-white` instead of glass pill style

**File:** `next/src/components/layout/HeaderClient.tsx:12`

**Issue:** The implementation decision specifies `fixed top-4 left-4 right-4 rounded-[2.5rem]` with glass background. The current implementation uses `sticky top-0` with `bg-white` — no glass effect, no border-radius, no floating pill. This is a direct divergence from the agreed design (68-CONTEXT.md > Specifics). The glass tokens (`--liquid-nav-bg`, `shadow-glass-header`) added to `globals.css` for this phase are not yet applied anywhere.

**Fix:**
```tsx
// HeaderClient.tsx
<header
  className={cn(
    'fixed top-4 left-4 right-4 z-50 flex items-center transition-all duration-300',
    'h-16 rounded-[2.5rem] bg-white/60 backdrop-blur-xl shadow-glass-header',
    isScrolled && 'bg-white/80 shadow-glass-lg',
  )}
>
```

---

### WR-02: Desktop nav breakpoint not switched from `md` to `lg`

**File:** `next/src/components/layout/Header.tsx:13`
**File:** `next/src/components/layout/Header.tsx:37`
**File:** `next/src/components/layout/MobileMenu.tsx:29`

**Issue:** The context decision document explicitly states: "Switch desktop nav breakpoint from md (768px) to lg (1024px) — more room for 5 links + phone + CTA." All three visibility toggles remain at `md`. With 5 nav links plus phone plus a CTA button at 768px, the header will overflow.

**Fix:**
```tsx
// Header.tsx line 13: hidden md:flex → hidden lg:flex
<nav className="hidden lg:flex items-center gap-6">

// Header.tsx line 37: hidden md:inline-flex → hidden lg:inline-flex
className="hidden lg:inline-flex items-center ..."

// MobileMenu.tsx line 29: md:hidden → lg:hidden
className="lg:hidden p-2 -mr-2"
```

---

### WR-03: Footer missing Services column and uses `<a>` for internal routes

**File:** `next/src/components/layout/Footer.tsx:5-48`

**Issue:** Two related problems:

1. The context decision specifies a 4-column layout: Company, Services, Navigation, Contacts. The current footer renders only 3 columns (Company, Contacts, Nav) and does not use `FOOTER_SERVICES_LINKS` at all — the Services column is absent.

2. `FOOTER_NAV_LINKS` entries (e.g., `/contacts`, `/`) are rendered as plain `<a>` tags (line 29) rather than Next.js `<Link>`. Internal routes should use `<Link>` for client-side navigation and prefetching. Only bare anchor-hash links (`#clinics`, `#why-us`) that point to within the same page need plain `<a>`.

**Fix for missing column** — import and render the Services list:
```tsx
import { FOOTER_NAV_LINKS, FOOTER_SERVICES_LINKS, ... } from '@/lib/navigation';
import Link from 'next/link';

// Add a Services column before the Nav column:
<div>
  <p className="font-heading font-bold mb-3 text-white/60 text-sm uppercase tracking-wider">Услуги</p>
  {FOOTER_SERVICES_LINKS.map((link) => (
    <Link key={link.href} href={link.href} className="block mb-2 text-[1.125rem] text-white hover:text-[#2B6CB0] transition-colors">
      {link.label}
    </Link>
  ))}
</div>
```

**Fix for `<a>` vs `<Link>`** — use `<Link>` for entries whose `href` does not start with `#`:
```tsx
{FOOTER_NAV_LINKS.map((link) =>
  link.href.startsWith('#') ? (
    <a key={link.href} href={link.href} className="...">...</a>
  ) : (
    <Link key={link.href} href={link.href} className="...">...</Link>
  )
)}
```

---

### WR-04: MobileMenu has no focus trap — keyboard users can tab behind the overlay

**File:** `next/src/components/layout/MobileMenu.tsx:34-73`

**Issue:** When the mobile menu opens, keyboard focus is not trapped inside the nav panel. A user pressing Tab can cycle through all interactive elements behind the overlay (header, main content, footer), which violates WCAG 2.1 SC 2.1.2 and creates a broken UX for screen reader users. The backdrop overlay catches mouse clicks but has no effect on keyboard navigation.

Additionally, the nav `<nav>` element has no `aria-label` to distinguish it from the desktop nav, and the open menu has no `aria-modal` or equivalent trap signal for assistive technologies.

**Fix:** Add a keyboard listener that traps Tab/Shift+Tab and an Escape key handler:
```tsx
useEffect(() => {
  if (!isOpen) return;
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    // For full trap: query all focusable elements in the panel and constrain Tab
  };
  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
}, [isOpen]);

// On the nav element:
<nav aria-label="Мобильная навигация" ...>
```

---

### WR-05: `StickyBar` CTA links to `#contact` which does not exist on service pages

**File:** `next/src/components/layout/StickyBar.tsx:55`

**Issue:** The CTA anchor `href="#contact"` always links to a section with `id="contact"` on the current page. The context decision document notes: "StickyBar: #contact on index, smart fallback to /contacts on service pages." The current implementation has no fallback — on `/consultations`, `/treatment-abroad`, `/checkup`, and `/contacts`, clicking the CTA navigates to a non-existent anchor, effectively doing nothing (or jumping to the top of the page depending on browser behavior).

The `IntersectionObserver` targets both `#contact` and `footer` to hide the bar, but the CTA target is hardcoded.

**Fix:** Detect whether the current page has `#contact`, and fall back to `/contacts`:
```tsx
const [ctaHref, setCtaHref] = useState('#contact');

useEffect(() => {
  if (!document.querySelector('#contact')) {
    setCtaHref('/contacts');
  }
}, []);

// In JSX:
<a href={ctaHref} className="btn-primary btn-sticky">
  Оставить заявку
</a>
```

---

## Info

### IN-01: `FOOTER_SERVICES_LINKS` exported but never imported anywhere

**File:** `next/src/lib/navigation.ts:9-13`

**Issue:** `FOOTER_SERVICES_LINKS` is defined and exported but has zero consumers in the codebase. This will cause a lint/dead-export warning in stricter configurations and indicates the Footer Services column (per WR-03) has not been wired up.

**Fix:** Either import it in `Footer.tsx` (per WR-03), or remove it if the Services column is deferred to a later phase.

---

### IN-02: Three duplicate color token values in the green ramp

**File:** `next/src/app/globals.css:26-32`

**Issue:** Two pairs of tokens share identical hex values:
- `--mu-green-300` and `--mu-green-200` both resolve to `#A6EECB`
- `--mu-green-600` and `--mu-green-900` both resolve to `#35B678`

Additionally, `--color-cta` (line 171) hardcodes the same `#35B678` rather than referencing `--mu-green-600`. Three independent tokens for the same value creates confusion about which to use and risks diverging in future updates.

**Fix:** Consolidate — pick the authoritative token name for each value and alias the others, or remove the redundant tokens when the deprecated production block is cleaned up in phases 69-72.

---

### IN-03: `/privacy` route linked in footer does not exist

**File:** `next/src/lib/navigation.ts:20`

**Issue:** `FOOTER_NAV_LINKS` includes `{ href: '/privacy', label: 'Политика конфиденциальности' }`. There is no `/privacy` directory under `next/src/app/`, so this link will 404. The footer renders this link as a plain `<a>`, so Next.js will not warn during build.

**Fix:** Either create `next/src/app/privacy/page.tsx`, or remove the entry from `FOOTER_NAV_LINKS` until the page is ready.

---

### IN-04: Dead code — `startsWith('#')` branch in Header and MobileMenu never fires

**File:** `next/src/components/layout/Header.tsx:15`
**File:** `next/src/components/layout/MobileMenu.tsx:45`

**Issue:** Both files branch on `link.href.startsWith('#')` to render a plain `<a>` instead of `<Link>`. However, no entry in `NAV_LINKS` starts with `#` — the anchor links use absolute paths (`/#why-us`). The `<a>` branch is dead code. Note: this is functionally harmless since `<Link href="/#why-us">` works correctly, but the branch is misleading and will confuse future maintainers.

**Fix:** Remove the ternary and use `<Link>` for all nav entries, since Next.js `<Link>` handles `/#anchor` correctly:
```tsx
{NAV_LINKS.map((link) => (
  <Link
    key={link.href}
    href={link.href}
    className="text-sm font-body text-mu-text-500 hover:text-mu-blue transition-colors whitespace-nowrap"
  >
    {link.label}
  </Link>
))}
```

---

### IN-05: `MeshBackground` frosted overlay applies `backdrop-blur` over gradient blobs — no effect

**File:** `next/src/components/layout/MeshBackground.tsx:14`

**Issue:** The frosted overlay (`absolute inset-0 bg-white/40 backdrop-blur-[40px]`) sits inside the same `fixed` container as the blobs. `backdrop-blur` blurs what is behind the element in the stacking context — but since the blobs are siblings in the same container, not behind it in the document, the blur has no effect on the blobs. The visual result is that the frosted effect applies to whatever is behind the entire `fixed` layer (the page body/background), not to the gradient blobs.

This is a well-known limitation of `backdrop-filter`: it cannot blur sibling elements. To blur the blobs, a CSS `filter: blur()` on each blob div (already done with `blur-[120px]` Tailwind classes) is the correct approach. The frosted overlay can still provide the `bg-white/40` tint, but `backdrop-blur` on it is decorative-only in this setup.

**Fix:** Remove the `backdrop-blur` from the frosted overlay (it blurs the page background, not the blobs, which may or may not be the desired effect). If the intent is to soften the blobs, the existing `blur-[120px]` on each blob is doing the work:
```tsx
{/* Frosted overlay — bg-white/40 tint only; backdrop-blur has no effect on sibling blobs */}
<div className="absolute inset-0 bg-white/40" />
```

---

### IN-06: Gradient CTA button ("Обсудить случай") missing from desktop header

**File:** `next/src/components/layout/Header.tsx:34-43`

**Issue:** The context decision document specifies: "Add gradient CTA button 'Обсудить случай' to desktop header — matches new design, drives conversions." The current header only renders the phone number and the mobile menu toggle. No CTA button is present. Similarly, the logo is plain text (`font-heading text-lg font-bold text-mu-text-900`) rather than the specified gradient text (`from-mu-blue to-mu-accent-blue`).

These are implementation gaps rather than bugs, but they represent unfulfilled phase deliverables.

**Fix:**
```tsx
// Logo with gradient text
<Link href="/" className="font-heading text-lg font-bold bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent">
  MedicusUnion
</Link>

// CTA button after phone number, hidden on mobile
<a href="#contact" className="hidden lg:inline-flex btn-primary px-5 py-2 text-sm">
  Обсудить случай
</a>
```

---

_Reviewed: 2026-04-12_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
