# Phase 8: Directus Backend & Integration - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up Directus 11 via Docker Compose with PostgreSQL 16. Create consultation_requests collection, configure public create-only permissions, set up CORS, and wire the landing page form to submit to the Directus REST API.

</domain>

<decisions>
## Implementation Decisions

### Docker Compose Setup (BACK-01)
- Directus 11 + PostgreSQL 16 via docker-compose.yml
- Single `docker compose up -d` to start everything
- Environment variables for admin credentials, DB connection, secrets
- Persistent volumes for DB data and Directus uploads

### Collection Schema (BACK-02)
- Collection: `consultation_requests`
- Fields: name (string), phone (string), specialty (string), description (text), created_at (timestamp, auto), status (string, default: "new")
- Schema defined via Directus snapshot or bootstrap script

### Public Permissions (BACK-03)
- Public role: create-only on consultation_requests
- GET, PATCH, DELETE return 403
- Only POST /items/consultation_requests allowed

### CORS Configuration (BACK-04)
- CORS_ORIGIN set to production domain (medicusunion.kz)
- Also allow localhost for development

### Form-to-API Wiring (BACK-05)
- Update js/main.js to POST form data to Directus API
- API_URL configurable (environment-based or hardcoded constant)
- Handle API errors gracefully (show generic error, don't expose details)

### Claude's Discretion
- Directus bootstrap approach (snapshot YAML vs manual setup instructions)
- Error handling UX for failed submissions
- Whether to add a .env.example file

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- js/main.js has initFormValidation with TODO comment for Phase 8
- Form collects: name, phone, specialty, description
- Success state already implemented

### Integration Points
- Replace console.log in initFormValidation submit handler with fetch() to Directus API
- Add API_URL constant at top of IIFE in main.js
- Create docker-compose.yml at project root
- Create .env.example with required variables

</code_context>

<specifics>
## Specific Ideas

- Keep docker-compose.yml simple and well-documented
- Use Directus REST API (not GraphQL) for simplicity
- Provide clear README instructions for backend setup
- Form submission should be resilient: show success even if API fails (with console error for debugging)

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>
