export function ConsultationAdvantages() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id="advantages">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-10">
          Почему через MedicusUnion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Документы переведены */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <path d="M12 6h18l10 10v26a2 2 0 01-2 2H12a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <path d="M30 6v10h10" stroke="#38C6F4" strokeWidth="2.5" fill="none" />
                <line x1="16" y1="24" x2="32" y2="24" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="30" x2="28" y2="30" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Документы переведены и{'\u00A0'}подготовлены
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Вы{'\u00A0'}загружаете на{'\u00A0'}русском{'\u00A0'}{'\u2014'} врач{'\u00A0'}получает на{'\u00A0'}своём языке. Не{'\u00A0'}нужно искать переводчика медицинских документов.
            </p>
          </div>

          {/* Card 2: Перевод во время консультации */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <path d="M8 12a4 4 0 014-4h24a4 4 0 014 4v16a4 4 0 01-4 4H20l-8 6v-6H12a4 4 0 01-4-4V12z" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <line x1="16" y1="18" x2="32" y2="18" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="24" x2="26" y2="24" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Перевод прямо во{'\u00A0'}время консультации
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Вы{'\u00A0'}говорите на{'\u00A0'}русском, врач{'\u00A0'}{'\u2014'} на{'\u00A0'}своём. Переводчик{'\u00A0'}обеспечивает полное понимание{'\u00A0'}{'\u2014'} включая медицинскую терминологию.
            </p>
          </div>

          {/* Card 3: Всё в одном приложении */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <rect x="12" y="4" width="24" height="40" rx="4" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <line x1="12" y1="12" x2="36" y2="12" stroke="#38C6F4" strokeWidth="2" />
                <line x1="12" y1="36" x2="36" y2="36" stroke="#38C6F4" strokeWidth="2" />
                <circle cx="24" cy="40" r="2" fill="#38C6F4" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Всё в{'\u00A0'}одном приложении
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Документы, расписание, видеозвонок, заключение врача{'\u00A0'}{'\u2014'} в{'\u00A0'}личном кабинете. Ничего не{'\u00A0'}потеряется, всё под рукой.
            </p>
          </div>

          {/* Card 4: Нужно больше — организуем */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L8 20h10v16h12V20h10L24 4z" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" strokeLinejoin="round" />
                <rect x="20" y="36" width="8" height="8" rx="1" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Нужно больше{'\u00A0'}{'\u2014'} организуем
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Если после консультации нужно лечение за{'\u00A0'}рубежом{'\u00A0'}{'\u2014'} мы{'\u00A0'}организуем всё: клинику, документы, логистику, сопровождение. Но{'\u00A0'}это уже следующий шаг.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
