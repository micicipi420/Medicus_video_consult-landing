function PricingCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className="w-5 h-5 shrink-0"
      aria-hidden="true"
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

const includes = [
  'Перевод ваших медицинских документов',
  'Подготовка врача к\u00A0консультации (изучение вашего кейса)',
  'Видеовстреча с\u00A0переводчиком',
  'Письменное заключение врача',
  'Доступ к\u00A0личному кабинету',
];

export function ConsultationPricing() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id="pricing">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-4">
          Прозрачная цена, никаких сюрпризов
        </h2>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[640px] mx-auto mb-10">
          Стоимость зависит от{'\u00A0'}специализации врача и{'\u00A0'}сложности случая. Вы{'\u00A0'}узнаете точную цену до{'\u00A0'}оплаты.
        </p>

        <div className="max-w-[480px] mx-auto card-prod p-8 md:p-10 text-center">
          <span className="inline-block bg-[#d0fae4] text-[#007955] text-[1rem] font-heading font-bold px-4 py-1.5 rounded-full mb-6">
            Все включено
          </span>

          <div className="mb-8">
            <span className="text-[1.125rem] text-[rgba(24,33,44,0.55)]">от</span>
            <span className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-[#18212C] leading-none mx-2">
              450{'\u00A0'}{'\u20AC'}
            </span>
            <span className="text-[1.125rem] text-[rgba(24,33,44,0.55)] block mt-1">
              видеоконсультация
            </span>
          </div>

          <ul className="space-y-4 text-left mb-8" role="list">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[1.125rem] text-[#18212C]">
                <PricingCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a href="#form" className="btn-primary w-full">
            Получить консультацию
          </a>
        </div>
      </div>
    </section>
  );
}
