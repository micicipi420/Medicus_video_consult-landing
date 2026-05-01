# 97-01 SUMMARY — Admin auth gate

**Status:** Complete
**Wave:** 1
**Requirement:** ADM-01

## Auth pattern chosen

**Next.js middleware** (`next/src/middleware.ts`) — pattern A from PLAN.

Why: single chokepoint, sees both `?token=` query and `X-Admin-Token` header
natively, idiomatic Next 15. Pre-approved by orchestrator.

Note: file lives at `next/src/middleware.ts` (NOT `next/middleware.ts`) because
the project uses the `src/` directory layout. With `src/`, Next.js only looks
for middleware in `src/middleware.ts`.

## Runtime branching

`auth.ts` is fully runtime-agnostic. It uses only Web standard APIs:
- `TextEncoder` (available in both Node and Edge)
- A manual constant-time XOR loop on byte arrays

No conditional `process.versions.node` branch is needed. The same source runs
on Edge (middleware) and Node (any future Node-runtime caller).

## Matcher expression

```ts
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
```

Two entries — `/admin` matches the existing route exactly; `/admin/:path*`
matches any future sub-route (e.g., `/admin/submissions`, `/admin/api/...`).

## Token-handling rules

| Where | Behavior |
|-------|----------|
| `process.env.ADMIN_TOKEN` | Read INSIDE `checkAdminToken`, not at module load. Fresh per request. Fail-closed if unset/empty. |
| Logs | Token NEVER logged. No `console.log/error` of token, env, or comparison result anywhere in `auth.ts` or `middleware.ts`. |
| Response body | Generic redirect to `/`. No token echo, no diagnostic JSON. |
| Response headers | None reflect the supplied token. |
| Cookies | Not used. Token check happens fresh on every request. |

## Curl test results (port 3201, dev server)

| Test | Command | Expected | Actual |
|------|---------|----------|--------|
| No token | `curl -i http://localhost:3201/admin` | 307 -> / | **307 -> http://localhost:3201/** PASS |
| Query param (correct) | `curl -i 'http://localhost:3201/admin?token=test-token-32chars-min-yes-this-is-fine-for-test'` | 200 | **200** PASS |
| Header (correct) | `curl -i -H 'X-Admin-Token: test-token-32chars-min-yes-this-is-fine-for-test' http://localhost:3201/admin` | 200 | **200** PASS |
| Wrong token | `curl -i 'http://localhost:3201/admin?token=wrong'` | 307 -> / | **307 -> http://localhost:3201/** PASS |

All 4 patterns verified PASS.

## Test results — `auth.test.ts`

10 cases via `node --experimental-strip-types --test`:

```
✔ returns false when ADMIN_TOKEN env is unset
✔ returns false when ADMIN_TOKEN env is empty string
✔ returns false when supplied is null
✔ returns false when supplied is undefined
✔ returns false when supplied is empty
✔ returns true on exact match
✔ returns false on length mismatch (shorter)
✔ returns false on length mismatch (longer)
✔ returns false on same-length partial mismatch
✔ case sensitive
ℹ tests 10 / pass 10 / fail 0
```

## Threat register dispositions

| ID | Disposition | Evidence |
|----|------------|----------|
| T-97-01 (info disclosure — token echo) | mitigate | `middleware.ts` returns generic `NextResponse.redirect(new URL('/', req.url))`. No token in response headers/body. Verified by `curl -i` showing only Location: /. |
| T-97-02 (weak secret) | mitigate | `.env.example` documents `openssl rand -hex 32` and labels placeholder as `replace-with-strong-32-plus-char-secret`. |
| T-97-03 (referer leak) | accept | `?token=` documented as emergency-only; X-Admin-Token header is production preference. |
| T-97-04 (server-log leak) | accept | Operator-controlled Nginx logs; documented limitation. Future phase may rotate to httpOnly cookie. |
| T-97-05 (timing attack) | mitigate | `auth.ts` uses constant-time XOR on equal-length byte arrays AND a same-length dummy compare on length mismatch. Verified by source review. |
| T-97-06 (brute force) | accept | 32-byte random secret = 256-bit entropy (hex-encoded). Future phase may add Nginx rate limit on /admin. |
| T-97-07 (no audit log) | accept | Read-only view; no destructive operations. Future ADM phase if write paths added. |

## Operator runbook

### Set in production
```bash
# 1. Generate strong secret
openssl rand -hex 32
# 2. Set in environment (Docker compose / systemd / .env)
ADMIN_TOKEN=<generated-value>
# 3. Restart Next service so process.env updates
```

### Rotate
1. Generate new value with `openssl rand -hex 32`
2. Update `ADMIN_TOKEN` env var
3. Restart container/service
4. All previously-bookmarked URLs with old `?token=` are invalidated immediately
5. Update operator's bookmark / curl scripts

### Revoke (deny all admin access)
1. Unset `ADMIN_TOKEN` (delete the env var) OR set it to empty string
2. Restart service
3. Gate fails closed — every request to `/admin/*` redirects to `/`

## Known limitations carried forward

- **URL log leak** (T-97-04): self-hosted Nginx logs may capture full URI
  including `?token=`. Mitigated only by operator log discipline.
- **Browser history**: a browser visit with `?token=` writes the token to
  history. Document as one-shot use only; prefer header-based auth in scripts.
- **No audit trail** (T-97-07): no record of who accessed admin and when.
  Acceptable for v9.0.1 read-only view; revisit when write paths are added.

## Files

- `next/src/app/admin/auth.ts` — `checkAdminToken(supplied)` constant-time helper
- `next/src/app/admin/auth.test.ts` — 10 behavior tests via node:test
- `next/src/middleware.ts` — gate at `/admin`, `/admin/:path*`
- `next/.env.example` — documented `ADMIN_TOKEN` placeholder
- `next/.env.local` — local dev token + DATABASE_URL

## Build + lint

- `pnpm build` exit 0
- `pnpm lint` exit 0 (only pre-existing blob-engine warning, unrelated)
