export function ConsultationProblem() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="problem">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
        <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">Знакомо?</span>
      </h2>
      <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-glass max-w-3xl mx-auto space-y-6">
        <p className="text-mu-text-700 font-medium text-lg leading-relaxed">
          Получили диагноз{'\u00A0'}{'\u2014'} и{'\u00A0'}не{'\u00A0'}уверены, что он{'\u00A0'}правильный. Разные врачи говорят разное. Хочется услышать мнение врача, которому можно верить.
        </p>
        <p className="text-mu-text-700 font-medium text-lg leading-relaxed">
          Слышали, что за{'\u00A0'}границей лечат лучше{'\u00A0'}{'\u2014'} но{'\u00A0'}лететь дорого, долго и{'\u00A0'}страшно. А{'\u00A0'}вдруг можно получить ответ, не{'\u00A0'}выходя из{'\u00A0'}дома?
        </p>
        <p className="text-mu-text-900 font-bold text-lg leading-relaxed">
          Время идёт{'\u00A0'}{'\u2014'} а{'\u00A0'}решение всё ещё не{'\u00A0'}принято.
        </p>
      </div>
    </section>
  );
}
