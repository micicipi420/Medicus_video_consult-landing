import type { ReactNode } from 'react';

interface ProgramCard {
  name: string;
  featured?: boolean;
  spanFull?: boolean;
  price: ReactNode;
  description: ReactNode;
}

function GlassPricingCard({ name, featured, spanFull, price, description }: ProgramCard) {
  const cardClasses = featured
    ? `bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] p-8 border border-mu-blue/40 shadow-[0_16px_48px_color-mix(in_oklch,var(--color-mu-blue)_15%,transparent)] flex flex-col${spanFull ? ' md:col-span-2 lg:col-span-3' : ''}`
    : 'bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[3rem] p-8 border border-white/60 shadow-glass flex flex-col';

  const badgeClasses = featured
    ? 'inline-flex items-center gap-2 bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-4 py-1.5 rounded-full shadow-sm w-fit mb-4'
    : 'inline-flex items-center gap-2 bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] border border-glass-border px-4 py-1.5 rounded-full shadow-sm w-fit mb-4';

  const badgeTextClasses = featured
    ? 'text-sm font-bold'
    : 'text-sm font-bold text-mu-accent-blue';

  return (
    <div className={cardClasses}>
      <span className={badgeClasses}>
        <span className={badgeTextClasses}>{name}</span>
      </span>
      <div className="text-2xl font-extrabold bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent mb-3">
        {price}
      </div>
      <p className={`text-mu-text-700 font-medium${spanFull ? '' : ' flex-grow'}`}>
        {description}
      </p>
    </div>
  );
}

