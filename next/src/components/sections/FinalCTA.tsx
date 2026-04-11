import { PHONE_NUMBER } from '@/lib/navigation';

export function FinalCTA() {
  return (
    <section className="py-12 md:py-24 bg-[#1A365D]" id="final-cta">
      <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
          Начните с{'\u00A0'}бесплатной консультации
        </h2>
        <p className="font-body text-lg text-white/80 mb-8">
          Расскажите о{'\u00A0'}вашей ситуации{'\u00A0'}{'\u2014'} мы{'\u00A0'}подберём оптимальное решение.
          Без{'\u00A0'}обязательств.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="liquid-btn-primary squircle-md inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold"
          >
            Оставить заявку
          </a>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="liquid-btn-secondary squircle-md inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold"
          >
            Позвонить
          </a>
        </div>
      </div>
    </section>
  );
}
