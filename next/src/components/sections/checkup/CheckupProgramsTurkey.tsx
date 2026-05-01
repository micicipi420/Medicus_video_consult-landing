import type { ReactNode } from 'react';

interface TurkeyProgramCard {
  name: string;
  featured?: boolean;
  price: ReactNode;
  description: ReactNode;
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--mu-green-600)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function CheckupProgramsTurkey() {
  const programs: TurkeyProgramCard[] = [
    {
      name: 'Лабораторный',
      price: <>от{'\u00A0'}~$350</>,
      description: <>Расширенные анализы крови.</>,
    },
    {
      name: 'Silver',
      price: <>от{'\u00A0'}~$1{'\u00A0'}100 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$1{'\u00A0'}200 (жен.)</span></>,
      description: <>Анализы + УЗИ + базовые обследования.</>,
    },
    {
      name: 'Gold',
      price: <>от{'\u00A0'}~$2{'\u00A0'}100 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$2{'\u00A0'}200 (жен.)</span></>,
      description: <>Silver + расширенная диагностика.</>,
    },
    {
      name: 'Platinum',
      featured: true,
      price: <>от{'\u00A0'}~$3{'\u00A0'}100 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$3{'\u00A0'}200 (жен.)</span></>,
      description: <>Полный комплекс обследований.</>,
    },
  ];

  const includedItems = [
    <>Обследование у{'\u00A0'}профессоров и{'\u00A0'}ведущих врачей</>,
    <>Расширенная программа анализов</>,
    <>Всё за{'\u00A0'}1{'\u2013'}2{'\u00A0'}дня, без очередей</>,
    <>Трансфер из{'\u00A0'}аэропорта и{'\u00A0'}между отелем и{'\u00A0'}клиникой</>,
    <>Личный сопровождающий на{'\u00A0'}всех этапах</>,
    <>24/7 поддержка и{'\u00A0'}переводчик</>,
    <>Забор анализов прямо в{'\u00A0'}отеле</>,
  ];

  return (
    <section className="py-16 relative z-10" id="programs-turkey">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-4 text-center">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Чек-ап в{'\u00A0'}Турции
          </span>
        </h2>
        <p className="text-mu-blue font-bold text-lg text-center mb-4">
          Liv Hospital {'\u00B7'} Medicana{'\u00A0'}{'\u2014'} ведущие клиники Стамбула с{'\u00A0'}аккредитацией JCI
        </p>
        <p className="text-mu-text-700 text-lg text-center mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Турция{'\u00A0'}{'\u2014'} одно из{'\u00A0'}самых популярных направлений медицинского туризма в{'\u00A0'}мире. Ближе чем Корея, доступнее по{'\u00A0'}цене, при этом уровень оборудования и{'\u00A0'}врачей в{'\u00A0'}аккредитованных клиниках соответствует европейским стандартам.
        </p>

        {/* What's included - glass card */}
        <div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass mb-8">
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-4">
            Что включено во{'\u00A0'}все программы
          </h3>
          <ul className="grid sm:grid-cols-2 gap-3" role="list">
            {includedItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircleIcon />
                <span className="text-mu-text-900 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Program cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {programs.map((program) => (
            <div
              key={program.name}
              className={
                program.featured
                  ? 'bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] p-8 border border-mu-blue/40 shadow-[0_16px_48px_color-mix(in_oklch,var(--color-mu-blue)_15%,transparent)] flex flex-col'
                  : 'bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] p-8 border border-white/60 shadow-glass flex flex-col'
              }
            >
              <span
                className={
                  program.featured
                    ? 'inline-flex items-center gap-2 bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-4 py-1.5 rounded-full shadow-sm w-fit mb-4'
                    : 'inline-flex items-center gap-2 bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] border border-glass-border px-4 py-1.5 rounded-full shadow-sm w-fit mb-4'
                }
              >
                <span className={program.featured ? 'text-sm font-bold' : 'text-sm font-bold text-mu-accent-blue'}>
                  {program.name}
                </span>
              </span>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent mb-3">
                {program.price}
              </div>
              <p className="text-mu-text-700 font-medium flex-grow">
                {program.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#form-checkup"
            className="btn-primary bg-gradient-to-r from-mu-cta-brand-from to-mu-cta-brand-to text-white px-10 py-5 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 text-lg inline-flex items-center gap-2"
          >
            Подобрать программу
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
