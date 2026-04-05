import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const navigate = useNavigate();

  const scrollToContact = () => {
    navigate('/contacts');
  };

  return (
    <section className="py-16 relative overflow-hidden z-10">
      <div className="container mx-auto px-4 lg:px-6 relative z-10" ref={ref}>
        <motion.div 
          className="bg-white/60 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden relative shadow-glass-lg border border-glass-border-strong"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2">
            
            {/* Left Content */}
            <div className="p-12 lg:p-20 flex flex-col justify-center relative z-10">
              {/* Animated background elements inside box */}
              <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-mu-blue/30 rounded-full blur-[100px] -z-10 mix-blend-multiply"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-mu-text-900 mb-6 leading-tight drop-shadow-sm">
                Начните с бесплатной консультации
              </h2>

              <p className="text-xl text-mu-text-700 font-medium mb-10 leading-relaxed max-w-lg">
                Расскажите о вашей ситуации — мы выслушаем и подберём оптимальное решение. Без обязательств.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <motion.button
                  className="w-full sm:w-auto bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 shadow-glass-inner hover:shadow-xl hover:shadow-mu-blue/40 transition-all flex items-center justify-center gap-2 group text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToContact}
                >
                  Оставить заявку
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.a
                  href="tel:+77015322478"
                  className="w-full sm:w-auto bg-white/60 backdrop-blur-xl text-mu-text-900 px-8 py-4 rounded-3xl font-bold border border-glass-border hover:bg-white/80 transition-all flex items-center justify-center gap-2 shadow-glass-sm shadow-glass-inner-strong text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-5 h-5 text-mu-blue" />
                  Позвонить
                </motion.a>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[400px] lg:h-auto overflow-hidden hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1758691463393-a2aa9900af8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBsb29raW5nJTIwYXQlMjBjYW1lcmElMjBmcmllbmRseXxlbnwxfHx8fDE3NzUxOTY2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Friendly doctor"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent w-1/3" />
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}