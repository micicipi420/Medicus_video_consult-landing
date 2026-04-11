function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      aria-hidden="true"
      className="w-5 h-5 shrink-0"
    >
      <path
        d="M4 10l4 4 8-8"
        stroke="#047857"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckupB2B() {
  const trustItems = [
    <>Юридическое лицо в{'\u00A0'}Австрии (GmbH){'\u00A0'}{'\u2014'} договор, акты, прозрачная отчётность</>,
    <>Офис в{'\u00A0'}Казахстане{'\u00A0'}{'\u2014'} резидент Astana Hub</>,
    <>ISO{'\u00A0'}27001{'\u00A0'}{'\u2014'} медицинские данные сотрудников защищены</>,
    <>Одно контактное лицо{'\u00A0'}{'\u2014'} координация группы любого размера</>,
    <>Личный кабинет для каждого участника{'\u00A0'}{'\u2014'} компания не{'\u00A0'}видит результатов</>,
  ];

  return (
    <section className="py-12 lg:py-[6.25rem] bg-[#F5F7F9]" id="b2b">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-center text-[#18212C] mb-4 leading-[1.2] tracking-[-0.02em] text-balance">
          Чек-апы для бизнеса
        </h2>
        <p className="font-heading text-[1.125rem] font-semibold text-center text-[#18212C]/80 mb-4">
          Корпоративные программы обследования для топ-менеджмента и{'\u00A0'}клиентов вашей компании
        </p>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[800px] mx-auto mb-10">
          Здоровье ключевых людей{'\u00A0'}{'\u2014'} это бизнес-риск, который можно контролировать. MedicusUnion организует корпоративные чек-апы в{'\u00A0'}Samsung Medical Center, Severance Hospital и{'\u00A0'}клиниках Стамбула с{'\u00A0'}полным сопровождением.
        </p>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="card-prod p-6 md:p-8">
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              Для ваших сотрудников
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Чек-ап для топ-менеджмента и{'\u00A0'}ключевых специалистов{'\u00A0'}{'\u2014'} как часть корпоративной программы заботы о{'\u00A0'}здоровье. Покрывает то, что не{'\u00A0'}покрывает стандартный ДМС: онкоскрининг, кардиодиагностику, МРТ, колоноскопию.
            </p>
          </div>
          <div className="card-prod p-6 md:p-8">
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              Для ваших клиентов
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Чек-ап в{'\u00A0'}клинике мирового уровня{'\u00A0'}{'\u2014'} как статусный корпоративный подарок. Запоминается, ценится и{'\u00A0'}работает на{'\u00A0'}лояльность сильнее любого стандартного бонуса.
            </p>
          </div>
        </div>

        {/* Trust section */}
        <div className="mb-10">
          <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-4">
            Почему компании выбирают MedicusUnion
          </h3>
          <ul className="space-y-3">
            {trustItems.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[1.125rem] text-[#4A4E5C]">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="#form-checkup" className="btn-primary">
            Обсудить корпоративную программу
          </a>
        </div>
      </div>
    </section>
  );
}
