import type { ReactNode } from 'react';

interface Step {
  number: string;
  title: ReactNode;
  text: ReactNode;
}

export function CheckupProcess() {
  const steps: Step[] = [
    {
      number: '01',
      title: <>Оставьте заявку</>,
      text: <>Мы{'\u00A0'}свяжемся с{'\u00A0'}вами, уточним цели обследования, возраст, историю здоровья{'\u00A0'}{'\u2014'} и{'\u00A0'}подберём программу и{'\u00A0'}направление.</>,
    },
    {
      number: '02',
      title: <>Согласование и{'\u00A0'}подготовка</>,
      text: <>Фиксируем программу, дату, организуем визовую поддержку, бронируем слот в{'\u00A0'}клинике, помогаем с{'\u00A0'}авиабилетами и{'\u00A0'}проживанием.</>,
    },
    {
      number: '03',
      title: <>Прилёт и{'\u00A0'}трансфер</>,
      text: <>Вас встречают в{'\u00A0'}аэропорту, доставляют в{'\u00A0'}отель или в{'\u00A0'}клинику. С{'\u00A0'}вами{'\u00A0'}{'\u2014'} личный переводчик-сопровождающий.</>,
    },
    {
      number: '04',
      title: <>Обследование</>,
      text: <>Все процедуры{'\u00A0'}{'\u2014'} по{'\u00A0'}расписанию, без очередей. Сопровождающий рядом на{'\u00A0'}каждом этапе. Консультация врача по{'\u00A0'}результатам.</>,
    },
    {
      number: '05',
      title: <>Результаты</>,
      text: <>Все заключения, снимки и{'\u00A0'}анализы{'\u00A0'}{'\u2014'} в{'\u00A0'}личном кабинете и{'\u00A0'}приложении MedicusUnion, с{'\u00A0'}переводом на{'\u00A0'}русский. Если нужно лечение{'\u00A0'}{'\u2014'} организуем.</>,
    },
  ];

  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id="how-it-works">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-center text-[#18212C] mb-10 leading-[1.2] tracking-[-0.02em] text-balance">
          От{'\u00A0'}заявки до{'\u00A0'}результатов{'\u00A0'}{'\u2014'} 5{'\u00A0'}шагов
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div
                className="font-heading text-[3rem] font-bold text-[#38C6F4]/15 mb-2 leading-none"
                aria-hidden="true"
              >
                {step.number}
              </div>
              <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
                {step.title}
              </h3>
              <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
