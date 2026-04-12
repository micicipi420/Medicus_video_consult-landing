interface ReviewCard {
  initial: string;
  gradient: string;
  name: string;
  context: string;
  quote: React.ReactNode;
}

const REVIEWS: ReviewCard[] = [
  {
    initial: 'Р',
    gradient: 'from-mu-blue to-mu-accent-blue',
    name: 'Ренат, Казахстан',
    context: 'Лечение в\u00A0Австрии, Rudolfinerhaus',
    quote: (
      <>
        {'\u00AB'}Уже 10{'\u00A0'}лет приезжаю в{'\u00A0'}Рудольфинерхаус на{'\u00A0'}лечение,
        пользуясь услугами MedicusUnion. Каждый раз{'\u00A0'}{'\u2014'} чёткая организация,
        никаких накладок.{'\u00BB'}
      </>
    ),
  },
  {
    initial: 'Ж',
    gradient: 'from-mu-accent-teal to-mu-green-600',
    name: 'Жанна, Россия',
    context: 'Лечение за рубежом',
    quote: (
      <>
        {'\u00AB'}Всё было сделано настолько оперативно и{'\u00A0'}без проволочек,
        что заслуживает отдельного внимания.{'\u00BB'}
      </>
    ),
  },
  {
    initial: 'А',
    gradient: 'from-mu-accent-orange to-mu-accent-red',
    name: 'Андрей, Украина',
    context: 'Регулярное обращение',
    quote: (
      <>
        {'\u00AB'}Уже несколько лет обращаемся к{'\u00A0'}компании MedicusUnion.
        Медицинское обслуживание на{'\u00A0'}превосходном уровне в{'\u00A0'}минимальные сроки.{'\u00BB'}
      </>
    ),
  },
  {
    initial: 'А',
    gradient: 'from-mu-green-500 to-mu-green-600',
    name: 'Арина, Россия',
    context: 'Обследование в\u00A0Вене',
    quote: (
      <>
        {'\u00AB'}Познакомилась с{'\u00A0'}компанией MedicusUnion в{'\u00A0'}2008{'\u00A0'}году.
        На{'\u00A0'}протяжении этих лет приезжаю в{'\u00A0'}Вену на{'\u00A0'}обследование.{'\u00BB'}
      </>
    ),
  },
];

export function ReviewsSection() {
  return (
    <section className="py-16 relative z-10" id="reviews">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              Пациенты, которые прошли этот путь
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {REVIEWS.map((card, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border p-8 hover:shadow-glass-lg hover:border-glass-border-strong transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}
                >
                  {card.initial}
                </div>
                <div>
                  <h4 className="font-bold text-mu-text-900">{card.name}</h4>
                  <p className="text-mu-text-700 text-sm font-medium">
                    {card.context}
                  </p>
                </div>
              </div>
              <p className="text-mu-text-700 font-medium leading-relaxed">
                {card.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
