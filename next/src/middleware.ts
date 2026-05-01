import { NextRequest, NextResponse } from 'next/server';

import { checkAdminToken } from '@/app/admin/auth';

export const config = {
  // Match /admin AND /admin/* — the existing route lives at /admin (page.tsx)
  // and any future sub-routes will live under /admin/*.
  matcher: ['/admin', '/admin/:path*'],
};

/**
 * Phase 97 ADM-01 — env-token gate for /admin/*.
 *
 * Accepts EITHER ?token= query param OR X-Admin-Token header. On failure,
 * issues a generic redirect to "/" — no token echo, no diagnostic body.
 *
 * Token comparison delegates to checkAdminToken (constant-time on Node and
 * Edge). Middleware runs on Edge runtime by default; auth.ts uses
 * runtime-agnostic Web APIs (TextEncoder + manual XOR), so it works in both.
 */
export function middleware(req: NextRequest) {
  const fromHeader = req.headers.get('x-admin-token');
  const fromQuery = req.nextUrl.searchParams.get('token');
  const supplied = fromHeader ?? fromQuery;

  if (!checkAdminToken(supplied)) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}
