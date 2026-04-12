const COUNTRIES = [
  {
    country: 'Германия',
    clinics: `University Clinic of Munich${'\u00A0'}${'\u00B7'}${'\u00A0'}University Clinic of Freiburg${'\u00A0'}${'\u00B7'}${'\u00A0'}ATOS Orthopedic Center${'\u00A0'}${'\u00B7'}${'\u00A0'}Internistisches Klinikum M\u00FCnchen S\u00FCd${'\u00A0'}${'\u00B7'}${'\u00A0'}M1 Pediatric Center`,
    specialties: 'Ортопедия, кардиология, педиатрия',
  },
  {
    country: 'Австрия',
    clinics: `AKH (Университетская клиника Вены)${'\u00A0'}${'\u00B7'}${'\u00A0'}Rudolfinerhaus${'\u00A0'}${'\u00B7'}${'\u00A0'}D\u00F6bling Private Clinic${'\u00A0'}${'\u00B7'}${'\u00A0'}Wiener Privatklinik${'\u00A0'}${'\u00B7'}${'\u00A0'}Confraternit\u00E4t`,
    specialties: 'Хирургия, онкология, мультипрофиль',
  },
  {
    country: 'Швейцария',
    clinics: `Hirslanden Group${'\u00A0'}${'\u00B7'}${'\u00A0'}Swiss Medical Network`,
    specialties: 'Кардиология, онкология',
  },
  {
    country: 'Израиль',
    clinics: `Ichilov Medical Center${'\u00A0'}${'\u00B7'}${'\u00A0'}Assuta Hospital${'\u00A0'}${'\u00B7'}${'\u00A0'}Beilinson Clinic`,
    specialties: 'Онкология, трансплантология, кардиохирургия',
  },
  {
    country: 'Южная Корея',
    clinics: `Samsung Medical Center${'\u00A0'}${'\u00B7'}${'\u00A0'}Severance Hospital${'\u00A0'}${'\u00B7'}${'\u00A0'}Seoul National University Hospital${'\u00A0'}${'\u00B7'}${'\u00A0'}Chaum Life Center${'\u00A0'}${'\u00B7'}${'\u00A0'}Aju University Hospital`,
    specialties: 'Онкология, чек-апы, высокотехнологичная диагностика',
  },
  {
    country: 'Турция',
    clinics: `Liv Hospital${'\u00A0'}${'\u00B7'}${'\u00A0'}Medicana Hospital${'\u00A0'}${'\u00B7'}${'\u00A0'}Istanbul Florence Nightingale Hospital`,
    specialties: 'Широкий профиль, JCI-аккредитация',
  },
  {
    country: 'ОАЭ',
    clinics: `Dubai London Hospital${'\u00A0'}${'\u00B7'}${'\u00A0'}Samaa Assisted Fertilization Center${'\u00A0'}${'\u00B7'}${'\u00A0'}Kandinsky Clinic Dubai`,
    specialties: 'Кардиология, ЭКО',
  },
  {
    country: 'Индия',
    clinics: `Shalby Hospitals${'\u00A0'}${'\u00B7'}${'\u00A0'}CIMS Marengo Hospitals${'\u00A0'}${'\u00B7'}${'\u00A0'}HCG Hospitals`,
    specialties: 'Ортопедия, онкология, кардиохирургия',
  },
];

export function ClinicsSection() {
  return (
    <section className="py-16 relative z-10" id="clinics">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              Клиники, с{'\u00A0'}которыми мы{'\u00A0'}работаем
            </span>
          </h2>
          <p className="text-mu-text-700 text-lg max-w-2xl mx-auto font-medium">
            Прямые контракты с{'\u00A0'}медицинскими центрами. Приоритетная запись, согласованные условия, координация без цепочки посредников.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {COUNTRIES.map((item) => (
            <div
              key={item.country}
              className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-glass border border-glass-border p-8 hover:shadow-glass-lg hover:border-glass-border-strong transition-all duration-300"
            >
              <h3 className="font-extrabold text-mu-text-900 text-lg mb-2">{item.country}</h3>
              <p className="text-mu-text-700 font-medium text-sm leading-relaxed mb-2">{item.clinics}</p>
              <p className="text-mu-accent-blue font-bold text-sm">{item.specialties}</p>
            </div>
          ))}
        </div>

        <p className="text-mu-text-700 font-medium text-center max-w-2xl mx-auto">
          Это часть нашей партнёрской сети. Если для вашего случая нужна другая клиника или специалист{'\u00A0'}{'\u2014'} мы{'\u00A0'}найдём.
        </p>
      </div>
    </section>
  );
}
