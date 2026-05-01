import { and, gte, lte, eq } from 'drizzle-orm';

import { submissions } from '@/lib/db/schema';

import {
  parseFilterParams,
  isAnyFilterActive,
  ALLOWED_SPEC,
  ALLOWED_STATUS,
} from './filter-parsing';
import type { FilterParams } from './filter-parsing';

export type { FilterParams };
export { parseFilterParams, isAnyFilterActive, ALLOWED_SPEC, ALLOWED_STATUS };

/**
 * Build a Drizzle WHERE expression from parsed filters.
 * Returns undefined when no filter is active (caller passes through to query).
 */
export function buildWhere(f: FilterParams) {
  const conds = [];
  if (f.from) conds.push(gte(submissions.dateCreated, f.from));
  if (f.to) conds.push(lte(submissions.dateCreated, f.to));
  if (f.spec) conds.push(eq(submissions.specialization, f.spec));
  if (f.status) conds.push(eq(submissions.status, f.status));
  if (conds.length === 0) return undefined;
  if (conds.length === 1) return conds[0];
  return and(...conds);
}
