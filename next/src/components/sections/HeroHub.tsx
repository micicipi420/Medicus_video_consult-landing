'use client';

import { HeroEntrance, HeroEntranceItem } from '@/components/motion/HeroEntrance';

export function HeroHub() {
  return (
    <section
      className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-[#F0F7FF] to-white"
      id="hero-hub"
    >
      <HeroEntrance className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
        <HeroEntranceItem>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-mu-text-900 leading-tight mb-6">
            Медицина мирового уровня{'\u00A0'}{'\u2014'} для{'\u00A0'}Казахстана
          </h1>
        </HeroEntranceItem>
        <HeroEntranceItem>
          <p className="font-body text-lg md:text-xl text-mu-text-500 mb-10 leading-relaxed">
            Консультации с{'\u00A0'}европейскими врачами онлайн, лечение в{'\u00A0'}лучших клиниках мира,
            комплексные чек-апы в{'\u00A0'}Южной Корее и{'\u00A0'}Турции. Одна платформа{'\u00A0'}{'\u2014'} 43{'\u00A0'}клиники
            в{'\u00A0'}11{'\u00A0'}странах.
          </p>
        </HeroEntranceItem>
        <HeroEntranceItem>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#services"
              className="liquid-btn-primary squircle-md inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold"
            >
              Выбрать услугу
            </a>
            <a
              href="#contact"
              className="liquid-btn-secondary squircle-md inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold"
            >
              Оставить заявку
            </a>
          </div>
        </HeroEntranceItem>
      </HeroEntrance>
    </section>
  );
}
