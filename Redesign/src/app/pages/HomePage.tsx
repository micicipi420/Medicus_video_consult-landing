import { Hero } from '../components/Hero';
import { StatsSection } from '../components/StatsSection';
import { ServicesSection } from '../components/ServicesSection';
import { GuideSection } from '../components/GuideSection';
import { WhyUsSection } from '../components/WhyUsSection';
import { ContactSection } from '../components/ContactSection';
import { CTASection } from '../components/CTASection';

export function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesSection />
      <GuideSection />
      <WhyUsSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
