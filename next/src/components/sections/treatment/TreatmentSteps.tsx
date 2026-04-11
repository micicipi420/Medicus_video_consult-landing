export function TreatmentSteps() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id="steps">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-4">
          Ваш путь к{'\u00A0'}здоровью за{'\u00A0'}4{'\u00A0'}простых шага
        </h2>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[720px] mx-auto mb-10">
          Мы{'\u00A0'}сопровождаем вас на{'\u00A0'}каждом этапе медицинского путешествия{'\u00A0'}{'\u2014'} от{'\u00A0'}первой консультации до{'\u00A0'}полного восстановления.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 01 */}
          <div className="card-prod p-8 relative">
            <div className="font-heading text-[4rem] font-bold leading-none text-[rgba(56,198,244,0.12)] absolute top-6 right-8 select-none" aria-hidden="true">
              01
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Планирование
            </h3>
            <span className="text-[0.8125rem] font-heading font-semibold text-[#1A4D80] bg-[#F0F7FF] px-3 py-1 rounded-full inline-block mb-3">
              2{'\u2013'}4 дня
            </span>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed mb-4">
              Анализ медицинской истории, подбор лучших клиник и{'\u00A0'}врачей, организация онлайн-консультаций с{'\u00A0'}экспертами.
            </p>
            <ul className="space-y-1.5 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Анализ медкарты
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Подбор клиники
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Онлайн-консультации
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Расчёт стоимости
              </li>
            </ul>
          </div>

          {/* Step 02 */}
          <div className="card-prod p-8 relative">
            <div className="font-heading text-[4rem] font-bold leading-none text-[rgba(56,198,244,0.12)] absolute top-6 right-8 select-none" aria-hidden="true">
              02
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Логистика
            </h3>
            <span className="text-[0.8125rem] font-heading font-semibold text-[#1A4D80] bg-[#F0F7FF] px-3 py-1 rounded-full inline-block mb-3">
              7{'\u2013'}10 дней
            </span>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed mb-4">
              Помощь с{'\u00A0'}оформлением виз, бронирование перелётов и{'\u00A0'}отелей, организация трансферов.
            </p>
            <ul className="space-y-1.5 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Визовая поддержка
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Авиабилеты
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Проживание
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Трансферы
              </li>
            </ul>
          </div>

          {/* Step 03 */}
          <div className="card-prod p-8 relative">
            <div className="font-heading text-[4rem] font-bold leading-none text-[rgba(56,198,244,0.12)] absolute top-6 right-8 select-none" aria-hidden="true">
              03
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Координация лечения
            </h3>
            <span className="text-[0.8125rem] font-heading font-semibold text-[#1A4D80] bg-[#F0F7FF] px-3 py-1 rounded-full inline-block mb-3">
              По{'\u00A0'}плану лечения
            </span>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed mb-4">
              Координация с{'\u00A0'}медперсоналом, услуги переводчика, постоянная поддержка на{'\u00A0'}всех этапах лечения.
            </p>
            <ul className="space-y-1.5 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Постоянная связь
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Медицинские переводчики
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Экстренная поддержка
              </li>
            </ul>
          </div>

          {/* Step 04 */}
          <div className="card-prod p-8 relative">
            <div className="font-heading text-[4rem] font-bold leading-none text-[rgba(56,198,244,0.12)] absolute top-6 right-8 select-none" aria-hidden="true">
              04
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-2">
              Реабилитация
            </h3>
            <span className="text-[0.8125rem] font-heading font-semibold text-[#1A4D80] bg-[#F0F7FF] px-3 py-1 rounded-full inline-block mb-3">
              Долгосрочно
            </span>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed mb-4">
              Мониторинг восстановления, координация с{'\u00A0'}врачами на{'\u00A0'}родине, долгосрочное наблюдение.
            </p>
            <ul className="space-y-1.5 text-[0.9375rem] text-[#4A4E5C]">
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Мониторинг здоровья
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Связь с{'\u00A0'}врачами
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Реабилитационные программы
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#35B678] before:shrink-0">
                Постоянное наблюдение
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
