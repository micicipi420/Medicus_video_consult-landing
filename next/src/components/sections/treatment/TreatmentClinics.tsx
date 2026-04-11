export function TreatmentClinics() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-[#F5F7F9]" id="clinics">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-4">
          Лучшие клиники мира
        </h2>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[720px] mx-auto mb-10">
          14{'\u00A0'}ведущих медицинских центров с{'\u00A0'}мировой репутацией. Партнёрские клиники в{'\u00A0'}6{'\u00A0'}странах.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Германия */}
          <div className="card-prod p-8">
            <div className="w-12 h-8 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
                <rect width="48" height="32" rx="3" fill="#000" />
                <rect y="11" width="48" height="10" fill="#DD0000" />
                <rect y="21" width="48" height="11" rx="0 0 3 3" fill="#FFCC00" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Германия
            </h3>
            <p className="text-[0.9375rem] font-heading font-semibold text-[#1A4D80] mb-1">
              2{'\u00A0'}800+ специалистов
            </p>
            <p className="text-[0.875rem] text-[rgba(24,33,44,0.55)] mb-3">
              Педиатрия {'\u00B7'} Ортопедия {'\u00B7'} Кардиология
            </p>
            <ul className="space-y-1 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                M1 Pediatric Center
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                ATOS Orthopedic Center
              </li>
            </ul>
          </div>

          {/* ОАЭ */}
          <div className="card-prod p-8">
            <div className="w-12 h-8 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
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
            <p className="text-[0.9375rem] font-heading font-semibold text-[#1A4D80] mb-1">
              950+ специалистов
            </p>
            <p className="text-[0.875rem] text-[rgba(24,33,44,0.55)] mb-3">
              Кардиология {'\u00B7'} Онкология {'\u00B7'} Ортопедия
            </p>
            <ul className="space-y-1 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Dubai London Clinic
              </li>
            </ul>
          </div>

          {/* Австрия */}
          <div className="card-prod p-8">
            <div className="w-12 h-8 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
                <rect width="48" height="32" rx="3" fill="#ED2939" />
                <rect y="11" width="48" height="10" fill="#fff" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Австрия
            </h3>
            <p className="text-[0.9375rem] font-heading font-semibold text-[#1A4D80] mb-1">
              1{'\u00A0'}900+ специалистов
            </p>
            <p className="text-[0.875rem] text-[rgba(24,33,44,0.55)] mb-3">
              Кардиология {'\u00B7'} Онкология {'\u00B7'} Хирургия
            </p>
            <ul className="space-y-1 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Rudolfinerhaus Hospital
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                D&#246;bling Private Clinic
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Goldenes Kreuz Hospital
              </li>
            </ul>
          </div>

          {/* Швейцария */}
          <div className="card-prod p-8">
            <div className="w-12 h-8 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
                <rect width="48" height="32" rx="3" fill="#DA291C" />
                <rect x="20" y="8" width="8" height="16" fill="#fff" />
                <rect x="16" y="12" width="16" height="8" fill="#fff" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Швейцария
            </h3>
            <p className="text-[0.9375rem] font-heading font-semibold text-[#1A4D80] mb-1">
              1{'\u00A0'}200+ специалистов
            </p>
            <p className="text-[0.875rem] text-[rgba(24,33,44,0.55)] mb-3">
              Кардиология {'\u00B7'} Онкология {'\u00B7'} Пластическая хирургия
            </p>
            <ul className="space-y-1 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Hirslanden Hospital Group
              </li>
            </ul>
          </div>

          {/* Израиль */}
          <div className="card-prod p-8">
            <div className="w-12 h-8 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
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
            <p className="text-[0.9375rem] font-heading font-semibold text-[#1A4D80] mb-1">
              2{'\u00A0'}400+ специалистов
            </p>
            <p className="text-[0.875rem] text-[rgba(24,33,44,0.55)] mb-3">
              Онкология {'\u00B7'} Кардиохирургия {'\u00B7'} Неврология
            </p>
            <ul className="space-y-1 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Sourasky Medical Center
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Assuta Private Clinic
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Beilinson Hospital
              </li>
            </ul>
          </div>

          {/* Индия */}
          <div className="card-prod p-8">
            <div className="w-12 h-8 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
                <rect width="48" height="32" rx="3" fill="#fff" />
                <rect width="48" height="11" rx="3 3 0 0" fill="#FF9933" />
                <rect y="21" width="48" height="11" rx="0 0 3 3" fill="#138808" />
                <circle cx="24" cy="16" r="4" stroke="#000080" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Индия
            </h3>
            <p className="text-[0.9375rem] font-heading font-semibold text-[#1A4D80] mb-1">
              3{'\u00A0'}500+ специалистов
            </p>
            <p className="text-[0.875rem] text-[rgba(24,33,44,0.55)] mb-3">
              Кардиохирургия {'\u00B7'} Онкология {'\u00B7'} Трансплантология
            </p>
            <ul className="space-y-1 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Marengo CIMS Hospitals
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Shalby Multispecialty Hospital
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                HCG Hospital
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#38C6F4] before:shrink-0">
                Medicover Hospitals
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
