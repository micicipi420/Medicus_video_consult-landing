import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { CheckCircle2, Send, Phone, Mail } from 'lucide-react';

export function ContactSection() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', interest: '', description: '' });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-16 relative z-10" id="contact">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info & Photo */}
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isTitleInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-full"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
                Остались вопросы?
              </span>
            </h2>
            <p className="text-mu-text-700 font-medium text-lg mb-8 leading-relaxed max-w-lg">
              Оставьте заявку — наш медицинский координатор свяжется с вами, выслушает вашу ситуацию и подскажет оптимальный путь. Бесплатно и без обязательств.
            </p>

            {/* Coordinator Card */}
            <div className="mt-auto bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/60 flex flex-col sm:flex-row gap-6 items-center shadow-glass">
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/60 bg-white/50 backdrop-blur-sm shadow-glass-sm">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBtZWRpY2FsJTIwY29vcmRpbmF0b3IlMjBzbWlsaW5nfGVufDF8fHx8MTc3NTE5NzQ0NXww&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Медицинский координатор"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-mu-text-900 mb-1">Айгерим</h4>
                <p className="text-mu-blue font-bold text-sm mb-4">Старший медицинский координатор</p>
                <div className="space-y-3">
                  <a href="tel:+77015322478" className="flex items-center gap-3 text-mu-text-900 hover:text-mu-blue transition-colors text-sm font-semibold">
                    <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-glass-inner-strong">
                      <Phone className="w-4 h-4 text-mu-blue" />
                    </div>
                    +7 701 532 24 78
                  </a>
                  <a href="mailto:kz@medicusunion.com" className="flex items-center gap-3 text-mu-text-900 hover:text-mu-blue transition-colors text-sm font-semibold">
                    <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-glass-inner-strong">
                      <Mail className="w-4 h-4 text-mu-blue" />
                    </div>
                    kz@medicusunion.com
                  </a>
                </div>
              </div>
            </div>
            
            {/* Trust signals below coordinator */}
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                'На связи 24/7',
                'ISO 27001'
              ].map((text, index) => (
                <div key={index} className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 text-mu-text-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-glass-inner">
                  <CheckCircle2 className="w-4 h-4 text-mu-green-600" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isTitleInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/60 relative overflow-hidden shadow-glass-lg">
              {/* Success State */}
              {isSubmitted && (
                <motion.div
                  className="absolute inset-0 bg-white/80 backdrop-blur-3xl z-20 flex flex-col items-center justify-center p-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <div className="w-24 h-24 bg-white/80 border border-white/60 rounded-full flex items-center justify-center mb-6 shadow-glass-sm">
                      <CheckCircle2 className="w-12 h-12 text-mu-green-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl font-extrabold text-mu-text-900 mb-3">Спасибо!</h3>
                  <p className="text-mu-text-700 font-medium text-center">Мы свяжемся с вами в течение 24 часов.</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-mu-text-900 mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Например, Айгуль"
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-mu-text-900 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (___) ___-__-__"
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-sm font-bold text-mu-text-900 mb-2">
                    Что вас интересует
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all text-mu-text-900 font-medium shadow-glass-inner appearance-none"
                  >
                    <option value="" className="text-mu-text-900">Выберите направление</option>
                    <option value="consultation" className="text-mu-text-900">Онлайн-консультация</option>
                    <option value="treatment" className="text-mu-text-900">Лечение за рубежом</option>
                    <option value="checkup" className="text-mu-text-900">Чек-ап</option>
                    <option value="not-sure" className="text-mu-text-900">Пока не определился</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-mu-text-900 mb-2">
                    Кратко о вашем случае <span className="text-mu-text-500 font-medium">(необязательно)</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Опишите вашу ситуацию или вопрос"
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all resize-none placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white py-4 rounded-2xl font-bold shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)] shadow-glass-inner hover:shadow-[0_20px_40px_color-mix(in_oklch,var(--color-mu-blue)_40%,transparent)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-8"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Отправка...
                    </>
                  ) : (
                    <>
                      Отправить заявку
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
                <p className="text-sm text-mu-text-700 font-medium text-center mt-4">
                  Мы перезвоним в течение 24 часов. Ваши данные защищены.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}