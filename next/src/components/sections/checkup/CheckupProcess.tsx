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
      title: <>Результаты и{'\u00A0'}дальнейшие шаги</>,
      text: <>Все заключения, снимки и{'\u00A0'}анализы{'\u00A0'}{'\u2014'} в{'\u00A0'}личном кабинете и{'\u00A0'}приложении MedicusUnion, с{'\u00A0'}переводом на{'\u00A0'}русский. Если нужно лечение{'\u00A0'}{'\u2014'} организуем.</>,
    },
  ];

  return (
    <section className="py-16 relative z-10" id="how-it-works">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-12 text-center">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            От{'\u00A0'}заявки до{'\u00A0'}результатов{'\u00A0'}{'\u2014'} 5{'\u00A0'}шагов
          </span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass text-center">
              <div
                className="text-4xl font-extrabold bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent mb-4"
                aria-hidden="true"
              >
                {step.number}
              </div>
              <h3 className="text-lg font-extrabold text-mu-text-900 mb-2">
                {step.title}
              </h3>
              <p className="text-mu-text-700 font-medium text-sm">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
