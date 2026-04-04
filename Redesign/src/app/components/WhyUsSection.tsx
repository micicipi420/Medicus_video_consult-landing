import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Globe, Smartphone, Award, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdvantageCardProps {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  delay: number;
}

function AdvantageCard({ icon, iconColor, iconBg, title, description, delay }: AdvantageCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-5 group"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className={`w-16 h-16 ${iconBg} backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center shadow-glass-sm border border-glass-border ${iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-2">
        <h3 className="text-xl font-extrabold text-mu-text-900 mb-2 leading-snug drop-shadow-sm group-hover:text-mu-blue transition-colors" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-mu-text-700 font-medium leading-relaxed text-sm md:text-base">{description}</p>
      </div>
    </motion.div>
  );
}

export function WhyUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-16 relative z-10" id="why-us">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div ref={ref}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-glass-border px-5 py-2.5 rounded-full shadow-sm shadow-glass-inner mb-6">
                <span className="text-sm font-bold text-mu-green-600 uppercase tracking-wider">О компании</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-mu-text-900 drop-shadow-sm">
                Почему выбирают <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">MedicusUnion</span>
              </h2>
              <p className="text-mu-text-700 font-medium text-xl">
                Мы — не просто медицинский агрегатор. Мы берем на себя ответственность за ваше здоровье на каждом этапе лечения.
              </p>
            </motion.div>

            <div className="space-y-12">
              <AdvantageCard
                icon={<Globe className="w-8 h-8" />}
                iconColor="text-mu-accent-teal"
                iconBg="bg-mu-accent-teal-bg"
                title='<span class="text-mu-accent-teal">43</span> клиники в <span class="text-mu-accent-teal">11</span> странах'
                description="Германия, Австрия, Швейцария, Израиль, ОАЭ, Южная Корея, Турция, Индия — подберём линику под задачу и бюджет."
                delay={0}
              />
              <AdvantageCard
                icon={<Smartphone className="w-8 h-8" />}
                iconColor="text-mu-accent-blue"
                iconBg="bg-mu-blue/10"
                title="Всё в одном приложении"
                description="Документы, расписание, видеоконсультации, результаты обследований, заключения врачей — в личном кабинете. Ничего не потеряется."
                delay={0.15}
              />
              <AdvantageCard
                icon={<Award className="w-8 h-8" />}
                iconColor="text-mu-accent-orange"
                iconBg="bg-mu-accent-orange-bg"
                title='<span class="text-mu-accent-orange">15+</span> лет, <span class="text-mu-accent-orange">10 000+</span> пациентов'
                description="Устойчивые процессы, проверенные партнёры, прямые контракты с клиниками. Не посредник — медицинская платформа."
                delay={0.3}
              />
              <AdvantageCard
                icon={<Shield className="w-8 h-8" />}
                iconColor="text-mu-green-600"
                iconBg="bg-mu-green-50"
                title="Абсолютная надежность"
                description="MedicusUnion GmbH, Австрия. Офис в Казахстане — резидент Astana Hub. ISO 27001. Договор, чеки, прозрачные условия."
                delay={0.45}
              />
            </div>
          </div>

          {/* Right Images Collage */}
          <motion.div 
            className="relative h-[600px] hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="space-y-6 pt-12">
                <div className="h-64 rounded-[3rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-2xl bg-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1666886573590-5815157da865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwbWVkaWNhbCUyMHRlYW0lMjBkb2N0b3JzfGVufDF8fHx8MTc3NTE5NjUzOXww&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Medical team"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="h-80 rounded-[3rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-2xl bg-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1686771416282-3888ddaf249b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBzaGFraW5nJTIwaGFuZHMlMjBwYXRpZW50fGVufDF8fHx8MTc3NTE5NjU0M3ww&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Doctor and patient"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-80 rounded-[3rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-2xl bg-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1690306816872-91063f6de36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGRvY3RvcnxlbnwxfHx8fDE3NzUxOTY1ODF8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Healthcare professional"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="h-64 rounded-[3rem] overflow-hidden shadow-glass-lg border border-white/60 bg-white/40 backdrop-blur-2xl p-8 flex flex-col justify-center shadow-glass-inner">
                  <Shield className="w-12 h-12 mb-4 text-mu-blue drop-shadow-sm" />
                  <div className="text-4xl font-extrabold mb-2 text-mu-text-900">100%</div>
                  <div className="text-mu-text-700 font-bold leading-tight">Конфиденциальность медицинских данных</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}