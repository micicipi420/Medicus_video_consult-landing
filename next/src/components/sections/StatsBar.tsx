const STATS = [
  { number: '43', label: 'клиники', color: 'text-mu-accent-blue' },
  { number: '11', label: 'стран', color: 'text-mu-accent-teal' },
  { number: '500+', label: 'врачей', color: 'text-mu-accent-orange' },
  { number: '15+', label: 'лет опыта', color: 'text-mu-green-600' },
] as const;

export function StatsBar() {
  return (
    <section className="relative py-12 z-20" aria-label="Ключевые цифры">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="relative group flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-glass-border shadow-glass hover:shadow-glass-lg hover:bg-white/70 hover:border-glass-border-strong transition-all duration-500 overflow-hidden"
            >
              <div className={`text-5xl md:text-6xl font-extrabold mb-3 drop-shadow-sm ${stat.color} relative z-10`}>
                {stat.number}
              </div>
              <div className="text-mu-text-700 font-bold text-lg text-center uppercase tracking-wider relative z-10">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
