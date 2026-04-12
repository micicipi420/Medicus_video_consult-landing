import type { Metadata } from 'next';
import { HeroHub } from '@/components/sections/HeroHub';
import { StatsBar } from '@/components/sections/StatsBar';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { GuideGrid } from '@/components/sections/GuideGrid';
import { AdvantagesGrid } from '@/components/sections/AdvantagesGrid';
import { ContactSection } from '@/components/sections/ContactSection';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

export const metadata: Metadata = {
  title: {
    absolute: 'MedicusUnion KZ \u2014 Медицина мирового уровня для Казахстана',
  },
  description:
    'Онлайн-консультации с европейскими врачами, лечение за рубежом, чек-ап в Samsung Medical Center и клиниках Стамбула. Организация под ключ.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MedicusUnion KZ \u2014 Медицина мирового уровня для Казахстана',
    description:
      'Онлайн-консультации с врачами Европы, лечение за рубежом, чек-ап в ведущих клиниках мира. 43 клиники, 11 стран, организация под ключ.',
    url: '/',
  },
};

export default function Home() {
  return (
    <>
      <HeroHub />
      <StatsBar />
      <ServicesGrid />
      <ScrollReveal delay={0.05}>
        <GuideGrid />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <AdvantagesGrid />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ContactSection />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <FinalCTA />
      </ScrollReveal>
    </>
  );
}
