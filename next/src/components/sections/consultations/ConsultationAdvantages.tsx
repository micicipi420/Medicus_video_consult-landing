export function ConsultationAdvantages() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="advantages">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Почему через MedicusUnion
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Advantage 1: Документы переведены */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-mu-blue/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-accent-blue shadow-glass-sm border border-white/60 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-mu-text-900 mb-2 leading-snug">
                Документы переведены и{'\u00A0'}подготовлены
              </h3>
              <p className="text-mu-text-700 font-medium text-sm">
                Вы{'\u00A0'}загружаете на{'\u00A0'}русском{'\u00A0'}{'\u2014'} врач получает на{'\u00A0'}своём языке. Не{'\u00A0'}нужно искать переводчика медицинских документов.
              </p>
            </div>
          </div>
        </div>

        {/* Advantage 2: Перевод во время консультации */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-mu-accent-teal-bg backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-accent-teal shadow-glass-sm border border-white/60 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-mu-text-900 mb-2 leading-snug">
                Перевод прямо во{'\u00A0'}время консультации
              </h3>
              <p className="text-mu-text-700 font-medium text-sm">
                Вы{'\u00A0'}говорите на{'\u00A0'}русском, врач{'\u00A0'}{'\u2014'} на{'\u00A0'}своём. Переводчик обеспечивает полное понимание{'\u00A0'}{'\u2014'} включая медицинскую терминологию.
              </p>
            </div>
          </div>
        </div>

        {/* Advantage 3: Всё в одном приложении */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-mu-accent-orange-bg backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-accent-orange shadow-glass-sm border border-white/60 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-mu-text-900 mb-2 leading-snug">
                Всё в{'\u00A0'}одном приложении
              </h3>
              <p className="text-mu-text-700 font-medium text-sm">
                Документы, расписание, видеозвонок, заключение врача{'\u00A0'}{'\u2014'} в{'\u00A0'}личном кабинете. Ничего не{'\u00A0'}потеряется, всё под рукой.
              </p>
            </div>
          </div>
        </div>

        {/* Advantage 4: Офис в Казахстане */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-mu-green-50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-green-600 shadow-glass-sm border border-white/60 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-mu-text-900 mb-2 leading-snug">
                Офис в{'\u00A0'}Казахстане, договор, документы
              </h3>
              <p className="text-mu-text-700 font-medium text-sm">
                MedicusUnion GmbH, Австрия. Офис в{'\u00A0'}Казахстане{'\u00A0'}{'\u2014'} резидент Astana Hub. ISO{'\u00A0'}27001.
              </p>
            </div>
          </div>
        </div>

        {/* Advantage 5: Нужно больше — организуем */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500 md:col-span-2 lg:col-span-1">
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-mu-blue/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-accent-blue shadow-glass-sm border border-white/60 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-mu-text-900 mb-2 leading-snug">
                Нужно больше{'\u00A0'}{'\u2014'} организуем
              </h3>
              <p className="text-mu-text-700 font-medium text-sm">
                Если после консультации нужно лечение за{'\u00A0'}рубежом{'\u00A0'}{'\u2014'} мы{'\u00A0'}организуем всё: клинику, документы, логистику, сопровождение. Но{'\u00A0'}это уже следующий шаг.
              </p>
              <a href="/treatment-abroad" className="inline-flex items-center gap-1 text-mu-accent-blue font-bold mt-3 text-sm hover:gap-2 transition-all">
                Лечение за{'\u00A0'}рубежом
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
