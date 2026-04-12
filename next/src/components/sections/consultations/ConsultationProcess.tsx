export function ConsultationProcess() {
  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" id="process">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-mu-blue via-mu-accent-teal to-mu-green-600 bg-clip-text text-transparent">
          Три шага до{'\u00A0'}мнения европейского врача
        </span>
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass relative group hover:bg-white/80 hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="text-6xl font-extrabold text-mu-accent-blue opacity-20 mb-4 group-hover:opacity-40 group-hover:-translate-y-2 group-hover:scale-105 origin-left transition-all duration-500" aria-hidden="true">01</div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
            Загрузите документы
          </h3>
          <p className="text-mu-text-700 font-medium">
            Снимки, анализы, заключения{'\u00A0'}{'\u2014'} в{'\u00A0'}любом формате, на{'\u00A0'}любом языке. Мы{'\u00A0'}переведём всё сами и{'\u00A0'}подготовим для врача.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass relative group hover:bg-white/80 hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="text-6xl font-extrabold text-mu-green-500 opacity-20 mb-4 group-hover:opacity-40 group-hover:-translate-y-2 group-hover:scale-105 origin-left transition-all duration-500" aria-hidden="true">02</div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
            Врач изучает ваш случай
          </h3>
          <p className="text-mu-text-700 font-medium">
            Специалист готовится к{'\u00A0'}встрече: изучает документы, снимки, историю болезни. На{'\u00A0'}консультации он{'\u00A0'}уже в{'\u00A0'}курсе вашего случая.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass relative group hover:bg-white/80 hover:border-white/80 hover:shadow-glass-lg transition-all duration-500">
          <div className="text-6xl font-extrabold text-mu-accent-teal opacity-20 mb-4 group-hover:opacity-40 group-hover:-translate-y-2 group-hover:scale-105 origin-left transition-all duration-500" aria-hidden="true">03</div>
          <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">
            Видеоконсультация
          </h3>
          <p className="text-mu-text-700 font-medium">
            Встреча по{'\u00A0'}видео с{'\u00A0'}переводчиком. Врач даёт оценку, отвечает на{'\u00A0'}вопросы. После{'\u00A0'}{'\u2014'} письменное заключение в{'\u00A0'}личном кабинете.
          </p>
        </div>
      </div>
    </section>
  );
}
