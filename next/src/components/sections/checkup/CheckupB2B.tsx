function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--mu-green-600)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function CheckupB2B() {
  const trustItems = [
    <>Юридическое лицо в{'\u00A0'}Австрии (GmbH){'\u00A0'}{'\u2014'} договор, акты, прозрачная отчётность</>,
    <>Офис в{'\u00A0'}Казахстане{'\u00A0'}{'\u2014'} резидент Astana Hub</>,
    <>ISO{'\u00A0'}27001{'\u00A0'}{'\u2014'} медицинские данные сотрудников защищены по{'\u00A0'}международным стандартам</>,
    <>Одно контактное лицо{'\u00A0'}{'\u2014'} координация группы любого размера</>,
    <>Личный кабинет для каждого участника{'\u00A0'}{'\u2014'} компания не{'\u00A0'}видит результатов, сотрудник/клиент видит свои</>,
  ];

  return (
    <section className="py-16 relative z-10" id="b2b">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-4 text-center">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Чек-апы для бизнеса
          </span>
        </h2>
        <p className="text-mu-blue font-bold text-lg text-center mb-4">
          Корпоративные программы обследования для топ-менеджмента и{'\u00A0'}клиентов вашей компании
        </p>
        <p className="text-mu-text-700 text-lg text-center mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Здоровье ключевых людей{'\u00A0'}{'\u2014'} это бизнес-риск, который можно контролировать. MedicusUnion организует корпоративные чек-апы в{'\u00A0'}Samsung Medical Center, Severance Hospital и{'\u00A0'}клиниках Стамбула с{'\u00A0'}полным сопровождением.
        </p>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
              Для ваших сотрудников
            </h3>
            <p className="text-mu-text-700 font-medium">
              Чек-ап для топ-менеджмента и{'\u00A0'}ключевых специалистов{'\u00A0'}{'\u2014'} как часть корпоративной программы заботы о{'\u00A0'}здоровье. Покрывает то, что не{'\u00A0'}покрывает стандартный ДМС: онкоскрининг, кардиодиагностику, МРТ, колоноскопию.
            </p>
          </div>
          <div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
              Для ваших клиентов
            </h3>
            <p className="text-mu-text-700 font-medium">
              Чек-ап в{'\u00A0'}клинике мирового уровня{'\u00A0'}{'\u2014'} как статусный корпоративный подарок. Запоминается, ценится и{'\u00A0'}работает на{'\u00A0'}лояльность сильнее любого стандартного бонуса.
            </p>
          </div>
        </div>

        {/* Trust section in glass card */}
        <div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass mb-8">
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-4">
            Почему компании выбирают MedicusUnion
          </h3>
          <ul className="space-y-3" role="list">
            {trustItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircleIcon />
                <span className="text-mu-text-900 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#form-checkup"
            className="btn-primary bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-10 py-5 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 text-lg inline-flex items-center gap-2"
          >
            Обсудить корпоративную программу
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
