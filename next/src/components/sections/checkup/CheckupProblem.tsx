export function CheckupProblem() {
  return (
    <section className="py-16 relative z-10" id="why-checkup">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-4 text-center">
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Почему не{'\u00A0'}стоит ждать симптомов
          </span>
        </h2>
        <p className="text-mu-text-700 text-lg text-center mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Большинство серьёзных заболеваний{'\u00A0'}{'\u2014'} онкология, сердечно-сосудистые, эндокринные нарушения{'\u00A0'}{'\u2014'} на{'\u00A0'}ранних стадиях никак себя не{'\u00A0'}проявляют. Комплексный чек-ап проверяет все ключевые системы организма за{'\u00A0'}1{'\u2013'}2{'\u00A0'}дня и{'\u00A0'}выявляет проблемы тогда, когда с{'\u00A0'}ними ещё можно справиться.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: AlertCircle */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>
            </div>
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
              {'\u00AB'}Я{'\u00A0'}нормально себя чувствую{'\u00BB'}
            </h3>
            <p className="text-mu-text-700 font-medium">
              Именно так говорит большинство людей, у{'\u00A0'}которых потом находят проблему. Чек-ап{'\u00A0'}{'\u2014'} это не{'\u00A0'}про ощущения, а{'\u00A0'}про данные: анализы крови, УЗИ, КТ, МРТ видят то, что вы{'\u00A0'}не{'\u00A0'}чувствуете.
            </p>
          </div>

          {/* Card 2: Clock */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
              {'\u00AB'}У{'\u00A0'}меня нет времени{'\u00BB'}
            </h3>
            <p className="text-mu-text-700 font-medium">
              Чек-ап за{'\u00A0'}рубежом{'\u00A0'}{'\u2014'} это не{'\u00A0'}месяцы хождения по{'\u00A0'}кабинетам. Это 1{'\u2013'}2{'\u00A0'}дня по{'\u00A0'}заранее спланированному расписанию: вы{'\u00A0'}приехали, прошли всё, получили результат. Без очередей.
            </p>
          </div>

          {/* Card 3: HelpCircle */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass">
            <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">
              {'\u00AB'}Не{'\u00A0'}знаю, что проверять{'\u00BB'}
            </h3>
            <p className="text-mu-text-700 font-medium">
              Не{'\u00A0'}нужно знать. Программы чек-апов составлены врачами и{'\u00A0'}покрывают все основные системы: от{'\u00A0'}сердца и{'\u00A0'}сосудов до{'\u00A0'}онкомаркеров. Вы{'\u00A0'}выбираете уровень программы{'\u00A0'}{'\u2014'} остальное уже продумано.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
