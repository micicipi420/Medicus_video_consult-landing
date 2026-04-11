export function ConsultationProcess() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id="process">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] leading-[1.2] tracking-[-0.02em] text-balance text-center mb-10">
          Три шага до{'\u00A0'}мнения европейского врача
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 01 */}
          <div className="text-center md:text-left">
            <div className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-[rgba(56,198,244,0.2)] leading-none mb-4" aria-hidden="true">
              01
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Загрузите документы
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Снимки, анализы, заключения{'\u00A0'}{'\u2014'} в{'\u00A0'}любом формате, на{'\u00A0'}любом языке. Мы{'\u00A0'}переведём всё сами и{'\u00A0'}подготовим для врача.
            </p>
          </div>

          {/* Step 02 */}
          <div className="text-center md:text-left">
            <div className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-[rgba(56,198,244,0.2)] leading-none mb-4" aria-hidden="true">
              02
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Врач изучает ваш случай
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Специалист готовится к{'\u00A0'}встрече: изучает документы, снимки, историю болезни. На{'\u00A0'}консультации он{'\u00A0'}уже в{'\u00A0'}курсе вашего случая.
            </p>
          </div>

          {/* Step 03 */}
          <div className="text-center md:text-left">
            <div className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-[rgba(56,198,244,0.2)] leading-none mb-4" aria-hidden="true">
              03
            </div>
            <h3 className="font-heading text-[clamp(1.375rem,2.5vw,2rem)] font-bold text-[#18212C] leading-[1.2] mb-3">
              Видеоконсультация
            </h3>
            <p className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
              Встреча по{'\u00A0'}видео с{'\u00A0'}переводчиком. Врач даёт оценку, отвечает на{'\u00A0'}вопросы. После{'\u00A0'}{'\u2014'} письменное заключение в{'\u00A0'}личном кабинете.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
