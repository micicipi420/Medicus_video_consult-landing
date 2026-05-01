import { MessageCircle } from 'lucide-react';

export function ContactsHero() {
  return (
    <section className="pt-32 pb-12 md:pt-40 md:pb-16 text-center">
      <div className="container mx-auto px-4 md:px-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 text-sm font-medium text-mu-text-700 shadow-glass-sm mb-6">
          <MessageCircle className="w-4 h-4 text-mu-blue" />
          <span>Свяжитесь с{'\u00A0'}нами</span>
        </div>
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-mu-blue to-[#38C6F4] bg-clip-text text-transparent">
            {'Контакты'}
          </span>
        </h1>
        <p className="font-body text-lg text-mu-text-500 max-w-xl mx-auto">
          Оставьте заявку или свяжитесь напрямую{'\u00A0'}{'\u2014'}{'\u00A0'}наш координатор ответит в{'\u00A0'}течение 24{'\u00A0'}часов
        </p>
      </div>
    </section>
  );
}
