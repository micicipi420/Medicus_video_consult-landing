import type { Metadata } from 'next';
import { ServiceHero } from '@/components/sections/service/ServiceHero';
import { SocialProof } from '@/components/sections/service/SocialProof';
import { FAQ } from '@/components/sections/service/FAQ';
import { LeadFormSection } from '@/components/sections/service/LeadFormSection';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { TreatmentAboutUs } from '@/components/sections/treatment/TreatmentAboutUs';
import { TreatmentClinics } from '@/components/sections/treatment/TreatmentClinics';
import { TreatmentSteps } from '@/components/sections/treatment/TreatmentSteps';
import { TreatmentReviews } from '@/components/sections/treatment/TreatmentReviews';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { PHONE_NUMBER } from '@/lib/navigation';

export const metadata: Metadata = {
  title: 'Лечение за рубежом',
  description:
    'Организуем лечение за границей под ключ: подбор клиники, оформление документов, перевод, логистика и сопровождение. 100+ клиник в 6 странах. 15+ лет опыта.',
  alternates: {
    canonical: '/treatment-abroad',
  },
  openGraph: {
    title: 'Лечение за рубежом \u2014 MedicusUnion KZ',
    description:
      'Организуем лечение за границей под ключ: от первой консультации до полного восстановления. 100+ клиник, 500+ врачей, 15+ лет опыта.',
    url: '/treatment-abroad',
  },
};

const SOCIAL_PROOF_ITEMS = [
  { number: '100+', label: 'клиник' },
  { number: '500+', label: 'врачей-экспертов' },
  { number: '15+', label: 'лет практики' },
  { number: '10 000+', label: 'пациентов' },
];

const FAQ_ITEMS = [
  {
    question: 'С\u00A0какими заболеваниями можно обратиться?',
    answer:
      'Мы\u00A0охватываем широкий спектр медицинских направлений: онкология, кардиология, неврология, ортопедия, офтальмология, пластическая хирургия, стоматология, лечение бесплодия, детская медицина и\u00A0многие другие. Наша команда поможет подобрать лучших специалистов для вашего конкретного случая.',
  },
  {
    question: 'Как выбрать подходящую страну для лечения?',
    answer:
      'Выбор страны зависит от\u00A0типа заболевания, бюджета, языковых предпочтений и\u00A0сроков лечения. Наши медицинские консультанты проанализируют ваш случай и\u00A0порекомендуют оптимальные варианты с\u00A0учётом клинических и\u00A0бюджетных факторов.',
  },
  {
    question: 'Какие документы нужны для лечения за\u00A0рубежом?',
    answer:
      'Базовый пакет: медицинские документы с\u00A0переводом, загранпаспорт, виза (при необходимости), справка о\u00A0финансовой состоятельности. Мы\u00A0поможем подготовить все необходимые документы и\u00A0переводы, а\u00A0также получить медицинскую визу через официальные каналы клиник-партнёров.',
  },
  {
    question: 'Сколько стоят ваши услуги?',
    answer:
      'Первая консультация\u00A0\u2014 бесплатно. Каждый случай мы\u00A0рассматриваем индивидуально. В\u00A0стоимость входит полное сопровождение: от\u00A0планирования до\u00A0завершения лечения. Окончательная стоимость зависит от\u00A0сложности случая и\u00A0выбранной страны.',
  },
  {
    question: 'Предоставляете\u00A0ли вы\u00A0услуги переводчика?',
    answer:
      'Да, мы\u00A0обеспечиваем профессиональных медицинских переводчиков на\u00A0всех этапах лечения. Наши переводчики имеют медицинское образование и\u00A0опыт работы в\u00A0клиниках. Также предоставляем письменный перевод всех медицинских документов.',
  },
  {
    question: 'Что включает послеоперационное сопровождение?',
    answer:
      'Координация с\u00A0лечащими врачами на\u00A0родине, перевод всех медицинских документов, организация контрольных обследований, консультации по\u00A0реабилитации, мониторинг состояния здоровья. Поддержка продолжается до\u00A0полного восстановления.',
  },
];

const LEAD_FORM_TRUST_ITEMS = [
  { text: 'Бесплатная консультация и план лечения' },
  { text: 'Подбор лучших клиник и врачей' },
  { text: 'Полное сопровождение 24/7' },
];

