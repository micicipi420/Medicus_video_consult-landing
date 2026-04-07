# Navigation Redesign Research - MedicusUnion KZ Multi-Page Site

**Researched:** 2026-04-05
**Domain:** Multi-page navigation UX for medical website targeting 45+ audience
**Confidence:** HIGH

## Summary

The current navigation has a critical discoverability problem: three service pages (online-consultations.html, treatment-abroad.html, checkup.html) are invisible in the header nav. Users must navigate to index.html and scroll to the services section to discover them. This forces an extra step in the user journey and breaks the principle that every page should be reachable within one click from the header.

Research strongly recommends **flat navigation with all service pages as direct top-level links** rather than a dropdown. For 5 total navigation items (3 services + "O kompanii" + "Kontakty"), this is well within the 5-7 item sweet spot recommended by healthcare UX research. Dropdowns introduce motor-skill barriers for 45+ users (hover precision, accidental dismissal) and hide the very pages the site wants to promote.

**Primary recommendation:** Replace the 3-link nav with a 5-link flat nav showing all three services as direct links, add `aria-current="page"` for active page highlighting, keep the dropdown-panel mobile menu (not full-screen overlay), and make the CTA button scroll to the page's own form rather than always linking to contacts.html.

## Project Constraints (from CLAUDE.md)

- **Stack:** HTML + Tailwind CSS v4 + Vanilla JS (no frameworks, no build tools beyond Tailwind CLI)
- **Design source:** Redesign/ folder is the visual reference (React + Tailwind prototype)
- **Mobile-first:** Target audience 45+, large fonts, high contrast, simple navigation
- **Tone:** Calm, confident, medical -- no aggressive marketing
- **Fonts:** SF Pro Display / SF Pro Rounded with system fallback chain
- **Animations:** Motion standalone CDN (window.Motion) for scroll-reveal, hover transforms
- **Language:** Russian only

## Current State Analysis

### Site Structure (6 HTML files)
| Page | URL | Purpose |
|------|-----|---------|
| index.html | / | Hub page with services overview, why-us, form |
| online-consultations.html | /online-consultations | Service page: video consultations |
| treatment-abroad.html | /treatment-abroad | Service page: treatment abroad |
| checkup.html | /checkup | Service page: checkup programs |
| contacts.html | /contacts | Contact form, phone, address |
| 404.html | /404 | Error page |

### Current Nav (identical across all pages)
```
[MedicusUnion logo] --- [Услуги] [Почему мы] [Контакты] --- [phone] [CTA button]
```
- "Услуги" links to `index.html#services` (scrolls to cards section on homepage)
- "Почему мы" links to `index.html#why-us` (scrolls to section on homepage)
- "Контакты" links to `contacts.html`
- CTA button links to `#consultation-form` (on-page) or `contacts.html` (varies by page)

### Problems Identified
1. **Service pages unreachable from nav** -- users must visit homepage and scroll to find service page links
2. **No active page indication** -- when on checkup.html, no nav item is highlighted; screen readers get no signal
3. **"Услуги" is misleading** -- it promises a services listing but actually scrolls to homepage cards, not a services index page
4. **Nav inconsistency** -- CTA button points to different anchors on different pages (`#consultation-form`, `#form-abroad`, `#form-checkup`, `#contact-section`)
5. **Mobile menu uses wrong selectors** -- JS listens for `.mobile-menu__link` and `.mobile-menu__cta` classes but mobile nav links have no such classes on some pages

### What the React Prototype Did
The Redesign/Header.tsx uses the same 3-link nav (Услуги, Почему мы, Контакты). It does NOT have direct service page links either. However, it does have `aria-current`-equivalent active state logic: `location.pathname === item.to ? 'text-mu-blue' : 'text-mu-text-700'`. The prototype's routes.tsx shows services nested under `/services/` prefix.

### What the Parent Site (medicusunion.com) Does
The parent site uses a "Services" dropdown with sub-items. However, this is for a much larger international site with many more pages and service types. Not directly applicable to a 6-page local site.

