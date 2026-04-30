import type { Metadata } from 'next';
import { ServiceHero } from '@/components/sections/service/ServiceHero';
import { SocialProof } from '@/components/sections/service/SocialProof';
import { FAQ } from '@/components/sections/service/FAQ';
import { LeadFormSection } from '@/components/sections/service/LeadFormSection';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { CheckupProblem } from '@/components/sections/checkup/CheckupProblem';
import { CheckupAdvantages } from '@/components/sections/checkup/CheckupAdvantages';
import { CheckupWhyUs } from '@/components/sections/checkup/CheckupWhyUs';
import { CheckupProgramsKorea } from '@/components/sections/checkup/CheckupProgramsKorea';
import { CheckupProgramsTurkey } from '@/components/sections/checkup/CheckupProgramsTurkey';
import { CheckupProcess } from '@/components/sections/checkup/CheckupProcess';
import { CheckupB2B } from '@/components/sections/checkup/CheckupB2B';

export const metadata: Metadata = {
  title: 'Чек-ап за рубежом \u2014 Samsung Medical Center, Severance Hospital, клиники Стамбула',
  description:
    'Комплексное обследование за 1\u20132 дня в ведущих клиниках Южной Кореи и Турции. Организация под ключ: виза, трансфер, переводчик, сопровождение. Результаты \u2014 в приложении. От $350.',
  alternates: { canonical: '/checkup' },
  openGraph: {
    title:
      'Чек-ап за рубежом \u2014 Samsung Medical Center, Severance Hospital | MedicusUnion',
    description:
      'Комплексное обследование за 1\u20132 дня в ведущих клиниках Южной Кореи и Турции. Организация под ключ: виза, трансфер, переводчик, сопровождение. От $350.',
    url: '/checkup',
  },
};

function CheckupIllustration() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" className="w-full max-w-[400px]">
      {/* Clipboard */}
      <rect x="120" y="80" width="160" height="220" rx="10" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.06)" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="170" y="68" width="60" height="24" rx="6" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.08)" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="200" cy="80" r="5" fill="rgba(56,198,244,0.2)" />

      {/* Checklist lines with checks */}
      <line x1="145" y1="130" x2="255" y2="130" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <polyline points="140,128 143,132 149,125" stroke="#35B678" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="155" y1="130" x2="230" y2="130" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      <line x1="145" y1="155" x2="255" y2="155" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <polyline points="140,153 143,157 149,150" stroke="#35B678" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="155" y1="155" x2="240" y2="155" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      <line x1="145" y1="180" x2="255" y2="180" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <polyline points="140,178 143,182 149,175" stroke="#35B678" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="155" y1="180" x2="220" y2="180" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      <line x1="145" y1="205" x2="255" y2="205" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <polyline points="140,203 143,207 149,200" stroke="#35B678" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="155" y1="205" x2="245" y2="205" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      <line x1="145" y1="230" x2="255" y2="230" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <circle cx="144" cy="230" r="5" stroke="#38C6F4" strokeWidth="1.5" fill="none" opacity="0.4" />
      <line x1="155" y1="230" x2="235" y2="230" stroke="#38C6F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

      {/* Heartbeat line */}
      <polyline points="130,270 160,270 170,250 180,290 190,260 200,280 210,270 260,270" stroke="#35B678" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Stethoscope */}
      <path d="M300 140 C300 180, 270 200, 270 230" stroke="#38C6F4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="270" cy="240" r="12" stroke="#38C6F4" strokeWidth="2.5" fill="rgba(56,198,244,0.1)" />
      <circle cx="270" cy="240" r="5" fill="rgba(53,182,120,0.3)" />
      <path d="M296 132 C290 125, 310 125, 304 132" stroke="#38C6F4" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Medical cross */}
      <rect x="82" y="158" width="16" height="5" rx="1.5" fill="rgba(53,182,120,0.3)" />
      <rect x="88" y="152" width="5" height="16" rx="1.5" fill="rgba(53,182,120,0.3)" />

      {/* Decorative dots */}
      <circle cx="340" cy="100" r="4" fill="rgba(56,198,244,0.15)" />
      <circle cx="70" cy="280" r="3" fill="rgba(53,182,120,0.12)" />
      <circle cx="350" cy="320" r="3" fill="rgba(56,198,244,0.1)" />
      <circle cx="60" cy="120" r="4" fill="rgba(53,182,120,0.12)" />
      <circle cx="320" cy="280" r="4" fill="rgba(56,198,244,0.12)" />
    </svg>
  );
}

const socialProofItems = [
  { number: '43', label: 'клиники' },
  { number: '11', label: 'стран' },
  { number: '1\u20132', label: 'дня обследование' },
  { number: 'ISO', label: '27001' },
];

