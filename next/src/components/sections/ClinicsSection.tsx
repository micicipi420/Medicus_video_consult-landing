import React from 'react';

const FLAGS: Record<string, React.ReactNode> = {
  'Германия': (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0 rounded-sm shadow-sm">
      <rect width="24" height="5.33" fill="#000"/>
      <rect y="5.33" width="24" height="5.33" fill="#DD0000"/>
      <rect y="10.67" width="24" height="5.33" fill="#FFCE00"/>
    </svg>
  ),
  'Австрия': (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0 rounded-sm shadow-sm">
      <rect width="24" height="5.33" fill="#ED2939"/>
      <rect y="5.33" width="24" height="5.33" fill="#FFF"/>
      <rect y="10.67" width="24" height="5.33" fill="#ED2939"/>
    </svg>
  ),
  'Швейцария': (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0 rounded-sm shadow-sm">
      <rect width="24" height="16" fill="#FF0000"/>
      <rect x="10" y="3" width="4" height="10" fill="#FFF"/>
      <rect x="7" y="6" width="10" height="4" fill="#FFF"/>
    </svg>
  ),
  'Израиль': (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0 rounded-sm shadow-sm">
      <rect width="24" height="16" fill="#FFF"/>
      <rect y="1.5" width="24" height="2.5" fill="#0038B8"/>
      <rect y="12" width="24" height="2.5" fill="#0038B8"/>
      <path d="M12 4.5L14.5 9H9.5L12 4.5Z" fill="#0038B8"/>
      <path d="M12 11.5L9.5 7H14.5L12 11.5Z" fill="#0038B8"/>
    </svg>
  ),
  'Южная Корея': (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0 rounded-sm shadow-sm">
      <rect width="24" height="16" fill="#FFF"/>
      <circle cx="12" cy="8" r="4" fill="#C60C30"/>
      <path d="M12 4C14.2 4 16 5.8 16 8C14.2 8 12 6 12 4Z" fill="#003478"/>
      <path d="M12 12C9.8 12 8 10.2 8 8C9.8 8 12 10 12 12Z" fill="#003478"/>
    </svg>
  ),
  'Турция': (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0 rounded-sm shadow-sm">
      <rect width="24" height="16" fill="#E30A17"/>
      <circle cx="10" cy="8" r="3.5" fill="#FFF"/>
      <circle cx="11" cy="8" r="2.8" fill="#E30A17"/>
      <path d="M14 6.2L14.6 8L16.2 8L14.8 9L15.3 10.8L14 9.8L12.7 10.8L13.2 9L11.8 8L13.4 8L14 6.2Z" fill="#FFF"/>
    </svg>
  ),
  'ОАЭ': (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0 rounded-sm shadow-sm">
      <rect width="24" height="5.33" fill="#00732F"/>
      <rect y="5.33" width="24" height="5.33" fill="#FFF"/>
      <rect y="10.67" width="24" height="5.33" fill="#000"/>
      <rect width="6" height="16" fill="#FF0000"/>
    </svg>
  ),
  'Индия': (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0 rounded-sm shadow-sm">
      <rect width="24" height="5.33" fill="#FF9933"/>
      <rect y="5.33" width="24" height="5.33" fill="#FFF"/>
      <rect y="10.67" width="24" height="5.33" fill="#138808"/>
      <circle cx="12" cy="8" r="1.8" stroke="#000080" strokeWidth="0.5" fill="none"/>
    </svg>
  ),
};

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {COUNTRIES.map((item) => (
            <div
              key={item.country}
              className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-glass border border-glass-border p-8 hover:shadow-glass-lg hover:border-glass-border-strong transition-all duration-300"
            >
              <h3 className="font-extrabold text-mu-text-900 text-lg mb-2 flex items-center gap-2">
                {FLAGS[item.country]}
                {item.country}
              </h3>
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
