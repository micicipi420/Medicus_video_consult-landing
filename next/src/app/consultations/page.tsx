import type { Metadata } from 'next';
import { ServiceHero } from '@/components/sections/service/ServiceHero';
import { SocialProof } from '@/components/sections/service/SocialProof';
import { ConsultationProblem } from '@/components/sections/consultations/ConsultationProblem';
import { ConsultationBenefits } from '@/components/sections/consultations/ConsultationBenefits';
import { ConsultationProcess } from '@/components/sections/consultations/ConsultationProcess';
import { ConsultationDoctors } from '@/components/sections/consultations/ConsultationDoctors';
import { ConsultationAdvantages } from '@/components/sections/consultations/ConsultationAdvantages';
import { ConsultationScenarios } from '@/components/sections/consultations/ConsultationScenarios';
import { ConsultationPricing } from '@/components/sections/consultations/ConsultationPricing';
import { LeadFormSection } from '@/components/sections/service/LeadFormSection';
import { FAQ } from '@/components/sections/service/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

export const metadata: Metadata = {
  title: 'Консультации с европейскими врачами',
  description:
    'Видеоконсультация с европейским врачом из дома. Второе мнение по диагнозу, перевод документов, письменное заключение. От 450\u20AC, за 5 дней.',
  alternates: { canonical: '/consultations' },
  openGraph: {
    title: 'MedicusUnion KZ \u2014 Консультации с европейскими врачами',
    description:
      'Видеоконсультация с европейским врачом из дома. Второе мнение по диагнозу, перевод документов, письменное заключение. От 450\u20AC.',
    url: '/consultations',
  },
};

function DoctorAtLaptopIllustration() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" className="w-full max-w-[400px]">
      {/* Desk surface */}
      <rect x="60" y="260" width="280" height="12" rx="4" stroke="#38C6F4" strokeWidth="2" fill="rgba(56,198,244,0.08)" strokeLinecap="round" strokeLinejoin="round" />

      {/* Laptop base */}
      <rect x="120" y="245" width="160" height="15" rx="3" stroke="#38C6F4" strokeWidth="2" fill="rgba(56,198,244,0.08)" strokeLinecap="round" strokeLinejoin="round" />
      {/* Laptop screen frame */}
      <rect x="130" y="145" width="140" height="100" rx="6" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.08)" strokeLinecap="round" strokeLinejoin="round" />
      {/* Laptop screen inner */}
      <rect x="140" y="155" width="120" height="80" rx="3" fill="rgba(56,198,244,0.15)" />

      {/* Video call: patient face outline on screen */}
      <circle cx="200" cy="185" r="16" stroke="#38C6F4" strokeWidth="2" fill="rgba(56,198,244,0.08)" strokeLinecap="round" />
      {/* Patient shoulders on screen */}
      <path d="M175 210 C175 200, 185 195, 200 195 C215 195, 225 200, 225 210" stroke="#38C6F4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Video call indicator dot */}
      <circle cx="250" cy="162" r="4" fill="rgba(53,182,120,0.3)" />
      {/* Video call status bar */}
      <rect x="145" y="225" width="110" height="5" rx="2" fill="rgba(53,182,120,0.12)" />

      {/* Doctor figure -- torso */}
      <path d="M65 370 L65 300 C65 280, 80 270, 95 270 L95 370" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.08)" strokeLinecap="round" strokeLinejoin="round" />
      {/* Doctor head */}
      <circle cx="80" cy="248" r="22" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.08)" strokeLinecap="round" />
      {/* Doctor arm reaching to laptop */}
      <path d="M95 290 C110 290, 115 270, 125 260" stroke="#38C6F4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Doctor other arm */}
      <path d="M65 290 C50 290, 45 300, 42 310" stroke="#38C6F4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* White coat collar detail */}
      <path d="M72 270 L80 280 L88 270" stroke="#38C6F4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Medical cross on doctor coat */}
      <rect x="74" y="295" width="12" height="4" rx="1" fill="rgba(53,182,120,0.3)" />
      <rect x="78" y="291" width="4" height="12" rx="1" fill="rgba(53,182,120,0.3)" />

      {/* Stethoscope around neck */}
      <path d="M72 266 C68 278, 70 285, 75 290" stroke="#38C6F4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="75" cy="292" r="3" stroke="#38C6F4" strokeWidth="1.5" fill="rgba(56,198,244,0.15)" />

      {/* Chair back */}
      <path d="M50 275 C48 290, 48 340, 50 370" stroke="#38C6F4" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M100 275 C102 290, 102 340, 100 370" stroke="#38C6F4" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Desk legs */}
      <line x1="80" y1="272" x2="80" y2="395" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="320" y1="272" x2="320" y2="395" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />

      {/* Notepad on desk */}
      <rect x="270" y="240" width="50" height="20" rx="3" stroke="#38C6F4" strokeWidth="2" fill="rgba(56,198,244,0.08)" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="278" y1="247" x2="310" y2="247" stroke="#38C6F4" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <line x1="278" y1="253" x2="305" y2="253" stroke="#38C6F4" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

      {/* Pen on desk */}
      <line x1="265" y1="255" x2="275" y2="242" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" />

      {/* Decorative dots */}
      <circle cx="340" cy="130" r="4" fill="rgba(56,198,244,0.15)" />
      <circle cx="360" cy="170" r="3" fill="rgba(53,182,120,0.12)" />
      <circle cx="30" cy="180" r="4" fill="rgba(56,198,244,0.15)" />
      <circle cx="20" cy="320" r="3" fill="rgba(53,182,120,0.12)" />
      <circle cx="370" cy="300" r="3" fill="rgba(56,198,244,0.1)" />
      <circle cx="350" cy="350" r="4" fill="rgba(53,182,120,0.12)" />

      {/* WiFi signal arcs above laptop */}
      <path d="M195 130 C195 125, 205 125, 205 130" stroke="#38C6F4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M190 123 C190 115, 210 115, 210 123" stroke="#38C6F4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M185 116 C185 105, 215 105, 215 116" stroke="#38C6F4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const faqItems = [
  {
    question: 'Как проходит консультация технически?',
    answer: (
      <p>
        Видеозвонок через приложение MedicusUnion. Работает на{'\u00A0'}телефоне, планшете и{'\u00A0'}компьютере. Нужен только интернет.
      </p>
    ),
  },
  {
    question: 'Сколько длится консультация?',
    answer: (
      <p>
        Обычно 30{'\u2013'}60 минут. Врач не{'\u00A0'}торопится{'\u00A0'}{'\u2014'} это не{'\u00A0'}поликлиника с{'\u00A0'}10-минутным приёмом.
      </p>
    ),
  },
  {
    question: 'А\u00A0если я\u00A0не\u00A0говорю по-английски?',
    answer: (
      <p>
        Не{'\u00A0'}нужно. Мы{'\u00A0'}обеспечиваем перевод во{'\u00A0'}время консультации. Документы тоже переводим сами.
      </p>
    ),
  },
  {
    question: 'Можно показать заключение своему врачу?',
    answer: (
      <p>
        Конечно. Вы{'\u00A0'}получите письменное заключение{'\u00A0'}{'\u2014'} его можно скачать, распечатать, показать любому врачу.
      </p>
    ),
  },
  {
    question: 'Консультация обязывает к\u00A0лечению?',
    answer: (
      <p>
        Нет. Это ваше решение. Консультация даёт информацию для принятия решения, а{'\u00A0'}не{'\u00A0'}обязательство.
      </p>
    ),
  },
  {
    question: 'Можно выбрать конкретного врача?',
    answer: (
      <p>
        Да. Вы{'\u00A0'}можете выбрать врача на{'\u00A0'}платформе сами, или мы{'\u00A0'}подберём подходящего специалиста под ваш случай.
      </p>
    ),
  },
];

