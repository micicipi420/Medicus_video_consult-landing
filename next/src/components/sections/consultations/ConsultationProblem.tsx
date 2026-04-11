export function ConsultationProblem() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id="problem">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-10">
          Знакомо?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Сомнения в диагнозе */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="20" cy="20" r="14" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <line x1="30" y1="30" x2="42" y2="42" stroke="#38C6F4" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="14" y1="20" x2="26" y2="20" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="14" x2="20" y2="26" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Сомнения в{'\u00A0'}диагнозе
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Получили диагноз{'\u00A0'}{'\u2014'} и{'\u00A0'}не{'\u00A0'}уверены, что он{'\u00A0'}правильный. Разные врачи{'\u00A0'}говорят разное.
            </p>
          </div>

          {/* Card 2: Лечение за рубежом */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <ellipse cx="24" cy="24" rx="8" ry="18" stroke="#38C6F4" strokeWidth="1.5" fill="none" />
                <line x1="6" y1="16" x2="42" y2="16" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="6" y1="32" x2="42" y2="32" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Лечение за{'\u00A0'}рубежом
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Слышали, что за{'\u00A0'}границей лечат лучше{'\u00A0'}{'\u2014'} но{'\u00A0'}лететь дорого, долго и{'\u00A0'}страшно.
            </p>
          </div>

          {/* Card 3: Время уходит */}
          <div className="card-prod p-8">
            <div className="w-12 h-12 mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <polyline points="24,12 24,24 32,28" stroke="#38C6F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Время уходит
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Время идёт{'\u00A0'}{'\u2014'} а{'\u00A0'}решение всё ещё не{'\u00A0'}принято. Нужна ясность{'\u00A0'}{'\u2014'} сейчас.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