## Architecture Patterns

### Recommended Navigation Structure

**Desktop (lg: 1024px+):**
```
[MedicusUnion] --- [Консультации] [Лечение] [Чек-ап] [О нас] [Контакты] --- [phone] [CTA]
```

5 nav items, all flat direct links. No dropdowns.

**Mobile (< 1024px):**
```
[MedicusUnion] --- [hamburger button]
```
Dropdown panel (current pattern) with all 5 links + phone + CTA.

### Why Flat Nav, Not Dropdown

| Factor | Flat Nav (5 items) | Dropdown under "Услуги" |
|--------|-------------------|------------------------|
| **45+ usability** | One click, no hover precision needed | Requires hover/click then second target acquisition |
| **Discoverability** | All pages always visible | Service pages hidden until menu opened |
| **Medical trust** | Clear, predictable, scannable | Perceived complexity |
| **Mobile UX** | Same pattern -- list of links | Extra tap to expand nested list |
| **NN/G research** | "5-7 items in primary menu" -- 5 items is ideal | Cascading menus are "error-prone, require precise mouse movements" |
| **Cognitive load** | Minimal -- user sees everything at a glance | User must remember to check dropdown |
| **Implementation** | Simple HTML links | Requires JS for click-to-open, focus management, ESC handler |

**Verdict:** With only 5 pages plus contacts, flat nav is strictly superior. A dropdown would only be justified at 8+ top-level items.

### Recommended Nav Labels

| Current | Proposed | Rationale |
|---------|----------|-----------|
| Услуги | -- (removed) | Generic; replaced with direct service links |
| Почему мы | О нас | Shorter; standard medical site convention |
| Контакты | Контакты | Keep as-is |
| -- | Консультации | Short label for online-consultations.html |
| -- | Лечение за рубежом | For treatment-abroad.html |
| -- | Чек-ап | For checkup.html |

**Note:** "Лечение за рубежом" is the longest label. It can be shortened to "Лечение" if horizontal space is tight, with `title` attribute providing full text. However, at 5 items with gap-6 instead of gap-8, all labels fit comfortably in a 1280px max-width container.

### Pattern 1: Active Page Highlighting with `aria-current="page"`

**What:** Add `aria-current="page"` to the nav link matching the current page. Use CSS to style it.

**Why:** NN/G calls the lack of current-page indication "probably the single most common mistake we see on website menus." For screen readers, `aria-current="page"` announces "current page" alongside the link text.

**Implementation:**
```html
<!-- On online-consultations.html -->
<nav class="header__nav hidden lg:flex items-center gap-6">
  <a href="online-consultations.html" 
     aria-current="page"
     class="text-mu-blue font-semibold tracking-tight">Консультации</a>
  <a href="treatment-abroad.html" 
     class="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">Лечение за рубежом</a>
  <a href="checkup.html" 
     class="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">Чек-ап</a>
  <a href="index.html#why-us" 
     class="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">О нас</a>
  <a href="contacts.html" 
     class="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">Контакты</a>
</nav>
```

**CSS (Tailwind):**
```css
/* Active nav link -- using aria-current attribute selector */
a[aria-current="page"] {
  @apply text-mu-blue font-semibold;
}
```

Or inline with Tailwind classes: apply `text-mu-blue font-semibold` to the active link and `text-mu-text-700 hover:text-mu-blue font-medium` to inactive links.

**Per-page approach:** Since this is a static multi-page site (no JS router), the `aria-current="page"` attribute must be set in the HTML of each page. This is acceptable for 5 pages.

### Pattern 2: Mobile Menu -- Dropdown Panel (Not Full-Screen Overlay)

**What:** Keep the current dropdown panel approach. The mobile menu drops down from below the header as a rounded card, with semi-transparent backdrop.

**Why superior to full-screen overlay for 45+ users:**
- **Context retention:** User can still see the page header and brand -- feels less disorienting
- **Smaller interaction area:** Tap targets are closer together in a compact panel
- **Faster escape:** Tap outside the panel to close (obvious interaction)
- **Current implementation works:** Already built and styled to match the glass design system

