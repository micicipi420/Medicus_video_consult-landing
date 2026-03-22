# Pitfalls Research

**Domain:** Medical consultation landing page (45+ audience, Kazakhstan, Directus backend)
**Researched:** 2026-03-23
**Confidence:** HIGH (well-documented domain with extensive healthcare UX research)

## Critical Pitfalls

### Pitfall 1: Directus Public Role Misconfiguration Exposes Admin API

**What goes wrong:**
Developers grant the Public role too many permissions to "make the form work quickly," inadvertently exposing read access to the entire submissions collection or other system tables. Attackers can then enumerate all submitted patient data (names, phone numbers, medical descriptions) via the REST API.

**Why it happens:**
Directus ships with all public permissions off by default. When the form submission does not work, the natural instinct is to open up permissions broadly. The admin UI makes it easy to toggle entire CRUD columns at once.

**How to avoid:**
- Create a dedicated "website" role with ONLY create permission on the `submissions` collection. Disable App access for this role.
- Generate a static access token for this role -- do NOT use the Public role.
- Add field-level validation rules in Directus to reject unexpected field values.
- Use Directus field presets to auto-set `status: "new"` and `created_at` server-side, so the client cannot spoof these.
- Test by attempting GET requests on the submissions endpoint with the website token -- they must return 403.

**Warning signs:**
- Form works but you never explicitly configured create-only permissions
- Using the Public role instead of a dedicated restricted role
- No field validation rules configured in Directus

**Phase to address:**
Phase 1 (Backend/Directus setup) -- permissions must be locked down before the form is connected.

---

### Pitfall 2: Tiny Touch Targets and Small Text Kill 45+ Mobile Conversion

**What goes wrong:**
The page looks polished on a developer's 27-inch monitor but is unusable on a 45+ user's phone. Buttons are too small to tap accurately, text is too small to read without zooming, and interactive elements are too close together, causing mis-taps. Conversion drops 40-60% vs. desktop.

**Why it happens:**
Developers are typically younger, have good vision, and test on large screens. The default browser font size (16px) is already borderline small for aging eyes. Standard button sizes (36-40px) are below the threshold needed for users with reduced motor precision.

**How to avoid:**
- Minimum body text: 18px, prefer 20px for body copy. Headlines 28-36px on mobile.
- Minimum touch target: 48x48px (WCAG 2.5.8), prefer 56px for primary CTAs.
- Minimum spacing between tappable elements: 12px.
- Line height: 1.6 minimum for body text (aging eyes need more leading).
- Test on actual budget Android phones (Samsung A-series), not iPhone 15 Pro -- Kazakhstan 45+ audience skews toward mid-range Android.
- Disable viewport zoom prevention (`maximum-scale=1` in meta tag) -- older users WILL pinch to zoom.

**Warning signs:**
- Body font-size below 18px in CSS
- `user-scalable=no` or `maximum-scale=1` in viewport meta tag
- Button height below 48px
- No testing on physical Android device

**Phase to address:**
Phase 1 (HTML/CSS foundation) -- baked into base styles from day one, not retrofitted.

---

### Pitfall 3: Phone Number Field Friction Destroys Form Completion

**What goes wrong:**
The phone field uses a generic text input without proper formatting guidance. Users in Kazakhstan type numbers in inconsistent formats (+7, 8, 7, with/without spaces). Validation rejects valid numbers, or the numeric keyboard does not appear on mobile, forcing users to switch keyboard layouts. For a 45+ audience unfamiliar with web forms, any friction here means abandonment.

**Why it happens:**
Phone number formatting varies by country and user habit. Kazakhstan uses +7 country code (shared with Russia), and users write numbers as `+7 701 532 24 78`, `87015322478`, `7 701 532 2478`, etc. Developers hardcode a single format mask without accounting for real input patterns.

**How to avoid:**
- Use `<input type="tel">` to trigger numeric keyboard on mobile.
- Pre-fill the `+7` prefix and make it non-editable (visually shown as label before the input).
- Accept input with or without spaces/dashes -- strip non-digits server-side.
- Validate only that the result is 11 digits starting with 7.
- Show a placeholder with the expected format: `701 532 24 78`.
- Show inline validation errors in Russian, in plain language: "Введите номер телефона из 10 цифр" (not "Invalid format").

**Warning signs:**
- Form uses `type="text"` instead of `type="tel"` for phone
- No placeholder showing expected format
- Validation error messages in English or using technical language
- No server-side normalization of phone formats

