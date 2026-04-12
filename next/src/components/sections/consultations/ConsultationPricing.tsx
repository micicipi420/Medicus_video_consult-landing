const includes = [
  'Перевод ваших медицинских документов',
  'Подготовка врача к\u00A0консультации (изучение вашего кейса)',
  'Видеовстреча с\u00A0переводчиком',
  'Письменное заключение врача',
  'Доступ к\u00A0личному кабинету',
];

export function ConsultationPricing() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="pricing">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
        <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
          Прозрачная цена, никаких сюрпризов
        </span>
      </h2>
      <p className="text-mu-text-700 font-medium text-lg text-center mb-10 max-w-2xl mx-auto">
        Стоимость зависит от{'\u00A0'}специализации врача и{'\u00A0'}сложности случая. Вы{'\u00A0'}узнаете точную цену до{'\u00A0'}оплаты.
      </p>

      <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-glass-lg max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-full shadow-glass-inner mb-6 text-sm font-bold text-mu-text-900">
          Все включено
        </div>

        <div className="mb-8">
          <span className="text-mu-text-700 font-medium text-lg">от</span>
          <span className="text-5xl font-extrabold bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent">
            {'\u00A0'}450{'\u00A0'}{'\u20AC'}
          </span>
          <span className="text-mu-text-700 font-medium text-lg block mt-1">видеоконсультация</span>
        </div>

        <ul className="space-y-4 mb-8">
          {includes.map((item) => (
            <li key={item} className="flex items-center gap-3 text-mu-text-900 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mu-green-600 flex-shrink-0" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <a href="#consultation-form" className="w-full bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white py-4 rounded-2xl font-bold shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)] hover:shadow-[0_20px_40px_color-mix(in_oklch,var(--color-mu-blue)_40%,transparent)] transition-all flex items-center justify-center gap-2 text-lg">
          Получить консультацию
        </a>
      </div>
    </section>
  );
}
