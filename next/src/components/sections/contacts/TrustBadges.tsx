const BADGES = [
  'На\u00A0связи 24/7',
  'ISO\u00A027001',
  'Astana Hub Resident',
  '10\u00A0000+ пациентов',
] as const;

export function TrustBadges() {
  return (
    <div className="flex flex-wrap gap-3">
      {BADGES.map((text) => (
        <div
          key={text}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            width="16"
            height="16"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M3.5 8l3 3 6-6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