export default function ConsultationsPage() {
  return (
    <>
      <ServiceHero
        title={
          <>Мнение немецкого врача{'\u00A0'}{'\u2014'} за{'\u00A0'}5{'\u00A0'}дней, без{'\u00A0'}перелёта</>
        }
        subtitle={
          <>
            Видеоконсультация с{'\u00A0'}европейским специалистом{'\u00A0'}{'\u2014'} на{'\u00A0'}вашем языке, с{'\u00A0'}переводом.
            Загрузите документы в{'\u00A0'}приложение{'\u00A0'}{'\u2014'} мы{'\u00A0'}переведём их, передадим врачу и{'\u00A0'}организуем встречу.
          </>
        }
        primaryCta={{
          text: 'Получить консультацию\u00A0\u2014 от\u00A0450\u00A0\u20AC',
          href: '#form',
        }}
        secondaryCta={{
          text: 'Узнать, подходит\u00A0ли мой случай',
          href: '#scenarios',
        }}
        illustration={<DoctorAtLaptopIllustration />}
      />
      <ScrollReveal>
        <SocialProof
          items={[
            { number: '7', label: 'стран' },
            { number: '50+', label: 'врачей' },
            { number: '15+', label: 'специализаций' },
          ]}
        />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ConsultationProblem />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ConsultationBenefits />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ConsultationProcess />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ConsultationDoctors />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ConsultationAdvantages />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ConsultationScenarios />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <ConsultationPricing />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <LeadFormSection
          heading={'Оставить заявку на\u00A0консультацию'}
          subtext={<>Заполните форму{'\u00A0'}{'\u2014'} мы{'\u00A0'}перезвоним в{'\u00A0'}течение 24{'\u00A0'}часов.</>}
          trustItems={[
            { text: 'Перезвоним в течение 24 часов' },
            { text: 'Бесплатно и без обязательств' },
            { text: 'Ваши данные защищены' },
          ]}
          privacyText="Мы\u00A0перезвоним в\u00A0течение 24\u00A0часов. Ваши данные защищены."
        />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <FAQ heading="Частые вопросы" items={faqItems} id="faq" />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <FinalCTA />
      </ScrollReveal>
    </>
  );
}