**Full-screen overlay drawbacks for this audience:**
- Disorienting "where am I?" feeling (entire screen changes)
- More animation/transition to process cognitively
- Close button placement varies and can be missed by 45+ users

**Implementation notes:**
- Keep `position: absolute; top: 6rem` (below header) approach
- Keep `bg-black/50` backdrop on the overlay div for click-outside-to-close
- Add proper `aria-hidden` toggling when menu opens/closes
- Add `role="dialog"` and focus trap for accessibility
- Ensure all nav links in mobile menu have the same `aria-current="page"` pattern

### Pattern 3: CTA Button Behavior -- Context-Sensitive

**What:** The CTA button in the header should always scroll to the form on the current page, not navigate away.

**Current problem:** On index.html it goes to `#consultation-form`, on treatment-abroad.html to `#form-abroad`, on checkup.html to `#form-checkup`. This is actually correct behavior -- each page has its own form. But "Оставить заявку" on contacts.html goes to `#contact-section`, which is the same page content.

**Recommendation:**
| Page | CTA href | CTA text |
|------|----------|----------|
| index.html | `#consultation-form` | Оставить заявку |
| online-consultations.html | `#consultation-form` | Оставить заявку |
| treatment-abroad.html | `#form-abroad` | Оставить заявку |
| checkup.html | `#form-checkup` | Подобрать программу |
| contacts.html | `#contact-section` | Оставить заявку |

**Key insight:** Sticky CTA that scrolls to on-page form converts 15-25% better than CTA that navigates away (per CRO research). Every service page already has its own form, so always use `#anchor` links, never `contacts.html` from the CTA.

### Pattern 4: Sticky Header Improvements

**Current state:** Header is `fixed` with glass morphism (`bg-white/30 backdrop-blur-[40px]`). On scroll past 20px, JS adds `.header--scrolled` which increases blur and reduces padding. This is a solid pattern.

**Recommended improvements:**
1. **Hide on scroll down, show on scroll up** -- a common "smart sticky" pattern that gives users more reading space. For 45+ users, this must be implemented with sufficient scroll threshold (50-80px) to avoid jittery behavior on shaky hand scrolling.
2. **Alternative: Keep always visible** -- simpler, more predictable. For a medical site with trust-sensitive audience, always-visible header may be better. The user always knows where the nav is.

**Verdict:** Keep the current always-visible sticky header. The "hide on down, show on up" pattern adds implementation complexity and cognitive surprise for older users. The current glass effect already minimizes visual weight.

**One actual improvement:** Reduce `top-4` to `top-2` and `rounded-[2.5rem]` to `rounded-[2rem]` on scroll to give more reading space while maintaining the floating pill look:

```css
.header--scrolled {
  top: 0.5rem;
  border-radius: 2rem;
}
```

### Anti-Patterns to Avoid

- **Dropdown menu for 5 items:** Unnecessary complexity. Dropdowns are justified only when 8+ items would crowd the nav bar.
- **Hover-activated dropdowns:** NN/G research confirms these are error-prone, especially for users with motor skill limitations. If a dropdown were ever needed, it MUST be click-activated.
- **Hamburger menu on desktop:** The site has only 5 links -- they fit easily. Never hide desktop nav behind a hamburger.
- **Mega menu:** Completely inappropriate for a 6-page site. Mega menus are for enterprise healthcare portals with 50+ pages.
- **Bottom tab bar on mobile web:** This is a native app pattern. Implementing it on a mobile website feels out of place and conflicts with browser chrome.
- **"More" or three-dot overflow menu:** Hides content. With only 5 items, everything should be visible in the mobile menu panel.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap in mobile menu | Custom focus trap JS | Minimal focus-trap pattern (15 lines) | Easy to get wrong; must handle Tab, Shift+Tab, Escape, edge focus |
| Scroll lock when menu open | Complex overflow toggling | `document.body.style.overflow = 'hidden'` | Already implemented in main.js -- keep it simple |
| Active page detection | JS-based URL parsing | Static `aria-current="page"` per HTML file | 5 pages is manageable; no runtime detection needed |
| Smooth scroll | Custom scroll animation | `scrollIntoView({ behavior: 'smooth' })` | Native browser support; already used |

