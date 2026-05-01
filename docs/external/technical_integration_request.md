# Technical Integration Request: Find Me a Doctor Form

**From:** MedicusUnion KZ (TOO "Medicus Union KZ")
**To:** MedicusUnion GmbH, Technical Team (Vienna HQ)
**Date:** 2026-04-13
**Subject:** Integration of the "Find Me a Doctor" patient request form into medicusunion.kz

---

## 1. Executive Summary

The KZ office requests technical capabilities to integrate the patient treatment request form ("Find Me a Doctor") into the medicusunion.kz website. The goal is to:

- **Reduce the customer journey** from KZ-targeted advertising to form submission
- **Improve conversion rates** by keeping users on the local .kz domain
- **Enable lead attribution** for the KZ office (source tracking, analytics)
- **Maintain full compatibility** with the existing HQ backend and patient management workflow

This document details our findings from a technical analysis of the current form at `medicusunion.com/ru/services/find-me-doctor` and proposes integration options.

---

## 2. Current Architecture (Discovered)

### 2.1 Frontend Framework

| Parameter | Value |
|-----------|-------|
| Framework | **Next.js** (React SSR/SSG) |
| Build ID | `NI46lMopquPItmKzvAO9I` |
| Powered By | `Next.js` (response header) |
| State Management | **Apollo Client** (GraphQL) |
| Styling | styled-components (CSS-in-JS) |
| i18n | next-i18next (locales: `en`, `ru`, `de`) |
| Error Tracking | Sentry (`sentry.javascript.nextjs/9.47.1`) |
| Analytics | Google Analytics (G-BMVSSH9TN8), GTM (GTM-5W3WLVF), Facebook Pixel, Matomo, HubSpot |
| Live Chat | Intercom |
| Deep Links | Branch.io (mobile app) |
| reCAPTCHA | Google reCAPTCHA v3 (key: `6LeVofkpAAAAAMV5hRHly3TiUa2XE9YIvlvJBNd6`) |

### 2.2 API Infrastructure

| Service | URL | Purpose |
|---------|-----|---------|
| REST API | `https://api.medicusunion.com` | Authentication, file uploads, OTP verification |
| GraphQL API | `https://gql.medicusunion.com` | Main data operations (queries, mutations) |
| Doctor Portal | `https://doctor.medicusunion.com` | Doctor-facing application |
| Meeting/Diagnostics | `https://meeting.medicusunion.com/diagnostics` | Video consultation infrastructure |
| Staging (GraphQL) | `https://gql.medicusunion.me` | Staging environment |
| Staging (Doctor) | `https://stg-doctor.medicusunion.me` | Staging doctor portal |

**Next.js API Routes** (BFF layer on `www.medicusunion.com`):

| Route | Purpose |
|-------|---------|
| `/api/auth/google` | Google OAuth redirect |
| `/api/auth/apple` | Apple OAuth redirect |
| `/api/ipwhois` | GeoIP detection (country auto-select) |
| `/api/track` | Event tracking proxy |
| `/api/hubspot` | HubSpot integration proxy |
| `/api/image-proxy` | Image proxy |

### 2.3 Authentication Mechanism

**Type:** JWT-based with refresh tokens

**Flow:**
1. User submits email + password + reCAPTCHA token
2. `POST /auth/sign-in` to `api.medicusunion.com` with body: `{ email, password, role: "patient", recaptchaToken }`
3. Response returns: `{ token, refreshToken, tmpToken }`
4. Tokens stored in cookies: `token`, `refreshToken`, `tempToken`, `tempRefreshToken`
5. Alternative auth: Google OAuth, Apple OAuth (via `/api/auth/{provider}`)

**Registration:**
1. `POST /auth/sign-up` to `api.medicusunion.com` with body: `{ ...formData, recaptchaToken }` (with `withCredentials: true`)
2. Email verification via `POST /auth/resend-email` and `POST auth/verify/email/resend`

