# Phase 67: Docker Deployment - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase)

<domain>
## Phase Boundary

The complete Next.js application deploys via docker compose up with PostgreSQL, producing a production-ready self-hosted setup.

Requirements: DOCK-01, DOCK-02

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
- Multi-stage Dockerfile with node:20-slim base
- Next.js standalone output mode (already configured)
- Docker Compose with Next.js + PostgreSQL services
- Environment variables for DB connection
- Health checks on both services
- Correct copying of public/ and .next/static/
</decisions>

<code_context>
## Existing Code Insights
- docker-compose.yml exists for Directus — replace with Next.js version
- .env.example exists with DB credentials pattern
- next.config.ts already has output: 'standalone'
</code_context>

<specifics>
No specific requirements beyond success criteria.
</specifics>

<deferred>
None.
</deferred>