## Common Pitfalls

### Pitfall 1: Inconsistent Mobile Menu Link Selectors
**What goes wrong:** The current JS in main.js listens for `.mobile-menu__link` and `.mobile-menu__cta` clicks to close the menu, but not all pages use these classes on mobile nav links.
**Why it happens:** The header HTML was copy-pasted between pages with slight class name variations.
**How to avoid:** Use consistent BEM classes across all 5 pages. Standardize: `.mobile-menu__link` for all nav links, `.mobile-menu__cta` for the CTA button, `.mobile-menu__phone` for the phone link.
**Warning signs:** Mobile menu stays open after tapping a link on some pages.

### Pitfall 2: Missing aria-current on Mobile Menu
**What goes wrong:** Active page is highlighted in desktop nav but forgotten in mobile menu.
**Why it happens:** Mobile menu is a separate HTML block, easy to forget mirroring the `aria-current` attribute.
**How to avoid:** When setting `aria-current="page"` on a desktop nav link, also set it on the corresponding mobile menu link.

### Pitfall 3: CTA Button Jumping to Wrong Page
**What goes wrong:** User on checkup.html clicks "Оставить заявку" and lands on contacts.html instead of scrolling to the on-page form.
**Why it happens:** CTA href is hardcoded to `contacts.html` instead of page-specific anchor.
**How to avoid:** Each page's header HTML must have a page-specific CTA anchor. Document which anchor ID each page uses.

### Pitfall 4: Header HTML Duplication Drift
**What goes wrong:** Nav changes on one page but not others. Over time, the 5 HTML files have different nav structures.
**Why it happens:** No templating system -- each page has a full copy of the header.
**How to avoid:** After changing the nav, use a find-and-replace workflow across all 5 pages (not 404.html which may have minimal nav). Consider a comment block marking the header: `<!-- HEADER:START -->` and `<!-- HEADER:END -->` to make bulk updates easier.

### Pitfall 5: Glass Header Unreadable on Light Backgrounds
**What goes wrong:** On pages with very light hero sections, the glass header text becomes hard to read (low contrast against white-on-white).
**Why it happens:** `bg-white/30` with `backdrop-blur` on top of white content.
**How to avoid:** The `.header--scrolled` state already darkens to `bg-white/50`. For initial state, ensure hero sections have enough color contrast behind the header area. Test with WCAG contrast checker.

## Code Examples

### Complete Desktop Nav HTML (for online-consultations.html)
```html
<header class="header fixed z-50 transition-all duration-500 top-4 left-4 right-4 mx-auto max-w-7xl rounded-[2.5rem] px-4 md:px-8 border-[0.5px] border-white/50 shadow-glass-header bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%] py-5" id="header">
  <div class="header__inner flex items-center justify-between">
    <a href="index.html" class="header__logo text-2xl font-bold tracking-tight bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent">MedicusUnion</a>

    <nav class="header__nav hidden lg:flex items-center gap-6" aria-label="Основная навигация">
      <a href="online-consultations.html" aria-current="page" class="text-mu-blue font-semibold tracking-tight">Консультации</a>
      <a href="treatment-abroad.html" class="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">Лечение за рубежом</a>
      <a href="checkup.html" class="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">Чек-ап</a>
      <a href="index.html#why-us" class="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">О нас</a>
      <a href="contacts.html" class="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">Контакты</a>
    </nav>

    <div class="header__actions hidden lg:flex items-center gap-4">
      <a href="tel:+77015322478" class="header__phone flex items-center gap-2 text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        +7 701 532 24 78
      </a>
      <a href="#consultation-form" class="header__cta bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-mu-blue/25 hover:shadow-xl hover:shadow-mu-blue/30 transition-shadow inline-block tracking-tight">Оставить заявку</a>
    </div>

    <button class="header__menu-btn lg:hidden p-2 text-mu-text-700 bg-white/50 rounded-full backdrop-blur-xl backdrop-saturate-[180%] border border-white/50" aria-label="Открыть меню" aria-expanded="false">
      <svg class="icon-menu" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  </div>
</header>
```

