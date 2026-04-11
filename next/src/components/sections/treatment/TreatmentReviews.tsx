const REVIEWS = [
  {
    initial: '\u0420',
    name: 'Ренат',
    text: <>Уже на{'\u00A0'}протяжении 10{'\u00A0'}лет я{'\u00A0'}приезжаю в{'\u00A0'}Рудольфинерхаус на{'\u00A0'}лечение, пользуясь услугами MedicusUnion. Это команда профессионалов, которые решают любой вопрос на{'\u00A0'}месте, для них нет ничего невозможного.</>,
  },
  {
    initial: '\u0416',
    name: 'Жанна',
    text: <>Хочу выразить благодарность за{'\u00A0'}организацию моего лечения, всё было сделано настолько оперативно и{'\u00A0'}без проволочек, что заслуживает отдельного внимания! Вы{'\u00A0'}не{'\u00A0'}просто лечите людей, вы{'\u00A0'}спасаете жизни.</>,
  },
  {
    initial: '\u0410',
    name: 'Андрей',
    text: <>Уже несколько лет обращаемся к{'\u00A0'}компании MedicusUnion, потому что услуги медицинского обслуживания оказываются на{'\u00A0'}превосходном уровне в{'\u00A0'}минимальные сроки. Индивидуальный подход к{'\u00A0'}каждому пациенту.</>,
  },
  {
    initial: '\u0410',
    name: 'Арина',
    text: <>Я{'\u00A0'}познакомилась с{'\u00A0'}компанией MedicusUnion в{'\u00A0'}2008 году. Для команды MedicusUnion не{'\u00A0'}существует неразрешимой задачи, они всегда решат любой вопрос немедленно.</>,
  },
  {
    initial: 'P',
    name: 'Paul Fischer',
    text: <>Возможность передать снимки МРТ в{'\u00A0'}режиме онлайн и{'\u00A0'}впоследствии получить чёткую и{'\u00A0'}понятную оценку врача-радиолога придало мне уверенности.</>,
  },
  {
    initial: 'N',
    name: 'Nargiza Tursunova',
    text: <>Онлайн-консультация через платформу помогла мне быстрее получить медицинскую помощь. Врач оказался очень компетентным и{'\u00A0'}отзывчивым. Спасибо за{'\u00A0'}такую ценную поддержку!</>,
  },
] as const;

export function TreatmentReviews() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-[#F5F7F9]" id="reviews">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-4">
          Что говорят наши пациенты
        </h2>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[720px] mx-auto mb-10">
          Более 10{'\u00A0'}000 пациентов доверили нам своё здоровье. Их{'\u00A0'}истории{'\u00A0'}{'\u2014'} лучшее подтверждение качества нашего сервиса.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.name} className="card-prod p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-10 h-10 rounded-full bg-[#F0F7FF] text-[#1A4D80] font-heading font-bold text-[1.125rem] flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  {review.initial}
                </span>
                <span className="font-heading font-bold text-[#18212C] text-[1.125rem]">
                  {review.name}
                </span>
              </div>
              <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
