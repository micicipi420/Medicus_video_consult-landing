import type { ReactNode } from 'react';

interface AdvantageCard {
  icon: ReactNode;
  title: ReactNode;
  description: string;
}

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-4" aria-hidden="true">
    <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
    <ellipse cx="24" cy="24" rx="8" ry="18" stroke="#38C6F4" strokeWidth="1.5" fill="none" />
    <line x1="6" y1="18" x2="42" y2="18" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6" y1="30" x2="42" y2="30" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-4" aria-hidden="true">
    <rect x="12" y="4" width="24" height="40" rx="4" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
    <line x1="12" y1="12" x2="36" y2="12" stroke="#38C6F4" strokeWidth="2" />
    <line x1="12" y1="36" x2="36" y2="36" stroke="#38C6F4" strokeWidth="2" />
    <circle cx="24" cy="40" r="2" fill="#38C6F4" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-4" aria-hidden="true">
    <path d="M24 6l-4 8h-10l8 6-3 9 9-6 9 6-3-9 8-6h-10z" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-4" aria-hidden="true">
    <path d="M24 4L10 14v12c0 10 6 18 14 22 8-4 14-12 14-22V14L24 4z" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" strokeLinejoin="round" />
    <polyline points="18,24 22,28 30,20" stroke="#35B678" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ADVANTAGES: AdvantageCard[] = [
  {
    icon: <GlobeIcon />,
    title: (
      <>
        <span>43</span>{'\u00A0'}клиники в{'\u00A0'}<span>11</span>{'\u00A0'}странах
      </>
    ),
    description:
      'Германия, Австрия, Швейцария, Израиль, ОАЭ, Южная Корея, Турция, Индия\u00A0\u2014 подберём клинику под задачу и\u00A0бюджет.',
  },
  {
    icon: <PhoneIcon />,
    title: 'Всё в\u00A0одном приложении',
    description:
      'Документы, расписание, видеоконсультации, результаты обследований, заключения врачей\u00A0\u2014 в\u00A0личном кабинете. Ничего не\u00A0потеряется.',
  },
  {
    icon: <StarIcon />,
    title: (
      <>
        <span>15+</span> лет, <span>10{'\u00A0'}000+</span> пациентов
      </>
    ),
    description:
      'Устойчивые процессы, проверенные партнёры, прямые контракты с\u00A0клиниками. Не\u00A0посредник\u00A0\u2014 медицинская платформа.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Юридическая надёжность',
    description:
      'MedicusUnion GmbH, Австрия. Офис в\u00A0Казахстане\u00A0\u2014 резидент Astana Hub. ISO\u00A027001. Договор, чеки, прозрачные условия.',
  },
];

export function AdvantagesGrid() {
  return (
    <section className="py-12 md:py-24 section-tint-mint" id="why-mu">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-mu-text-900 mb-10 md:mb-14">
          Почему MedicusUnion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((card, i) => (
            <div
              key={i}
              className="liquid-regular squircle-lg p-6 flex flex-col"
            >
              {card.icon}
              <h3 className="font-heading text-lg font-bold text-mu-text-900 mb-2">
                {card.title}
              </h3>
              <p className="font-body text-sm text-mu-text-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
