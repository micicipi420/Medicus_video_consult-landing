# Feature Research

**Domain:** Medical second-opinion consultation landing page (telemedicine, lead generation)
**Researched:** 2026-03-23
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with clear value proposition | Users decide in 3 seconds whether to stay. "Мнение европейского врача не выходя из дома" must be instantly readable. Medical jargon = bounce. | LOW | Headline + subheadline + single CTA. No carousel, no animation. Static confidence. |
| Prominent click-to-call phone number | 45+ audience trusts phone calls over forms. Click-to-call converts 10-15x higher than web forms for this demographic. Missing phone number = "is this even real?" | LOW | `tel:` link in header (sticky on mobile), also in footer and form section. +7 701 532 24 78 must be visible at all times. |
| Mobile-first responsive layout | Primary audience accesses from smartphones. Pinch-to-zoom = immediate bounce for 45+ users. | MEDIUM | Not "also works on mobile" — designed mobile-first, enhanced for desktop. Touch targets minimum 48x48px. |
| Large, readable typography | 45+ users have declining visual acuity. 14px body text = unreadable for target audience. | LOW | Body text 18px minimum, headings 28-36px. Inter/Manrope (sans-serif) per brand. Use rem units for scalability. High contrast: dark text on light background. |
| Trust signals: doctor credentials & country flags | Users paying 450EUR+ for a second opinion need to trust the doctors. "European doctors" is vague without proof. | LOW | Country flags (Germany, Israel, Switzerland, etc.), institutional logos, "15+ years experience" type stats. Link to medicusunion.com/doctors for full profiles. |
| "How it works" step-by-step section | Medical consultation process is unfamiliar. Users need to understand what happens after they submit a form. Uncertainty = abandonment. | LOW | 3-4 numbered steps with icons. Simple: Submit form -> We contact you -> Doctor reviews case -> Video consultation. |
| Lead capture form (name, phone, specialty, optional description) | This is the conversion mechanism. The entire page exists to drive form submissions. | MEDIUM | Short form (4 fields max). Specialty as dropdown. Phone with country code pre-filled (+7). No required email — phone is primary contact for this audience. |
| FAQ accordion section | 450EUR is a significant purchase decision. Users have objections: "Is it legitimate?", "What language?", "How do I send documents?". Unanswered questions = lost leads. | LOW | 8-12 questions. Accordion pattern saves space on mobile. Each answer should address an objection and reinforce trust. |
| SSL/security indicators | Medical data sensitivity. Users entering phone numbers and health descriptions need to feel safe. | LOW | HTTPS is baseline. Add visual "data is secure" note near form. Privacy policy link. |
| Fast page load (under 3 seconds) | Slow pages kill conversion. Every second of load time reduces conversions by 7%. Mobile networks in KZ can be variable. | MEDIUM | No framework overhead helps here. Optimize images (WebP), minimal JS, lazy-load below-fold content. Target < 2s on 3G. |
| Clear pricing display | 450EUR is a premium price. Hidden pricing destroys trust. Users who see price and still submit the form are higher-quality leads. | LOW | "от 450 EUR" prominently displayed. Explain what's included. No asterisks or hidden fees. |

### Differentiators (Competitive Advantage)

