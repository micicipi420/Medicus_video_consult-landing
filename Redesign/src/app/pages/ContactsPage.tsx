import { motion } from 'motion/react';
import { useState } from 'react';
import { CheckCircle2, Send, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    description: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', interest: '', description: '' });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-16">
      {/* Header */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-full shadow-sm shadow-glass-inner mb-6">
            <MessageCircle className="w-4 h-4 text-mu-blue" />
            <span className="text-sm font-bold text-mu-blue uppercase tracking-wider">Свяжитесь с нами</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1]">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              Контакты
            </span>
          </h1>
          <p className="text-xl text-mu-text-700 font-medium leading-relaxed">
            Оставьте заявку или свяжитесь напрямую — наш координатор ответит в течение 24 часов
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Coordinator Card */}
            <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-glass border border-white/60 shadow-glass-inner">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-glass-sm flex-shrink-0 border-4 border-white/60">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBtZWRpY2FsJTIwY29vcmRpbmF0b3IlMjBzbWlsaW5nfGVufDF8fHx8MTc3NTE5NzQ0NXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Медицинский координатор"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-mu-text-900 mb-1">Айгерим</h3>
                  <p className="text-mu-blue font-bold text-sm mb-4">Старший медицинский координатор</p>
                  <p className="text-mu-text-700 font-medium">
                    Выслушаю вашу ситуацию и помогу выбрать оптимальное решение. Бесплатно и без обязательств.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact methods */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Phone className="w-5 h-5" />, label: 'Телефон', value: '+7 701 532 24 78', href: 'tel:+77015322478' },
                { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'kz@medicusunion.com', href: 'mailto:kz@medicusunion.com' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Офис', value: 'Астана, Казахстан', href: undefined },
                { icon: <Clock className="w-5 h-5" />, label: 'График', value: 'Пн–Пт 9:00–18:00', href: undefined },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/60 shadow-glass"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center text-mu-blue border border-white/60 mb-3">
                    {item.icon}
                  </div>
                  <p className="text-sm text-mu-text-500 font-bold mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-mu-text-900 font-bold hover:text-mu-blue transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-mu-text-900 font-bold">{item.value}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-3">
              {['На связи 24/7', 'ISO 27001', 'Astana Hub Resident', '10 000+ пациентов'].map((text, i) => (
                <div key={i} className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 text-mu-text-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-glass-inner">
                  <CheckCircle2 className="w-4 h-4 text-mu-green-600" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 shadow-glass-lg border border-white/60 relative overflow-hidden shadow-glass-inner">
              {isSubmitted && (
                <motion.div
                  className="absolute inset-0 bg-white/80 backdrop-blur-3xl z-20 flex flex-col items-center justify-center p-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                    <div className="w-24 h-24 bg-white/80 border border-white/60 shadow-glass-sm rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-12 h-12 text-mu-green-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl font-extrabold text-mu-text-900 mb-3">Спасибо!</h3>
                  <p className="text-mu-text-700 font-medium text-center">Мы свяжемся с вами в течение 24 часов.</p>
                </motion.div>
              )}

              <h2 className="text-2xl font-extrabold text-mu-text-900 mb-6">Оставить заявку</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-mu-text-900 mb-2">Ваше имя</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Например, Айгуль" required
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-mu-text-900 mb-2">Телефон</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+7 (___) ___-__-__" required
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" />
                </div>
                <div>
                  <label htmlFor="interest" className="block text-sm font-bold text-mu-text-900 mb-2">Что вас интересует</label>
                  <select id="interest" name="interest" value={formData.interest} onChange={handleChange} required
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all text-mu-text-900 font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] appearance-none">
                    <option value="">Выберите направление</option>
                    <option value="consultation">Онлайн-консультация</option>
                    <option value="treatment">Лечение за рубежом</option>
                    <option value="checkup">Чек-ап</option>
                    <option value="not-sure">Пока не определился</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-mu-text-900 mb-2">
                    Кратко о вашем случае <span className="text-mu-text-500 font-medium">(необязательно)</span>
                  </label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Опишите вашу ситуацию или вопрос"
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all resize-none placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" />
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white py-4 rounded-2xl font-bold shadow-lg shadow-mu-blue/30 hover:shadow-xl hover:shadow-mu-blue/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-lg mt-4"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                      Отправка...
                    </>
                  ) : (
                    <>
                      Отправить заявку
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
                <p className="text-sm text-mu-text-700 font-medium text-center">
                  Мы перезвоним в течение 24 часов. Ваши данные защищены.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}