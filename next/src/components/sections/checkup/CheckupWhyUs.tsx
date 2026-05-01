export function CheckupWhyUs() {
  const items = [
    {
      number: '01',
      title: <>Организация от{'\u00A0'}А{'\u00A0'}до{'\u00A0'}Я</>,
      text: <>Запись в{'\u00A0'}клинику, визовая поддержка, авиабилеты, трансфер из{'\u00A0'}аэропорта, проживание, личный переводчик-сопровождающий на{'\u00A0'}всех этапах.</>,
    },
    {
      number: '02',
      title: <>Личный кабинет и{'\u00A0'}приложение</>,
      text: <>Все результаты обследования{'\u00A0'}{'\u2014'} в{'\u00A0'}вашем личном кабинете: на{'\u00A0'}русском языке, в{'\u00A0'}цифровом виде. DICOM-просмотрщик для снимков, переведённые заключения врачей.</>,
    },
    {
      number: '03',
      title: <>Страховочная сетка: 43{'\u00A0'}клиники, 11{'\u00A0'}стран</>,
      text: <>Если чек-ап выявит проблему{'\u00A0'}{'\u2014'} вам не{'\u00A0'}нужно начинать поиск с{'\u00A0'}нуля. Мы{'\u00A0'}организуем лечение в{'\u00A0'}той{'\u00A0'}же клинике или в{'\u00A0'}любой другой из{'\u00A0'}нашей сети.</>,
    },
    {
      number: '04',
      title: <>Юридическая надёжность</>,
      text: <>MedicusUnion GmbH зарегистрирована в{'\u00A0'}Австрии. Офис в{'\u00A0'}Казахстане{'\u00A0'}{'\u2014'} резидент Astana Hub. Договор, чеки, прозрачные условия. Сертификация ISO{'\u00A0'}27001.</>,
    },
    {
      number: '05',
      title: <>Два направления{'\u00A0'}{'\u2014'} под ваш бюджет</>,
      text: <>Южная Корея{'\u00A0'}{'\u2014'} максимально глубокое обследование в{'\u00A0'}клиниках мирового топ-уровня. Турция{'\u00A0'}{'\u2014'} качественный чек-ап ближе и{'\u00A0'}доступнее по{'\u00A0'}цене.</>,
    },
  ];

  return (
    <section className="py-16 relative z-10" id="why-us">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-4 text-center">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Не{'\u00A0'}просто посредник{'\u00A0'}{'\u2014'} медицинская платформа
          </span>
        </h2>
        <p className="text-mu-text-700 text-lg text-center mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Можно обратиться в{'\u00A0'}клинику напрямую. Но{'\u00A0'}тогда вы{'\u00A0'}сами организуете визу, перелёт, трансфер, проживание, переписку с{'\u00A0'}клиникой на{'\u00A0'}английском, перевод результатов. И{'\u00A0'}если обследование выявит проблему{'\u00A0'}{'\u2014'} вы{'\u00A0'}с{'\u00A0'}ней один на{'\u00A0'}один. MedicusUnion{'\u00A0'}{'\u2014'} это другой подход.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.number} className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
              <div
                className="text-4xl font-extrabold bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent mb-4"
                aria-hidden="true"
              >
                {item.number}
              </div>
              <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
                {item.title}
              </h3>
              <p className="text-mu-text-700 font-medium">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
