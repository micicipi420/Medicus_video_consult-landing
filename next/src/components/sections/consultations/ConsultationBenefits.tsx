export function ConsultationBenefits() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-[#FFF8F0]" id="benefits">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-10">
          Что вы{'\u00A0'}получите за{'\u00A0'}одну консультацию
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Второе мнение */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="20" cy="20" r="14" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <line x1="30" y1="30" x2="40" y2="40" stroke="#38C6F4" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Второе мнение по{'\u00A0'}вашему диагнозу
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Врач изучит ваши документы до{'\u00A0'}встречи и{'\u00A0'}даст оценку вашего случая. Не{'\u00A0'}общие слова, а{'\u00A0'}конкретное заключение по{'\u00A0'}вашим анализам и{'\u00A0'}снимкам.
            </p>
          </div>

          {/* Card 2: Понятный план действий */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <rect x="10" y="8" width="28" height="34" rx="3" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <rect x="17" y="4" width="14" height="8" rx="2" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <line x1="16" y1="22" x2="32" y2="22" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="28" x2="28" y2="28" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="34" x2="24" y2="34" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Понятный план действий
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Что делать дальше: какие обследования пройти, какое лечение рекомендуется, какие есть варианты. Вы{'\u00A0'}уходите с{'\u00A0'}консультации с{'\u00A0'}ясностью, а{'\u00A0'}не{'\u00A0'}с{'\u00A0'}новыми вопросами.
            </p>
          </div>

          {/* Card 3: Письменное заключение */}
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
              Письменное заключение
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              После консультации вы{'\u00A0'}получите документ с{'\u00A0'}рекомендациями врача. Его можно{'\u00A0'}показать своему лечащему врачу или использовать для принятия решения.
            </p>
          </div>

          {/* Card 4: Ответы на ваши вопросы */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <path d="M18 18a6 6 0 0112 0c0 4-6 4-6 8" stroke="#38C6F4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="24" cy="34" r="1.5" fill="#38C6F4" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Ответы на{'\u00A0'}ваши вопросы
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Консультация{'\u00A0'}{'\u2014'} это не{'\u00A0'}монолог врача. Вы{'\u00A0'}задаёте вопросы, врач{'\u00A0'}отвечает. Переводчик{'\u00A0'}обеспечивает полное понимание.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
