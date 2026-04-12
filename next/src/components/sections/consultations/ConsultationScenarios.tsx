const scenarios = [
  'Вам поставили серьёзный диагноз и\u00A0вы\u00A0хотите убедиться, что он\u00A0верный',
  'Разные врачи дают противоречивые рекомендации',
  'Нужно понять, какое лечение подходит именно вам',
  'Рассматриваете лечение за\u00A0рубежом, но\u00A0хотите сначала поговорить с\u00A0врачом',
  'Хотите показать снимки или анализы специалисту узкого профиля',
];

export function ConsultationScenarios() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="scenarios">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
        <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
          Когда имеет смысл получить второе мнение
        </span>
      </h2>
      <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-3xl mx-auto">
        <ul className="space-y-5" role="list">
          {scenarios.map((text) => (
            <li key={text} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 bg-white/60 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center shadow-glass-inner-strong mt-0.5">
                <svg className="w-4 h-4 text-mu-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              </span>
              <span className="text-mu-text-900 font-medium text-lg">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