function HeroIllustration() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" className="w-full max-w-[400px]">
      {/* Globe */}
      <circle cx="200" cy="200" r="90" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.06)" />
      <ellipse cx="200" cy="200" rx="40" ry="90" stroke="#38C6F4" strokeWidth="1.5" fill="none" />
      <line x1="110" y1="175" x2="290" y2="175" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="110" y1="225" x2="290" y2="225" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="110" y1="200" x2="290" y2="200" stroke="#38C6F4" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

      {/* Airplane */}
      <g transform="translate(120, 100) rotate(-20)">
        <path d="M0 15 L30 0 L60 15 L30 12 Z" stroke="#38C6F4" strokeWidth="2" fill="rgba(56,198,244,0.1)" strokeLinejoin="round" />
        <path d="M25 12 L30 25 L35 12" stroke="#38C6F4" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <path d="M-5 15 C-15 18, -25 14, -40 16" stroke="#38C6F4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="4 4" opacity="0.4" />
      </g>

      {/* Location pins */}
      <g transform="translate(180, 155)">
        <path d="M0 -12 C-6 -12, -10 -6, -10 0 C-10 8, 0 16, 0 16 C0 16, 10 8, 10 0 C10 -6, 6 -12, 0 -12Z" fill="rgba(53,182,120,0.3)" stroke="#35B678" strokeWidth="1.5" />
        <circle cx="0" cy="-2" r="3" fill="#35B678" />
      </g>
      <g transform="translate(230, 190)">
        <path d="M0 -10 C-5 -10, -8 -5, -8 0 C-8 6, 0 13, 0 13 C0 13, 8 6, 8 0 C8 -5, 5 -10, 0 -10Z" fill="rgba(53,182,120,0.2)" stroke="#35B678" strokeWidth="1.5" />
        <circle cx="0" cy="-2" r="2.5" fill="#35B678" />
      </g>
      <g transform="translate(260, 170)">
        <path d="M0 -10 C-5 -10, -8 -5, -8 0 C-8 6, 0 13, 0 13 C0 13, 8 6, 8 0 C8 -5, 5 -10, 0 -10Z" fill="rgba(53,182,120,0.2)" stroke="#35B678" strokeWidth="1.5" />
        <circle cx="0" cy="-2" r="2.5" fill="#35B678" />
      </g>

      {/* Medical cross */}
      <g transform="translate(200, 200)">
        <rect x="-6" y="-2" width="12" height="4" rx="1" fill="rgba(53,182,120,0.25)" />
        <rect x="-2" y="-6" width="4" height="12" rx="1" fill="rgba(53,182,120,0.25)" />
      </g>

      {/* Dashed route */}
      <path d="M180 160 Q160 130, 145 115" stroke="#35B678" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.5" />

      {/* Decorative dots */}
      <circle cx="340" cy="130" r="4" fill="rgba(56,198,244,0.15)" />
      <circle cx="60" cy="280" r="3" fill="rgba(53,182,120,0.12)" />
      <circle cx="350" cy="300" r="3" fill="rgba(56,198,244,0.1)" />
      <circle cx="50" cy="120" r="4" fill="rgba(53,182,120,0.12)" />
    </svg>
  );
}

export default function TreatmentAbroadPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Медицинский туризм"
        title={<>Организуем лечение за{'\u00A0'}границей</>}
        subtitle={
          <>
            Без очередей, переплат и{'\u00A0'}языкового барьера. Подберём врача, оформим документы, переведём анализы и{'\u00A0'}организуем перелёт. Вам остаётся только поправляться{'\u00A0'}{'\u2014'} остальное мы{'\u00A0'}берём на{'\u00A0'}себя.
          </>
        }
        primaryCta={{ text: 'Получить бесплатную консультацию', href: '#form-abroad' }}
        secondaryCta={{ text: 'Как это работает', href: '#steps' }}
        illustration={<HeroIllustration />}
        variant="abroad"
      />
      <ScrollReveal>
        <SocialProof items={SOCIAL_PROOF_ITEMS} />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <TreatmentAboutUs />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <TreatmentClinics />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <TreatmentSteps />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <TreatmentReviews />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <FAQ items={FAQ_ITEMS} id="faq-abroad" />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <LeadFormSection
          heading="Готовы начать лечение?"
          subtext={
            <>
              Получите бесплатную консультацию с{'\u00A0'}нашими медицинскими экспертами. Мы{'\u00A0'}проанализируем ваш случай и{'\u00A0'}предложим оптимальный план лечения за{'\u00A0'}рубежом.
            </>
          }
          trustItems={LEAD_FORM_TRUST_ITEMS}
          privacyText="Отправляя данные, вы\u00A0даёте согласие на\u00A0их\u00A0обработку и\u00A0подтверждаете, что ознакомились с\u00A0Политикой конфиденциальности ТОО\u00A0\u00ABMedicus Union KZ\u00BB."
          id="form-abroad"
        />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <FinalCTA />
      </ScrollReveal>
    </>
  );
}
