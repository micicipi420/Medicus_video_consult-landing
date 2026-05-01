import type { FilterParams } from './filter-parsing';

interface FiltersProps {
  current: FilterParams;
  /** When token arrived via ?token=, persist it on form round-trip via hidden input. */
  tokenInUrl?: string | undefined;
}

const SPEC_OPTIONS = [
  { value: '', label: 'Все направления' },
  { value: 'Онлайн-консультация', label: 'Онлайн-консультация' },
  { value: 'Лечение за рубежом', label: 'Лечение за рубежом' },
  { value: 'Чек-ап', label: 'Чек-ап' },
  { value: 'Пока не определился', label: 'Пока не определился' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'new', label: 'Новая' },
  { value: 'contacted', label: 'Связались' },
  { value: 'completed', label: 'Завершено' },
];

function toDateInput(d: Date | null): string {
  if (!d) return '';
  return d.toISOString().slice(0, 10);
}

/**
 * Filter form — server component using native <form method="get">.
 * Submitting issues a GET to /admin with named inputs as query params; RSC
 * re-renders with new filter applied. No client JS required.
 *
 * Token handling: when caller passes `tokenInUrl`, we render a hidden input
 * so the form round-trip preserves the URL-based auth. Header-based auth
 * doesn't need URL persistence.
 */
export function Filters({ current, tokenInUrl }: FiltersProps) {
  const resetHref = tokenInUrl
    ? `/admin?token=${encodeURIComponent(tokenInUrl)}`
    : '/admin';

  return (
    <form
      action="/admin"
      method="get"
      className="mb-6 flex flex-wrap items-end gap-4"
    >
      {tokenInUrl ? (
        <input type="hidden" name="token" value={tokenInUrl} />
      ) : null}

      <div>
        <label
          htmlFor="from"
          className="mb-1 block text-xs font-medium text-muted-foreground"
        >
          С
        </label>
        <input
          id="from"
          name="from"
          type="date"
          defaultValue={toDateInput(current.from)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="to"
          className="mb-1 block text-xs font-medium text-muted-foreground"
        >
          По
        </label>
        <input
          id="to"
          name="to"
          type="date"
          defaultValue={toDateInput(current.to)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="spec"
          className="mb-1 block text-xs font-medium text-muted-foreground"
        >
          Направление
        </label>
        <select
          id="spec"
          name="spec"
          defaultValue={current.spec ?? ''}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {SPEC_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-1 block text-xs font-medium text-muted-foreground"
        >
          Статус
        </label>
        <select
          id="status"
          name="status"
          defaultValue={current.status ?? ''}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="h-9 rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-90"
      >
        Применить
      </button>

      <a
        href={resetHref}
        className="h-9 self-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Сбросить
      </a>
    </form>
  );
}
