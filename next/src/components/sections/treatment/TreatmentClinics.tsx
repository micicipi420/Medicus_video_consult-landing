export function TreatmentClinics() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="clinics">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
        <span className="text-mu-text-900">
          Подбираем клинику под ваш диагноз, а{'\u00A0'}не{'\u00A0'}продаём {'\u00AB'}свою{'\u00BB'}
        </span>
      </h2>
      <p className="text-mu-text-700 text-lg leading-relaxed font-medium text-center max-w-3xl mx-auto mb-12">
        Прямые контракты с{'\u00A0'}ведущими медицинскими центрами. Это значит: приоритетная запись, согласованные условия лечения и{'\u00A0'}координация без цепочки посредников.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Австрия */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass">
          <div className="w-12 h-8 mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
              <rect width="48" height="32" rx="3" fill="#ED2939" />
              <rect y="11" width="48" height="10" fill="#fff" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">Австрия</h3>
          <p className="text-mu-text-700 font-medium text-sm mb-3">Хирургия {'\u00B7'} Онкология {'\u00B7'} Кардиология</p>
          <ul className="space-y-1.5 text-sm text-mu-text-900 font-medium">
            <li>Rudolfinerhaus</li>
            <li>D&#246;bling Private Clinic</li>
            <li>Goldenes Kreuz Private Hospital</li>
          </ul>
        </div>

        {/* Германия */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass">
          <div className="w-12 h-8 mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
              <rect width="48" height="32" rx="3" fill="#000" />
              <rect y="11" width="48" height="10" fill="#DD0000" />
              <rect y="21" width="48" height="11" rx="0 0 3 3" fill="#FFCC00" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">Германия</h3>
          <p className="text-mu-text-700 font-medium text-sm mb-3">Педиатрия {'\u00B7'} Ортопедия {'\u00B7'} Кардиология</p>
          <ul className="space-y-1.5 text-sm text-mu-text-900 font-medium">
            <li>M1 Pediatric Center</li>
            <li>ATOS Orthopedic Center</li>
            <li>Internistisches Klinikum M&#252;nchen S&#252;d</li>
          </ul>
        </div>

        {/* Швейцария */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass">
          <div className="w-12 h-8 mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
              <rect width="48" height="32" rx="3" fill="#DA291C" />
              <rect x="20" y="8" width="8" height="16" fill="#fff" />
              <rect x="16" y="12" width="16" height="8" fill="#fff" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">Швейцария</h3>
          <p className="text-mu-text-700 font-medium text-sm mb-3">Кардиология {'\u00B7'} Онкология {'\u00B7'} Пластическая хирургия</p>
          <ul className="space-y-1.5 text-sm text-mu-text-900 font-medium">
            <li>Hirslanden Private Hospital Group</li>
          </ul>
        </div>

        {/* Израиль */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass">
          <div className="w-12 h-8 mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
              <rect width="48" height="32" rx="3" fill="#fff" />
              <rect y="4" width="48" height="4" fill="#0038B8" />
              <rect y="24" width="48" height="4" fill="#0038B8" />
              <polygon points="24,9 27.5,18 20.5,18" fill="none" stroke="#0038B8" strokeWidth="1.5" />
              <polygon points="24,23 20.5,14 27.5,14" fill="none" stroke="#0038B8" strokeWidth="1.5" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">Израиль</h3>
          <p className="text-mu-text-700 font-medium text-sm mb-3">Онкология {'\u00B7'} Кардиохирургия {'\u00B7'} Трансплантология</p>
          <ul className="space-y-1.5 text-sm text-mu-text-900 font-medium">
            <li>Sourasky Medical Center (Ichilov)</li>
            <li>Assuta Private Clinic</li>
            <li>Beilinson Hospital</li>
          </ul>
        </div>

        {/* Индия */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass">
          <div className="w-12 h-8 mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
              <rect width="48" height="32" rx="3" fill="#fff" />
              <rect width="48" height="11" rx="3 3 0 0" fill="#FF9933" />
              <rect y="21" width="48" height="11" rx="0 0 3 3" fill="#138808" />
              <circle cx="24" cy="16" r="4" stroke="#000080" strokeWidth="1" fill="none" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">Индия</h3>
          <p className="text-mu-text-700 font-medium text-sm mb-3">Ортопедия {'\u00B7'} Онкология {'\u00B7'} Кардиохирургия</p>
          <ul className="space-y-1.5 text-sm text-mu-text-900 font-medium">
            <li>Marengo CIMS Hospitals</li>
            <li>Shalby Multispecialty Hospital</li>
            <li>HCG Hospital</li>
          </ul>
        </div>

        {/* ОАЭ */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass">
          <div className="w-12 h-8 mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
              <rect width="48" height="32" rx="3" fill="#000" />
              <rect x="12" width="36" height="11" fill="#00732F" />
              <rect x="12" y="11" width="36" height="10" fill="#fff" />
              <rect x="12" y="21" width="36" height="11" fill="#000" />
              <rect width="12" height="32" rx="3 0 0 3" fill="#FF0000" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">ОАЭ</h3>
          <p className="text-mu-text-700 font-medium text-sm mb-3">Кардиология {'\u00B7'} Онкология {'\u00B7'} Ортопедия</p>
          <ul className="space-y-1.5 text-sm text-mu-text-900 font-medium">
            <li>Dubai London Clinic</li>
          </ul>
        </div>

        {/* Турция */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass">
          <div className="w-12 h-8 mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
              <rect width="48" height="32" rx="3" fill="#E30A17" />
              <circle cx="20" cy="16" r="7" fill="#fff" />
              <circle cx="22.5" cy="16" r="5.5" fill="#E30A17" />
              <polygon points="28,16 25.5,17.2 26,14.5 24,12.8 26.7,12.5 28,10 29.3,12.5 32,12.8 30,14.5 30.5,17.2" fill="#fff" transform="scale(0.7) translate(12,8)" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">Турция</h3>
          <p className="text-mu-text-700 font-medium text-sm mb-3">Широкий профиль {'\u00B7'} JCI-аккредитация</p>
          <ul className="space-y-1.5 text-sm text-mu-text-900 font-medium">
            <li>Liv Hospital</li>
            <li>Medicana Hospital</li>
            <li>Istanbul Florence Nightingale Hospital</li>
          </ul>
        </div>

        {/* Южная Корея */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] p-6 border border-white/60 shadow-glass">
          <div className="w-12 h-8 mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
              <rect width="48" height="32" rx="3" fill="#fff" />
              <circle cx="24" cy="16" r="8" fill="none" />
              <path d="M16,16 A8,8 0 0,1 32,16 A4,4 0 0,1 24,16 A4,4 0 0,0 16,16Z" fill="#CD2E3A" />
              <path d="M32,16 A8,8 0 0,1 16,16 A4,4 0 0,1 24,16 A4,4 0 0,0 32,16Z" fill="#0047A0" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">Южная Корея</h3>
          <p className="text-mu-text-700 font-medium text-sm mb-3">Онкология {'\u00B7'} Чекапы {'\u00B7'} Высокотехнологичная диагностика</p>
          <ul className="space-y-1.5 text-sm text-mu-text-900 font-medium">
            <li>Samsung Medical Center</li>
            <li>Severance Hospital</li>
            <li>Seoul National University Hospital</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-mu-text-700 font-medium mt-10 max-w-2xl mx-auto">
        Это часть нашей партнёрской сети. Если для вашего случая нужен другой специалист или клиника{'\u00A0'}{'\u2014'} мы{'\u00A0'}найдём.
      </p>
    </section>
  );
}
