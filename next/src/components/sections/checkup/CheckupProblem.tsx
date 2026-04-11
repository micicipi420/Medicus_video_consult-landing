export function CheckupProblem() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id="why-checkup">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-center text-[#18212C] mb-4 leading-[1.2] tracking-[-0.02em] text-balance">
          Почему не{'\u00A0'}стоит ждать симптомов
        </h2>
        <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed text-center max-w-[800px] mx-auto mb-10">
          Большинство серьёзных заболеваний{'\u00A0'}{'\u2014'} онкология, сердечно-сосудистые, эндокринные нарушения{'\u00A0'}{'\u2014'} на{'\u00A0'}ранних стадиях никак себя не{'\u00A0'}проявляют. Комплексный чек-ап проверяет все ключевые системы организма за{'\u00A0'}1{'\u2013'}2{'\u00A0'}дня и{'\u00A0'}выявляет проблемы тогда, когда с{'\u00A0'}ними ещё можно справиться.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="card-prod p-6 md:p-8">
            <div className="w-12 h-12 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <path d="M24 14v12" stroke="#38C6F4" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="24" cy="32" r="2" fill="#38C6F4" />
              </svg>
            </div>
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              {'\u00AB'}Я{'\u00A0'}нормально себя чувствую{'\u00BB'}
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Именно так говорит большинство людей, у{'\u00A0'}которых потом находят проблему. Чек-ап{'\u00A0'}{'\u2014'} это не{'\u00A0'}про ощущения, а{'\u00A0'}про данные: анализы крови, УЗИ, КТ, МРТ видят то, что вы{'\u00A0'}не{'\u00A0'}чувствуете.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-prod p-6 md:p-8">
            <div className="w-12 h-12 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <polyline points="24,12 24,24 32,28" stroke="#38C6F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              {'\u00AB'}У{'\u00A0'}меня нет времени{'\u00BB'}
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Чек-ап за{'\u00A0'}рубежом{'\u00A0'}{'\u2014'} это не{'\u00A0'}месяцы хождения по{'\u00A0'}кабинетам. Это 1{'\u2013'}2{'\u00A0'}дня по{'\u00A0'}заранее спланированному расписанию: вы{'\u00A0'}приехали, прошли всё, получили результат. Без очередей.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-prod p-6 md:p-8">
            <div className="w-12 h-12 mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
                <path d="M18 18a6 6 0 0112 0c0 4-6 4-6 8" stroke="#38C6F4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="24" cy="34" r="1.5" fill="#38C6F4" />
              </svg>
            </div>
            <h3 className="font-heading text-[1.25rem] font-bold text-[#18212C] mb-2">
              {'\u00AB'}Не{'\u00A0'}знаю, что проверять{'\u00BB'}
            </h3>
            <p className="text-[1rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Не{'\u00A0'}нужно знать. Программы чек-апов составлены врачами и{'\u00A0'}покрывают все основные системы: от{'\u00A0'}сердца и{'\u00A0'}сосудов до{'\u00A0'}онкомаркеров. Вы{'\u00A0'}выбираете уровень программы{'\u00A0'}{'\u2014'} остальное уже продумано.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
