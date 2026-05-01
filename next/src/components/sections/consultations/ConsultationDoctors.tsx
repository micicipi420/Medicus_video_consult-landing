const specializations = [
  'Онкология',
  'Кардиология',
  'Нейрохирургия',
  'Ортопедия',
  'Радиология',
  'ЭКО',
  'Гинекология',
  'Урология',
  'Гастроэнтерология',
  'Эндокринология',
  'Офтальмология',
  'Дерматология',
  'Педиатрия',
  'Пульмонология',
];

export function ConsultationDoctors() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="doctors">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Врачи из{'\u00A0'}Германии, Израиля, Швейцарии и{'\u00A0'}ещё 4{'\u00A0'}стран
          </span>
        </h2>
      </div>

      {/* Description card */}
      <div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-4xl mx-auto mb-12 space-y-4">
        <p className="text-mu-text-700 font-medium text-lg leading-relaxed">
          На{'\u00A0'}платформе MedicusUnion{'\u00A0'}{'\u2014'} врачи из{'\u00A0'}клиник и{'\u00A0'}медицинских университетов Германии, Израиля, Швейцарии, Австрии, ОАЭ, Южной Кореи и{'\u00A0'}Турции.
        </p>
        <p className="text-mu-text-700 font-medium text-lg leading-relaxed">
          Основные специализации: онкология, кардиология, нейрохирургия, ортопедия, радиология, ЭКО и{'\u00A0'}другие.
        </p>
        <p className="text-mu-text-700 font-medium text-lg leading-relaxed">
          Каждый врач{'\u00A0'}{'\u2014'} с{'\u00A0'}профилем на{'\u00A0'}платформе: специализация, опыт, клиника, языки консультации, стоимость.
        </p>
      </div>

      {/* Country cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
        {/* Германия */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300">
          <div className="mb-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="w-10 h-7 mx-auto" aria-hidden="true">
              <rect width="48" height="32" rx="3" fill="#000" />
              <rect y="11" width="48" height="10" fill="#DD0000" />
              <rect y="21" width="48" height="11" rx="3" fill="#FFCC00" />
            </svg>
          </div>
          <h3 className="font-bold text-mu-text-900 mb-1">Германия</h3>
          <p className="text-sm text-mu-text-700 font-medium">Онкология, кардиология, нейрохирургия</p>
        </div>

        {/* Израиль */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300">
          <div className="mb-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="w-10 h-7 mx-auto" aria-hidden="true">
              <rect width="48" height="32" rx="3" fill="#fff" />
              <rect y="4" width="48" height="4" fill="#0038B8" />
              <rect y="24" width="48" height="4" fill="#0038B8" />
              <polygon points="24,9 27.5,18 20.5,18" fill="none" stroke="#0038B8" strokeWidth="1.5" />
              <polygon points="24,23 20.5,14 27.5,14" fill="none" stroke="#0038B8" strokeWidth="1.5" />
            </svg>
          </div>
          <h3 className="font-bold text-mu-text-900 mb-1">Израиль</h3>
          <p className="text-sm text-mu-text-700 font-medium">Онкология, ортопедия, ЭКО</p>
        </div>

        {/* Швейцария */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300">
          <div className="mb-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="w-10 h-7 mx-auto" aria-hidden="true">
              <rect width="48" height="32" rx="3" fill="#DA291C" />
              <rect x="20" y="8" width="8" height="16" fill="#fff" />
              <rect x="16" y="12" width="16" height="8" fill="#fff" />
            </svg>
          </div>
          <h3 className="font-bold text-mu-text-900 mb-1">Швейцария</h3>
          <p className="text-sm text-mu-text-700 font-medium">Кардиология, нейрохирургия</p>
        </div>

        {/* Австрия */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300">
          <div className="mb-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="w-10 h-7 mx-auto" aria-hidden="true">
              <rect width="48" height="32" rx="3" fill="#ED2939" />
              <rect y="11" width="48" height="10" fill="#fff" />
            </svg>
          </div>
          <h3 className="font-bold text-mu-text-900 mb-1">Австрия</h3>
          <p className="text-sm text-mu-text-700 font-medium">Ортопедия, радиология</p>
        </div>

        {/* ОАЭ */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300">
          <div className="mb-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="w-10 h-7 mx-auto" aria-hidden="true">
              <rect width="48" height="32" rx="3" fill="#000" />
              <rect x="12" width="36" height="11" fill="#00732F" />
              <rect x="12" y="11" width="36" height="10" fill="#fff" />
              <rect x="12" y="21" width="36" height="11" rx="3" fill="#000" />
              <rect width="12" height="32" rx="3" fill="#FF0000" />
            </svg>
          </div>
          <h3 className="font-bold text-mu-text-900 mb-1">ОАЭ</h3>
          <p className="text-sm text-mu-text-700 font-medium">Кардиология, ортопедия</p>
        </div>

        {/* Южная Корея */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300">
          <div className="mb-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="w-10 h-7 mx-auto" aria-hidden="true">
              <rect width="48" height="32" rx="3" fill="#fff" />
              <circle cx="24" cy="16" r="8" fill="#CD2E3A" />
              <path d="M16 16a8 8 0 0 0 16 0" fill="#0047A0" />
            </svg>
          </div>
          <h3 className="font-bold text-mu-text-900 mb-1">Южная Корея</h3>
          <p className="text-sm text-mu-text-700 font-medium">Онкология, радиология</p>
        </div>

        {/* Турция */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-2xl shadow-glass-sm border border-white/60 p-5 text-center hover:shadow-glass hover:border-white/80 transition-all duration-300">
          <div className="mb-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="w-10 h-7 mx-auto" aria-hidden="true">
              <rect width="48" height="32" rx="3" fill="#E30A17" />
              <circle cx="19" cy="16" r="8" fill="#fff" />
              <circle cx="21.5" cy="16" r="6.5" fill="#E30A17" />
              <polygon points="27,16 30,13.5 28,16 30,18.5" fill="#fff" />
            </svg>
          </div>
          <h3 className="font-bold text-mu-text-900 mb-1">Турция</h3>
          <p className="text-sm text-mu-text-700 font-medium">Ортопедия, ЭКО</p>
        </div>
      </div>

      {/* Specializations card */}
      <div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3rem] p-12 border border-white/60 shadow-glass-lg max-w-4xl mx-auto mb-8">
        <h3 className="text-3xl md:text-4xl font-extrabold text-mu-text-900 mb-8 text-center">Доступные специализации</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {specializations.map((spec) => (
            <span key={spec} className="bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] border border-white/60 px-6 py-3 rounded-full font-bold text-mu-text-900 shadow-glass-inner hover:bg-mu-green-50 hover:text-mu-green-700 transition-colors cursor-default">
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* All doctors link */}
      <div className="text-center">
        <a
          href="https://medicusunion.com/doctors"
          className="inline-flex items-center gap-2 bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] text-mu-text-900 px-8 py-4 rounded-3xl font-semibold shadow-glass hover:bg-[var(--glass-card-fill)] transition-all border border-white/60 text-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Все врачи
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
        </a>
      </div>
    </section>
  );
}
