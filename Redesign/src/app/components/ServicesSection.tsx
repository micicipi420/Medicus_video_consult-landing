import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Video, Globe2, ClipboardCheck, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

interface ServiceCardProps {
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  delay: number;
  href: string;
}

function ServiceCard({ imageSrc, imageAlt, icon, iconColor, iconBg, badge, badgeColor, title, description, features, ctaText, delay, href }: ServiceCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  return (
    <motion.div
      ref={ref}
      className="relative group h-full flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500 hover:-translate-y-2 h-full flex flex-col overflow-hidden">
        
        {/* Top Image Section */}
        <div className="relative h-56 w-full overflow-hidden p-3">
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/40 shadow-inner">
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Floating Icon */}
            <div className={`absolute top-4 right-4 w-12 h-12 ${iconBg} backdrop-blur-xl rounded-2xl flex items-center justify-center ${iconColor} shadow-glass-sm border border-glass-border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              {icon}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-4 flex-grow flex flex-col">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-glass-border px-4 py-1.5 rounded-full shadow-sm w-fit mb-5">
            <span className={`text-sm font-bold ${badgeColor}`}>{badge}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-mu-text-900 mb-4">{title}</h3>

          {/* Description */}
          <p className="text-mu-text-700 font-medium leading-relaxed mb-6">{description}</p>

          {/* Features */}
          <ul className="space-y-4 mb-8 flex-grow">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/60 backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glass-inner-strong">
                  <svg className="w-3.5 h-3.5 text-mu-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-mu-text-900 font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <motion.button
            className="w-full bg-white/50 backdrop-blur-xl border border-glass-border text-mu-text-900 py-4 rounded-2xl font-bold shadow-glass-sm hover:bg-white/70 hover:shadow-glass transition-all flex items-center justify-center gap-2 group/btn mt-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(href)}
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section className="py-16 relative z-10" id="services">
      
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Title */}
        <motion.div
          ref={titleRef}
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-glass-border px-5 py-2.5 rounded-full shadow-sm shadow-glass-inner mb-6">
            <span className="text-sm font-bold text-mu-accent-blue uppercase tracking-wider">Наши Услуги</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              Выберите то, что нужно вам
            </span>
          </h2>
          <p className="text-mu-text-700 text-lg leading-relaxed font-medium">Три ключевых направления для вашего здоровья: от дистанционной помощи до комплексного лечения за границей</p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            imageSrc="https://images.unsplash.com/photo-1612944095914-33fd0a85fcfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMGRvY3RvciUyMHNtaWxpbmd8ZW58MXx8fHwxNzc1MTk2MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            imageAlt="Doctor video consultation"
            icon={<Video className="w-6 h-6" />}
            iconColor="text-mu-accent-blue"
            iconBg="bg-mu-blue/10"
            badge="от 450 €"
            badgeColor="text-mu-accent-blue"
            title="Онлайн-консультации"
            description="Видеоконсультация с европейским специалистом на вашем языке. Второе мнение по диагнозу, план лечения, письменное заключение. За 5 дней, без перелёта."
            features={[
              'Перевод документов и консультации',
              'Врачи из 7 стран',
              'Письменное заключение'
            ]}
            ctaText="Получить консультацию"
            delay={0}
            href="/services/online-consultations"
          />
          <ServiceCard
            imageSrc="https://images.unsplash.com/photo-1720180244462-648c13ee01e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMHJvb20lMjBwYXRpZW50fGVufDF8fHx8MTc3NTE5NjI1MXww&ixlib=rb-4.1.0&q=80&w=1080"
            imageAlt="Modern hospital room"
            icon={<Globe2 className="w-6 h-6" />}
            iconColor="text-mu-accent-teal"
            iconBg="bg-mu-accent-teal-bg"
            badge="100+ клиник"
            badgeColor="text-mu-accent-teal"
            title="Лечение за рубежом"
            description="Организуем лечение под ключ: от подбора клиники до реабилитации. Визовая поддержка, перелёт, проживание, переводчик, сопровождение на каждом этапе."
            features={[
              '6 стран, 14 клиник-партнёров',
              'Полная организация',
              'Координация до выздоровления'
            ]}
            ctaText="Узнать подробнее"
            delay={0.2}
            href="/services/treatment-abroad"
          />
          <ServiceCard
            imageSrc="https://images.unsplash.com/photo-1758691462774-f01ed567f2c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBjaGVja2luZyUyMHRhYmxldCUyMG1yaXxlbnwxfHx8fDE3NzUxOTYyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            imageAlt="Doctor checking MRI tablet"
            icon={<ClipboardCheck className="w-6 h-6" />}
            iconColor="text-mu-green-600"
            iconBg="bg-mu-green-50"
            badge="от $350"
            badgeColor="text-mu-green-700"
            title="Чек-ап за рубежом"
            description="Комплексное обследование в лучших клиниках Южной Кореи и Турции за 1–2 дня. Виза, трансфер, переводчик, результаты в приложении."
            features={[
              'Южная Корея и Турция',
              'Программы от базовой до премиум',
              'Корпоративные чек-апы'
            ]}
            ctaText="Подобрать программу"
            delay={0.4}
            href="/services/checkups"
          />
        </div>
      </div>
    </section>
  );
}