import Image from 'next/image';
import { ContactForm } from './ContactForm';
import { PHONE_NUMBER, PHONE_DISPLAY, EMAIL } from '@/lib/navigation';

export function ContactSection() {
  return (
    <section className="py-16 relative z-10" id="contact">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left Column - Info */}
          <div className="flex flex-col h-full">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
                Обсудите ваш случай{'\u00A0'}{'\u2014'} бесплатно и{'\u00A0'}без{'\u00A0'}обязательств
              </span>
            </h2>
            <p className="text-mu-text-700 font-medium text-lg mb-8 leading-relaxed max-w-lg">
              Оставьте заявку{'\u00A0'}{'\u2014'} мы{'\u00A0'}свяжемся в{'\u00A0'}течение 24{'\u00A0'}часов, разберём вашу ситуацию и{'\u00A0'}подскажем оптимальный путь: онлайн-консультация, чек-ап или лечение за{'\u00A0'}рубежом.
            </p>

            {/* Coordinator Card */}
            <div className="mt-auto bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/60 flex flex-col sm:flex-row gap-6 items-center shadow-glass">
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/60 bg-white/50 backdrop-blur-sm shadow-glass-sm">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBtZWRpY2FsJTIwY29vcmRpbmF0b3IlMjBzbWlsaW5nfGVufDF8fHx8MTc3NTE5NzQ0NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Медицинский координатор"
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-mu-text-900 mb-1">Айгерим</h4>
                <p className="text-mu-blue font-bold text-sm mb-4">Старший медицинский координатор</p>
                <div className="space-y-3">
                  <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 text-mu-text-900 hover:text-mu-blue transition-colors text-sm font-semibold">
                    <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-glass-inner-strong">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mu-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    {PHONE_DISPLAY}
                  </a>
                  <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-mu-text-900 hover:text-mu-blue transition-colors text-sm font-semibold">
                    <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-glass-inner-strong">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mu-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    {EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 text-mu-text-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-glass-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mu-green-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                На связи 24/7
              </div>
              <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 text-mu-text-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-glass-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mu-green-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                ISO 27001
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/60 relative overflow-hidden shadow-glass-lg">
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
