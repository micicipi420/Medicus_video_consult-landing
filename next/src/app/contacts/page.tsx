import type { Metadata } from 'next';
import { LeadFormSection } from '@/components/sections/service/LeadFormSection';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

export const metadata: Metadata = {
  title: 'Контакты',
  description:
    'Оставьте заявку или свяжитесь напрямую. Медицинский координатор ответит в течение 24 часов. Телефон: +7 701 532 24 78.',
  alternates: {
    canonical: '/contacts',
  },
  openGraph: {
    title: 'Контакты \u2014 MedicusUnion KZ',
    description:
      'Оставьте заявку или свяжитесь напрямую. Медицинский координатор ответит в течение 24 часов.',
    url: '/contacts',
  },
};

export default function ContactsPage() {
  return (
    <>
      <section className="pt-20 pb-12 lg:pt-[5rem] lg:pb-12 bg-gradient-to-b from-[#F0F7FF] to-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
          <h1 className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#18212C] mb-6 text-balance">
            Свяжитесь с{'\u00A0'}нами
          </h1>
          <p className="text-[1.25rem] text-[rgba(24,33,44,0.55)] leading-relaxed max-w-[720px] mx-auto">
            Не{'\u00A0'}знаете, какой сервис подходит? Оставьте заявку{'\u00A0'}{'\u2014'} мы{'\u00A0'}перезвоним и{'\u00A0'}подскажем.
          </p>
        </div>
      </section>
      <ScrollReveal>
        <LeadFormSection
          heading="Оставить заявку"
          subtext={<>Заполните форму{'\u00A0'}{'\u2014'} мы{'\u00A0'}перезвоним в{'\u00A0'}течение 24{'\u00A0'}часов.</>}
          trustItems={[
            { text: 'Перезвоним в\u00A0течение 24\u00A0часов' },
            { text: 'Бесплатная консультация' },
            { text: 'Ваши данные защищены (ISO\u00A027001)' },
          ]}
          id="contact-section"
        />
      </ScrollReveal>
    </>
  );
}