**Token Refresh:** Automatic via Apollo Link error handler on 401 responses.

### 2.4 Form Structure (3 Steps)

#### Step 1: Authentication (Login or Register)

**Login Form:**

| Field | Type | Name | Required | Validation |
|-------|------|------|----------|------------|
| Email | text | `email` | Yes | Email format |
| Password | password | - | Yes | Min length |

+ reCAPTCHA v3 token generated on submit

**Registration Form:** Triggered via "Зарегистрироваться" link. Uses `POST /auth/sign-up`.

#### Step 2: Describe Health Complaints

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Health description | textarea | Yes | Placeholder: "Введите здесь..." |
| Medical files | file upload | No | Drag & drop or manual select |

**File upload details:**
- **Endpoint:** `POST /aws-s3` on `api.medicusunion.com`
- **Format:** `multipart/form-data` (FormData with `file` field)
- **Auth:** `Authorization: Bearer {token}`
- **Supported formats:** JPEG, PNG, PDF
- **Max size:** 1000 MB
- **Mechanism:** Direct upload to AWS S3 via backend proxy (not presigned URLs)
- **Abort support:** Yes (AbortController per file UID)

#### Step 3: Personal Details + Submit

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| First name | text | Yes | Pre-filled from user profile if exists |
| Last name | text | Yes | Pre-filled from user profile if exists |
| Phone number | tel | Yes | With country selector (PhoneInput component) |

**Submit button:** "Отправить запрос"

**On submit:**
1. Fires analytics events: `videoconsultation_phone`, `videoconsultation_birthday`, `videoconsultation_gender`
2. If phone not verified: triggers phone verification flow (Step 3.5)
3. Calls GraphQL mutation (likely `CreateAppointment` or similar via `Me` query check)
4. Clears `localStorage.findMeDoctor`

### 2.5 Phone/SMS Verification

**Flow:**
1. After form submit, if `user.phoneVerify === false`:
   - `verifyPhone(phone)` is called (via context provider `Bt()`)
   - Phone stored in cookie `userPhone`
   - UI switches to OTP code input (6-digit code, numeric only)
2. **OTP Verification:** `POST /auth/otp/verify` to `api.medicusunion.com` with `{ otp, token }`
3. **Resend:** Available with 60-second cooldown
4. On success: user profile updated, form submission completes

### 2.6 GraphQL Operations (Discovered)

**Queries:**
- `Me` — current user profile
- `Appointments` — list appointments
- `AppointmentById` — single appointment
- `Doctors` / `DoctorBySlug` — doctor data
- `GetServiceBySlugDoctors` — service-specific doctors
- `NearestAppointment` — next available slot
- `GetFastAppointments` — express consultations
- `Languages` — available languages
- `TranslatorPlanByLanguage` — translator pricing

**Mutations:**
- `CreateAppointment` — create consultation request
- `CreateSession` — create AI/chat session
- `OpenRoom` — open video room
- `CreateReview` — submit doctor review
- `PayAppointment` — process payment
- `UpdatePatient` — update patient profile
- `SendContactUsEmail` — contact form
- `CreateSource` — create lead source

### 2.7 Payments

- **Provider:** Stripe
- **Live Key:** `pk_live_51I9WpyKysaOezCoph3rcbgrSzBbGeAUCXghMbPFBwmTlg5c6a02jhYr0Gh8Ho4SwZpkk50dtxz3yQLBNsX41iPbS00ES2LkaAx`
- Subscription and one-time payment flows exist

---

## 3. Response Headers Analysis

| Header | Value | Implication |
|--------|-------|-------------|
| `X-Frame-Options` | **DENY** | **Iframe embedding is impossible** |
| `Content-Security-Policy` | Not set | No CSP restrictions (but X-Frame-Options takes precedence) |
| `X-Content-Type-Options` | `nosniff` | Standard security header |
| `Strict-Transport-Security` | `max-age=15724800; includeSubDomains` | HTTPS enforced |
| `Cache-Control` | `private, no-cache, no-store` | Dynamic content, no caching |
| `X-Powered-By` | `Next.js` | Framework confirmation |

