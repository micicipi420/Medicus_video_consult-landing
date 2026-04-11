import type { Metadata } from 'next';
import { ContactsHero } from '@/components/sections/contacts/ContactsHero';
import { CoordinatorCard } from '@/components/sections/contacts/CoordinatorCard';
import { ContactMethodGrid } from '@/components/sections/contacts/ContactMethodGrid';
import { TrustBadges } from '@/components/sections/contacts/TrustBadges';
import { ContactForm } from '@/components/sections/ContactForm';

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
      <ContactsHero />
      <section className="pb-12 md:pb-24" id="contact-section">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
            {/* Left column: coordinator + contact methods + trust badges */}
            <div>
              <CoordinatorCard />
              <ContactMethodGrid />
              <TrustBadges />
            </div>
            {/* Right column: form card */}
            <div className="bg-white border border-black/8 rounded-2xl shadow-md p-8 md:p-10">
              <h2 className="font-heading text-2xl font-bold text-mu-text-900 mb-6">
                Оставить заявку
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
