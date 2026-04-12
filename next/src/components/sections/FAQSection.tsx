'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Что именно делает MedicusUnion?',
    answer: (
      <>
        Мы{'\u00A0'}{'\u2014'} международная медицинская платформа. Организуем
        онлайн-консультации с{'\u00A0'}зарубежными врачами, комплексные чек-апы
        и{'\u00A0'}полное сопровождение лечения за{'\u00A0'}рубежом.
        Всё{'\u00A0'}{'\u2014'} через одну платформу: от{'\u00A0'}разбора вашего
        случая до{'\u00A0'}наблюдения после возвращения.
      </>
    ),
  },
  {
    question: 'С какими заболеваниями можно обратиться?',
    answer: (
      <>
        Онкология, кардиология, ортопедия, неврология, трансплантология,
        педиатрия, офтальмология и{'\u00A0'}другие направления. Опишите свой
        случай{'\u00A0'}{'\u2014'} мы{'\u00A0'}скажем, можем{'\u00A0'}ли помочь
        и{'\u00A0'}куда лучше обратиться.
      </>
    ),
  },
  {
    question: 'Сколько это стоит?',
    answer: (
      <>
        Онлайн-консультация{'\u00A0'}{'\u2014'} от{'\u00A0'}450{'\u00A0'}{'\u20AC'}.
        Чек-ап{'\u00A0'}{'\u2014'} от{'\u00A0'}$350 (Турция) или от{'\u00A0'}$760
        (Корея). Лечение за{'\u00A0'}рубежом{'\u00A0'}{'\u2014'} зависит
        от{'\u00A0'}диагноза, страны и{'\u00A0'}объёма; первая консультация
        и{'\u00A0'}план лечения{'\u00A0'}{'\u2014'} бесплатно. Вы{'\u00A0'}всегда
        знаете стоимость до{'\u00A0'}оплаты.
      </>
    ),
  },
  {
    question: 'А если я не говорю на иностранном языке?',
    answer: (
      <>
        Не{'\u00A0'}нужно. Мы{'\u00A0'}переводим все документы и{'\u00A0'}обеспечиваем
        профессиональный перевод на{'\u00A0'}консультациях и{'\u00A0'}во{'\u00A0'}время
        лечения{'\u00A0'}{'\u2014'} включая медицинскую терминологию.
      </>
    ),
  },
  {
    question: 'Чем вы отличаетесь от агентств из Instagram?',
    answer: (
      <>
        Юридическое лицо в{'\u00A0'}Австрии и{'\u00A0'}Казахстане, договор.
        Собственная цифровая платформа с{'\u00A0'}личным кабинетом, а{'\u00A0'}не{'\u00A0'}переписка
        в{'\u00A0'}WhatsApp. Сеть из{'\u00A0'}43{'\u00A0'}клиник, а{'\u00A0'}не{'\u00A0'}2{'\u2013'}3.
        Сопровождение после лечения, а{'\u00A0'}не{'\u00A0'}до{'\u00A0'}аэропорта.
        Защита данных по{'\u00A0'}ISO{'\u00A0'}27001.
      </>
    ),
  },
  {
    question: 'Могу ли я обратиться в клинику напрямую?',
    answer: (
      <>
        Можете. Но{'\u00A0'}с{'\u00A0'}нами вы{'\u00A0'}получаете: приоритетную
        запись через прямой контракт, координатора, переводчика, полную логистику
        и{'\u00A0'}наблюдение после возвращения. Вы{'\u00A0'}экономите недели
        и{'\u00A0'}снижаете риск выбрать не{'\u00A0'}ту{'\u00A0'}клинику.
      </>
    ),
  },
  {
    question: 'Что будет, если чек-ап или консультация выявят проблему?',
    answer: (
      <>
        Мы{'\u00A0'}организуем лечение: в{'\u00A0'}той{'\u00A0'}же клинике или
        в{'\u00A0'}любой другой из{'\u00A0'}нашей сети в{'\u00A0'}11{'\u00A0'}странах.
        Вам не{'\u00A0'}нужно начинать поиск с{'\u00A0'}нуля{'\u00A0'}{'\u2014'} вся
        информация уже в{'\u00A0'}вашем личном кабинете.
      </>
    ),
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 relative z-10" id="faq">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-8 text-center">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Частые вопросы
          </span>
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-2xl rounded-2xl border border-glass-border shadow-glass-sm overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full text-left px-6 py-5 font-bold text-mu-text-900 flex items-center justify-between transition-colors hover:bg-white/80"
                  aria-expanded={isOpen}
                  onClick={() => handleToggle(i)}
                >
                  {item.question}
                  <svg
                    className={`shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
                >
                  <div className="px-6 pb-5 text-mu-text-700 font-medium leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