const faqItems = [
  {
    question: 'Нужна\u00A0ли виза в\u00A0Южную Корею?',
    answer: (
      <p>
        Для граждан Казахстана{'\u00A0'}{'\u2014'} да. Мы{'\u00A0'}помогаем с{'\u00A0'}визовой поддержкой: подготовим необходимые документы от{'\u00A0'}клиники и{'\u00A0'}проконсультируем по{'\u00A0'}процессу.
      </p>
    ),
  },
  {
    question: 'Нужна\u00A0ли виза в\u00A0Турцию?',
    answer: (
      <p>
        Нет, граждане Казахстана могут находиться в{'\u00A0'}Турции до{'\u00A0'}30 дней без визы.
      </p>
    ),
  },
  {
    question: 'Сколько дней нужно закладывать на\u00A0поездку?',
    answer: (
      <p>
        Само обследование занимает 1{'\u2013'}2{'\u00A0'}дня в{'\u00A0'}зависимости от{'\u00A0'}программы. С{'\u00A0'}учётом перелёта рекомендуем закладывать 3{'\u2013'}5{'\u00A0'}дней на{'\u00A0'}Корею и{'\u00A0'}3{'\u2013'}4{'\u00A0'}дня на{'\u00A0'}Турцию.
      </p>
    ),
  },
  {
    question: 'Что если чек-ап выявит проблему?',
    answer: (
      <p>
        Врач клиники даст заключение и{'\u00A0'}рекомендации. Если потребуется лечение{'\u00A0'}{'\u2014'} мы{'\u00A0'}организуем его: в{'\u00A0'}той{'\u00A0'}же клинике, в{'\u00A0'}другой клинике Кореи/Турции, или в{'\u00A0'}любой из{'\u00A0'}43{'\u00A0'}клиник нашей сети в{'\u00A0'}11{'\u00A0'}странах.
      </p>
    ),
  },
  {
    question: 'Будет\u00A0ли переводчик?',
    answer: (
      <p>
        Да. С{'\u00A0'}вами будет русскоязычный переводчик-сопровождающий на{'\u00A0'}всех этапах обследования. Результаты также переводятся на{'\u00A0'}русский язык.
      </p>
    ),
  },
  {
    question: 'Как я\u00A0получу результаты?',
    answer: (
      <p>
        Все результаты, снимки и{'\u00A0'}заключения врачей загружаются в{'\u00A0'}ваш личный кабинет в{'\u00A0'}приложении MedicusUnion. Доступ{'\u00A0'}{'\u2014'} с{'\u00A0'}любого устройства, в{'\u00A0'}любое время.
      </p>
    ),
  },
  {
    question: 'Можно\u00A0ли добавить отдельные обследования?',
    answer: (
      <p>
        Да. Мы{'\u00A0'}можем дополнить стандартную программу отдельными исследованиями под ваш запрос. Обсудим это на{'\u00A0'}этапе подбора программы.
      </p>
    ),
  },
];

export default function CheckupPage() {
  return (
    <>
      <ServiceHero
        eyebrow={'Чек-ап за\u00A0рубежом'}
        title={
          <>
            Проверьте здоровье в{'\u00A0'}Samsung Medical Center и{'\u00A0'}Severance Hospital{'\u00A0'}{'\u2014'} за{'\u00A0'}1{'\u2013'}2{'\u00A0'}дня
          </>
        }
        subtitle={
          <>
            Комплексный чек-ап в{'\u00A0'}ведущих клиниках Южной Кореи и{'\u00A0'}Турции. Мы{'\u00A0'}берём на{'\u00A0'}себя всё{'\u00A0'}{'\u2014'} от{'\u00A0'}визы до{'\u00A0'}перевода результатов. Вам остаётся только приехать.
          </>
        }
        primaryCta={{ text: 'Подобрать программу', href: '#form-checkup' }}
        secondaryCta={{ text: 'Смотреть программы', href: '#programs-korea' }}
        trustLine={'MedicusUnion GmbH, Австрия \u00B7 ISO\u00A027001 \u00B7 43\u00A0клиники \u00B7 11\u00A0стран'}
        illustration={<CheckupIllustration />}
        variant="checkup"
      />

      <ScrollReveal>
        <SocialProof items={socialProofItems} />
      </ScrollReveal>

      <ScrollReveal>
        <CheckupProblem />
      </ScrollReveal>

      <ScrollReveal>
        <CheckupAdvantages />
      </ScrollReveal>

      <ScrollReveal>
        <CheckupWhyUs />
      </ScrollReveal>

      <ScrollReveal>
        <CheckupProgramsKorea />
      </ScrollReveal>

      <ScrollReveal>
        <CheckupProgramsTurkey />
      </ScrollReveal>

      <ScrollReveal>
        <CheckupProcess />
      </ScrollReveal>

      <ScrollReveal>
        <CheckupB2B />
      </ScrollReveal>

      <ScrollReveal>
        <FAQ
          items={faqItems}
          id="faq-checkup"
        />
      </ScrollReveal>

      <ScrollReveal>
        <LeadFormSection
          heading={'Узнайте всё о\u00A0своём здоровье за\u00A01\u20132\u00A0дня'}
          subtext={
            <>
              Оставьте заявку{'\u00A0'}{'\u2014'} мы{'\u00A0'}свяжемся с{'\u00A0'}вами, поможем выбрать программу и{'\u00A0'}направление, и{'\u00A0'}организуем чек-ап полностью. Бесплатная консультация, без обязательств.
            </>
          }
          trustItems={[
            { text: 'Бесплатный подбор программы' },
            { text: 'Организация под ключ' },
            { text: 'Ваши данные защищены (ISO\u00A027001)' },
          ]}
          id="form-checkup"
        />
      </ScrollReveal>

      <ScrollReveal>
        <FinalCTA />
      </ScrollReveal>
    </>
  );
}
