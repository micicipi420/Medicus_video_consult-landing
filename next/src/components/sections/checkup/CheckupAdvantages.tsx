export function CheckupAdvantages() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id="why-abroad">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-center text-[#18212C] mb-4 leading-[1.2] tracking-[-0.02em] text-balance">
          Что даёт чек-ап в{'\u00A0'}клинике мирового уровня
        </h2>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[800px] mx-auto mb-10">
          Качество чек-апа определяется тремя вещами: оборудование, квалификация врачей и{'\u00A0'}полнота программы. Samsung Medical Center и{'\u00A0'}Severance Hospital{'\u00A0'}{'\u2014'} клиники, которые входят в{'\u00A0'}мировые рейтинги и{'\u00A0'}ежегодно принимают тысячи международных пациентов.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Equipment */}
          <div className="card-prod p-6 md:p-8">
            <div className="w-12 h-12 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="24" rx="4" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <circle cx="24" cy="24" r="6" stroke="#35B678" strokeWidth="2" fill="rgba(53,182,120,0.15)" />
                <line x1="8" y1="36" x2="14" y2="42" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
                <line x1="40" y1="36" x2="34" y2="42" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              Оборудование последнего поколения
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Низкодозированная КТ, 3D{'\u00A0'}КТ сосудов сердца, ПЭТ{'\u00A0'}КТ, МРТ/МРА головного мозга{'\u00A0'}{'\u2014'} методы, которые выявляют патологии на{'\u00A0'}самых ранних стадиях.
            </p>
          </div>

          {/* Card 2: Doctors */}
          <div className="card-prod p-6 md:p-8">
            <div className="w-12 h-12 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="16" r="8" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <path d="M10 40c0-8 6-14 14-14s14 6 14 14" stroke="#38C6F4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M20 14l4 4 4-4" stroke="#35B678" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              Врачи с{'\u00A0'}международной репутацией
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Обследование проводят профессора и{'\u00A0'}ведущие специалисты. По{'\u00A0'}результатам{'\u00A0'}{'\u2014'} личная консультация врача: что в{'\u00A0'}норме, что требует внимания, что делать дальше.
            </p>
          </div>

          {/* Card 3: Programs */}
          <div className="card-prod p-6 md:p-8">
            <div className="w-12 h-12 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <rect x="10" y="8" width="28" height="34" rx="3" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <rect x="17" y="4" width="14" height="8" rx="2" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <line x1="16" y1="22" x2="32" y2="22" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="28" x2="28" y2="28" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="34" x2="24" y2="34" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              Программы, а{'\u00A0'}не{'\u00A0'}отдельные анализы
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Каждая программа{'\u00A0'}{'\u2014'} это комплекс обследований, составленный так, чтобы ничего не{'\u00A0'}пропустить. От{'\u00A0'}базового скрининга до{'\u00A0'}углублённого обследования с{'\u00A0'}колоноскопией и{'\u00A0'}МРТ.
            </p>
          </div>

          {/* Card 4: Speed */}
          <div className="card-prod p-6 md:p-8">
            <div className="w-12 h-12 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <path d="M16 24l6 6 10-10" stroke="#35B678" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              Скорость и{'\u00A0'}точность
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Все обследования{'\u00A0'}{'\u2014'} за{'\u00A0'}1{'\u2013'}2{'\u00A0'}дня по{'\u00A0'}заранее составленному расписанию. Результаты{'\u00A0'}{'\u2014'} в{'\u00A0'}день обследования или на{'\u00A0'}следующий день.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