export function CheckupProgramsKorea() {
  const comprehensivePrograms: ProgramCard[] = [
    {
      name: 'Базовая',
      price: <>от{'\u00A0'}~$760 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$810 (жен.)</span></>,
      description: <>Анализы крови (метаболизм, онкомаркеры, гепатит, инфекции), анализ мочи и{'\u00A0'}кала, офтальмолог, аудиометрия, ЭКГ, флюорография, УЗИ брюшной полости, стоматолог, маммография (жен.{'\u00A0'}35+), гинекология (жен.), консультация врача.</>,
    },
    {
      name: 'Primary',
      price: <>от{'\u00A0'}~$1{'\u00A0'}400 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$1{'\u00A0'}750 (жен.) {'\u00B7'} 3{'\u00A0'}часа</span></>,
      description: <>Всё из{'\u00A0'}базовой + расширенные анализы крови (щитовидная железа, липидный профиль, диабет, анемия, половые гормоны, витамин{'\u00A0'}D), гастроскопия с{'\u00A0'}седацией, УЗИ сонных артерий, анализ состава тела.</>,
    },
    {
      name: 'Executive',
      price: <>от{'\u00A0'}~$2{'\u00A0'}270 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$2{'\u00A0'}600 (жен.) {'\u00B7'} 4{'\u00A0'}часа</span></>,
      description: <>Всё из{'\u00A0'}Primary + колоноскопия с{'\u00A0'}седацией, УЗИ сердца, детальные анализы крови (электролиты, маркеры костной ткани, B12, фолиевая кислота, NT-pro BNP), денситометрия (35+).</>,
    },
    {
      name: 'Executive on\u00A0Cancer',
      featured: true,
      price: <>от{'\u00A0'}~$2{'\u00A0'}150 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$2{'\u00A0'}690 (жен.) {'\u00B7'} 5{'\u00A0'}часов</span></>,
      description: <>Всё из{'\u00A0'}Executive + КТ{'\u00A0'}брюшной полости и{'\u00A0'}малого таза, низкодозированная КТ{'\u00A0'}лёгких, расширенные анализы на{'\u00A0'}онкомаркеры, УЗИ щитовидной железы. Углублённая проверка на{'\u00A0'}онкологию.</>,
    },
    {
      name: 'Премиум',
      price: <>от{'\u00A0'}~$2{'\u00A0'}410 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$2{'\u00A0'}990 (жен.)</span></>,
      description: <>Базовая + всё из{'\u00A0'}Executive, КТ{'\u00A0'}на кальциноз коронарных артерий, КТ{'\u00A0'}брюшной полости, низкодозированная КТ{'\u00A0'}лёгких, колоноскопия с{'\u00A0'}седацией, денситометрия, Exbody (костно-мышечный дисбаланс).</>,
    },
    {
      name: 'Платинум',
      price: <>от{'\u00A0'}~$4{'\u00A0'}280 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$4{'\u00A0'}860 (жен.)</span></>,
      description: <>Всё из{'\u00A0'}Премиум + МРТ/МРА головного мозга, УЗИ сонных артерий, УЗИ сердца.</>,
    },
    {
      name: 'Ноблесс',
      featured: true,
      spanFull: true,
      price: <>от{'\u00A0'}~$6{'\u00A0'}100 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$6{'\u00A0'}420 (жен.) {'\u00B7'} 8{'\u00A0'}часов</span></>,
      description: <>Максимальная программа. Всё из{'\u00A0'}Платинум + МРТ{'\u00A0'}брюшной полости, 3D{'\u00A0'}КТ сосудов сердца, МРТ{'\u00A0'}предстательной железы (муж.), ПЭТ{'\u00A0'}КТ (40+), стоматологический осмотр, панорамный снимок зубов, аудиометрия.</>,
    },
  ];

  const teenPrograms: ProgramCard[] = [
    {
      name: 'Подростковая',
      price: <>от{'\u00A0'}~$440 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$475 (жен.)</span></>,
      description: <>Анализы крови (анемия, метаболизм, функция печени/почек/щитовидной железы, гепатит, инфекции), измерение давления, анализ мочи, острота зрения и{'\u00A0'}слуха, ЭКГ, флюорография, УЗИ брюшной полости.</>,
    },
  ];

  const specializedPrograms: ProgramCard[] = [
    {
      name: 'Пищеварительная система',
      price: <>от{'\u00A0'}~$1{'\u00A0'}500 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$1{'\u00A0'}560 (жен.)</span></>,
      description: <>КТ{'\u00A0'}брюшной полости, колоноскопия с{'\u00A0'}седацией.</>,
    },
    {
      name: 'Сердечно-сосудистая система',
      price: <>от{'\u00A0'}~$1{'\u00A0'}800 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$1{'\u00A0'}850 (жен.)</span></>,
      description: <>3D{'\u00A0'}КТ сосудов сердца, УЗИ сердца и{'\u00A0'}сонных артерий, измерение стеноза и{'\u00A0'}эластичности артерий, центральное аортальное давление.</>,
    },
    {
      name: 'Дыхательная система',
      price: <>от{'\u00A0'}~$1{'\u00A0'}260 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$1{'\u00A0'}350 (жен.)</span></>,
      description: <>Низкодозированная КТ{'\u00A0'}лёгких, онкомаркер рака лёгких, анализ на{'\u00A0'}аллергию (MAST/61), функция лёгких.</>,
    },
    {
      name: 'Головной мозг',
      price: <>от{'\u00A0'}~$2{'\u00A0'}400 <span className="text-base font-bold text-mu-text-700">(муж.) / ~$2{'\u00A0'}450 (жен.)</span></>,
      description: <>МРТ + МРА головного мозга, УЗИ сонных артерий, измерение стеноза и{'\u00A0'}эластичности артерий.</>,
    },
    {
      name: 'Для будущих мам',
      price: <>от{'\u00A0'}~$1{'\u00A0'}200 <span className="text-base font-bold text-mu-text-700">(жен.)</span></>,
      description: <>УЗИ малого таза, антимюллеров гормон, антитела к{'\u00A0'}краснухе, тесты на{'\u00A0'}рак яичников (HE4, ROMA).</>,
    },
    {
      name: 'Для женщин',
      price: <>от{'\u00A0'}~$1{'\u00A0'}735 <span className="text-base font-bold text-mu-text-700">(жен.)</span></>,
      description: <>УЗИ щитовидной железы, молочных желёз, малого таза, ВПЧ, денситометрия, женские гормоны, тесты на{'\u00A0'}рак яичников.</>,
    },
  ];

  return (
    <section className="py-16 relative z-10" id="programs-korea">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-4 text-center">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Чек-ап в{'\u00A0'}Южной Корее
          </span>
        </h2>
        <p className="text-mu-blue font-bold text-lg text-center mb-4">
          Samsung Medical Center {'\u00B7'} Severance Hospital{'\u00A0'}{'\u2014'} ведущие клиники Сеула с{'\u00A0'}международной аккредитацией
        </p>
        <p className="text-mu-text-700 text-lg text-center mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Samsung Medical Center{'\u00A0'}{'\u2014'} №1 в{'\u00A0'}Азии по{'\u00A0'}онкологии. Severance Hospital{'\u00A0'}{'\u2014'} один из{'\u00A0'}старейших университетских госпиталей Кореи, основан в{'\u00A0'}1885{'\u00A0'}году. Оба центра ежегодно принимают десятки тысяч международных пациентов.
        </p>

        {/* Comprehensive Programs */}
        <h3 className="text-2xl font-extrabold text-mu-text-900 mb-6">
          Комплексные программы
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {comprehensivePrograms.map((program) => (
            <GlassPricingCard key={program.name} {...program} />
          ))}
        </div>

        {/* Teen Programs */}
        <h3 className="text-2xl font-extrabold text-mu-text-900 mb-6">
          Для подростков (13{'\u2013'}18 лет)
        </h3>
        <div className="grid md:grid-cols-1 max-w-xl gap-6 mb-12">
          {teenPrograms.map((program) => (
            <GlassPricingCard key={program.name} {...program} />
          ))}
        </div>

        {/* Specialized Packages */}
        <h3 className="text-2xl font-extrabold text-mu-text-900 mb-3">
          Узкоспециализированные пакеты
        </h3>
        <p className="text-mu-text-700 font-medium mb-6">
          Базовая программа включена во{'\u00A0'}все пакеты.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializedPrograms.map((program) => (
            <GlassPricingCard key={program.name} {...program} />
          ))}
        </div>
      </div>
    </section>
  );
}
