const STATS = [
  { number: '43', label: 'клиники' },
  { number: '11', label: 'стран' },
  { number: '500+', label: 'врачей' },
  { number: '15+', label: 'лет опыта' },
] as const;

export function StatsBar() {
  return (
    <section className="bg-[#1A365D] py-8 lg:py-8" aria-label="Ключевые цифры">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <span className="font-heading text-[2.5rem] font-bold leading-none text-white tabular-nums">
              {stat.number}
            </span>
            <span className="font-body text-[1.125rem] text-white/85 block mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
