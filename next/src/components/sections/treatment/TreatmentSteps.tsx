const CheckIcon = () => (
  <svg className="w-4 h-4 text-mu-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

export function TreatmentSteps() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="steps">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
          Как это работает
        </span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Step 1: Планирование */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
          <div className="text-6xl font-extrabold text-mu-blue/15 mb-4" aria-hidden="true">01</div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">Планирование</h3>
          <span className="inline-flex items-center bg-mu-blue/10 text-mu-blue font-bold text-sm px-3 py-1 rounded-full mb-4">
            2{'\u2013'}4 дня
          </span>
          <p className="text-mu-text-700 font-medium mb-4">
            Анализ медицинской истории, подбор лучших клиник и{'\u00A0'}врачей, организация онлайн-консультаций с{'\u00A0'}экспертами.
          </p>
          <ul className="space-y-2" role="list">
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Анализ медкарты
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Подбор клиники
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Онлайн-консультации
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Расчёт стоимости
            </li>
          </ul>
        </div>

        {/* Step 2: Логистика */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
          <div className="text-6xl font-extrabold text-mu-blue/15 mb-4" aria-hidden="true">02</div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">Логистика</h3>
          <span className="inline-flex items-center bg-mu-accent-teal-bg text-mu-accent-teal font-bold text-sm px-3 py-1 rounded-full mb-4">
            7{'\u2013'}10 дней
          </span>
          <p className="text-mu-text-700 font-medium mb-4">
            Помощь с{'\u00A0'}оформлением виз, бронирование перелётов и{'\u00A0'}отелей, организация трансферов.
          </p>
          <ul className="space-y-2" role="list">
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Визовая поддержка
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Авиабилеты
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Проживание
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Трансферы
            </li>
          </ul>
        </div>

        {/* Step 3: Координация лечения */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
          <div className="text-6xl font-extrabold text-mu-blue/15 mb-4" aria-hidden="true">03</div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">Координация лечения</h3>
          <span className="inline-flex items-center bg-mu-accent-orange-bg text-mu-accent-orange font-bold text-sm px-3 py-1 rounded-full mb-4">
            По{'\u00A0'}плану лечения
          </span>
          <p className="text-mu-text-700 font-medium mb-4">
            Координация с{'\u00A0'}медперсоналом, услуги переводчика, постоянная поддержка на{'\u00A0'}всех этапах лечения.
          </p>
          <ul className="space-y-2" role="list">
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Постоянная связь
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Медицинские переводчики
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Экстренная поддержка
            </li>
          </ul>
        </div>

        {/* Step 4: Реабилитация */}
        <div className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
          <div className="text-6xl font-extrabold text-mu-blue/15 mb-4" aria-hidden="true">04</div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">Реабилитация</h3>
          <span className="inline-flex items-center bg-mu-green-50 text-mu-green-600 font-bold text-sm px-3 py-1 rounded-full mb-4">
            Долгосрочно
          </span>
          <p className="text-mu-text-700 font-medium mb-4">
            Мониторинг восстановления, координация с{'\u00A0'}врачами на{'\u00A0'}родине, долгосрочное наблюдение.
          </p>
          <ul className="space-y-2" role="list">
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Мониторинг здоровья
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Связь с{'\u00A0'}врачами
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Реабилитационные программы
            </li>
            <li className="flex items-center gap-2 text-sm text-mu-text-900 font-medium">
              <CheckIcon />
              Постоянное наблюдение
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
