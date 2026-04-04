import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { HelpCircle, FileText, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface GuideCardProps {
  imageSrc: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  linkText: string;
  delay: number;
  href: string;
}

function GuideCard({ imageSrc, icon, iconColor, iconBg, title, description, linkText, delay, href }: GuideCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();

  return (
    <motion.div
      ref={ref}
      className="group cursor-pointer flex flex-col h-full"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(href)}
    >
      <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500 h-full flex flex-col overflow-hidden p-3">
        
        {/* Top Image Area */}
        <div className="relative h-48 w-full shrink-0">
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/40 shadow-inner">
            <img 
              src={imageSrc} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          
          {/* Floating Icon */}
          <div className={`absolute bottom-0 left-8 translate-y-1/2 w-14 h-14 ${iconBg} backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-glass-sm border border-glass-border z-10 group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 pt-12 flex flex-col flex-grow relative">
          {/* Title */}
          <h3 className={`text-2xl font-bold text-mu-text-900 mb-3 ${iconColor.replace('text-', 'group-hover:text-')} transition-colors duration-500`}>
            {title}
          </h3>

          {/* Description */}
          <p className="text-mu-text-700 font-medium leading-relaxed mb-6 flex-grow">
            {description}
          </p>

          {/* Link */}
          <div className={`flex items-center gap-2 ${iconColor} font-bold group-hover:gap-3 transition-all duration-300 mt-auto bg-white/50 border border-glass-border shadow-glass-inner p-4 rounded-2xl justify-center`}>
            {linkText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function GuideSection() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section className="py-16 relative z-10">

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Title */}
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-mu-text-900 mb-4">
            Не знаете, с чего начать?
          </h2>
          <p className="text-mu-text-700 text-lg max-w-2xl mx-auto">
            Мы поможем определить, какая услуга подходит именно вам
          </p>
        </motion.div>

        {/* Guide Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <GuideCard
            imageSrc="https://images.unsplash.com/photo-1551076805-e18690c5e53b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjB0YWxraW5nJTIwdG8lMjBwYXRpZW50fGVufDF8fHx8MTc3NTE5Nzk4OHww&ixlib=rb-4.1.0&q=80&w=1080"
            icon={<HelpCircle className="w-7 h-7" />}
            iconColor="text-mu-accent-blue"
            iconBg="bg-mu-blue/10"
            title="Есть диагноз, нужно мнение"
            description="Вы уже получили диагноз и хотите убедиться, что он верный, или узнать альтернативные варианты лечения."
            linkText="Онлан-консультация"
            delay={0}
            href="/services/online-consultations"
          />
          <GuideCard
            imageSrc="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGV4dGVyaW9yfGVufDF8fHx8MTc3NTE5ODAyMXww&ixlib=rb-4.1.0&q=80&w=1080"
            icon={<FileText className="w-7 h-7" />}
            iconColor="text-mu-accent-teal"
            iconBg="bg-mu-accent-teal-bg"
            title="Нужно лечение за границей"
            description="Вам рекомендовали операцию или лечение, и вы рассматриваете клиники в Европе, Израиле, ОАЭ или Индии."
            linkText="Лечение за рубежом"
            delay={0.15}
            href="/services/treatment-abroad"
          />
          <GuideCard
            imageSrc="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2hlY2t1cHxlbnwxfHx8fDE3NzUxOTgwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            icon={<Heart className="w-7 h-7" />}
            iconColor="text-mu-accent-orange"
            iconBg="bg-mu-accent-orange-bg"
            title="Хочу проверить здоровье"
            description="Чувствуете себя нормально, но хотите убедиться. Или давно не проходили полное обследование."
            linkText="Чек-ап за рубежом"
            delay={0.3}
            href="/services/checkups"
          />
        </div>
      </div>
    </section>
  );
}