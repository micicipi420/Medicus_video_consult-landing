import { ShieldCheck, Clock3, Stethoscope, Phone, Mail } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { PHONE_NUMBER, PHONE_DISPLAY, EMAIL } from '@/lib/navigation';

const TRUST_SIGNALS = [
  {
    Icon: ShieldCheck,
    title: 'Конфиденциально',
    body: 'ISO\u00A027001, GDPR. Ваши данные не передаются третьим сторонам.',
  },
  {
    Icon: Clock3,
    title: 'Ответ в\u00A0течение 24\u00A0часов',
    body: 'Координатор изучит ваш запрос и\u00A0свяжется в\u00A0рабочее время.',
  },
  {
    Icon: Stethoscope,
    title: 'Врачи Европы',
    body: 'Германия, Австрия, Швейцария. Самостоятельно подбираем профильного специалиста.',
  },
] as const;

export function ContactSection() {
  return (
    <section
      className="relative z-10 overflow-hidden bg-gradient-to-br from-mu-blue via-mu-accent-blue to-mu-blue py-16 sm:py-20 lg:py-24"
      id="contact"
      aria-label="Заявка на консультацию"
    >
      {/* Decorative blur blobs (purely visual; aria-hidden) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-white/15 blur-[120px]" />
        <div className="absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-mu-green-500/25 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Left column — heading + trust signals + coordinator */}
          <div className="text-white">
            <h2 className="mb-5 text-4xl font-extrabold leading-[1.06] tracking-tight drop-shadow-sm sm:text-5xl md:text-6xl">
              Обсудите ваш случай&nbsp;— бесплатно и&nbsp;без&nbsp;обязательств
            </h2>
            <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
              Оставьте заявку&nbsp;— мы&nbsp;свяжемся в&nbsp;течение
              24&nbsp;часов, разберём вашу ситуацию и&nbsp;подскажем оптимальный
              путь: онлайн-консультация, чек-ап или&nbsp;лечение
              за&nbsp;рубежом.
            </p>

            {/* Trust signals — 3 cards */}
            <ul className="mb-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {TRUST_SIGNALS.map((signal) => {
                const { Icon } = signal;
                return (
                  <li
                    key={signal.title}
                    className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-bold leading-tight text-white sm:text-base">
                      {signal.title}
                    </div>
                    <div className="text-xs font-medium leading-snug text-white/80 sm:text-sm">
                      {signal.body}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Coordinator quick-contact row */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 sm:p-5">
              <div className="text-sm font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
                Или&nbsp;сразу&nbsp;—
              </div>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex min-h-11 items-center gap-2 text-base font-bold text-white transition-[color,background-color] duration-200 hover:text-white/90 sm:text-lg"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex min-h-11 items-center gap-2 text-sm font-bold text-white transition-[color,background-color] duration-200 hover:text-white/90 sm:text-base"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Right column — form in a white glass card */}
          <div>
            <div className="rounded-[2rem] border border-white/40 bg-white p-6 shadow-glass-lg sm:rounded-[2.5rem] sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