### Complete Mobile Menu HTML (for online-consultations.html)
```html
<div class="mobile-menu-overlay fixed inset-0 z-40 lg:hidden" aria-hidden="true">
  <div class="absolute inset-0 bg-black/50"></div>
  <div class="mobile-menu absolute top-24 left-4 right-4 bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%] shadow-glass-lg rounded-3xl overflow-hidden border-[0.5px] border-white/50">
    <nav class="mobile-menu__nav flex flex-col p-6 gap-2" aria-label="Мобильная навигация">
      <a href="online-consultations.html" aria-current="page" class="mobile-menu__link text-mu-blue bg-mu-blue/5 rounded-2xl px-4 py-3 font-semibold tracking-tight">Консультации</a>
      <a href="treatment-abroad.html" class="mobile-menu__link text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight">Лечение за рубежом</a>
      <a href="checkup.html" class="mobile-menu__link text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight">Чек-ап</a>
      <a href="index.html#why-us" class="mobile-menu__link text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight">О нас</a>
      <a href="contacts.html" class="mobile-menu__link text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight">Контакты</a>
      <div class="mobile-menu__divider h-[0.5px] bg-white/40 my-2"></div>
      <a href="tel:+77015322478" class="mobile-menu__phone flex items-center gap-3 text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-mu-blue"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        +7 701 532 24 78
      </a>
      <a href="#consultation-form" class="mobile-menu__cta bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-6 py-4 rounded-2xl font-semibold tracking-tight shadow-lg mt-4 w-full text-center block">Оставить заявку</a>
    </nav>
  </div>
</div>
```

### Active Page Indication CSS (for Tailwind `@layer`)
```css
/* In src/styles/index.css or equivalent */
@layer base {
  /* Active nav link */
  .header__nav a[aria-current="page"] {
    @apply text-mu-blue font-semibold;
  }
  
  /* Active mobile menu link -- subtle background highlight */
  .mobile-menu__nav a[aria-current="page"] {
    @apply text-mu-blue bg-mu-blue/5 font-semibold;
  }
}
```

### Per-Page Configuration Matrix
```
Page                        | aria-current on           | CTA href              | CTA text
----------------------------|---------------------------|-----------------------|-------------------
index.html                  | none (or "Главная" if added) | #consultation-form | Оставить заявку
online-consultations.html   | "Консультации"            | #consultation-form    | Оставить заявку
treatment-abroad.html       | "Лечение за рубежом"      | #form-abroad          | Оставить заявку
checkup.html                | "Чек-ап"                  | #form-checkup         | Подобрать программу
contacts.html               | "Контакты"                | #contact-section      | Оставить заявку
```

