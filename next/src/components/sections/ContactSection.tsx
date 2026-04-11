import { ContactForm } from './ContactForm';

export function ContactSection() {
  return (
    <section className="py-12 md:py-24 bg-[#F5F7F9] relative" id="contact">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-12 items-start">
          {/* Left column -- info + trust items (Server rendered) */}
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-mu-text-900 mb-4">
              Свяжитесь с{'\u00A0'}нами
            </h2>
            <p className="font-body text-mu-text-500 leading-relaxed mb-8">
              Не{'\u00A0'}знаете, какой сервис подходит? Оставьте заявку{'\u00A0'}{'\u2014'}{'\u00A0'}мы{'\u00A0'}перезвоним,
              выслушаем вашу ситуацию и{'\u00A0'}подскажем оптимальный путь. Бесплатно и{'\u00A0'}без обязательств.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-mu-text-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true" className="shrink-0">
                  <path d="M4 10l4 4 8-8" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Перезвоним в{'\u00A0'}течение 24{'\u00A0'}часов</span>
              </li>
              <li className="flex items-center gap-3 text-mu-text-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true" className="shrink-0">
                  <path d="M4 10l4 4 8-8" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Бесплатная консультация</span>
              </li>
              <li className="flex items-center gap-3 text-mu-text-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true" className="shrink-0">
                  <path d="M4 10l4 4 8-8" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Ваши данные защищены (ISO{'\u00A0'}27001)</span>
              </li>
            </ul>
          </div>

          {/* Right column -- form card (Client Component) */}
          <div className="bg-white border border-black/8 rounded-2xl shadow-md p-8 md:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
