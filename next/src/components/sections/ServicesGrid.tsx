import Link from 'next/link';
import {
  Video,
  ClipboardCheck,
  Globe,
  Building2,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ServiceCard = {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  href: string;
  ctaText: string;
};

const SERVICES: readonly ServiceCard[] = [
  {
    Icon: Video,
    iconBg: 'bg-mu-accent-blue/10',
    iconColor: 'text-mu-accent-blue',
    badge: 'от\u00A0450\u00A0\u20AC',
    badgeColor: 'text-mu-accent-blue',
    title: 'Онлайн-консультация',
    description:
      'Видеовстреча с\u00A0европейским врачом\u00A0— Германия, Австрия, Швейцария. Перевод документов и\u00A0письменное заключение.',
    href: '/consultations',
    ctaText: 'Записаться',
  },
  {
    Icon: ClipboardCheck,
    iconBg: 'bg-mu-green-50',
    iconColor: 'text-mu-green-600',
    badge: 'от\u00A0$350',
    badgeColor: 'text-mu-green-700',
    title: 'Чек-ап в\u00A0мировой клинике',
    description:
      'Комплексное обследование за\u00A01–2\u00A0дня. Samsung Medical Center, Severance, клиники Стамбула. Виза, трансфер, переводчик включены.',
    href: '/checkup',
    ctaText: 'Подобрать программу',
  },
  {
    Icon: Globe,
    iconBg: 'bg-mu-accent-teal-bg',
    iconColor: 'text-mu-accent-teal',
    badge: 'план бесплатно',
    badgeColor: 'text-mu-accent-teal',
    title: 'Лечение за\u00A0границей под\u00A0ключ',
    description:
      'Подбор клиники из\u00A0сети 43\u00A0партнёров в\u00A011\u00A0странах. Полная организация: виза, логистика, переводчик, координация до\u00A0выздоровления.',
    href: '/treatment-abroad',
    ctaText: 'Получить план',
  },
  {
    Icon: Building2,
    iconBg: 'bg-mu-accent-orange/10',
    iconColor: 'text-mu-accent-orange',
    badge: 'для\u00A0компаний',
    badgeColor: 'text-mu-accent-orange',
    title: 'Корпоративные чек-апы',
    description:
      'B2B-программа здоровья для\u00A0сотрудников: чек-ап в\u00A0Сеуле или\u00A0Стамбуле, индивидуальный план для\u00A0каждого участника, отчётность для\u00A0HR.',
    href: '/checkup#b2b',
    ctaText: 'Запросить предложение',
  },
] as const;

export function ServicesGrid() {
  return (
    <section className="relative z-10 py-16 sm:py-20" id="services">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section title */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-glass-border bg-[var(--glass-section-fill)] px-5 py-2.5 shadow-glass-inner backdrop-blur-[var(--glass-section-blur)]">
            <span className="text-xs font-bold uppercase tracking-wider text-mu-accent-blue sm:text-sm">
              Наши Услуги
            </span>
          </div>
          <h2 className="mb-5 text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              Мы&nbsp;помогаем на&nbsp;каждом этапе
            </span>
          </h2>
          <p className="text-base font-medium leading-relaxed text-mu-text-700 sm:text-lg">
            От&nbsp;первой консультации до&nbsp;возвращения домой&nbsp;— четыре
            направления под&nbsp;вашу задачу.
          </p>
        </div>

        {/* 4-card grid */}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {SERVICES.map((card) => {
            const { Icon } = card;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group flex h-full flex-col rounded-[2rem] border border-glass-border bg-[var(--glass-card-fill)] p-6 shadow-glass backdrop-blur-[var(--glass-card-blur)] transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-glass-border-strong hover:bg-[var(--glass-form-fill)] hover:shadow-glass-lg sm:p-7"
              >
                {/* Icon */}
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor} transition-transform duration-300 group-hover:scale-105`}
                  aria-hidden="true"
                >
                  <Icon className="h-7 w-7" />
                </div>

                {/* Price badge */}
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-glass-border bg-[var(--glass-button-fill)] px-3 py-1 shadow-sm">
                  <span className={`text-xs font-bold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold tracking-tight text-mu-text-900 sm:text-[1.375rem]">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="mb-6 flex-grow text-sm font-medium leading-relaxed text-mu-text-700 sm:text-base">
                  {card.description}
                </p>

                {/* CTA */}
                <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-mu-text-900 sm:text-base">
                  {card.ctaText}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
