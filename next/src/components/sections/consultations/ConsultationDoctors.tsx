export function ConsultationDoctors() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-[#F0F7FF]" id="doctors">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-4">
          Врачи из{'\u00A0'}Германии, Израиля, Швейцарии и{'\u00A0'}ещё 4{'\u00A0'}стран
        </h2>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[800px] mx-auto mb-10">
          На{'\u00A0'}платформе MedicusUnion{'\u00A0'}{'\u2014'} врачи из{'\u00A0'}клиник и{'\u00A0'}медицинских университетов Германии, Израиля, Швейцарии, Австрии, ОАЭ, Южной Кореи и{'\u00A0'}Турции.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Германия */}
          <div className="card-prod p-8 text-center">
            <div className="w-12 h-8 mx-auto mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" aria-hidden="true">
                <rect width="48" height="32" rx="3" fill="#000" />
                <rect y="11" width="48" height="10" fill="#DD0000" />
                <rect y="21" width="48" height="11" rx="0 0 3 3" fill="#FFCC00" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Германия
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Онкология, кардиология, нейрохирургия
            </p>
          </div>

          {/* Израиль */}
          <div className="card-prod p-8 text-center">
            <div className="w-12 h-8 mx-auto mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" aria-hidden="true">
                <rect width="48" height="32" rx="3" fill="#fff" />
                <rect y="4" width="48" height="4" fill="#0038B8" />
                <rect y="24" width="48" height="4" fill="#0038B8" />
                <polygon points="24,9 27.5,18 20.5,18" fill="none" stroke="#0038B8" strokeWidth="1.5" />
                <polygon points="24,23 20.5,14 27.5,14" fill="none" stroke="#0038B8" strokeWidth="1.5" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Израиль
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Онкология, ортопедия, ЭКО
            </p>
          </div>

          {/* Швейцария */}
          <div className="card-prod p-8 text-center">
            <div className="w-12 h-8 mx-auto mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" aria-hidden="true">
                <rect width="48" height="32" rx="3" fill="#DA291C" />
                <rect x="20" y="8" width="8" height="16" fill="#fff" />
                <rect x="16" y="12" width="16" height="8" fill="#fff" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Швейцария
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Кардиология, нейрохирургия
            </p>
          </div>

          {/* Австрия */}
          <div className="card-prod p-8 text-center">
            <div className="w-12 h-8 mx-auto mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" aria-hidden="true">
                <rect width="48" height="32" rx="3" fill="#ED2939" />
                <rect y="11" width="48" height="10" fill="#fff" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Австрия
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Ортопедия, радиология
            </p>
          </div>

          {/* ОАЭ */}
          <div className="card-prod p-8 text-center">
            <div className="w-12 h-8 mx-auto mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" aria-hidden="true">
                <rect width="48" height="32" rx="3" fill="#000" />
                <rect x="12" width="36" height="11" fill="#00732F" />
                <rect x="12" y="11" width="36" height="10" fill="#fff" />
                <rect x="12" y="21" width="36" height="11" fill="#000" />
                <rect width="12" height="32" rx="3 0 0 3" fill="#FF0000" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              ОАЭ
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Кардиология, ортопедия
            </p>
          </div>

          {/* Южная Корея */}
          <div className="card-prod p-8 text-center">
            <div className="w-12 h-8 mx-auto mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" aria-hidden="true">
                <rect width="48" height="32" rx="3" fill="#fff" />
                <circle cx="24" cy="16" r="8" fill="#CD2E3A" />
                <path d="M16 16a8 8 0 0 0 16 0" fill="#0047A0" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Южная Корея
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Онкология, радиология
            </p>
          </div>

          {/* Турция */}
          <div className="card-prod p-8 text-center">
            <div className="w-12 h-8 mx-auto mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" aria-hidden="true">
                <rect width="48" height="32" rx="3" fill="#E30A17" />
                <circle cx="19" cy="16" r="8" fill="#fff" />
                <circle cx="21.5" cy="16" r="6.5" fill="#E30A17" />
                <polygon points="27,16 30,13.5 28,16 30,18.5" fill="#fff" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Турция
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Ортопедия, ЭКО
            </p>
          </div>
        </div>

        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center mt-8">
          Специализации: онкология, кардиология, нейрохирургия, ортопедия, радиология, ЭКО и{'\u00A0'}другие
        </p>
        <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center mt-2">
          Каждый профиль врача содержит: специализация, опыт, клиника, языки консультации, стоимость
        </p>

        <div className="text-center mt-8">
          <a
            href="https://medicusunion.com/doctors"
            className="btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Все врачи
          </a>
        </div>
      </div>
    </section>
  );
}