Features that set MedicusUnion KZ apart. Not expected, but drive conversion.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Sticky mobile CTA bar | Phone number + "Оставить заявку" button always visible while scrolling. Reduces friction — user never needs to scroll back up to act. A/B tests show 55% increase in CTA clicks. | LOW | Fixed bottom bar on mobile only. Semi-transparent, does not obscure content. Disappears when form section is in viewport to avoid redundancy. |
| Problem-agitation section ("Когда нужна консультация") | Most competitors list services. Showing specific situations ("Вам поставили серьезный диагноз", "Предложена сложная операция") creates emotional resonance. User thinks "this is exactly my situation." | LOW | 4-6 scenario cards. Each scenario = a reason to seek second opinion. Uses empathetic, non-alarmist language per brand tone. |
| Social proof with specifics | Generic "we helped 1000 patients" is weak. Specific numbers with geography build credibility: "3,200+ консультаций", "27 стран", "98% рекомендуют". | LOW | Statistics bar with animated counters (on scroll into view). Numbers must be real and verifiable. |
| WhatsApp/Telegram contact option | 45+ audience in Kazakhstan uses messengers heavily. WhatsApp is dominant. Offering messenger contact alongside phone lowers the barrier to first contact. | LOW | Small messenger icons near phone number. Opens pre-filled message. Not a replacement for the form — an additional entry point. |
| Micro-copy reassurance near form | "Бесплатная первичная консультация по вашему случаю", "Мы перезвоним в течение 2 часов", "Ваши данные защищены" — placed directly around the form. Reduces anxiety at the decision point. | LOW | 2-3 short reassurance lines near form submit button. Green checkmark icons. Addresses the "what happens after I submit?" anxiety. |
| Specialty-specific entry points | Instead of generic "consultation", showing specific specialties (oncology, cardiology, neurosurgery) with brief descriptions helps users self-qualify: "Yes, they handle my condition." | LOW | Visual cards or list in a dedicated section. Each specialty links/scrolls to the form with that specialty pre-selected in dropdown. |
| Final urgency section (non-aggressive) | A calm closing section: "Не откладывайте заботу о здоровье" with a repeated CTA. Not a countdown timer or "LAST CHANCE!" — a dignified reminder consistent with medical tone. | LOW | Short section before footer. Headline + CTA button. Calm but clear. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this specific project and audience.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Live chat / chatbot | "Users can ask questions instantly" | 45+ audience distrusts chatbots. Requires 24/7 staffing or AI that handles medical sensitivity. Poorly implemented chat destroys trust faster than no chat at all. Medical questions via chat create liability. | Prominent phone number + WhatsApp. Human contact, not bot contact. |
| Online payment integration | "Let users pay directly" | 450EUR is not an impulse purchase. Users need human conversation first. Payment adds massive complexity (PCI compliance, currency conversion EUR/KZT, refund flows). Out of scope per PROJECT.md. | Form captures lead. Sales team handles payment offline after consultation is scheduled. |
| Doctor profile pages on landing | "Show specific doctors users will consult with" | Creates maintenance burden. Doctors change availability. Landing page is lead capture, not a directory. Out of scope per PROJECT.md. | "Наши врачи" section with aggregated credentials + link to medicusunion.com/doctors for full directory. |
| Multi-step wizard form | "Break the form into steps for better completion" | 4 fields do not warrant a wizard. Multi-step adds complexity, creates "how many more steps?" anxiety, and increases JS complexity. Wizards help with 10+ field forms, not 4. | Single-screen form. All fields visible at once. Minimal cognitive load. |
| Video testimonials | "More engaging than text" | Slow to load on mobile (KZ network speeds). Requires production quality or looks cheap. Autoplay video is hostile to 45+ users. Bandwidth cost for users on mobile data. | Text testimonials with patient initials (for anonymity) and condition type. Optional: 1-2 short video links for those who want them, never autoplay. |
| Countdown timers / urgency tactics | "Creates FOMO, drives conversion" | Fundamentally incompatible with medical trust. Countdown on a health decision feels manipulative. Violates brand tone ("спокойный, уверенный, медицинский — без маркетинговой агрессии"). | Calm urgency: "Не откладывайте заботу о здоровье." Dignity, not desperation. |
| Parallax scrolling / heavy animations | "Modern, premium feel" | Causes motion sickness for some older users. Slows page load. Adds JS complexity. Distracts from content. Accessibility hazard (WCAG prefers-reduced-motion). | Clean, static design with subtle transitions. Professional = calm, not flashy. |
| Kazakh language toggle | "Reach more of the market" | Out of scope for v1 per PROJECT.md. Adding i18n doubles content maintenance. Target audience is Russian-speaking per validated constraint. | Russian only in v1. Kazakh language as a separate milestone when validated. |

## Feature Dependencies

```
[Hero with CTA button]
    └──scrolls-to──> [Lead Capture Form]
                         └──submits-to──> [Directus Backend]

[Specialty Cards]
    └──pre-selects──> [Form Specialty Dropdown]

[Sticky Mobile CTA Bar]
    └──scrolls-to──> [Lead Capture Form]
    └──triggers──> [Click-to-Call Phone]

[FAQ Accordion]
    └──addresses-objections-for──> [Lead Capture Form]

[Pricing Section]
    └──sets-expectations-for──> [Lead Capture Form]

["How It Works" Steps]
    └──reduces-uncertainty-for──> [Lead Capture Form]

[Trust Signals / Credentials]
    └──links-to──> [medicusunion.com/doctors] (external)
```