**Phase to address:**
Phase 2 (Form implementation) -- the form is the conversion point, phone is the most critical field.

---

### Pitfall 4: CORS Blocks Form Submission When Landing and Directus Are on Different Domains

**What goes wrong:**
The landing page is on `medicusunion.kz` and Directus is on `api.medicusunion.kz` or a different server entirely. The browser blocks the POST request with a CORS error. The form appears to silently fail -- no error visible to the user, no submission recorded. This is the number one Directus integration issue in community forums.

**Why it happens:**
Directus CORS is not configured by default for cross-origin requests. The preflight OPTIONS request fails because `Access-Control-Allow-Origin` is not set. Developers test with both on localhost where CORS does not apply, then it breaks in production.

**How to avoid:**
- Configure Directus `.env` before any integration testing:
  ```
  CORS_ENABLED=true
  CORS_ORIGIN=https://medicusunion.kz
  CORS_METHODS=GET,POST
  CORS_ALLOWED_HEADERS=Content-Type,Authorization
  ```
- Do NOT use `CORS_ORIGIN=*` -- it fails when credentials are included and is a security risk.
- Test the form submission from the actual production domain (or staging equivalent) before launch, not just localhost.
- Implement visible error handling in the form JS: if the POST fails, show a message with the phone number to call instead.

**Warning signs:**
- Form works on localhost but not from the deployed domain
- Browser console shows "Access-Control-Allow-Origin" errors
- Directus `.env` has no CORS variables or uses wildcard `*`

**Phase to address:**
Phase 1 (Directus setup) -- configure CORS as part of initial Directus deployment, test cross-origin before building the form.

---

### Pitfall 5: No Spam/Bot Protection on Directus Submission Endpoint

**What goes wrong:**
The form submission endpoint is a public REST API. Bots discover it and flood the submissions collection with thousands of spam entries. Directus database fills up, legitimate submissions are buried, and if email notifications are configured, the inbox becomes unusable.

**Why it happens:**
Directus rate limiting (default 50 req/sec) is designed for server protection, not spam prevention. A bot submitting 1 request every 2 seconds bypasses rate limits entirely while still generating 43,000 spam entries per day. There is no built-in CAPTCHA or honeypot in Directus.

**How to avoid:**
- Add a honeypot field: hidden CSS field (`<input name="website" style="display:none">`) -- if filled, reject server-side via Directus Flow or custom hook.
- Implement a time-based check: record when the page loaded (hidden timestamp field), reject submissions completed in under 3 seconds.
- Configure Directus rate limiting per-IP: `RATE_LIMITER_ENABLED=true`, `RATE_LIMITER_POINTS=5`, `RATE_LIMITER_DURATION=60` (5 submissions per minute per IP).
- Consider a simple math CAPTCHA in Russian ("Сколько будет 3 + 4?") -- more accessible for 45+ users than reCAPTCHA, which is often confusing for older adults.
- Do NOT rely on Google reCAPTCHA v2 (image puzzles) -- it has poor UX for older users and may be blocked/slow in Kazakhstan.

**Warning signs:**
- No honeypot field in the form
- Rate limiter disabled or at default high values
- No validation logic in Directus Flows for the submissions collection

**Phase to address:**
Phase 2 (Form implementation) -- implement alongside form, not as afterthought.

---

### Pitfall 6: Missing Trust Signals for Premium Medical Service (450 EUR)

**What goes wrong:**
The landing page asks users to request a 450+ EUR consultation but provides no evidence that the service is legitimate. Users in Kazakhstan are particularly cautious about online medical services, especially at premium pricing. Without concrete trust signals, the page looks like a scam -- conversion near zero.

**Why it happens:**
Developers focus on layout and functionality, treating trust as "nice to have content" rather than a conversion requirement. The team assumes the MedicusUnion brand is well-known, but a first-time visitor from a Google ad has zero context.

**How to avoid:**
- Show specific doctor credentials (not generic "European doctors") -- country flags, specialization, years of experience. Link to medicusunion.com/doctors for full profiles.
- Include real patient testimonials in Russian from Kazakhstan patients (with photos if possible, not stock).
- Display partner hospital logos and accreditation badges.
- Show the company's Austrian registration / legal entity details.
- Include the physical Kazakhstan contact: phone number (+7 701 532 24 78), email, and ideally a Kazakhstani legal entity or partner name.
- Price transparency: "от 450 EUR" is good -- also explain what is included (written opinion, video call duration, follow-up).
- Add a "Как это работает" section that demystifies the process step-by-step.