**CORS Status:** API endpoints (`api.medicusunion.com`, `gql.medicusunion.com`) block cross-origin requests from domains other than `medicusunion.com`. GraphQL introspection also blocked.

---

## 4. Integration Options (Simple to Complex)

### Option A: API Integration (Recommended)

**Description:** Build a custom form on `medicusunion.kz` that directly calls the MedicusUnion REST and GraphQL APIs.

**What KZ office builds:**
- Custom HTML/CSS/JS form matching the .kz site design
- Three-step wizard: Auth > Description + Files > Personal Data + Phone Verify
- Direct API calls to `api.medicusunion.com` and `gql.medicusunion.com`

**What HQ needs to provide:**
1. Add `medicusunion.kz` to CORS allowed origins on both `api.medicusunion.com` and `gql.medicusunion.com`
2. API documentation (or dedicated API key for the KZ office)
3. reCAPTCHA domain whitelist update (add `medicusunion.kz`)
4. GraphQL schema documentation (or enable introspection for KZ IP range)
5. Webhook/callback for appointment status changes

**Estimated HQ effort:** 4-8 hours (CORS config + docs + testing)

**Pros:**
- Full control over UX and design on .kz
- Best conversion optimization potential
- Clean lead attribution via `CreateSource` mutation
- No dependency on HQ frontend releases

**Cons:**
- KZ office must maintain form logic
- Must stay in sync with API changes

---

### Option B: Reverse Proxy via Nginx

**Description:** Nginx on the .kz server proxies requests to .com APIs, making them appear same-origin.

**Configuration concept:**
```nginx
# On medicusunion.kz nginx
location /api/ {
    proxy_pass https://api.medicusunion.com/;
    proxy_set_header Host api.medicusunion.com;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-KZ-Source "medicusunion.kz";
}

location /gql/ {
    proxy_pass https://gql.medicusunion.com/;
    proxy_set_header Host gql.medicusunion.com;
    proxy_set_header X-KZ-Source "medicusunion.kz";
}
```

**What HQ needs to provide:**
1. Whitelist the .kz server IP in API rate limiting / firewall rules
2. Accept the `X-KZ-Source` header for lead attribution
3. Documentation of API endpoints

**Estimated HQ effort:** 2-4 hours

**Pros:**
- Bypasses CORS restrictions entirely
- Form code can be simpler (same-origin requests)

**Cons:**
- Adds latency (KZ proxy > AT/EU API)
- KZ server becomes a single point of failure
- SSL certificate management for upstream connections
- Must handle token/cookie domain issues

---

### Option C: Iframe Embedding

**Status: NOT POSSIBLE**

The `X-Frame-Options: DENY` header on `medicusunion.com` explicitly prevents iframe embedding. This would require HQ to:
- Remove or change `X-Frame-Options` to `ALLOW-FROM https://medicusunion.kz`
- Or use `Content-Security-Policy: frame-ancestors https://medicusunion.kz`

**Not recommended** due to:
- Security implications of changing frame policy
- Poor UX (iframe scrolling, responsiveness)
- Cookie/auth issues in cross-origin iframes (3rd party cookie restrictions)

---

### Option D: Redirect with Pre-fill

**Description:** Collect initial data on .kz, then redirect to .com with query parameters.

**Current support:** The form does NOT accept GET parameters for pre-filling. The form state is managed entirely in React component state and localStorage (`findMeDoctor` key).

**What HQ needs to provide:**
1. Add query parameter support to the form page (e.g., `?source=kz&phone=...&name=...`)
2. Add UTM/source tracking parameter support

**Estimated HQ effort:** 8-16 hours (frontend changes + testing)

**Pros:**
- Simplest for KZ office
- No ongoing maintenance

