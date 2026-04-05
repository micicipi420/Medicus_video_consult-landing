import { motion } from 'motion/react';
import { Phone, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="relative overflow-hidden z-10 py-16">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/60 shadow-glass-lg">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <motion.h3
                className="text-3xl font-extrabold bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent mb-4 drop-shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                MedicusUnion
              </motion.h3>
              <p className="text-mu-text-700 font-medium leading-relaxed">
                Международный медицинский сервис. Австрия · Казахстан
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-extrabold text-lg text-mu-text-900 mb-4">Услуги</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/services/online-consultations" className="text-mu-text-700 hover:text-mu-blue transition-colors font-medium">
                    Онлайн-консультации
                  </Link>
                </li>
                <li>
                  <Link to="/services/treatment-abroad" className="text-mu-text-700 hover:text-mu-blue transition-colors font-medium">
                    Лечение за рубежом
                  </Link>
                </li>
                <li>
                  <Link to="/services/checkups" className="text-mu-text-700 hover:text-mu-blue transition-colors font-medium">
                    Чек-ап
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-extrabold text-lg text-mu-text-900 mb-4">Навигация</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-mu-text-700 hover:text-mu-blue transition-colors font-medium">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link to="/contacts" className="text-mu-text-700 hover:text-mu-blue transition-colors font-medium">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-extrabold text-lg text-mu-text-900 mb-4">Контакты</h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+77015322478" className="flex items-center gap-3 text-mu-text-900 hover:text-mu-blue transition-colors font-semibold">
                    <div className="bg-white/60 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-glass-inner-strong">
                      <Phone className="w-4 h-4 text-mu-blue" />
                    </div>
                    +7 701 532 24 78
                  </a>
                </li>
                <li>
                  <a href="mailto:kz@medicusunion.com" className="flex items-center gap-3 text-mu-text-900 hover:text-mu-blue transition-colors break-all font-semibold">
                    <div className="bg-white/60 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-glass-inner-strong">
                      <Mail className="w-4 h-4 text-mu-blue flex-shrink-0" />
                    </div>
                    kz@medicusunion.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-mu-text-300/30 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-mu-text-700 font-medium text-sm">
                &copy; 2026 MedicusUnion. Все права защищены.
              </p>
              <p className="text-mu-text-700 font-medium text-sm flex items-center gap-2">
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-mu-green-600"/> ISO 27001 Certified</span>
                <span className="w-1.5 h-1.5 bg-mu-text-300/30 rounded-full" />
                <span>Astana Hub Resident</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}