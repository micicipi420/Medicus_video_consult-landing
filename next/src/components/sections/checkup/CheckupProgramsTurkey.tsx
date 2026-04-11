import type { ReactNode } from 'react';

interface TurkeyProgramCard {
  name: string;
  accent?: boolean;
  price: ReactNode;
  description: ReactNode;
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      aria-hidden="true"
      className="w-5 h-5 shrink-0"
    >
      <path
        d="M4 10l4 4 8-8"
        stroke="#047857"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      price: <>от{'\u00A0'}~$1{'\u00A0'}100 <span className="text-[0.875rem] font-normal text-[rgba(24,33,44,0.55)]">(муж.) / ~$1{'\u00A0'}200 (жен.)</span></>,
      description: <>Анализы + УЗИ + базовые обследования.</>,
    },
    {
      name: 'Gold',
      price: <>от{'\u00A0'}~$2{'\u00A0'}100 <span className="text-[0.875rem] font-normal text-[rgba(24,33,44,0.55)]">(муж.) / ~$2{'\u00A0'}200 (жен.)</span></>,
      description: <>Silver + расширенная диагностика.</>,
    },
    {
      name: 'Platinum',
      accent: true,
      price: <>от{'\u00A0'}~$3{'\u00A0'}100 <span className="text-[0.875rem] font-normal text-[rgba(24,33,44,0.55)]">(муж.) / ~$3{'\u00A0'}200 (жен.)</span></>,
      description: <>Полный комплекс обследований.</>,
    },
  ];

  const includedItems = [
    <>Обследование у{'\u00A0'}профессоров и{'\u00A0'}ведущих врачей</>,
    <>Всё за{'\u00A0'}1{'\u2013'}2{'\u00A0'}дня, без очередей</>,
    <>Трансфер из{'\u00A0'}аэропорта и{'\u00A0'}между отелем и{'\u00A0'}клиникой</>,
    <>Личный сопровождающий и{'\u00A0'}переводчик 24/7</>,
  ];

  return (
    <section className="py-12 lg:py-[6.25rem] bg-[#F5F7F9]" id="programs-turkey">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-center text-[#18212C] mb-4 leading-[1.2] tracking-[-0.02em] text-balance">
          Чек-ап в{'\u00A0'}Турции
        </h2>
        <p className="font-heading text-[1.125rem] font-semibold text-center text-[#18212C]/80 mb-4">
          Liv Hospital {'\u00B7'} Medicana{'\u00A0'}{'\u2014'} ведущие клиники Стамбула с{'\u00A0'}аккредитацией JCI
        </p>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[800px] mx-auto mb-10">
          Турция{'\u00A0'}{'\u2014'} одно из{'\u00A0'}самых популярных направлений медицинского туризма в{'\u00A0'}мире. Ближе чем Корея, доступнее по{'\u00A0'}цене, при этом уровень оборудования и{'\u00A0'}врачей в{'\u00A0'}аккредитованных клиниках соответствует европейским стандартам.
        </p>

        {/* Included in all programs */}
        <div className="mb-10">
          <h3 className="font-heading text-[1.5rem] font-bold text-[#18212C] mb-4">
            Что включено во{'\u00A0'}все программы
          </h3>
          <ul className="space-y-3">
            {includedItems.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[1.125rem] text-[#4A4E5C]">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {programs.map((program) => (
            <div key={program.name} className="card-prod p-6 md:p-8 flex flex-col">
              <span
                className={`inline-block self-start px-3 py-1 rounded-full text-[0.8125rem] font-bold mb-3 ${
                  program.accent
                    ? 'bg-[#FFF8F0] text-[#B5621D]'
                    : 'bg-[#d0fae4] text-[#007955]'
                }`}
              >
                {program.name}
              </span>
              <div className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-3">
                {program.price}
              </div>
              <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="#form-checkup" className="btn-primary">
            Подобрать программу
          </a>
        </div>
      </div>
    </section>
  );
}
