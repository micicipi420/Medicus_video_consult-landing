'use client';

import { HeroEntrance, HeroEntranceItem } from '@/components/motion/HeroEntrance';

export function HeroHub() {
  return (
    <section
      className="pt-20 pb-12 lg:pt-[5rem] lg:pb-12 bg-gradient-to-b from-[#F0F7FF] to-white"
      id="hero-hub"
    >
      <HeroEntrance className="container mx-auto px-4 md:px-8 text-center max-w-[800px]">
        <HeroEntranceItem>
          <h1 className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-mu-text-900 leading-[1.1] tracking-[-0.02em] text-balance mb-6">
            Медицина мирового уровня{'\u00A0'}{'\u2014'} для{'\u00A0'}Казахстана
          </h1>
        </HeroEntranceItem>
        <HeroEntranceItem>
          <p className="font-body text-[1.25rem] text-mu-text-500 mb-10 leading-relaxed max-w-[720px] mx-auto">
            Консультации с{'\u00A0'}европейскими врачами онлайн, лечение в{'\u00A0'}лучших клиниках мира,
            комплексные чек-апы в{'\u00A0'}Южной Корее и{'\u00A0'}Турции. Одна платформа{'\u00A0'}{'\u2014'} 43{'\u00A0'}клиники
            в{'\u00A0'}11{'\u00A0'}странах.
          </p>
        </HeroEntranceItem>
        <HeroEntranceItem>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#services"
              className="btn-primary btn-hero"
            >
              Выбрать услугу
            </a>
            <a
              href="#contact"
              className="btn-outline btn-hero"
            >
              Оставить заявку
            </a>
          </div>
        </HeroEntranceItem>
      </HeroEntrance>
    </section>
  );
}
