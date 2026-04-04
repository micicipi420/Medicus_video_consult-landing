import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Star, Users, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

export function Hero() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 lg:pt-40" id="hero">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-[20px] border border-glass-border px-5 py-2.5 rounded-full shadow-glass-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-mu-blue" />
              <span className="text-sm font-semibold text-mu-text-900">Европейский стандарт медицины</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-mu-text-900 drop-shadow-sm">Ваше здоровье — </span>
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
                наш приоритет
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-mu-text-700 mb-10 max-w-xl leading-relaxed font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Организуем онлайн-консультации с лучшими европейскими врачами, лечение и чек-апы в 43 передовых клиниках мира. Без посредников.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="w-full sm:w-auto bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-semibold shadow-lg shadow-mu-blue/30 shadow-glass-inner hover:shadow-xl hover:shadow-mu-blue/40 transition-all flex items-center justify-center gap-2 group text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('services')}
              >
                Выбрать услугу
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                className="w-full sm:w-auto bg-white/50 backdrop-blur-[20px] text-mu-text-900 px-8 py-4 rounded-3xl font-semibold shadow-glass hover:bg-white/60 transition-all border border-glass-border text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('contact')}
              >
                Оставить заявку
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex items-center gap-8 text-base text-mu-text-700 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-mu-green-600" />
                <span>10 000+ пациентов</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-mu-green-600" />
                <span>Офис в Казахстане</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Photo Composition */}
          <motion.div 
            className="relative lg:h-[600px] w-full mt-10 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Main large image */}
            <div className="absolute right-0 top-0 w-[85%] h-[85%] rounded-[3rem] overflow-hidden shadow-glass-lg border-[8px] border-white/40 backdrop-blur-3xl z-10 bg-white/20">
              <img 
                src="https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc1MTk2MjQzfDA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Smiling Doctor"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Secondary overlapping image */}
            <motion.div 
              className="absolute left-0 bottom-4 w-3/5 h-[45%] rounded-[2.5rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-2xl z-20 bg-white/30"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1568359730364-d3fad2a80b80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpZW50JTIwYW5kJTIwZG9jdG9yJTIwdGFsa2luZyUyMGhhcHB5fGVufDF8fHx8MTc3NTE5NjI2NXww&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Doctor consulting patient"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Floating Badge */}
            <motion.div 
              className="absolute -right-6 top-1/4 bg-white/70 backdrop-blur-[40px] p-4 rounded-[2rem] shadow-glass border border-glass-border-strong z-30 flex items-center gap-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-mu-green-500 to-mu-green-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                <Users className="w-7 h-7" />
              </div>
              <div className="pr-2">
                <div className="text-2xl font-bold text-mu-text-900 tracking-tight">500+</div>
                <div className="text-sm text-mu-text-700 font-semibold">Врачей-экспертов</div>
              </div>
            </motion.div>

            {/* Floating Rating */}
            <motion.div 
              className="absolute left-8 top-12 bg-white/70 backdrop-blur-[40px] px-6 py-4 rounded-[2rem] shadow-glass border border-glass-border-strong z-30 flex items-center gap-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />
                ))}
              </div>
              <div className="font-extrabold text-mu-text-900 text-lg">4.9/5</div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}