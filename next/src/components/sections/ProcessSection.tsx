interface ProcessStep {
  gradient: string;
  shadow: string;
  number: string;
  title: string;
  description: React.ReactNode;
}

const STEPS: ProcessStep[] = [
  {
    gradient: 'bg-gradient-to-br from-mu-blue to-mu-accent-blue',
    shadow: 'shadow-mu-blue/25',
    number: '01',
    title: 'Разбор вашего случая',
    description: (
      <>
        Вы{'\u00A0'}присылаете документы{'\u00A0'}{'\u2014'} мы{'\u00A0'}
        анализируем историю болезни и{'\u00A0'}подбираем оптимальный путь:
        онлайн-консультацию, чек-ап или лечение в{'\u00A0'}профильной клинике.
        Не{'\u00A0'}{'\u00AB'}по{'\u00A0'}договорённости{'\u00BB'}, а{'\u00A0'}
        под ваш конкретный диагноз.
      </>
    ),
  },
  {
    gradient: 'bg-gradient-to-br from-mu-accent-teal to-mu-green-600',
    shadow: 'shadow-mu-green-600/25',
    number: '02',
    title: 'Подготовка',
    description: (
      <>
        Переводим документы, записываем к{'\u00A0'}врачу, при необходимости
        организуем визу, билеты, проживание и{'\u00A0'}трансферы. Вы{'\u00A0'}
        получаете полный план до{'\u00A0'}оплаты.
      </>
    ),
  },
  {
    gradient: 'bg-gradient-to-br from-mu-accent-orange to-mu-accent-red',
    shadow: 'shadow-mu-accent-orange/25',
    number: '03',
    title: 'Консультация или лечение',
    description: (
      <>
        Онлайн-встреча с{'\u00A0'}переводчиком{'\u00A0'}{'\u2014'} или приём
        в{'\u00A0'}клинике с{'\u00A0'}личным сопровождающим. На{'\u00A0'}каждом
        этапе{'\u00A0'}{'\u2014'} координатор MedicusUnion. Все документы
        и{'\u00A0'}снимки{'\u00A0'}{'\u2014'} в{'\u00A0'}защищённом личном
        кабинете.
      </>
    ),
  },
  {
    gradient: 'bg-gradient-to-br from-mu-green-500 to-mu-green-600',
    shadow: 'shadow-mu-green-600/25',
    number: '04',
    title: 'После консультации / лечения',
    description: (
      <>
        Письменное заключение врача с{'\u00A0'}переводом. Координация
        наблюдения с{'\u00A0'}врачами в{'\u00A0'}Казахстане. При
        необходимости{'\u00A0'}{'\u2014'} контрольные онлайн-консультации
        с{'\u00A0'}лечащим врачом за{'\u00A0'}рубежом.
      </>
    ),
  },
];

export function ProcessSection() {
  return (
    <section className="py-16 relative z-10" id="process">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              От{'\u00A0'}обращения до{'\u00A0'}результата{'\u00A0'}{'\u2014'}{' '}
              4{'\u00A0'}шага
            </span>
          </h2>
          <p className="text-mu-text-700 text-lg max-w-2xl mx-auto font-medium">
            Вы{'\u00A0'}занимаетесь здоровьем{'\u00A0'}{'\u2014'} мы{'\u00A0'}
            берём на{'\u00A0'}себя всё остальное.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="group bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500 p-8 flex flex-col overflow-hidden"
            >
              <div
                className={`w-16 h-16 ${step.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg ${step.shadow} mb-6 text-2xl font-extrabold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
              >
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-mu-text-900 mb-3">
                {step.title}
              </h3>
              <p className="text-mu-text-700 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