**Warning signs:**
- No testimonials or social proof on the page
- No legal entity / company registration visible
- Price stated without explanation of what is included
- No real doctor information or credentials shown

**Phase to address:**
Phase 1 (Content/sections) -- trust signals must be in the initial content structure, not added post-launch.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline CSS styles instead of proper stylesheet architecture | Faster to prototype | Unmaintainable, inconsistent responsive behavior | Never for production |
| Storing Directus admin token in frontend JS | Quick form integration | Anyone can extract the admin token and access all data | Never |
| Skipping form validation client-side, relying only on Directus | Less JS code | Poor UX -- user sees no feedback until server responds | Never for the phone/name fields |
| Single CSS breakpoint (mobile + desktop only) | Faster development | Tablets (common for 45+ users) get poor layout | Acceptable for MVP if tablet is rare in analytics |
| No loading/success state on form submission | Less JS to write | User clicks submit multiple times, creating duplicate entries | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Directus Items API | Using admin token in frontend code | Create a dedicated role with a static token that has ONLY create permission on submissions |
| Directus Items API | Not handling network errors in form JS | Show fallback message with phone number: "Ошибка отправки. Позвоните нам: +7 701 532 24 78" |
| Directus File Uploads | Allowing file uploads via the form without size/type limits | For v1, do NOT accept file uploads -- text-only form. Add document upload in v2 with strict limits |
| Directus Flows (email notification) | Not configuring an email transport, so admin never sees new submissions | Set up `EMAIL_TRANSPORT` in Directus .env and create a Flow that emails on new submission creation |
| CTA scroll-to-form | Using `element.scrollIntoView()` without smooth behavior | Use `scrollIntoView({ behavior: 'smooth' })` and test that the form is not hidden behind a fixed header |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized hero images | Page loads in 8+ seconds on Kazakhstan mobile (54 Mbps median, but 3-10 Mbps outside cities) | WebP format, max 200KB hero image, lazy-load below-fold images | Immediately for rural users |
| Web fonts loading blocking render | Flash of invisible text (FOIT) for 2-3 seconds on slow connections | `font-display: swap` in @font-face, subset Inter/Manrope to Cyrillic only | On any connection below 10 Mbps |
| Too many DOM sections loaded at once | Janky scrolling on budget Android phones | Simple HTML without heavy JS animations, use CSS transitions only | Budget phones with 2-3GB RAM |
| No caching headers on static assets | Every revisit re-downloads all assets | Set `Cache-Control: max-age=31536000` for hashed assets | On repeat visits |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing Directus admin panel on public URL without IP restriction | Attackers brute-force admin login | Restrict admin panel access by IP or put behind VPN; use a non-obvious URL path |
| No HTTPS on landing page | Browser shows "Not Secure" warning, destroying trust for medical service | SSL certificate mandatory from day one, redirect HTTP to HTTPS |
| Storing medical case descriptions without encryption | Data breach exposes sensitive health information | Encrypt the "описание случая" field at rest; review Kazakhstan data protection law (Personal Data Law No. 94-V) |
| Directus default SECRET_KEY | Session tokens are predictable | Generate a strong random SECRET/KEY in Directus .env before first deployment |
| No Content Security Policy headers | XSS attacks possible | Add CSP headers that restrict script sources to self only (vanilla JS, no CDN dependencies) |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Aggressive popup or sticky banner CTAs | Feels like a scam, especially for medical service. 45+ users panic-close popups | Calm, visible CTA buttons within the page flow. No popups, no countdown timers |
| Dropdown for specialization with 20+ options | Overwhelming for older users, hard to scroll on mobile | Limit to 6-8 top specializations + "Другое" (Other) option |
| Form asks for email (not in the spec, but tempting to add) | Extra friction, many 45+ users in KZ do not use email regularly | Stick to name + phone + specialization + optional description. Phone is king in KZ |
| FAQ section with tiny click targets | Accordion headers too small to tap, users cannot expand answers | FAQ headers: full-width tappable area, minimum 56px height, clear expand/collapse indicator |
| "Политика конфиденциальности" link required but missing | Legally required for collecting personal data in Kazakhstan, erodes trust | Add privacy policy link near the form, even a simple one-page document |

## "Looks Done But Isn't" Checklist

