import Link from 'next/link';
import type { ReactNode } from 'react';

interface ServiceCard {
  icon: ReactNode;
  badge: string;
  title: string;
  description: ReactNode;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

const ConsultationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-16 h-16" aria-hidden="true">
    <rect x="12" y="8" width="40" height="32" rx="4" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.08)" />
    <line x1="12" y1="40" x2="52" y2="40" stroke="#38C6F4" strokeWidth="2.5" />
    <rect x="24" y="40" width="16" height="6" rx="2" stroke="#38C6F4" strokeWidth="2" fill="rgba(56,198,244,0.08)" />
    <circle cx="32" cy="24" r="6" stroke="#35B678" strokeWidth="2" fill="rgba(53,182,120,0.12)" />
    <path d="M24 34c0-4 3.5-7 8-7s8 3 8 7" stroke="#35B678" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-16 h-16" aria-hidden="true">
    <circle cx="32" cy="32" r="22" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.06)" />
    <ellipse cx="32" cy="32" rx="10" ry="22" stroke="#38C6F4" strokeWidth="1.5" fill="none" />
    <line x1="10" y1="26" x2="54" y2="26" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="38" x2="54" y2="38" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
    <g transform="translate(42, 12)">
      <path d="M0 -8 C-4 -8, -6 -4, -6 0 C-6 5, 0 10, 0 10 C0 10, 6 5, 6 0 C6 -4, 4 -8, 0 -8Z" fill="rgba(53,182,120,0.3)" stroke="#35B678" strokeWidth="1.5" />
      <circle cx="0" cy="-1" r="2" fill="#35B678" />
    </g>
  </svg>
);

const CheckupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-16 h-16" aria-hidden="true">
    <rect x="16" y="6" width="32" height="44" rx="4" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.06)" />
    <rect x="24" y="2" width="16" height="8" rx="3" stroke="#38C6F4" strokeWidth="2" fill="rgba(56,198,244,0.08)" />
    <polyline points="22,24 26,28 34,20" stroke="#35B678" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="22" y1="36" x2="42" y2="36" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <line x1="22" y1="42" x2="36" y2="42" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <polyline points="36,54 42,60 54,48" stroke="#35B678" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SERVICES: ServiceCard[] = [
  {
    icon: <ConsultationIcon />,
    badge: 'от\u00A0450\u00A0\u20AC',
    title: 'Онлайн-консультации',
    description: (
      <>
        Видеоконсультация с{'\u00A0'}европейским специалистом на{'\u00A0'}вашем языке.
        Второе мнение по{'\u00A0'}диагнозу, план лечения, письменное заключение.{' '}
        <span>За{'\u00A0'}5{'\u00A0'}дней</span>, без{'\u00A0'}перелёта.
      </>
    ),
    features: [
      'Перевод документов и\u00A0консультации',
      'Врачи из\u00A07 стран',
      'Письменное заключение',
    ],
    ctaText: 'Получить консультацию',
    ctaHref: '/consultations',
  },
  {
    icon: <GlobeIcon />,
    badge: '100+ клиник',
    title: 'Лечение за\u00A0рубежом',
    description: (
      <>
        Организуем лечение под ключ: от{'\u00A0'}подбора клиники до{'\u00A0'}реабилитации.
        Визовая поддержка, перелёт, проживание, переводчик, сопровождение на{'\u00A0'}каждом этапе.
      </>
    ),
    features: [
      '6 стран, 14 клиник-партнёров',
      'Полная организация',
      'Координация до\u00A0выздоровления',
    ],
    ctaText: 'Узнать подробнее',
    ctaHref: '/treatment-abroad',
  },
  {
    icon: <CheckupIcon />,
    badge: 'от\u00A0$350',
    title: 'Чек-ап за\u00A0рубежом',
    description: (
      <>
        Комплексное обследование в{'\u00A0'}Samsung Medical Center, Severance Hospital
        и{'\u00A0'}клиниках Стамбула за{'\u00A0'}1{'\u2013'}2{'\u00A0'}дня. Виза, трансфер, переводчик,
        результаты в{'\u00A0'}приложении.
      </>
    ),
    features: [
      'Южная Корея и\u00A0Турция',
      'Программы от\u00A0базовой до\u00A0премиум',
      'Корпоративные чек-апы',
    ],
    ctaText: 'Подобрать программу',
    ctaHref: '/checkup',
  },
];

export function ServicesGrid() {
  return (
    <section className="py-12 md:py-24" id="services">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-mu-text-900 mb-10 md:mb-14">
          Выберите, что{'\u00A0'}вам нужно
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.ctaHref}
              className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col"
            >
              <div className="mb-2">{service.icon}</div>
              <span className="inline-block bg-[#d0fae4] text-[#007955] text-sm font-semibold px-3 py-1 rounded-full mt-4 mb-3 w-fit">
                {service.badge}
              </span>
              <h3 className="font-heading text-xl font-bold text-mu-text-900 mb-3">
                {service.title}
              </h3>
              <p className="font-body text-mu-text-500 leading-relaxed mb-4 flex-grow">
                {service.description}
              </p>
              <ul className="space-y-2 mb-6 text-mu-text-700 text-sm">
                {service.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href={service.ctaHref}
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-mu-cta-from to-mu-cta-to hover:opacity-90 transition-opacity mt-auto"
              >
                {service.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
