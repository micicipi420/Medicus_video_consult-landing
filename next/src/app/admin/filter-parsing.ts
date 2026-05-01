/**
 * Pure URL-param parser for admin filter — extracted from filter-params.ts
 * so it can be tested without loading Drizzle / DB schema (which require Next's
 * webpack alias resolution that node:test doesn't have).
 *
 * Whitelisted filter values must match what is stored:
 * - spec: Russian strings (per actions.ts WRITE-time mapping)
 * - status: 3 English values (per submission-mappings STATUS_LABELS)
 *
 * Threat T-97-12: unknown values are silently dropped (filter not applied).
 */

export const ALLOWED_SPEC = new Set([
  'Онлайн-консультация',
  'Лечение за рубежом',
  'Чек-ап',
  'Пока не определился',
]);

export const ALLOWED_STATUS = new Set(['new', 'contacted', 'completed']);

export interface FilterParams {
  from: Date | null;
  to: Date | null;
  spec: string | null;
  status: string | null;
  page: number;
}

function parseDate(
  raw: string | undefined,
  endOfDay = false
): Date | null {
  if (!raw) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const d = new Date(
    raw + (endOfDay ? 'T23:59:59.999Z' : 'T00:00:00.000Z')
  );
  return Number.isNaN(d.getTime()) ? null : d;
}

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return n;
}

export function parseFilterParams(
  sp: Record<string, string | string[] | undefined>
): FilterParams {
  const get = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v) as string | undefined;
  };
  const spec = get('spec');
  const status = get('status');
  return {
    from: parseDate(get('from')),
    to: parseDate(get('to'), true),
    spec: spec && ALLOWED_SPEC.has(spec) ? spec : null,
    status: status && ALLOWED_STATUS.has(status) ? status : null,
    page: parsePage(get('page')),
  };
}

export function isAnyFilterActive(f: FilterParams): boolean {
  return (
    f.from !== null || f.to !== null || f.spec !== null || f.status !== null
  );
}
