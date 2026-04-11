import { PHONE_NUMBER } from '@/lib/navigation';

export function FinalCTA() {
  return (
    <section className="py-12 lg:py-[6.25rem] bg-[#1A365D]" id="final-cta">
      <div className="container mx-auto px-4 md:px-8 text-center max-w-[640px]">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.2] tracking-[-0.02em] text-balance font-bold text-white mb-4">
          Начните с{'\u00A0'}бесплатной консультации
        </h2>
        <p className="font-body text-[1.125rem] text-white/85 mb-8">
          Расскажите о{'\u00A0'}вашей ситуации{'\u00A0'}{'\u2014'} мы{'\u00A0'}подберём оптимальное решение.
          Без{'\u00A0'}обязательств.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="btn-primary"
          >
            Оставить заявку
          </a>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="btn-outline btn-outline-light"
          >
            Позвонить нам
          </a>
        </div>
      </div>
    </section>
  );
}