- [ ] **Form submission:** Has visible success state ("Ваша заявка принята! Мы перезвоним в течение 2 часов") -- not just a console.log
- [ ] **Form error state:** Has visible error handling with fallback phone number
- [ ] **Form duplicate prevention:** Submit button disables after click, preventing double submissions
- [ ] **Directus CORS:** Tested from production domain, not just localhost
- [ ] **Directus permissions:** GET request on submissions endpoint returns 403 with website token
- [ ] **Mobile viewport:** `user-scalable=yes` is set (or not restricted), allowing pinch-to-zoom
- [ ] **Phone link:** Phone number in footer/header is wrapped in `<a href="tel:+77015322478">` for one-tap calling
- [ ] **SSL certificate:** HTTPS active and HTTP redirects to HTTPS
- [ ] **Privacy policy:** Link present near the form (required by Kazakhstan law)
- [ ] **Favicons/meta:** OG tags and favicon set -- missing favicon shows "broken" icon in browser tab, looks unprofessional for medical service
- [ ] **404 page:** Custom 404 instead of server default -- users who mistype URL should not see a raw error
- [ ] **Analytics:** Yandex.Metrica or similar installed (Google Analytics works but Yandex is more common in KZ) with form submission as a goal

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Directus admin token exposed in frontend | HIGH | Immediately rotate all tokens, audit submissions for malicious data, create proper restricted role |
| Spam flood in submissions | MEDIUM | Add honeypot + rate limiting, bulk-delete spam via Directus admin, add IP blocklist |
| Poor mobile UX discovered post-launch | MEDIUM | Audit all font sizes and touch targets, apply global CSS fixes (usually 2-4 hours of work) |
| CORS blocking form in production | LOW | Add CORS env vars to Directus, restart -- 5-minute fix once diagnosed |
| Missing trust signals, low conversion | MEDIUM | Add testimonials, credentials, price breakdown -- requires content from client, 1-2 day turnaround |
| No email notification for new submissions | LOW | Create Directus Flow with email trigger -- 30-minute setup |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Directus permissions exposure | Phase 1: Backend setup | Attempt unauthenticated GET on submissions -- must return 403 |
| Small touch targets / text | Phase 1: HTML/CSS foundation | Audit with Chrome DevTools device mode on Galaxy A14, all targets >= 48px |
| Phone number friction | Phase 2: Form implementation | Test form with 5 different phone formats, all should submit successfully |
| CORS blocking | Phase 1: Directus deployment | Submit form from staging domain, verify 200 response |
| Spam/bot submissions | Phase 2: Form implementation | Submit form with honeypot filled -- must be rejected |
| Missing trust signals | Phase 1: Content sections | Page contains testimonials, credentials, price explanation, legal entity |
| Unoptimized images | Phase 1: Asset preparation | Lighthouse performance score >= 90 on mobile throttled connection |
| No form feedback states | Phase 2: Form JS | Click submit -- see loading state, then success message or error with phone fallback |
| Missing privacy policy | Phase 2: Legal/compliance | Privacy policy page exists and is linked from the form |
| No SSL | Phase 1: Deployment | `https://medicusunion.kz` loads without certificate warnings |

## Sources

- [Healthcare Landing Page Best Practices - Landingi](https://landingi.com/landing-page/healthcare-best-practices/)
- [Usability for Older Adults - Nielsen Norman Group](https://www.nngroup.com/articles/usability-for-senior-citizens/)
- [Design Considerations for Mobile Health Apps Targeting Older Adults - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8837196/)
- [Directus Access Control Documentation](https://directus.io/docs/guides/auth/access-control)
- [Directus Security Limits Documentation](https://directus.io/docs/configuration/security-limits)
- [Directus CORS Issues - GitHub #20577](https://github.com/directus/directus/issues/20577)
- [Directus Self-Hosting Requirements](https://directus.io/docs/self-hosting/requirements)
- [Healthcare Website Conversion Checklist - Navazon](https://www.navazondigital.com/healthcare-website-conversion-checklist-increase-leads/)
- [Healthcare Trust and Conversion - Crucible](https://crucible.io/insights/news/healthcare-how-to-build-trust-and-maximise-website-conversion-rate/)
- [3 Form Fields That Kill Conversion - HubSpot](https://blog.hubspot.com/blog/tabid/6307/bid/6748/3-form-fields-that-kill-landing-page-conversion-rates.aspx)
- [Kazakhstan Internet Speed Statistics - SpeedGEO](https://www.speedgeo.net/statistics/kazakhstan)
- [Optimizing Mobile App Design for Older Adults - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12350549/)

---
*Pitfalls research for: MedicusUnion KZ medical consultation landing page*
*Researched: 2026-03-23*
