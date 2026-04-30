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

            {/* Coordinator card — designed presence (no external photo dependency).
                TODO(content): swap initials avatar for a real on-team coordinator
                photo when available; replace placeholder name "Айгерим" with the
                actual coordinator's name. */}
            <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:gap-5 sm:p-5">
              {/* Initials avatar */}
              <div
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-white/35 to-white/15 text-lg font-extrabold text-white shadow-inner sm:h-16 sm:w-16 sm:text-xl"
                aria-hidden="true"
              >
                АК
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="text-base font-extrabold leading-tight text-white sm:text-lg">
                  Айгерим
                </div>
                <div className="text-xs font-semibold leading-tight text-white/75 sm:text-sm">
                  Старший медицинский координатор
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white transition-[color] duration-200 hover:text-white/90 sm:text-base"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {PHONE_DISPLAY}
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-white transition-[color] duration-200 hover:text-white/90 sm:text-sm"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — form in a white glass card */}
          <div>
            <div className="rounded-[2rem] border border-white/40 bg-[var(--glass-form-fill)] backdrop-blur-[var(--glass-form-blur)] p-6 shadow-glass-lg sm:rounded-[2.5rem] sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
