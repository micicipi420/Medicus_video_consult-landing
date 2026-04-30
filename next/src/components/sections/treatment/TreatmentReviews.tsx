const REVIEWS = [
  {
    initial: '\u0420',
    name: 'Ренат',
    subtitle: 'Казахстан \u00B7 Лечение в\u00A0Австрии, Rudolfinerhaus',
    gradient: 'from-mu-blue to-mu-accent-blue',
    text: '\u00AB\u0423\u0436\u0435 10\u00A0\u043B\u0435\u0442 \u043F\u0440\u0438\u0435\u0437\u0436\u0430\u044E \u0432\u00A0\u0420\u0443\u0434\u043E\u043B\u044C\u0444\u0438\u043D\u0435\u0440\u0445\u0430\u0443\u0441 \u043D\u0430\u00A0\u043B\u0435\u0447\u0435\u043D\u0438\u0435, \u043F\u043E\u043B\u044C\u0437\u0443\u044F\u0441\u044C \u0443\u0441\u043B\u0443\u0433\u0430\u043C\u0438 MedicusUnion. \u041A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437\u00A0\u2014 \u0447\u0451\u0442\u043A\u0430\u044F \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F, \u043D\u0438\u043A\u0430\u043A\u0438\u0445 \u043D\u0430\u043A\u043B\u0430\u0434\u043E\u043A.\u00BB',
  },
  {
    initial: '\u0416',
    name: 'Жанна',
    subtitle: 'Россия \u00B7 Лечение за\u00A0рубежом',
    gradient: 'from-mu-green-500 to-mu-green-600',
    text: '\u00AB\u0412\u0441\u0451 \u0431\u044B\u043B\u043E \u0441\u0434\u0435\u043B\u0430\u043D\u043E \u043D\u0430\u0441\u0442\u043E\u043B\u044C\u043A\u043E \u043E\u043F\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u043E \u0438\u00A0\u0431\u0435\u0437 \u043F\u0440\u043E\u0432\u043E\u043B\u043E\u0447\u0435\u043A, \u0447\u0442\u043E \u0437\u0430\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u0435\u0442 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F. \u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044E \u0437\u0430\u00A0\u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044E.\u00BB',
  },
  {
    initial: '\u0410',
    name: 'Андрей',
    subtitle: 'Украина \u00B7 Регулярное обращение',
    gradient: 'from-mu-accent-teal to-mu-green-600',
    text: '\u00AB\u0423\u0436\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043B\u0435\u0442 \u043E\u0431\u0440\u0430\u0449\u0430\u0435\u043C\u0441\u044F \u043A\u00A0\u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 MedicusUnion. \u041C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u043E\u0435 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u043D\u0430\u00A0\u043F\u0440\u0435\u0432\u043E\u0441\u0445\u043E\u0434\u043D\u043E\u043C \u0443\u0440\u043E\u0432\u043D\u0435 \u0432\u00A0\u043C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0440\u043E\u043A\u0438.\u00BB',
  },
  {
    initial: '\u0410',
    name: 'Арина',
    subtitle: 'Россия \u00B7 Обследование в\u00A0Вене',
    gradient: 'from-mu-accent-orange to-mu-accent-red',
    text: '\u00AB\u041F\u043E\u0437\u043D\u0430\u043A\u043E\u043C\u0438\u043B\u0430\u0441\u044C \u0441\u00A0\u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0435\u0439 MedicusUnion \u0432\u00A02008 \u0433\u043E\u0434\u0443. \u041D\u0430\u00A0\u043F\u0440\u043E\u0442\u044F\u0436\u0435\u043D\u0438\u0438 \u044D\u0442\u0438\u0445 \u043B\u0435\u0442 \u043F\u0440\u0438\u0435\u0437\u0436\u0430\u044E \u0432\u00A0\u0412\u0435\u043D\u0443 \u043D\u0430\u00A0\u043E\u0431\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435 \u0438\u00A0\u043E\u0431\u0440\u0430\u0449\u0430\u044E\u0441\u044C \u043A\u00A0\u043D\u0438\u043C.\u00BB',
  },
] as const;

export function TreatmentReviews() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="reviews">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
          Пациенты, которые прошли этот путь
        </span>
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {REVIEWS.map((review) => (
          <div key={review.name} className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <div className="flex items-center gap-4 mb-5">
              <span
                className={`w-12 h-12 bg-gradient-to-br ${review.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}
                aria-hidden="true"
              >
                {review.initial}
              </span>
              <div>
                <span className="block text-mu-text-900 font-bold">{review.name}</span>
                <span className="text-mu-text-700 text-sm font-medium">{review.subtitle}</span>
              </div>
            </div>
            <p className="text-mu-text-700 font-medium leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
