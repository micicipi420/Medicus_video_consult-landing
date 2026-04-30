export function ConsultationBenefits() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="benefits">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Что вы{'\u00A0'}получите за{'\u00A0'}одну консультацию
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Benefit 1: Второе мнение */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="w-14 h-14 bg-mu-blue/10 backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-accent-blue shadow-glass-sm border border-white/60 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
            Второе мнение по{'\u00A0'}вашему диагнозу
          </h3>
          <p className="text-mu-text-700 font-medium">
            Врач изучит ваши документы до{'\u00A0'}встречи и{'\u00A0'}даст оценку вашего случая. Не{'\u00A0'}общие слова, а{'\u00A0'}конкретное заключение по{'\u00A0'}вашим анализам и{'\u00A0'}снимкам.
          </p>
        </div>

        {/* Benefit 2: Понятный план действий */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="w-14 h-14 bg-mu-accent-teal-bg backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-accent-teal shadow-glass-sm border border-white/60 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
          </div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
            Понятный план действий
          </h3>
          <p className="text-mu-text-700 font-medium">
            Что делать дальше: какие обследования пройти, какое лечение рекомендуется, какие есть варианты. Вы{'\u00A0'}уходите с{'\u00A0'}консультации с{'\u00A0'}ясностью, а{'\u00A0'}не{'\u00A0'}с{'\u00A0'}новыми вопросами.
          </p>
        </div>

        {/* Benefit 3: Письменное заключение */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="w-14 h-14 bg-mu-green-50 backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-green-600 shadow-glass-sm border border-white/60 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
          </div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
            Письменное заключение
          </h3>
          <p className="text-mu-text-700 font-medium">
            После консультации вы{'\u00A0'}получите документ с{'\u00A0'}рекомендациями врача. Его можно показать своему лечащему врачу или использовать для принятия решения.
          </p>
        </div>

        {/* Benefit 4: Ответы на ваши вопросы */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="w-14 h-14 bg-mu-accent-orange-bg backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-accent-orange shadow-glass-sm border border-white/60 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
            Ответы на{'\u00A0'}ваши вопросы
          </h3>
          <p className="text-mu-text-700 font-medium">
            Консультация{'\u00A0'}{'\u2014'} это не{'\u00A0'}монолог врача. Вы{'\u00A0'}задаёте вопросы, врач отвечает. Переводчик обеспечивает полное понимание.
          </p>
        </div>
      </div>
    </section>
  );
}
