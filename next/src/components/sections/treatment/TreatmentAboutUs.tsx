export function TreatmentAboutUs() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="about-us">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
          MedicusUnion{'\u00A0'}{'\u2014'} ваш надёжный партнёр в{'\u00A0'}лечении за{'\u00A0'}границей
        </span>
      </h2>
      <p className="text-mu-text-700 text-lg leading-relaxed font-medium text-center max-w-3xl mx-auto mb-12">
        Организуем лечение под ключ: от{'\u00A0'}согласования с{'\u00A0'}клиникой до{'\u00A0'}выбора страны и{'\u00A0'}решения всех формальностей. За{'\u00A0'}счёт опыта и{'\u00A0'}партнёрских связей экономим ваши деньги и{'\u00A0'}время.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: 15+ лет практики */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
          <div className="w-14 h-14 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="24" height="24">
              <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
              <polyline points="16,24 22,30 32,18" stroke="#35B678" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
            15+ лет практики
          </h3>
          <p className="text-mu-text-700 font-medium">
            10{'\u00A0'}000+ пациентов доверили нам лечение за{'\u00A0'}рубежом{'\u00A0'}{'\u2014'} устойчивые процессы и{'\u00A0'}проверенные партнёры.
          </p>
        </div>

        {/* Card 2: Выбор страны под задачу */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
          <div className="w-14 h-14 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="24" height="24">
              <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
              <ellipse cx="24" cy="24" rx="8" ry="18" stroke="#38C6F4" strokeWidth="1.5" fill="none" />
              <line x1="6" y1="18" x2="42" y2="18" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="6" y1="30" x2="42" y2="30" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
            Выбор страны под задачу
          </h3>
          <p className="text-mu-text-700 font-medium">
            Австрия, Швейцария, Германия, Индия, ОАЭ, Израиль{'\u00A0'}{'\u2014'} обоснуем клинические и{'\u00A0'}бюджетные плюсы каждого варианта.
          </p>
        </div>

        {/* Card 3: Прямые партнёрства */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
          <div className="w-14 h-14 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="24" height="24">
              <rect x="8" y="10" width="32" height="28" rx="4" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
              <path d="M16 10V6" stroke="#38C6F4" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M32 10V6" stroke="#38C6F4" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="8" y1="18" x2="40" y2="18" stroke="#38C6F4" strokeWidth="2" />
              <circle cx="24" cy="28" r="4" stroke="#35B678" strokeWidth="2" fill="rgba(53,182,120,0.15)" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
            Прямые партнёрства
          </h3>
          <p className="text-mu-text-700 font-medium">
            Rudolfinerhaus, Ichilov, Hirslanden и{'\u00A0'}другие{'\u00A0'}{'\u2014'} быстрые слоты и{'\u00A0'}согласованные протоколы лечения.
          </p>
        </div>

        {/* Card 4: Медицинская экспертиза */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
          <div className="w-14 h-14 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="24" height="24">
              <rect x="10" y="8" width="28" height="34" rx="3" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
              <rect x="17" y="4" width="14" height="8" rx="2" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
              <line x1="16" y1="22" x2="32" y2="22" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="28" x2="28" y2="28" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="34" x2="24" y2="34" stroke="#38C6F4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
            Медицинская экспертиза
          </h3>
          <p className="text-mu-text-700 font-medium">
            Наш координатор сверяет показания и{'\u00A0'}документы{'\u00A0'}{'\u2014'} не{'\u00A0'}{'\u00AB'}просто туризм{'\u00BB'}, а{'\u00A0'}обоснованное лечение.
          </p>
        </div>
      </div>
    </section>
  );
}
