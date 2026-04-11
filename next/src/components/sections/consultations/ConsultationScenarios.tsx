function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className="w-8 h-8 shrink-0"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12" stroke="#38C6F4" strokeWidth="2" fill="rgba(56,198,244,0.1)" />
      <path d="M10 16l4 4 8-8" stroke="#35B678" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const scenarios = [
  'Вам поставили серьёзный диагноз и\u00A0вы\u00A0хотите убедиться, что он\u00A0верный',
  'Разные врачи дают противоречивые рекомендации',
  'Нужно понять, какое лечение подходит именно вам',
  'Рассматриваете лечение за\u00A0рубежом, но\u00A0хотите сначала поговорить с\u00A0врачом',
  'Хотите показать снимки или анализы специалисту узкого профиля',
];

export function ConsultationScenarios() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-[#FFF8F0]" id="scenarios">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-10">
          Когда имеет смысл получить второе мнение
        </h2>
        <ul className="max-w-[800px] mx-auto space-y-5" role="list">
          {scenarios.map((text) => (
            <li key={text} className="flex items-start gap-4">
              <CheckIcon />
              <span className="text-[1.125rem] text-[#18212C] leading-relaxed pt-1">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