### Updated Mobile Menu Close Handler (main.js fix)
```javascript
function initMobileMenu() {
  var menuBtn = document.querySelector('.header__menu-btn');
  var overlay = document.querySelector('.mobile-menu-overlay');
  if (!menuBtn || !overlay) return;

  var menuIcon = menuBtn.querySelector('.icon-menu');
  var closeIcon = menuBtn.querySelector('.icon-close');

  function openMenu() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    if (menuIcon) menuIcon.style.display = 'none';
    if (closeIcon) closeIcon.style.display = '';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (menuIcon) menuIcon.style.display = '';
    if (closeIcon) closeIcon.style.display = 'none';
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', function () {
    if (overlay.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on backdrop click
  overlay.querySelector('.absolute.inset-0.bg-black\\/50')?.addEventListener('click', closeMenu);

  // Close on ANY link click inside mobile menu
  overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeMenu();
      menuBtn.focus(); // Return focus to trigger
    }
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `class="active"` on nav links | `aria-current="page"` attribute | WCAG 2.1 adoption (~2020+) | Screen readers announce "current page"; CSS can target `[aria-current="page"]` |
| Hover-activated dropdowns | Click-activated or flat nav | NN/G guidance, touch device prevalence | Better for touch, keyboard, and motor-impaired users |
| Full-page mobile menu | Compact dropdown panel | 2023-2025 trend | Less disorienting, faster, preserves context |
| Fixed CTA linking to contact page | On-page anchor CTA | Conversion optimization research | 15-25% conversion lift from keeping users on page |

## Open Questions

1. **"О нас" link target**
   - What we know: Currently "Почему мы" links to `index.html#why-us`. Changing label to "О нас" is fine.
   - What's unclear: Should "О нас" remain a scroll-to-section on index.html, or should it become a standalone page?
   - Recommendation: Keep as `index.html#why-us` for now. A standalone about page can be added later when there's enough content to justify it. Add `aria-current` only if on index.html and the section is in view (too complex -- skip for now, leave without `aria-current` on homepage).

2. **index.html nav state**
   - What we know: When on index.html, no specific service page is "current." The MedicusUnion logo link already goes to index.html.
   - What's unclear: Should the logo link be visually indicated as "current" when on homepage?
   - Recommendation: No. The logo is already the visual indicator of the homepage. No nav item gets `aria-current` on the homepage. This is standard practice.

3. **404.html navigation**
   - What we know: 404 page exists but may have simplified nav.
   - Recommendation: Include the full nav on 404.html. Users who hit a broken link need maximum navigation options.

## Sources

### Primary (HIGH confidence)
- [NN/G: Menu Design Checklist: 17 UX Guidelines](https://www.nngroup.com/articles/menu-design/) -- click vs hover, active page indication, hamburger appropriateness
- [NN/G: Dropdowns Design Guidelines](https://www.nngroup.com/articles/drop-down-menus/) -- when dropdowns are appropriate vs flat nav
- [MDN: aria-current attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current) -- specification and usage
- [A11y Collective: Make Navigation Accessible with aria-current](https://www.a11y-collective.com/blog/aria-current/) -- implementation patterns

### Secondary (MEDIUM confidence)
- [314e: Healthcare Website Navigation: 9 Best Practices](https://www.314e.com/practifly/blog/healthcare-website-navigation-best-practices/) -- 5-7 nav items, sticky nav, CTA emphasis
- [LandingPageFlow: CTA Placement Strategies for 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) -- sticky CTA conversion research (15-25% lift)
- [Eastern Standard: Best Navigation Solutions for Hospital Websites](https://www.easternstandard.com/blog/the-best-navigation-solutions-for-hospital-health-system-websites/) -- flat vs hierarchical for healthcare
- [Webstacks: Mobile Menu Design Best Practices 2025](https://www.webstacks.com/blog/mobile-menu-design) -- panel vs overlay patterns

### Tertiary (LOW confidence)
- medicusunion.com navigation review -- parent site uses dropdown "Services" but for a much larger site; pattern does not transfer to 6-page site
- Redesign/Header.tsx analysis -- same 3-link nav as current; not a good model for the expanded site

## Metadata

**Confidence breakdown:**
- Navigation structure (flat vs dropdown): HIGH -- multiple authoritative UX sources agree; 5 items is clearly within flat nav territory
- Active page indication: HIGH -- `aria-current="page"` is the standard; MDN-documented specification
- Mobile menu pattern: HIGH -- current dropdown panel is already well-implemented; research confirms it over full-screen for 45+ audience
- CTA strategy: MEDIUM -- conversion lift numbers (15-25%) from CRO research apply generally, not specific to this site
- Sticky header: HIGH -- current implementation is solid; "keep it simple" is the right call for 45+ audience

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable -- navigation patterns change slowly)