**Cons:**
- User leaves .kz domain (breaks brand continuity)
- Limited pre-fill capabilities
- Depends on HQ development timeline
- PII in URL parameters (privacy concern)

---

## 5. Request to HQ (Checklist)

### Priority 1 (Required for any integration option):

- [ ] **API Documentation:** Full REST and GraphQL endpoint documentation, including:
  - Auth endpoints (`/auth/sign-in`, `/auth/sign-up`, `/auth/otp/verify`)
  - File upload endpoint (`/aws-s3`)
  - GraphQL schema (queries and mutations for appointment creation flow)
  - Error response formats and codes
- [ ] **CORS Configuration:** Add `https://medicusunion.kz` and `https://www.medicusunion.kz` to allowed origins on:
  - `api.medicusunion.com`
  - `gql.medicusunion.com`
- [ ] **reCAPTCHA:** Add `medicusunion.kz` to the allowed domains list for reCAPTCHA site key `6LeVofkpAAAAAMV5hRHly3TiUa2XE9YIvlvJBNd6`
- [ ] **Lead Attribution:** Mechanism to tag submissions originating from .kz (e.g., `source` field in `CreateAppointment` mutation, or dedicated `CreateSource` call)

### Priority 2 (Recommended):

- [ ] **API Key / Service Account:** Dedicated credentials for KZ office integration (separate from end-user auth)
- [ ] **Webhook / Callback:** Notification when appointment status changes (new > contacted > completed), so KZ office can track its leads
- [ ] **Staging Access:** Access to staging environment (`gql.medicusunion.me`) for development and testing
- [ ] **GraphQL Introspection:** Enable for KZ office IP range or provide exported schema (SDL)

### Priority 3 (Nice to have):

- [ ] **SMS Gateway Configuration:** Confirm SMS provider supports KZ phone numbers (+7 7xx) for OTP verification
- [ ] **Rate Limits Documentation:** Request limits per API key / IP to prevent accidental blocking
- [ ] **Changelog / Breaking Changes:** Notification process for API changes that could affect the integration
- [ ] **Stripe Integration:** If payments are needed on .kz, whether the same Stripe account can be used or a separate KZ entity is needed

---

## 6. Appendix: Raw Data

### 6.1 Discovered API Endpoints

**REST API (`api.medicusunion.com`):**

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/sign-in` | User login (email + password + recaptchaToken) |
| POST | `/auth/sign-up` | User registration |
| POST | `/auth/otp/verify` | SMS OTP verification |
| POST | `/auth/resend-email` | Resend email verification |
| POST | `auth/verify/email/resend` | Resend email verification (alt) |
| POST | `/aws-s3` | File upload (multipart/form-data) |

**GraphQL API (`gql.medicusunion.com`):**

| Type | Operation | Purpose |
|------|-----------|---------|
| Query | `Me` | Get current user profile |
| Query | `Appointments` | List user appointments |
| Query | `AppointmentById(id)` | Get single appointment |
| Query | `NearestAppointment` | Next available slot |
| Query | `Doctors` | List doctors |
| Query | `DoctorBySlug(slug)` | Get doctor by URL slug |
| Query | `GetServiceBySlugDoctors` | Doctors for a specific service |
| Query | `Languages` | Available languages |
| Query | `TranslatorPlanByLanguage` | Translator pricing |
| Query | `GetFastAppointments` | Express consultations list |
| Query | `GetSource` | Lead source info |
| Mutation | `CreateAppointment` | Create a consultation request |
| Mutation | `OpenRoom` | Open video consultation room |
| Mutation | `PayAppointment` | Process payment |
| Mutation | `UpdatePatient` | Update patient profile |
| Mutation | `CreateSession` | Create chat/AI session |
| Mutation | `CreateSource` | Register lead source |
| Mutation | `SendContactUsEmail` | Contact form submission |
| Mutation | `CreateReview` | Submit doctor review |

### 6.2 Authentication Token Flow

```
1. Login/Register
   POST api.medicusunion.com/auth/sign-in
   Body: { email, password, role: "patient", recaptchaToken }
   Response: { token, refreshToken, tmpToken }

