import Image from 'next/image';
import { PHONE_NUMBER, EMAIL } from '@/lib/navigation';

export function FinalCTA() {
  return (
    <section className="py-16 relative overflow-hidden z-10" id="cta">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3.5rem] overflow-hidden relative shadow-glass-lg border border-glass-border-strong">
          <div className="grid lg:grid-cols-2">

            {/* Left Content */}
            <div className="p-12 lg:p-20 flex flex-col justify-center relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-mu-text-900 mb-6 leading-tight drop-shadow-sm">
                Не{'\u00A0'}откладывайте решение о{'\u00A0'}здоровье
              </h2>
              <p className="text-xl text-mu-text-700 font-medium mb-10 leading-relaxed max-w-lg">
                Мнение зарубежного врача, комплексное обследование или лечение в{'\u00A0'}мировой клинике{'\u00A0'}{'\u2014'} начните с{'\u00A0'}бесплатной консультации.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="#contact"
                  className="w-full sm:w-auto bg-gradient-to-r from-mu-cta-brand-from to-mu-cta-brand-to text-white px-8 py-4 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 shadow-glass-inner hover:shadow-xl hover:shadow-mu-blue/40 transition-all flex items-center justify-center gap-2 group text-lg"
                >
                  Обсудить мой случай
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="w-full sm:w-auto bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] text-mu-text-900 px-8 py-4 rounded-3xl font-bold border border-glass-border hover:bg-[var(--glass-form-fill)] transition-all flex items-center justify-center gap-2 shadow-glass-sm shadow-glass-inner-strong text-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mu-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Позвонить
                </a>
              </div>

              <p className="text-mu-text-700 font-medium mt-8">
                Или напишите нам:{' '}
                <a href={`mailto:${EMAIL}`} className="text-mu-blue hover:underline">{EMAIL}</a>
                {'\u00A0'}{'\u00B7'}{'\u00A0'}
                <a href="https://wa.me/77015322478" className="text-mu-blue hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                {'\u00A0'}{'\u00B7'}{'\u00A0'}
                <a href="https://t.me/medicusunion" className="text-mu-blue hover:underline" target="_blank" rel="noopener noreferrer">Telegram</a>
              </p>
            </div>

            {/* Right Image */}
            <div className="relative h-[400px] lg:h-auto overflow-hidden hidden md:block">
              <Image
                src="/cta-doctor.webp"
                alt="Врач MedicusUnion"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 50vw, 540px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent w-1/3" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
