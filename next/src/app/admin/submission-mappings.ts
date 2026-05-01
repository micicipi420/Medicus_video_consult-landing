/**
 * Specialization & status display mappings for admin submissions view (Phase 97).
 *
 * History: pre-v3.1 admin form may have stored raw English keys
 * (consultation/treatment/checkup/not-sure). Current writes (per
 * `next/src/lib/db/actions.ts`) map to Russian strings BEFORE insert:
 *   consultation -> 'Онлайн-консультация'
 *   treatment    -> 'Лечение за рубежом'
 *   checkup      -> 'Чек-ап'
 *   not-sure     -> 'Пока не определился'
 *
 * The display layer must accept BOTH forms because legacy rows may exist.
 * The Russian form maps to itself (idempotent).
 */
export const SPECIALIZATION_LABELS: Record<string, string> = {
  consultation: 'Онлайн-консультация',
  treatment: 'Лечение за рубежом',
  checkup: 'Чек-ап',
  'not-sure': 'Пока не определился',
  // idempotent passthrough for already-mapped Russian strings:
  'Онлайн-консультация': 'Онлайн-консультация',
  'Лечение за рубежом': 'Лечение за рубежом',
  'Чек-ап': 'Чек-ап',
  'Пока не определился': 'Пока не определился',
};

export function labelForSpecialization(
  raw: string | null | undefined
): string {
  if (!raw) return '—';
  return SPECIALIZATION_LABELS[raw] ?? raw;
}

export const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  contacted: 'Связались',
  completed: 'Завершено',
};

/**
 * Truncate string to `max` characters, appending '…' if truncated.
 * Reserves 1 char for the ellipsis so total length is exactly `max`.
 * Returns '' for null/undefined input.
 */
export function truncate(
  text: string | null | undefined,
  max: number
): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}
