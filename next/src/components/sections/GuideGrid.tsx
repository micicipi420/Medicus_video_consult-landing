import Link from 'next/link';
import type { ReactNode } from 'react';

interface GuideItem {
  icon: ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-4" aria-hidden="true">
    <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
    <path d="M18 18a6 6 0 0112 0c0 4-6 4-6 8" stroke="#38C6F4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="24" cy="34" r="1.5" fill="#38C6F4" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-4" aria-hidden="true">
    <rect x="8" y="12" width="32" height="24" rx="4" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
    <path d="M16 18h16M16 24h12M16 30h8" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 36l4 4" stroke="#35B678" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-4" aria-hidden="true">
    <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
    <polyline points="16,24 22,30 32,18" stroke="#35B678" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GUIDE_ITEMS: GuideItem[] = [
  {
    icon: <QuestionIcon />,
    title: 'Есть диагноз, нужно мнение',
    description:
      'Вы\u00A0уже получили диагноз и\u00A0хотите убедиться, что он\u00A0верный, или узнать альтернативные варианты лечения.',
    linkText: 'Онлайн-консультация\u00A0\u2192',
    linkHref: '/consultations',
  },
  {
    icon: <DocumentIcon />,
    title: 'Нужно лечение за\u00A0границей',
    description:
      'Вам рекомендовали операцию или лечение, и\u00A0вы\u00A0рассматриваете клиники в\u00A0Европе, Израиле, ОАЭ или Индии.',
    linkText: 'Лечение за\u00A0рубежом\u00A0\u2192',
    linkHref: '/treatment-abroad',
  },
  {
    icon: <CheckCircleIcon />,
    title: 'Хочу проверить здоровье',
    description:
      'Чувствуете себя нормально, но\u00A0хотите убедиться. Или давно не\u00A0проходили полное обследование.',
    linkText: 'Чек-ап за\u00A0рубежом\u00A0\u2192',
    linkHref: '/checkup',
  },
];

export function GuideGrid() {
  return (
    <section className="py-12 md:py-24 section-tint-warm" id="guide">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-mu-text-900 mb-10 md:mb-14">
          Не{'\u00A0'}знаете, с{'\u00A0'}чего начать?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {GUIDE_ITEMS.map((item) => (
            <div
              key={item.linkHref}
              className="liquid-regular squircle-lg p-6 md:p-8 flex flex-col"
            >
              {item.icon}
              <h3 className="font-heading text-lg font-bold text-mu-text-900 mb-2">
                {item.title}
              </h3>
              <p className="font-body text-mu-text-500 leading-relaxed mb-4 flex-grow">
                {item.description}
              </p>
              <Link
                href={item.linkHref}
                className="font-semibold text-[#0B7A9A] hover:text-[#065c75] transition-colors mt-auto"
              >
                {item.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