2. Store in cookies
   Cookie: token = {JWT access token}
   Cookie: refreshToken = {refresh token}

3. API calls
   Header: Authorization: Bearer {token}

4. Token refresh (on 401)
   Automatic via Apollo Link error handler
   Uses refreshToken to obtain new token

5. Phone verification (after registration or form submit)
   verifyPhone(phone) -> sends SMS
   POST api.medicusunion.com/auth/otp/verify { otp, token }
```

### 6.3 File Upload Flow

```
POST api.medicusunion.com/aws-s3
Content-Type: multipart/form-data
Authorization: Bearer {token}

FormData:
  - file: {binary file data}

Supported: JPEG, PNG, PDF
Max size: 1000 MB
Response: file metadata (URL, ID)
```

### 6.4 Form Submission Sequence

```
Step 1: Auth
  -> POST /auth/sign-in OR /auth/sign-up
  -> Receive JWT tokens
  -> Store in cookies

Step 2: Describe complaint
  -> User enters health description (textarea)
  -> User uploads files (optional)
  -> POST /aws-s3 for each file
  -> Click "Далее" (Next)

Step 3: Personal data
  -> User enters first_name, last_name, phone
  -> Click "Отправить запрос" (Submit Request)
  -> GraphQL: query Me {} (check profile)
  -> If phone not verified:
      -> verifyPhone(phone) -> SMS sent
      -> User enters 6-digit OTP
      -> POST /auth/otp/verify { otp, token }
  -> GraphQL: mutation CreateAppointment / related mutation
  -> Analytics events fired
  -> localStorage.findMeDoctor cleared
  -> Success state displayed
```

### 6.5 Response Headers (Target Page)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=15724800; includeSubDomains
X-Powered-By: Next.js
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
```

### 6.6 robots.txt

```
User-agent: *
Disallow: /cgi-bin/
Disallow: /account
Disallow: /appointments
Disallow: /payment
Disallow: /subscription/
Disallow: /email-verify
Disallow: /team
Disallow: /ai-health
Disallow: /health
Disallow: /maintenance
Disallow: /mobile-app-pro
Disallow: /mobile-app
Disallow: /doctors/*/appointment
Allow: /doctors/*/profile
Sitemap: https://medicusunion.com/sitemap.xml
```

### 6.7 Third-Party Services

| Service | Purpose | Identifier |
|---------|---------|------------|
| Google Analytics | Web analytics | G-BMVSSH9TN8 |
| Google Tag Manager | Tag management | GTM-5W3WLVF |
| Facebook Pixel | Ad tracking | 537305362544393 |
| Matomo | Privacy-first analytics | medicusunionatu.matomo.cloud |
| HubSpot | CRM/Marketing | Account 147024999 |
| Intercom | Live chat | api-iam.intercom.io |
| Sentry | Error tracking | o4509134346518528.ingest.de.sentry.io |
| Branch.io | Mobile deep links | cdn.branch.io |
| Stripe | Payments | pk_live_51I9WpyKysaOezCoph3rc... |
| Google reCAPTCHA v3 | Bot protection | 6LeVofkpAAAAAMV5hRHly3TiUa2XE9YIvlvJBNd6 |

### 6.8 Public API Documentation

**Status: Not found.**

Checked and received no accessible response:
- `api.medicusunion.com/swagger` — CORS blocked
- `api.medicusunion.com/docs` — CORS blocked
- `api.medicusunion.com/api-docs` — CORS blocked
- `gql.medicusunion.com` (GraphQL Playground) — CORS blocked
- GraphQL introspection query — CORS blocked

### 6.9 Screenshots

Screenshots of the form steps are saved in the `screenshots/` directory:
- `step1_initial_page.png` — Login form (Step 1)
- `step1_full_page.png` — Full page view showing all 3 steps
