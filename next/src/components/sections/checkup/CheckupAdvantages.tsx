export function CheckupAdvantages() {
  return (
    <section className="py-16 relative z-10" id="why-abroad">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-4 text-center">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Что даёт чек-ап в{'\u00A0'}клинике мирового уровня
          </span>
        </h2>
        <p className="text-mu-text-700 text-lg text-center mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Качество чек-апа определяется тремя вещами: оборудование, квалификация врачей и{'\u00A0'}полнота программы. Samsung Medical Center и{'\u00A0'}Severance Hospital{'\u00A0'}{'\u2014'} клиники, которые входят в{'\u00A0'}мировые рейтинги и{'\u00A0'}ежегодно принимают тысячи международных пациентов.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Monitor */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
              Оборудование последнего поколения
            </h3>
            <p className="text-mu-text-700 font-medium">
              Низкодозированная КТ, 3D{'\u00A0'}КТ сосудов сердца, ПЭТ{'\u00A0'}КТ, МРТ/МРА головного мозга{'\u00A0'}{'\u2014'} методы, которые выявляют патологии на{'\u00A0'}самых ранних стадиях.
            </p>
          </div>

          {/* Card 2: User */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="5"/><path d="M5 20c0-5 3-8 7-8s7 3 7 8"/></svg>
            </div>
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
              Врачи с{'\u00A0'}международной репутацией
            </h3>
            <p className="text-mu-text-700 font-medium">
              Обследование проводят профессора и{'\u00A0'}ведущие специалисты. По{'\u00A0'}результатам{'\u00A0'}{'\u2014'} личная консультация врача: что в{'\u00A0'}норме, что требует внимания, что делать дальше.
            </p>
          </div>

          {/* Card 3: ClipboardList */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
            </div>
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
              Программы, а{'\u00A0'}не{'\u00A0'}отдельные анализы
            </h3>
            <p className="text-mu-text-700 font-medium">
              Каждая программа{'\u00A0'}{'\u2014'} это комплекс обследований, составленный так, чтобы ничего не{'\u00A0'}пропустить. От{'\u00A0'}базового скрининга до{'\u00A0'}углублённого обследования с{'\u00A0'}колоноскопией и{'\u00A0'}МРТ.
            </p>
          </div>

          {/* Card 4: CheckCircle */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
              Скорость и{'\u00A0'}точность
            </h3>
            <p className="text-mu-text-700 font-medium">
              Все обследования{'\u00A0'}{'\u2014'} за{'\u00A0'}1{'\u2013'}2{'\u00A0'}дня по{'\u00A0'}заранее составленному расписанию. Результаты{'\u00A0'}{'\u2014'} в{'\u00A0'}день обследования или на{'\u00A0'}следующий день.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
