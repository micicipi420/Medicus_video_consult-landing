import { Building2, Globe, Stethoscope, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Stat = {
  number: string;
  label: string;
  Icon: LucideIcon;
  iconBg: string;
  iconText: string;
};

const STATS: readonly Stat[] = [
  {
    number: '43',
    label: 'клиники',
    Icon: Building2,
    iconBg: 'bg-mu-accent-blue/12',
    iconText: 'text-mu-accent-blue',
  },
  {
    number: '11',
    label: 'стран',
    Icon: Globe,
    iconBg: 'bg-mu-accent-teal/12',
    iconText: 'text-mu-accent-teal',
  },
  {
    number: '500+',
    label: 'врачей',
    Icon: Stethoscope,
    iconBg: 'bg-mu-accent-orange/12',
    iconText: 'text-mu-accent-orange',
  },
  {
    number: '15+',
    label: 'лет опыта',
    Icon: Award,
    iconBg: 'bg-mu-green-600/12',
    iconText: 'text-mu-green-600',
  },
] as const;

export function StatsBar() {
  return (
    <section className="relative z-20 py-8 sm:py-12" aria-label="Ключевые цифры">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Mobile: single glass container with a 2x2 grid inside (one glass layer — keeps page within Phase 79 mobile budget) */}
        {/* sm+: separate glass cards (4 layers acceptable on desktop) */}
        <div className="rounded-[2rem] border border-glass-border bg-[var(--glass-section-fill)] p-4 shadow-glass backdrop-blur-[var(--glass-section-blur)] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
            {STATS.map((stat) => {
              const { Icon } = stat;
              return (
                <div
                  key={stat.label}
                  className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl px-3 py-5 text-center sm:rounded-[2.5rem] sm:border sm:border-glass-border sm:bg-[var(--glass-card-fill)] sm:p-7 sm:shadow-glass sm:backdrop-blur-[var(--glass-card-blur)] sm:transition-[background-color,border-color,box-shadow] sm:duration-300 sm:hover:bg-[var(--glass-form-fill)] sm:hover:border-glass-border-strong sm:hover:shadow-glass-lg"
                >
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${stat.iconBg} ${stat.iconText}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div
                    className={`text-3xl font-extrabold leading-none tracking-tight drop-shadow-sm sm:text-5xl md:text-6xl ${stat.iconText}`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-mu-text-700 sm:text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
