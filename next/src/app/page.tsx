import { HeroHub } from '@/components/sections/HeroHub';
import { StatsBar } from '@/components/sections/StatsBar';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { GuideGrid } from '@/components/sections/GuideGrid';
import { AdvantagesGrid } from '@/components/sections/AdvantagesGrid';
import { ContactSection } from '@/components/sections/ContactSection';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <>
      <HeroHub />
      <StatsBar />
      <ServicesGrid />
      <GuideGrid />
      <AdvantagesGrid />
      <ContactSection />
      <FinalCTA />
    </>
  );
}