### Dependency Notes

- **Every CTA requires the Form:** All CTA buttons across all sections scroll to the single lead capture form. Form must be implemented first or in parallel with all other sections.
- **Specialty cards enhance Form:** Clicking a specialty pre-selects the dropdown value. Requires the dropdown options to match the card labels exactly.
- **Sticky CTA bar requires Form + Phone:** Depends on both the form section (scroll target) and the click-to-call phone number being implemented.
- **All trust-building sections feed the Form:** Problem section, credentials, FAQ, pricing, "how it works" — they all exist to reduce friction before the form. The form is the convergence point.

## MVP Definition

### Launch With (v1)

Minimum viable product — what is needed to start capturing leads.

- [ ] Hero section (headline, subheadline, CTA) — first impression, 3-second test
- [ ] Problem/scenario section ("Когда нужна консультация") — emotional hook
- [ ] "How it works" (3-4 steps) — reduces uncertainty
- [ ] Doctor credentials section (aggregated, not individual profiles) — trust
- [ ] "Why through us" advantages section — differentiates from local options
- [ ] Pricing section (от 450 EUR, what's included) — qualification filter
- [ ] Lead capture form (name, phone, specialty, optional description) — conversion
- [ ] FAQ accordion (8-12 questions) — objection handling
- [ ] Final CTA section — last-chance conversion
- [ ] Footer (contacts, links, legal) — legitimacy
- [ ] Sticky mobile CTA bar (phone + form scroll) — persistent conversion path
- [ ] Click-to-call phone number in header — critical for 45+ audience
- [ ] Directus backend integration for form submissions — data capture

### Add After Validation (v1.x)

Features to add once traffic is flowing and conversion data is available.

- [ ] WhatsApp/Telegram contact buttons — add when analytics show mobile messenger referral traffic
- [ ] A/B testing on CTA copy and form placement — add when baseline conversion rate is established
- [ ] Animated statistics counters — add when real numbers are confirmed and worth showcasing
- [ ] Specialty-specific URL parameters for ad campaigns — add when paid traffic campaigns begin
- [ ] Schema.org structured data (MedicalOrganization, FAQPage) — add for SEO once page is stable
- [ ] Yandex.Metrika / Google Analytics goals — add immediately after launch for conversion tracking

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Kazakh language version — defer until Russian version conversion is validated
- [ ] Patient testimonials section — defer until real testimonials are collected (never use fake ones)
- [ ] Blog/educational content — defer; landing page is not a content site
- [ ] Online scheduling (pick time slot) — defer; requires calendar integration and timezone handling
- [ ] Document upload in form — defer; adds complexity, medical data handling requirements

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero section with clear CTA | HIGH | LOW | P1 |
| Click-to-call phone number | HIGH | LOW | P1 |
| Lead capture form + Directus | HIGH | MEDIUM | P1 |
| Mobile-first responsive layout | HIGH | MEDIUM | P1 |
| Large readable typography (18px+) | HIGH | LOW | P1 |
| "How it works" steps | HIGH | LOW | P1 |
| FAQ accordion | HIGH | LOW | P1 |
| Pricing section | HIGH | LOW | P1 |
| Problem/scenario section | HIGH | LOW | P1 |
| Trust signals (credentials, flags) | HIGH | LOW | P1 |
| Sticky mobile CTA bar | MEDIUM | LOW | P1 |
| "Why through us" section | MEDIUM | LOW | P1 |
| Final CTA section + footer | MEDIUM | LOW | P1 |
| SSL + privacy indicators near form | MEDIUM | LOW | P1 |
| Page performance optimization | MEDIUM | MEDIUM | P1 |
| WhatsApp/Telegram buttons | MEDIUM | LOW | P2 |
| Animated statistics counters | LOW | LOW | P2 |
| Schema.org structured data | MEDIUM | LOW | P2 |
| Analytics integration | HIGH | LOW | P2 |
| Kazakh language | MEDIUM | HIGH | P3 |
| Patient testimonials | MEDIUM | MEDIUM | P3 |
| Document upload in form | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch — all 11 sections from the brief, plus mobile UX essentials
- P2: Should have, add within first weeks post-launch
- P3: Nice to have, future consideration after conversion data

## Competitor Feature Analysis

| Feature | secondopinions.com | Mass General Brigham | Stanford Second Opinion | Our Approach |
|---------|-------------------|---------------------|------------------------|--------------|
| Process explanation | Detailed multi-page | Step-by-step guide | FAQ + process page | Single-page "How it works" section — simpler, faster |
| Form complexity | Account creation + medical form + document upload | Portal registration required | Multi-step intake | Minimal 4-field form. Human follows up for details. Lower barrier. |
| Pricing transparency | Hidden until consultation | Insurance-dependent, unclear | Not prominently displayed | "от 450 EUR" upfront. Filters out non-serious leads, builds trust with serious ones. |
| Doctor selection | User browses directory | Assigned by team | Assigned by team | Team assigns best specialist. Link to directory for curious users. |
| Phone contact | Available but not prominent | Call center listed | Phone available | Phone is PRIMARY CTA alongside form. Recognizes 45+ preference. |
| Language | English only | English only | English only | Russian — serving underserved Kazakh market with no direct competitor in language. |
| Mobile experience | Adequate but desktop-first | Adequate | Adequate | Mobile-first by design. Touch targets, large text, sticky CTA. |

## UX Patterns Critical for 45+ Audience

These are not optional features but design principles that must permeate every feature above:

1. **Minimum 18px body text, 28px+ headings** — declining visual acuity is universal at 45+
2. **48x48px minimum touch targets** — reduced fine motor control; small buttons cause mis-taps and frustration
3. **High contrast ratios (WCAG AA minimum, aim for AAA)** — dark text (#18212C) on white/light backgrounds
4. **No hover-dependent interactions** — mobile-first means no hover states for critical information
5. **Visible phone number at all times** — this audience trusts voice contact over digital forms
6. **Confirmation feedback after form submission** — green checkmark + clear "Ваша заявка принята, мы перезвоним в течение 2 часов" message
7. **No autoplay media** — video/audio that plays unexpectedly disorients older users
8. **Linear page flow** — no tabs, no complex navigation. Scroll down, read sections in order, submit form. Simple.
9. **Familiar UI patterns** — standard accordion, standard buttons, standard form fields. Innovation in UI = confusion for this audience.
10. **Generous whitespace** — cluttered layouts increase cognitive load. Medical context demands calm, spacious design.

## Sources

- [Landingi: Healthcare Landing Page Best Practices](https://landingi.com/landing-page/healthcare-best-practices/)
- [FetchFunnel: Conversion Rate Optimization for Healthcare 2025](https://www.fetchfunnel.com/conversion-rate-optimization-for-healthcare/)
- [Sequence Health: High Conversion Landing Page for Medical Sites](https://www.sequencehealth.com/how-to-craft-a-high-conversion-landing-page-for-your-medical-practice)
- [eSEOspace: Designing for Elderly Patients](https://eseospace.com/blog/designing-for-elderly-patients/)
- [Adchitects: Interface Design for Older Adults](https://adchitects.co/blog/guide-to-interface-design-for-older-adults)
- [Toptal: UI Design for Older Adults](https://www.toptal.com/designers/ui/ui-design-for-older-adults)
- [W3C WAI: Developing Websites for Older People](https://www.w3.org/WAI/older-users/developing/)
- [NN/g: Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/)
- [Purrweb: Telemedicine Website Design](https://www.purrweb.com/blog/telehealth-website-design/)
- [Invoca: Landing Pages that Drive Click-to-Call](https://www.invoca.com/blog/7-awesome-examples-of-landing-pages-that-drive-click-to-call)
- [AB Tasty: Mobile Stick-to-Scroll CTA](https://www.abtasty.com/blog/mobile-stick-to-scroll/)
- [BOIA: Font Size and Web Accessibility](https://www.boia.org/blog/does-font-size-matter-for-web-accessibility)
- [Stanford Medicine: Second Opinion Service](https://www.stanfordchildrens.org/en/landing/second-opinion.html)
- [Mass General Brigham: Online Second Opinions](https://www.massgeneralbrigham.org/en/patient-care/virtual-care/online-second-opinions)

---
*Feature research for: MedicusUnion KZ medical consultation landing page*
*Researched: 2026-03-23*
