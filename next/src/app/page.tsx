import type { Metadata } from 'next';
import { HeroHub } from '@/components/sections/HeroHub';
import { StatsBar } from '@/components/sections/StatsBar';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { WhyUsSection } from '@/components/sections/WhyUsSection';
import { ClinicsSection } from '@/components/sections/ClinicsSection';
import { PlatformSection } from '@/components/sections/PlatformSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { FAQSection } from '@/components/sections/FAQSection';
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
        <ProblemSection />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ProcessSection />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <WhyUsSection />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ClinicsSection />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <PlatformSection />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ReviewsSection />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <FAQSection />
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
